const fs = require('fs');
const path = require('path');
const { findOfficialImage } = require('./image-overrides.cjs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 3 news du jour. La section "veille" du site affiche automatiquement
// les 3 news de la veille depuis news-archives.json.
const MAX_NEWS = 3;

// Les images viennent d'abord du visuel officiel du jeu (scripts/image-overrides.cjs),
// sinon de l'article source (RSS/API ou balise Open Graph).
function applyOfficialImages(articles) {
  const seen = new Set();
  return articles.map(article => {
    const official = findOfficialImage(article.title);
    if (!official) return article;
    if (seen.has(official)) {
      console.log(`   ↩️  Visuel officiel déjà utilisé dans le lot, image d'article conservée : ${String(article.title || '').substring(0, 45)}`);
      return article;
    }
    seen.add(official);
    return { ...article, image: official, imageCredit: null };
  });
}

// Images à écarter : logos, icônes, avatars, images par défaut...
const BAD_IMAGE = /logo|favicon|avatar|placeholder|default[-_.]|sprite|gravatar|news\.google|googleusercontent|vlr\.gg\/img\/vlr\/card\.png|\.svg(\?|$)/i;

// Vraie image d'article = lien http(s) qui n'est ni une de nos images de remplissage, ni un logo
function isRealImage(url) {
  return typeof url === 'string'
    && /^https?:\/\//i.test(url)
    && !/steamstatic\.com|images\.unsplash\.com/i.test(url)
    && !BAD_IMAGE.test(url);
}

function fixImages(articles) {
  return articles.map(article => {
    if (isRealImage(article.image)) return article;
    return { ...article, image: null, imageCredit: null };
  });
}

// Une image dupliquée ne prouve pas qu'elle illustre plusieurs articles.
function dedupeImages(articles) {
  const seen = new Set();
  return articles.map(article => {
    if (!isRealImage(article.image) || !seen.has(article.image)) {
      if (isRealImage(article.image)) seen.add(article.image);
      return article;
    }
    return { ...article, image: null, imageCredit: null };
  });
}

// Image officielle de l'article : balise <meta property="og:image"> de sa page
function extractOgImage(html, baseUrl) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const found = {};
  for (const tag of tags) {
    const key = (tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
    const content = (tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (!key || !content) continue;
    const k = key.toLowerCase();
    if (!found[k]) found[k] = content;
  }
  const raw = found['og:image'] || found['og:image:secure_url'] || found['og:image:url'] || found['twitter:image'] || found['twitter:image:src'];
  if (!raw) return null;
  try {
    const absolute = new URL(decodeHTMLEntities(raw.trim()), baseUrl).href;
    return /^https?:\/\//i.test(absolute) ? absolute : null;
  } catch { return null; }
}

async function fetchOgImage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 400000);
    return extractOgImage(html, res.url || pageUrl);
  } catch { return null; }
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || '') && !/insidertricks\.fr/i.test(url);
}

async function enrichWithOfficialImages(articles) {
  const out = [];
  for (const article of articles) {
    let current = article;
    if (isRealImage(article.image)) {
      out.push(current);
      continue;
    }
    if (isExternalUrl(article.url)) {
      const og = await fetchOgImage(article.url);
      if (og && isRealImage(og)) {
        current = { ...article, image: og, imageCredit: null };
        console.log(`   🖼️  Image officielle trouvée : ${String(article.title || '').substring(0, 45)}`);
      } else {
        console.log(`   ⚠️ Pas d'image officielle : ${String(article.title || '').substring(0, 45)}`);
      }
    }
    out.push(current);
  }
  return out;
}

// =====================================================================

const AI_SYSTEM_PROMPT = `Tu es un journaliste gaming pour Insider Gaming Tricks, site français.
Réécris l'article source en français, de façon originale, style dynamique gaming.
Réponds UNIQUEMENT avec un objet JSON valide (sans balises markdown) :
{"title":"🎯 Titre accrocheur","summary":"1 phrase.","content":"4 paragraphes min 300 mots.","review":"Notre avis.","categories":["FPS"]}
Catégories : FPS, COMPETITION, MATERIEL, JOUEURS, JEUX, ESPORT.
INTERDIT : copier-coller, phrases anglaises (sauf noms propres).`;

function parseAIJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
}

const COMMON_FRENCH_WORDS = new Set([
  'le', 'la', 'les', 'des', 'une', 'un', 'est', 'et', 'avec', 'pour', 'dans',
  'que', 'qui', 'du', 'au', 'aux', 'plus', 'sur', 'ce', 'cette', 'ces', 'notre',
  'votre', 'son', 'ses', 'être', 'après', 'mais', 'sans', 'entre', 'joueurs',
  'actualité', 'nouvelle', 'annonce', 'selon', 'leurs',
]);
const COMMON_ENGLISH_WORDS = new Set([
  'the', 'and', 'after', 'while', 'that', 'they', 'have', 'will', 'with', 'from',
  'into', 'this', 'are', 'was', 'were', 'more', 'than', 'for', 'not', 'how',
  'what', 'when', 'its', 'their', 'back', 'needs', 'evolve', 'decide', 'pledging',
  'bring', 'announcing', 'changes', 'developing', 'read',
]);

function isLikelyFrench(text) {
  const words = (text || '').toLocaleLowerCase('fr-FR').match(/[a-zàâçéèêëîïôûùüÿœæ]+/g) || [];
  if (words.length < 8) return false;
  const frenchCount = words.filter(word => COMMON_FRENCH_WORDS.has(word)).length;
  const englishCount = words.filter(word => COMMON_ENGLISH_WORDS.has(word)).length;
  return frenchCount >= 3 && englishCount <= Math.max(1, frenchCount * 0.35);
}

async function callMistral(prompt) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let res;
    try {
      res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({ model: 'mistral-small-latest', messages: [{ role: 'system', content: AI_SYSTEM_PROMPT }, { role: 'user', content: prompt }], temperature: 0.8, max_tokens: 1200, response_format: { type: 'json_object' } }),
        signal: AbortSignal.timeout(25000),
      });
    } catch (error) {
      console.warn(`   ⚠️ Erreur réseau Mistral (${error.name || 'inconnue'})`);
      return null;
    }
    if (res.status === 429) { await new Promise(r => setTimeout(r, attempt * 5000)); continue; }
    if (!res.ok) {
      console.warn(`   ⚠️ Mistral HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  }
  return null;
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const models = ['gemini-2.0-flash-001', 'gemini-1.5-flash-001', 'gemini-1.0-pro'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: AI_SYSTEM_PROMPT + '\n\n' + prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 1200 } }),
        signal: AbortSignal.timeout(25000),
      });
      if (res.status === 404) {
        console.warn(`   ⚠️ Gemini HTTP 404 (${model}), essai du modèle suivant`);
        continue;
      }
      if (!res.ok) {
        console.warn(`   ⚠️ Gemini HTTP ${res.status} (${model})`);
        return null;
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) { console.log(`   Gemini OK (${model})`); return text; }
    } catch (error) {
      console.warn(`   ⚠️ Erreur réseau Gemini (${model}, ${error.name || 'inconnue'})`);
      continue;
    }
  }
  return null;
}

async function rewriteArticleWithAI(article) {
  const prompt = `Réécris cet article en français :
TITRE : ${article.title || ''}
DESCRIPTION : ${(article.description || article.body || '').substring(0, 500)}`;
  const raw = (await callMistral(prompt)) || (await callGemini(prompt));
  if (!raw) return null;
  const parsed = parseAIJson(raw);
  const rewrittenText = `${parsed?.title || ''} ${parsed?.summary || ''} ${parsed?.content || ''}`;
  if (!parsed?.title || !parsed?.summary || !parsed?.content || !isLikelyFrench(rewrittenText)) {
    console.warn(`   ⚠️ Réécriture ignorée: réponse absente ou non française pour "${article.title || ''}"`);
    return null;
  }
  const cats = Array.isArray(parsed.categories) ? parsed.categories : ['JEUX'];
  const topic = cats[0]?.toUpperCase() || 'JEUX';
  return {
    title: parsed.title,
    summary: parsed.summary || '',
    content: parsed.content || '',
    review: parsed.review || '',
    categories: cats,
    topic,
    url: article.url || '#',
    image: isRealImage(article.image) ? article.image : null,
    dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
    source: 'InsiderGamingtriks',
    originalSource: article.source || '',
  };
}

const TOPICS = {
  fps: ['fps', 'shooter', 'call of duty', 'valorant', 'counter-strike', 'cs2', 'battlefield', 'halo', 'warzone', 'apex', 'aim', 'headshot', 'recoil', 'crosshair', 'fps boost', 'optimisation'],
  competition: ['esport', 'tournoi', 'competition', 'league of legends', 'csgo', 'dota', 'equipe', 'team', 'championnat', 'ranking', 'pro player', 'strategie', 'tactique'],
  materiel: ['souris', 'clavier', 'casque', 'écran', 'moniteur', 'gpu', 'cpu', 'carte graphique', 'processeur', 'pc gamer', 'setup', 'périphérique', 'hardware', '144hz', 'performance'],
  gamers: ['streamer', 'joueur', 'pro player', 'twitch', 'youtube gaming', 'gamer', 'influenceur', 'community', 'discord'],
  jeux: ['jeu video', 'jeu', 'game', 'sortie', 'release', 'test', 'review', 'gaming', 'playstation', 'xbox', 'nintendo', 'patch', 'update', 'gameplay', 'astuce', 'trick', 'guide', 'nouveaute'],
};

/**
 * Vérifie qu'un mot-clé apparaît comme un mot entier dans le texte (et non
 * comme simple sous-chaîne). Évite les faux positifs du type "team" détecté
 * à l'intérieur de "myTEAM" ou "cod" détecté à l'intérieur de "codes".
 */
function keywordMatches(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

function categorizeArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const topic of TOPICS.fps) { if (keywordMatches(text, topic)) return 'fps'; }
  for (const topic of TOPICS.competition) { if (keywordMatches(text, topic)) return 'competition'; }
  for (const topic of TOPICS.materiel) { if (keywordMatches(text, topic)) return 'materiel'; }
  for (const topic of TOPICS.gamers) { if (keywordMatches(text, topic)) return 'gamers'; }
  for (const topic of TOPICS.jeux) { if (keywordMatches(text, topic)) return 'jeux'; }
  return 'jeux';
}

// Remplace les codes HTML (esperluette-amp, esperluette-lt, etc.) par les vrais caractères.
// Le caractere esperluette est construit a part (AMP) pour que le code reste a l'abri d'un copier-coller.
const AMP = '&';
function decodeHTMLEntities(text) {
  if (!text) return '';
  return String(text)
    .replace(new RegExp(AMP + 'nbsp;', 'g'), ' ')
    .replace(new RegExp(AMP + '#39;', 'g'), "'")
    .replace(new RegExp(AMP + 'quot;', 'g'), '"')
    .replace(new RegExp(AMP + 'lt;', 'g'), '<')
    .replace(new RegExp(AMP + 'gt;', 'g'), '>')
    .replace(new RegExp(AMP + 'amp;', 'g'), AMP);
}

function transformArticle(article, topic, index = 0) {
  const title = decodeHTMLEntities(article.title || '').trim();
  let body = decodeHTMLEntities((article.description || article.content || article.summary || '').replace(/<[^>]*>/g, '').trim());
  if (!body) body = title;
  if (body.length > 1600) body = body.substring(0, 1597) + '...';

  const image = isRealImage(article.image) ? article.image : null;

  return {
    title,
    body,
    url: article.url || article.link || '#',
    image,
    dateTimePub: article.publishedAt || article.dateTimePub || new Date().toISOString(),
    source: 'InsiderGamingtriks',
    originalSource: article.source || '',
    topic: topic.toUpperCase(),
  };
}

// Sans IA, on ne publie que des articles déjà en français, jamais d'anglais.
function prepareArticlesWithoutAI(
  articles,
  existingArticles = [],
  { excludeUrls = [] } = {},
) {
  const existingUrls = new Set([
    ...existingArticles.map(article => article.url || article.link),
    ...excludeUrls,
  ].filter(Boolean));
  const eligibleArticles = articles.filter(article =>
    !existingUrls.has(article.url || article.link) &&
      isFpsArticle(article.title || '', '') &&
      isLikelyFrench(`${article.title || ''} ${article.description || article.content || ''}`),
  );
  return diversify(eligibleArticles)
    .slice(0, Math.max(0, MAX_NEWS - existingArticles.length))
    .map(article => transformArticle(
      article,
      categorizeArticle(article.title || '', article.description || article.content || ''),
    ));
}

function selectImageBackedArticles(articles, existingArticles = [], limit = MAX_NEWS) {
  if (limit <= 0) return [];
  const usedUrls = new Set(existingArticles.map(article => article.url || article.link).filter(Boolean));
  const usedImages = new Set(existingArticles.map(article => article.image).filter(isRealImage));
  const selected = [];
  for (const article of articles) {
    const url = article.url || article.link;
    if (!isRealImage(article.image) || (url && usedUrls.has(url)) || usedImages.has(article.image)) continue;
    selected.push(article);
    if (url) usedUrls.add(url);
    usedImages.add(article.image);
    if (selected.length >= limit) break;
  }
  return selected;
}

async function fetchFromNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) { console.log('NewsAPI: pas de clé API'); return []; }
  try {
    const queries = ['valorant esport', 'CS2 counter-strike', 'warzone call of duty', 'apex legends', 'overwatch'];
    let all = [];
    for (const q of queries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if (data.articles) all = [...all, ...data.articles.map(a => ({
        title: a.title, description: a.description, content: a.content,
        url: a.url, image: a.urlToImage, publishedAt: a.publishedAt, source: a.source?.name,
      }))];
    }
    console.log(`NewsAPI: ${all.length} articles`);
    return all;
  } catch (e) { console.log('NewsAPI erreur:', e.message); return []; }
}

async function fetchFromGNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) { console.log('GNews: pas de clé API'); return []; }
  try {
    const queries = ['cs2 counter-strike valorant', 'battlefield call of duty warzone', 'esport fps tournoi', 'souris clavier gaming promo', 'apex legends overwatch pro player'];
    let all = [];
    for (const q of queries) {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=fr&max=10&apikey=${apiKey}`;
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if (data.articles) all = [...all, ...data.articles.map(a => ({ ...a, image: a.image }))];
    }
    console.log(`GNews: ${all.length} articles`);
    return all;
  } catch (e) { console.log('GNews erreur:', e.message); return []; }
}

async function fetchFromNewsDataIO() {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) { console.log('NewsData: pas de clé API'); return []; }
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=gaming&language=fr&category=technology`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.results) {
      return data.results.map(a => ({
        title: a.title, description: a.description, content: a.content,
        url: a.link, image: a.image_url, publishedAt: a.pubDate, source: a.source_id,
      }));
    }
    return [];
  } catch (e) { console.log('NewsData erreur:', e.message); return []; }
}

const FPS_KEYWORDS = [
  'cs2', 'cs:go', 'counter-strike', 'valorant', 'warzone', 'call of duty', 'black ops',
  'battlefield', 'apex legends', 'halo infinite', 'halo', 'overwatch', 'rainbow six siege',
  'r6 siege', 'hunt showdown', 'escape from tarkov', 'delta force', 'xdefiant', 'the finals',
  'doom eternal', 'doom: the dark ages', 'doom 2016', 'quake', 'destiny 2', 'tarkov',
  'vct', 'faceit', 'blast premier', 'iem',
];

const EXCLUDE_KEYWORDS = [
  'nba', 'fifa', 'football', 'pokemon', 'nintendo', 'mario', 'zelda', 'persona', 'final fantasy', 'dragon quest',
  'mobile game', 'candy crush', 'clash of clans', 'minecraft', 'roblox', 'the sims', 'civilization',
  'openai', 'chatgpt', 'ai model', 'machine learning',
  'mlbb', 'mobile legends', 'free fire', 'pubg mobile',
];

function isFpsArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some(kw => keywordMatches(text, kw))) return false;
  return FPS_KEYWORDS.some(kw => keywordMatches(text, kw));
}

// Cherche la vraie image d'un item RSS : media:content > media:thumbnail > enclosure > première <img>
function extractRssImage(item) {
  const decoded = decodeHTMLEntities(item);
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match && isRealImage(match[1]) && !/\.(mp4|webm|mp3)(\?|$)/i.test(match[1])) return match[1];
  }
  return null;
}

function parsePublishedAt(value, fallbackDate = new Date()) {
  const parsedDate = value ? new Date(value) : null;
  return parsedDate && !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toISOString()
    : fallbackDate.toISOString();
}

async function fetchFromRSS() {
  // Un flux qui ne répond pas est simplement ignoré
  const rssUrls = [
    'https://www.jeuxvideo.com/rss/rss.xml',
    'https://www.vlr.gg/rss',
    'https://dotesports.com/feed',
    'https://www.rockpapershotgun.com/feed',
    'https://www.eurogamer.net/feed',
    'https://www.pcgamer.com/rss/',
    'https://www.gamesradar.com/rss/',
    'https://dexerto.com/feed/',
    'https://www.hltv.org/rss/news',
  ];
  let all = [];
  for (const rssUrl of rssUrls) {
    try {
      const res = await fetch(rssUrl, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const text = await res.text();
      const items = text.match(/<item[\s\S]*?>[\s\S]*?<\/item>/g) || [];
      for (const item of items.slice(0, 25)) {
        const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/i);
        if (titleMatch && linkMatch) {
          const title = decodeHTMLEntities(titleMatch[1].trim());
          const description = decodeHTMLEntities((descMatch ? descMatch[1] : '').replace(/<[^>]*>/g, '').trim());
          if (!isFpsArticle(title, description)) continue;
          all.push({
            title,
            description,
            url: linkMatch[1].trim(),
            image: extractRssImage(item),
            publishedAt: parsePublishedAt(dateMatch ? dateMatch[1] : ''),
            source: new URL(rssUrl).hostname.replace('www.', ''),
          });
        }
      }
      console.log(`RSS ${rssUrl}: ${items.length} articles`);
    } catch (e) { console.log(`RSS erreur ${rssUrl}:`, e.message); }
  }
  return all;
}

// Sujet d'une news (jeu / matériel / esport), pour ne pas publier 3 news sur le même jeu d'affilée
function subjectKey(title, description, topic) {
  const text = `${title || ''} ${description || ''}`;
  const keyword = FPS_KEYWORDS.find(candidate => keywordMatches(text, candidate));
  return keyword ? keyword.toUpperCase() : String(topic || 'FPS').toUpperCase();
}

// 1 news par sujet d'abord (les plus récentes), puis le reste
function diversify(articles) {
  const picked = [];
  const rest = [];
  const seen = new Set();
  for (const article of articles) {
    const key = subjectKey(article.title, article.description || article.body || '', categorizeArticle(article.title || '', article.description || ''));
    if (seen.has(key)) { rest.push(article); continue; }
    seen.add(key);
    picked.push(article);
  }
  return [...picked, ...rest];
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
  const toArchive = (current.articles || [])
    .filter(a => !existingUrls.has(a.url))
    .map(article => ({ ...article, publishedOn: article.publishedOn || article.dateTimePub || current.generatedAt || new Date().toISOString() }));
  archives.articles = [...toArchive, ...archives.articles].slice(0, 100); // garder max 100 anciennes news
  fs.writeFileSync(archivePath, JSON.stringify(archives, null, 2), 'utf-8');
  console.log(`Archivé ${toArchive.length} news (total: ${archives.articles.length})`);
}

// Vérifie qu'une image d'article charge réellement (HTTP 200 + type image).
// Une image cassée ou une page HTML renvoyée à la place d'une image est écartée.
async function isImageReachable(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT, 'Range': 'bytes=0-255' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const contentType = String(res.headers.get('content-type') || '');
    if (contentType && !contentType.startsWith('image/')) return false;
    return true;
  } catch { return false; }
}

// Écarte les images cassées : image source d'abord, puis balise og:image de l'article.
async function removeBrokenImages(articles) {
  const out = [];
  for (const article of articles) {
    if (!isRealImage(article.image)) { out.push(article); continue; }
    if (await isImageReachable(article.image)) { out.push(article); continue; }
    let replacement = null;
    if (isExternalUrl(article.url)) {
      replacement = await fetchOgImage(article.url);
      if (replacement && !(await isImageReachable(replacement))) replacement = null;
    }
    if (replacement) {
      out.push({ ...article, image: replacement, imageCredit: null });
      console.log(`   🖼️  Image cassée remplacée par l'image officielle : ${String(article.title || '').substring(0, 45)}`);
    } else {
      out.push({ ...article, image: null, imageCredit: null });
      console.log(`   ⚠️ Image cassée écartée : ${String(article.title || '').substring(0, 45)}`);
    }
  }
  return out;
}

// Étape finale commune : images, archivage, écriture
async function publish(articles) {
  let finalArticles = articles.slice(0, MAX_NEWS);

  console.log('🖼️  Recherche et vérification des images officielles...');
  finalArticles = applyOfficialImages(finalArticles);
  finalArticles = await enrichWithOfficialImages(finalArticles);
  finalArticles = await removeBrokenImages(finalArticles);
  finalArticles = dedupeImages(fixImages(finalArticles));

  const publicPath = path.join(__dirname, '..', 'public');
  const publishedOn = new Date().toISOString();
  finalArticles = finalArticles.map(article => ({
    ...article,
    publishedOn: article.publishedOn || publishedOn,
  }));

  // Archiver les anciennes news avant d'écraser
  archiveOldNews(publicPath);

  const output = { articles: finalArticles, generatedAt: publishedOn };
  fs.writeFileSync(path.join(publicPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');

  const docsPath = path.join(__dirname, '..', 'docs');
  if (fs.existsSync(docsPath)) {
    fs.writeFileSync(path.join(docsPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');
  }
  const rootNewsPath = path.join(__dirname, '..', 'news.json');
  if (fs.existsSync(rootNewsPath)) {
    fs.writeFileSync(rootNewsPath, JSON.stringify(output, null, 2), 'utf-8');
  }

  console.log(`\n=== ${finalArticles.length} news générées ===`);
  finalArticles.forEach((a, i) => console.log(`${i + 1}. [${(a.categories || [a.topic || 'JEUX']).join(', ')}] ${a.title.substring(0, 60)}`));
}

async function main() {
  console.log('=== Récupération des news gaming ===');

  let all = [];
  all = [...all, ...(await fetchFromRSS())];
  all = [...all, ...(await fetchFromNewsAPI())];
  all = [...all, ...(await fetchFromGNews())];
  all = [...all, ...(await fetchFromNewsDataIO())];

  console.log(`Total brut: ${all.length} articles`);

  // Dédoublonner par URL et par titre normalisé (les agrégateurs republient
  // souvent la même dépêche avec plusieurs URL de tracking).
  const seenUrls = new Set();
  const seenTitles = new Set();
  const unique = all.filter(a => {
    const url = a.url || a.link;
    const normalizedTitle = (a.title || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (!url || seenUrls.has(url) || (normalizedTitle && seenTitles.has(normalizedTitle))) return false;
    seenUrls.add(url);
    if (normalizedTitle) seenTitles.add(normalizedTitle);
    return true;
  });

  // Filtrer uniquement les articles FPS, les plus récents d'abord
  const gaming = unique.filter(a => isFpsArticle(a.title, a.description || a.content || ''));
  console.log(`Articles FPS: ${gaming.length}`);
  gaming.sort((a, b) => new Date(b.publishedAt || b.dateTimePub || 0) - new Date(a.publishedAt || a.dateTimePub || 0));

  // Réécriture IA directe (Mistral puis Gemini en fallback), en variant les sujets.
  // Aucun article n'est publié en anglais : si la traduction échoue, on passe au suivant.
  const hasAI = process.env.MISTRAL_API_KEY || process.env.GEMINI_API_KEY;
  let finalArticles = [];

  if (hasAI) {
    console.log('🔄 Réécriture IA en cours (français uniquement)...');
    const candidates = diversify(gaming).slice(0, MAX_NEWS + 6); // marge en cas d'échecs IA
    for (const candidate of candidates) {
      if (finalArticles.length >= MAX_NEWS) break;
      const result = await rewriteArticleWithAI(candidate);
      if (result) {
        finalArticles.push(result);
        console.log(`   ✅ [${finalArticles.length}] ${result.title.substring(0, 60)}`);
      } else {
        console.log(`   ⛔ Article écarté (pas de traduction française fiable) : ${String(candidate.title || '').substring(0, 50)}`);
      }
      await new Promise(r => setTimeout(r, 800));
    }
    console.log(`✅ ${finalArticles.length} articles réécrits en français`);
  } else {
    console.log("ℹ️  Aucune clé IA : sélection d'articles sources français avec image, sans réécriture.");
    finalArticles = prepareArticlesWithoutAI(gaming);
  }

  if (finalArticles.length < MAX_NEWS) {
    // Complète uniquement avec des articles déjà en français (jamais d'anglais).
    const frenchSources = prepareArticlesWithoutAI(gaming, finalArticles);
    const enrichedSources = await enrichWithOfficialImages(frenchSources);
    const missingArticles = selectImageBackedArticles(
      enrichedSources,
      finalArticles,
      MAX_NEWS - finalArticles.length,
    );
    if (missingArticles.length > 0) {
      console.log(`📰 ${missingArticles.length} article(s) français avec image source publiés directement.`);
      finalArticles = [...finalArticles, ...missingArticles];
    }
  }

  if (finalArticles.length === 0) {
    console.error('⚠️ Aucune actualité 100% française avec image vérifiable ; news.json du jour conservée sans modification.');
    return;
  }

  await publish(finalArticles);
}

if (require.main === module) main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { isFpsArticle, isLikelyFrench, keywordMatches, categorizeArticle, transformArticle, prepareArticlesWithoutAI, selectImageBackedArticles, isRealImage, fixImages, dedupeImages, diversify, extractOgImage, enrichWithOfficialImages, removeBrokenImages, applyOfficialImages, findOfficialImage, parsePublishedAt, decodeHTMLEntities };
