#!/usr/bin/env node

const fs = require('fs');

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MISTRAL_MODEL = 'mistral-small-latest';

const TOPIC_IMAGES = {
  FPS:         'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  COMPETITION: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop',
  MATERIEL:    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop',
  JOUEURS:     'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
  ESPORT:      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=450&fit=crop',
  JEUX:        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

const SYSTEM_PROMPT = `Tu es un journaliste gaming pour Insider Gaming Tricks, site français.
Réécris l'article source en français, de façon originale, style dynamique gaming.
Réponds UNIQUEMENT avec un objet JSON valide (sans balises markdown, sans \`\`\`json) :
{"title":"🎯 Titre accrocheur original","summary":"1 phrase d'accroche.","content":"4 paragraphes minimum, 300 mots minimum.","review":"Notre avis en 1-2 phrases.","categories":["FPS"]}
Catégories possibles : FPS, COMPETITION, MATERIEL, JOUEURS, JEUX, ESPORT.
INTERDIT : copier-coller, garder des phrases anglaises (sauf noms propres de jeux/joueurs/équipes).`;

function parseJSON(text) {
  if (!text) return null;
  // Nettoyer les balises markdown que Gemini ajoute parfois
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  // Extraire le premier objet JSON trouvé
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
}

async function callMistral(prompt) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
        temperature: 0.8, max_tokens: 1800, response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (res.status === 429) {
      console.error(`   Mistral rate limit, attente ${attempt * 10}s...`);
      await new Promise(r => setTimeout(r, attempt * 10000));
      continue;
    }
    if (!res.ok) throw new Error(`Mistral ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  }
  throw new Error('Mistral rate limit après 3 tentatives');
}

async function callGemini(prompt) {
  // Essayer plusieurs modèles dans l'ordre
  const models = ['gemini-2.0-flash-001', 'gemini-1.5-flash-001', 'gemini-pro'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: SYSTEM_PROMPT + '\n\n' + prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1800 },
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (res.status === 404) { console.error(`   Gemini ${model} non disponible, essai suivant...`); continue; }
      if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) { console.error(`   Gemini OK avec ${model}`); return text; }
    } catch (e) {
      if (e.message.includes('404')) continue;
      throw e;
    }
  }
  throw new Error('Aucun modèle Gemini disponible');
}

async function rewriteArticle(article) {
  const prompt = `Réécris cet article en français (ne copie PAS, réécris complètement) :
TITRE : ${article.title || ''}
DESCRIPTION : ${(article.description || article.body || '').substring(0, 600)}`;

  let raw = null;

  if (MISTRAL_API_KEY) {
    try { raw = await callMistral(prompt); }
    catch (e) { console.error(`   ⚠️ Mistral échoué: ${e.message}`); }
  }
  if (!raw && GEMINI_API_KEY) {
    try { raw = await callGemini(prompt); }
    catch (e) { console.error(`   ⚠️ Gemini échoué: ${e.message}`); }
  }

  if (!raw) throw new Error('Aucun LLM disponible ou réponse vide');

  const parsed = parseJSON(raw);
  if (!parsed) throw new Error(`JSON invalide: ${raw.substring(0, 200)}`);

  const cats = Array.isArray(parsed.categories) ? parsed.categories : ['JEUX'];
  return {
    title: parsed.title || article.title,
    summary: parsed.summary || '',
    content: parsed.content || '',
    review: parsed.review || '',
    categories: cats,
    url: article.url || '#',
    image: article.image || TOPIC_IMAGES[cats[0]?.toUpperCase()] || TOPIC_IMAGES.JEUX,
    dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
    source: 'InsiderGamingtriks',
    originalSource: article.source || article.originalSource || '',
  };
}

async function main() {
  if (!MISTRAL_API_KEY && !GEMINI_API_KEY) {
    console.error('❌ Aucune clé LLM disponible.');
    process.exit(1);
  }

  const inputFile = process.argv[2];
  if (!inputFile || !fs.existsSync(inputFile)) {
    console.error('❌ Fichier input manquant.');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  const rawArticles = Array.isArray(raw) ? raw : (raw.articles || []);

  if (rawArticles.length === 0) {
    console.error('❌ Aucun article à réécrire.');
    process.exit(1);
  }

  console.error(`🔄 Réécriture de ${rawArticles.length} articles (Mistral: ${!!MISTRAL_API_KEY}, Gemini: ${!!GEMINI_API_KEY})...`);

  const rewritten = [];
  const toProcess = rawArticles.slice(0, 6);
  for (let i = 0; i < toProcess.length; i++) {
    const article = toProcess[i];
    console.error(`   [${i + 1}/${rawArticles.length}] "${(article.title || '').substring(0, 60)}"`);
    try {
      const result = await rewriteArticle(article);
      rewritten.push(result);
      console.error(`   ✅ "${result.title.substring(0, 60)}"`);
    } catch (e) {
      console.error(`   ⏭️ Ignoré: ${e.message}`);
    }
    if (i < toProcess.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(JSON.stringify({ articles: rewritten, generatedAt: new Date().toISOString() }));
}

main().catch(e => { console.error(`❌ ${e.message}`); process.exit(1); });
