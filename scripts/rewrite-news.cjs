#!/usr/bin/env node

/**
 * rewrite-news.cjs
 * 
 * Prend des articles bruts (titre + description provenant de sources externes)
 * et les réécrit intégralement via l'API Mistral AI pour produire un contenu
 * original au style Insider Gaming Tricks.
 *
 * Génère pour chaque article :
 *   - Un titre unique et accrocheur (pas de copie)
 *   - Un résumé (summary)
 *   - Un corps d'article complet et original (content)
 *   - Une section "Notre avis" (review)
 *   - Des catégories pertinentes (categories)
 *
 * Usage :
 *   node scripts/rewrite-news.cjs < input-raw.json > output-rewritten.json
 *
 * Variables d'environnement :
 *   MISTRAL_API_KEY (obligatoire) - Clé API Mistral AI
 *   MISTRAL_MODEL   (optionnel)   - Modèle (défaut: mistral-small-latest)
 */

const fs = require('fs');
const path = require('path');

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const USER_AGENT = 'InsiderGamingtriks/1.0';

// Prompt système pour la réécriture journalistique
const SYSTEM_PROMPT = `Tu es un journaliste gaming expert pour Insider Gaming Tricks, un site d'actualité gaming français.

Tu dois réécrire COMPLÈTEMENT les articles qu'on te donne. Règles strictes :

1. **Titre original** : Ne copie pas le titre source. Crée un titre accrocheur, unique, avec un émoji pertinent.
2. **Résumé** : Une phrase qui donne envie de lire.
3. **Corps de l'article** : 2-3 paragraphes complets, rédigés dans un style journalistique dynamique et moderne. Garde uniquement les faits, reformule tout.
4. **"Notre avis"** : Une analyse éditoriale (1-2 phrases) qui donne le point de vue d'Insider Gaming Tricks.
5. **Catégories** : 1 à 3 catégories parmi : FPS, COMPETITION, MATERIEL, JOUEURS, JEUX, STREAMING, TECH, ESPORT.
6. **Format** : Réponds UNIQUEMENT en JSON valide, sans texte avant/après.

Format de réponse JSON attendu :
{
  "title": "🎯 Titre original et accrocheur",
  "summary": "Résumé en une phrase.",
  "content": "Corps complet de l'article en 2-3 paragraphes. Utilise un style journalistique dynamique.",
  "review": "Notre avis : analyse éditoriale en 1-2 phrases.",
  "categories": ["FPS", "COMPETITION"]
}

IMPORTANT : Ne copie JAMAIS le texte source. Reformule intégralement. Sois factuel.`;

/**
 * Appelle l'API Mistral AI pour réécrire un article brut.
 */
async function rewriteArticle(rawTitle, rawDescription, rawContent) {
  const userPrompt = `Voici l'article brut à réécrire (ne copie PAS ce texte, réécris-le complètement) :

TITRE SOURCE : ${rawTitle || 'Sans titre'}
DESCRIPTION SOURCE : ${rawDescription || ''}
CONTENU SOURCE : ${rawContent ? rawContent.substring(0, 500) : ''}

Génère un article original au style Insider Gaming Tricks.`;

  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Réponse vide de Mistral AI');
  }

  // Extraire le JSON de la réponse
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Tentative d'extraction du JSON dans la réponse textuelle
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error(`Impossible de parser la réponse Mistral: ${content.substring(0, 200)}`);
    }
  }

  return {
    title: parsed.title || rawTitle,
    summary: parsed.summary || '',
    content: parsed.content || rawDescription || rawContent || '',
    review: parsed.review || '',
    categories: Array.isArray(parsed.categories) ? parsed.categories : [],
  };
}

/**
 * Point d'entrée principal.
 * Lit les articles bruts depuis stdin ou un fichier passé en argument.
 */
async function main() {
  if (!MISTRAL_API_KEY) {
    console.error('❌ MISTRAL_API_KEY non définie. Mode fallback : les articles ne seront pas réécrits.');
    process.exit(1);
  }

  // Lire les articles bruts depuis stdin ou depuis un fichier argument
  let rawArticles = [];
  const inputFile = process.argv[2];

  if (inputFile && fs.existsSync(inputFile)) {
    const raw = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    rawArticles = Array.isArray(raw) ? raw : (raw.articles || []);
  } else {
    // Lire depuis stdin
    const stdin = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    if (stdin) {
      const raw = JSON.parse(stdin);
      rawArticles = Array.isArray(raw) ? raw : (raw.articles || []);
    }
  }

  if (rawArticles.length === 0) {
    console.error('❌ Aucun article à réécrire.');
    process.exit(1);
  }

  console.error(`🔄 Réécriture de ${rawArticles.length} articles via Mistral AI...`);

  const rewritten = [];
  for (let i = 0; i < rawArticles.length; i++) {
    const article = rawArticles[i];
    console.error(`   [${i + 1}/${rawArticles.length}] "${(article.title || '').substring(0, 50)}..."`);

    try {
      const rewrittenContent = await rewriteArticle(
        article.title,
        article.description || article.body || '',
        article.content || ''
      );

      rewritten.push({
        ...rewrittenContent,
        url: article.url || article.link || '#',
        image: article.image || '',
        dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
        source: 'InsiderGamingtriks',
        originalSource: article.source || article.originalSource || '',
      });

      console.error(`   ✅ Réécrit: "${rewrittenContent.title}"`);
    } catch (error) {
      console.error(`   ⚠️ Erreur pour "${article.title}": ${error.message}`);
      // Fallback : garder l'article original mais marqué comme non-réécrit
      rewritten.push({
        title: article.title || 'Sans titre',
        summary: '',
        content: article.description || article.body || article.content || '',
        review: '',
        categories: [article.topic || 'JEUX'],
        url: article.url || article.link || '#',
        image: article.image || '',
        dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
        source: 'InsiderGamingtriks',
        originalSource: article.source || article.originalSource || '',
      });
    }

    // Petit délai pour éviter de rate-limiter l'API
    if (i < rawArticles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Sortie JSON sur stdout
  const output = {
    articles: rewritten,
    generatedAt: new Date().toISOString(),
  };

  console.log(JSON.stringify(output, null, 2));
}

// Exécution
main().catch(error => {
  console.error(`❌ Erreur fatale: ${error.message}`);
  process.exit(1);
});