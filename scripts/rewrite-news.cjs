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

// Images Unsplash par catégorie (pas de clé API requise)
const TOPIC_IMAGES = {
  FPS:         'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  COMPETITION: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop',
  MATERIEL:    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop',
  JOUEURS:     'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
  STREAMING:   'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&h=450&fit=crop',
  TECH:        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
  ESPORT:      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=450&fit=crop',
  JEUX:        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

function getImageForCategories(categories) {
  for (const cat of (categories || [])) {
    if (TOPIC_IMAGES[cat.toUpperCase()]) return TOPIC_IMAGES[cat.toUpperCase()];
  }
  return TOPIC_IMAGES.JEUX;
}

// Prompt système pour la réécriture journalistique
const SYSTEM_PROMPT = `Tu es un journaliste gaming expert pour Insider Gaming Tricks, un site d'actualité gaming français.

Tu es un ÉDITEUR, pas un copiste. Tu t'inspires de l'info source pour créer ton propre article.

Règles ABSOLUES :
1. **Titre** : Invente un titre COMPLÈTEMENT DIFFÉRENT de la source. Accrocheur, avec un émoji. Jamais de copie.
2. **Résumé** : 1 phrase originale qui donne envie de lire.
3. **Corps** : 2-3 paragraphes rédigés avec tes propres mots. Style dynamique, ton gaming. AUCUNE phrase copiée.
4. **Notre avis** : Ton point de vue éditorial en 1-2 phrases. Opinionné, direct.
5. **Catégories** : 1 à 3 parmi : FPS, COMPETITION, MATERIEL, JOUEURS, JEUX, STREAMING, TECH, ESPORT.
6. Réponds UNIQUEMENT en JSON valide.

{
  "title": "🎯 Ton titre original",
  "summary": "Ta phrase d'accroche.",
  "content": "Tes paragraphes originaux.",
  "review": "Notre avis : ton analyse.",
  "categories": ["FPS"]
}

INTERDIT : copier-coller, paraphraser mot à mot, garder la structure de la source.`;

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
        image: getImageForCategories(rewrittenContent.categories),
        dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
        source: 'InsiderGamingtriks',
        originalSource: article.source || article.originalSource || '',
      });

      console.error(`   ✅ Réécrit: "${rewrittenContent.title}"`);
    } catch (error) {
      console.error(`   ⚠️ Erreur pour "${article.title}": ${error.message}`);
      // Fallback : on skip cet article plutôt que de publier du copier-coller
      console.error(`   ⏭️  Article ignoré (pas de réécriture disponible)`);
      continue;
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