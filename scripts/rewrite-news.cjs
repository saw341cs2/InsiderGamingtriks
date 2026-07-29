#!/usr/bin/env node
// Génère des articles 100% originaux à partir de faits d'actualité gaming.
// - Récupère des faits bruts (titre + résumé) depuis des flux RSS gaming.
// - Envoie ces faits à Gemini (API gratuite) qui réécrit entièrement l'article
//   en français, avec un style propre à InsiderTricks, une catégorie et
//   une section "Notre avis".
// - Va chercher une photo libre de droits sur Unsplash (jamais l'image du
//   site source).
// Si GEMINI_API_KEY n'est pas configurée, ou si tout échoue, le script
// s'arrête en erreur : le workflow bascule alors automatiquement sur
// scripts/generate-news.cjs (contenu de secours déjà écrit à la main).

const fs = require('fs');
const path = require('path');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const CATEGORIES = ['fps', 'competition', 'materiel', 'gamers', 'jeux'];

// Images de secours si Unsplash est indisponible ou sans clé : de simples
// photos gaming génériques, libres de droits, choisies à l'avance.
const FALLBACK_IMAGES = {
  fps: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  competition: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop',
  materiel: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=450&fit=crop',
  gamers: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&h=450&fit=crop',
  jeux: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

// Mots-clés de recherche Unsplash par catégorie (en anglais : Unsplash indexe
// mieux en anglais, et on reste sur des termes génériques pour éviter toute
// image liée à une franchise/marque précise).
const UNSPLASH_QUERIES = {
  fps: 'first person shooter gaming',
  competition: 'esports tournament arena',
  materiel: 'gaming setup keyboard mouse',
  gamers: 'gamer playing headset',
  jeux: 'video game controller',
};

const GAMING_KEYWORDS = ['gaming', 'game', 'jeu', 'fps', 'esport', 'cs2', 'valorant', 'warzone', 'battlefield', 'playstation', 'xbox', 'nintendo', 'steam', 'twitch', 'streamer', 'tournoi', 'patch', 'update', 'meta', 'joueur', 'pro player'];

function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function isGamingArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  return GAMING_KEYWORDS.some(kw => text.includes(kw));
}

async function fetchFromRSS() {
  const rssUrls = [
    'https://www.jeuxvideo.com/rss/rss.xml',
    'https://www.gamekult.com/feed.rss',
    'https://www.millenium.org/rss.xml',
  ];
  let all = [];
  for (const rssUrl of rssUrls) {
    try {
      const res = await fetch(rssUrl, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const text = await res.text();
      const items = text.match(/<item[\s\S]*?>[\s\S]*?<\/item>/g) || [];
      for (const item of items.slice(0, 8)) {
        const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/i);
        if (titleMatch && linkMatch) {
          const title = decodeHTMLEntities(titleMatch[1].trim());
          const description = decodeHTMLEntities((descMatch ? descMatch[1] : '').replace(/<[^>]*>/g, '').trim());
          if (!isGamingArticle(title, description)) continue;
          all.push({
            title,
            description,
            url: linkMatch[1].trim(),
            publishedAt: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
            source: new URL(rssUrl).hostname.replace('www.', ''),
          });
        }
      }
    } catch (e) { console.log(`RSS erreur ${rssUrl}:`, e.message); }
  }
  return all;
}

// Construit le prompt envoyé à Gemini. On ne transmet que des faits bruts
// (titre + résumé courts) : le but est que le modèle reparte de zéro et
// écrive un texte entièrement nouveau, jamais un copier-coller reformulé.
function buildPrompt(fact) {
  return `Tu es rédacteur pour "InsiderTricks", un site communautaire français dédié aux jeux vidéo FPS et à l'esport.

Voici une information brute repérée dans l'actualité gaming :
Titre source : "${fact.title}"
Résumé source : "${fact.description}"

Consignes strictes :
- Écris un article 100% ORIGINAL en français, avec tes propres mots. N'utilise JAMAIS les phrases du titre ou du résumé source, même reformulées mot à mot.
- Ne garde que les informations factuelles et vérifiables contenues dans le résumé source. N'invente aucun fait, chiffre ou citation.
- Ton style : dynamique, communautaire, orienté joueurs FPS/esport, sans excès de superlatifs.
- "content" doit faire 3 à 5 phrases (un vrai petit article, pas juste une phrase).
- "resume" doit faire 1 à 2 phrases courtes (résumé pour une carte d'aperçu).
- "avis" est une section "Notre avis" : 2 à 3 phrases d'analyse ou de mise en perspective, écrites comme un avis éditorial de la rédaction (pas juste un résumé redit).
- "category" doit être EXACTEMENT l'une de ces valeurs : fps, competition, materiel, gamers, jeux.
- "titre" doit être un titre court, percutant, différent du titre source.

Réponds UNIQUEMENT avec un objet JSON strict, sans aucun texte autour, au format exact :
{"title": "...", "resume": "...", "content": "...", "avis": "...", "category": "fps"}`;
}

async function rewriteWithGemini(fact) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(fact) }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('Réponse Gemini vide');

  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const parsed = JSON.parse(cleaned);

  if (!parsed.title || !parsed.content || !CATEGORIES.includes(parsed.category)) {
    throw new Error('JSON Gemini incomplet ou catégorie invalide');
  }
  return parsed;
}

async function fetchUnsplashImage(category) {
  const fallback = { image: FALLBACK_IMAGES[category] || FALLBACK_IMAGES.jeux, credit: null };
  if (!UNSPLASH_ACCESS_KEY) return fallback;
  try {
    const query = UNSPLASH_QUERIES[category] || UNSPLASH_QUERIES.jeux;
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const imageUrl = data?.urls?.regular;
    if (!imageUrl) return fallback;
    const photographer = data?.user?.name;
    const photographerLink = data?.user?.links?.html;
    return {
      image: `${imageUrl}&w=800&h=450&fit=crop`,
      credit: photographer ? { name: photographer, url: photographerLink } : null,
    };
  } catch (e) {
    console.log('Unsplash erreur:', e.message);
    return fallback;
  }
}

function archiveOldNews(publicPath) {
  const newsPath = path.join(publicPath, 'news.json');
  const archivePath = path.join(publicPath, 'news-archives.json');
  if (!fs.existsSync(newsPath)) return;

  const current = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
  let archives = { articles: [] };
  if (fs.existsSync(archivePath)) {
    archives = JSON.parse(fs.readFileSync(archivePath, 'utf-8'));
  }

  const existingUrls = new Set(archives.articles.map(a => a.url));
  const toArchive = (current.articles || []).filter(a => !existingUrls.has(a.url));
  archives.articles = [...toArchive, ...archives.articles].slice(0, 100);
  fs.writeFileSync(archivePath, JSON.stringify(archives, null, 2), 'utf-8');
  console.log(`Archivé ${toArchive.length} news (total: ${archives.articles.length})`);
}

async function main() {
  console.log('=== Réécriture originale des news gaming ===');

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY manquante : bascule sur le contenu de secours.');
  }

  const facts = await fetchFromRSS();
  console.log(`Faits bruts récupérés : ${facts.length}`);

  const seen = new Set();
  const unique = facts.filter(f => {
    if (!f.url || seen.has(f.url)) return false;
    seen.add(f.url);
    return true;
  });
  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  if (unique.length < 2) {
    throw new Error('Pas assez de faits gaming trouvés aujourd\'hui.');
  }

  const targetCount = 3;
  const candidates = unique.slice(0, 8); // marge en cas d'échec de réécriture sur certains
  const articles = [];

  for (const fact of candidates) {
    if (articles.length >= targetCount) break;
    try {
      const rewritten = await rewriteWithGemini(fact);
      const { image, credit } = await fetchUnsplashImage(rewritten.category);
      articles.push({
        title: rewritten.title.trim(),
        body: rewritten.resume.trim(),
        content: rewritten.content.trim(),
        avis: rewritten.avis.trim(),
        url: fact.url,
        image,
        imageCredit: credit,
        dateTimePub: fact.publishedAt,
        source: 'InsiderGamingtriks',
        originalSource: fact.source,
        topic: rewritten.category.toUpperCase(),
      });
      console.log(`OK : ${rewritten.title.substring(0, 60)}`);
    } catch (e) {
      console.log(`Échec réécriture pour "${fact.title.substring(0, 40)}..." : ${e.message}`);
    }
  }

  if (articles.length === 0) {
    throw new Error('Aucun article n\'a pu être réécrit.');
  }

  const publicPath = path.join(__dirname, '..', 'public');
  archiveOldNews(publicPath);

  const output = { articles, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(publicPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');

  const docsPath = path.join(__dirname, '..', 'docs');
  if (fs.existsSync(docsPath)) {
    fs.writeFileSync(path.join(docsPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');
  }

  console.log(`\n=== ${articles.length} news originales générées ===`);
  articles.forEach((a, i) => console.log(`${i + 1}. [${a.topic}] ${a.title.substring(0, 60)}`));
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
