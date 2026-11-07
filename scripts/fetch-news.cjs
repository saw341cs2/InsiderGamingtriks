const fs = require('fs');
const path = require('path');
const { generateNews } = require('./generate-news.cjs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MAX_NEWS = 6;          // nombre de news affichées
const MIN_NEWS = 3;          // en dessous, on complète avec les news récentes déjà publiées
const MAX_ARCHIVE_DAYS = 10; // ancienneté max des news reprises depuis les archives

// =====================================================================
// IMAGES : on veut toujours l'image qui correspond à la news.
//
// Ordre de décision (voir publish()) :
//   1. L'image officielle de l'article (balise og:image de sa page) -> LA meilleure.
//   2. Sinon l'image fournie par le flux RSS / l'API.
//   3. Sinon, d'après le SUJET du titre : jaquette Steam du jeu, ou carte du sujet.
//   4. Si deux news ont exactement la même image, la 2e passe à l'étape 3.
// =====================================================================

const steam = id => `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`;

// Carte 800x450 générée (aucun lien externe) : dernier recours seulement
function makeCard(label, accent) {
  const size = Math.max(44, Math.min(96, Math.floor(640 / (label.length * 0.72))));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">'
    + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0f1a"/><stop offset="1" stop-color="#1f2937"/></linearGradient></defs>'
    + '<rect width="800" height="450" fill="url(#g)"/>'
    + '<polygon points="540,0 800,0 800,450 380,450" fill="' + accent + '" fill-opacity="0.35"/>'
    + '<rect x="60" y="292" width="110" height="8" fill="' + accent + '"/>'
    + '<text x="60" y="262" text-anchor="start" font-family="Arial Black, Arial, sans-serif" font-size="' + size + '" font-weight="900" fill="#ffffff">' + label + '</text>'
    + '<text x="60" y="345" text-anchor="start" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" fill="#ffffff" fill-opacity="0.65">INSIDERTRICKS</text>'
    + '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Matériel (le premier de la liste qui correspond gagne : "tapis de souris" avant "souris")
const HARDWARE_RULES = [
  { label: 'TAPIS',   accent: '#be185d', words: ['tapis de souris', 'mousepad', 'mouse pad', 'tapis'] },
  { label: 'SOURIS',  accent: '#0369a1', words: ['souris', 'mouse', 'mice'] },
  { label: 'CLAVIER', accent: '#15803d', words: ['clavier', 'claviers', 'keyboard', 'keyboards'] },
  { label: 'CASQUE',  accent: '#6d28d9', words: ['casque', 'casques', 'headset', 'headsets', 'headphones'] },
  { label: 'ÉCRAN',   accent: '#b45309', words: ['moniteur', 'moniteurs', 'monitor', 'monitors', 'ecran', 'ecrans', '144hz', '240hz', '360hz', '540hz'] },
  { label: 'GPU',     accent: '#4d7c0f', words: ['gpu', 'rtx', 'radeon', 'geforce', 'carte graphique', 'cartes graphiques', 'graphics card'] },
  { label: 'CPU',     accent: '#b91c1c', words: ['cpu', 'processeur', 'processeurs', 'ryzen'] },
  { label: 'AUDIO',   accent: '#0f766e', words: ['dac', 'micro', 'microphone', 'ampli'] },
];

// Jeux : "steam" = jaquette Steam officielle, "accent" = carte générée (jeu absent de Steam)
const GAME_RULES = [
  { label: 'BATTLEFIELD 2042', steam: 1517290, words: ['battlefield 2042', 'bf 2042', 'bf2042'] },
  { label: 'BATTLEFIELD',      steam: 2807960, words: ['battlefield', 'bf6', 'bf 6'] },
  { label: 'CALL OF DUTY',     steam: 1938090, words: ['warzone', 'call of duty', 'black ops', 'modern warfare', 'cod', 'bo6', 'bo7', 'mw3', 'mw4'] },
  { label: 'CS2',              steam: 730,     words: ['cs2', 'counter-strike', 'counter strike', 'csgo', 'cs go', 'cs:go', 'iem', 'faceit', 'esl pro league', 'blast premier', 'zywoo', 's1mple', 'donk', 'niko', 'm0nesy'] },
  { label: 'VALORANT',         accent: '#ff4655', words: ['valorant', 'vct'] },
  { label: 'APEX LEGENDS',     steam: 1172470, words: ['apex legends', 'apex'] },
  { label: 'RAINBOW SIX',      steam: 359550,  words: ['rainbow six', 'r6 siege', 'r6'] },
  { label: 'OVERWATCH 2',      steam: 2357570, words: ['overwatch'] },
  { label: 'HALO',             steam: 1240440, words: ['halo', 'halo infinite'] },
  { label: 'HUNT SHOWDOWN',    steam: 594650,  words: ['hunt showdown', 'hunt: showdown'] },
  { label: 'DESTINY 2',        steam: 1085660, words: ['destiny 2', 'destiny'] },
  { label: 'TARKOV',           accent: '#b45309', words: ['tarkov'] },
  { label: 'THE FINALS',       accent: '#e11d48', words: ['the finals'] },
  { label: 'DELTA FORCE',      accent: '#4d7c0f', words: ['delta force'] },
];

const ESPORT_RULES = [
  { label: 'ESPORT', accent: '#c2410c', words: ['esport', 'esports', 'tournoi', 'championnat', 'dota', 'league of legends'] },
];

// Si aucun sujet précis n'est reconnu : carte selon la catégorie
const TOPIC_CARDS = {
  MATERIEL:    ['MATÉRIEL', '#334155'],
  JOUEURS:     ['JOUEURS', '#7c2d12'],
  GAMERS:      ['JOUEURS', '#7c2d12'],
  COMPETITION: ['ESPORT', '#c2410c'],
  ESPORT:      ['ESPORT', '#c2410c'],
  DEFAULT:     ['FPS', '#1d4ed8'],
};

function normalizeText(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Mot entier uniquement ("cod" ne doit pas matcher "codes")
function hasWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|[^a-z0-9])' + escaped + '([^a-z0-9]|$)').test(text);
}

function matchRule(text, rules) {
  return rules.find(rule => rule.words.some(word => hasWord(text, word)));
}

function ruleToImage(rule) {
  return rule.steam ? steam(rule.steam) : makeCard(rule.label, rule.accent);
}

// De quoi parle l'article ? (le titre d'abord : matériel > jeu > esport ; puis le résumé : jeu > matériel > esport)
function detectRule(title, summary = '') {
  const inTitle = normalizeText(title);
  const inAll = normalizeText(`${title} ${summary}`);
  return matchRule(inTitle, HARDWARE_RULES) || matchRule(inTitle, GAME_RULES) || matchRule(inTitle, ESPORT_RULES) ||
    matchRule(inAll, GAME_RULES) || matchRule(inAll, HARDWARE_RULES) || matchRule(inAll, ESPORT_RULES);
}

function imageForText(title, summary = '', topic = '') {
  const rule = detectRule(title, summary);
  if (rule) return ruleToImage(rule);
  const [label, accent] = TOPIC_CARDS[String(topic).toUpperCase()] || TOPIC_CARDS.DEFAULT;
  return makeCard(label, accent);
}

// Vraie image d'article = lien http(s) qui n'est pas une de nos images de remplissage
function isRealImage(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) && !/steamstatic\.com|images\.unsplash\.com/i.test(url);
}

function fixImages(articles) {
  return articles.map(article => {
    if (isRealImage(article.image)) return article;
    const summary = article.summary || article.body || '';
    // imageCredit retiré : l'ancien crédit photo ne correspond plus à la nouvelle image
    return { ...article, image: imageForText(article.title || '', summary, article.topic), imageCredit: null };
  });
}

// Deux news avec exactement la même image : la 2e prend l'image de son propre sujet
function dedupeImages(articles) {
  const seen = new Set();
  return articles.map(article => {
    if (!seen.has(article.image)) { seen.add(article.image); return article; }
    const alt = imageForText(article.title || '', article.summary || article.body || '', article.topic);
    if (alt !== article.image && !seen.has(alt)) { seen.add(alt); return { ...article, image: alt, imageCredit: null }; }
    return article;
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
    if (isExternalUrl(article.url)) {
      const og = await fetchOgImage(article.url);
      if (og) {
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
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: 'mistral-small-latest', messages: [{ role: 'system', content: AI_SYSTEM_PROMPT }, { role: 'user', content: prompt }], temperature: 0.8, max_tokens: 1200, response_format: { type: 'json_object' } }),
      signal: AbortSignal.timeout(25000),
    });
    if (res.status === 429) { await new Promise(r => setTimeout(r, attempt * 5000)); continue; }
    if (!res.ok) return null;
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
      if (res.status === 404) continue;
      if (!res.ok) return null;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) { console.log(`   Gemini OK (${model})`); return text; }
    } catch { continue; }
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
    // Image du flux si elle existe ; sinon image du sujet (on regarde aussi le titre d'origine, qui nomme le jeu).
    // publish() cherchera ensuite l'image officielle de l'article.
    image: isRealImage(article.image)
      ? article.image
      : imageForText(article.title || '', `${article.description || ''} ${parsed.title} ${parsed.summary}`, topic),
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

  const image = isRealImage(article.image) ? article.image : imageForText(title, body, topic);

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
  'doom', 'quake', 'destiny 2', 'tarkov', 'vct', 'faceit', 'blast premier', 'iem',
];

const EXCLUDE_KEYWORDS = [
  'nba', 'fifa', 'football', 'pokemon', 'nintendo', 'mario', 'zelda', 'persona', 'final fantasy', 'dragon quest',
  'mobile game', 'candy crush', 'clash of clans', 'minecraft', 'roblox', 'the sims', 'civilization',
  'openai', 'chatgpt', 'ai model', 'machine learning',
  'mlbb', 'mobile legends', 'free fire', 'pubg mobile',
];

function isFpsArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some(kw => text.includes(kw))) return false;
  return FPS_KEYWORDS.some(kw => text.includes(kw));
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
        // Chercher l'image dans media:content, enclosure ou og:image
        const imgMatch = item.match(/url="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i) ||
                         item.match(/<enclosure[^>]+url="(https?:\/\/[^"]+)"/i);
        if (titleMatch && linkMatch) {
          const title = decodeHTMLEntities(titleMatch[1].trim());
          const description = decodeHTMLEntities((descMatch ? descMatch[1] : '').replace(/<[^>]*>/g, '').trim());
          if (!isFpsArticle(title, description)) continue;
          all.push({
            title,
            description,
            url: linkMatch[1].trim(),
            image: imgMatch ? decodeHTMLEntities(imgMatch[1]) : null,
            publishedAt: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
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
  const rule = detectRule(title || '', description || '');
  return rule ? rule.label : String(topic || 'FPS').toUpperCase();
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

// Quand il manque de news fraîches : on reprend de VRAIES news récentes déjà publiées
// (vrai lien, déjà en français) plutôt que d'inventer du contenu.
function recycleFromArchive(publicPath, current, count) {
  const archivePath = path.join(publicPath, 'news-archives.json');
  if (count <= 0 || !fs.existsSync(archivePath)) return [];
  let archives;
  try { archives = JSON.parse(fs.readFileSync(archivePath, 'utf-8')); } catch { return []; }
  const usedUrls = new Set(current.map(a => a.url));
  const oldest = Date.now() - MAX_ARCHIVE_DAYS * 86400000;
  const picked = [];
  for (const article of archives.articles || []) {
    if (picked.length >= count) break;
    if (!isExternalUrl(article.url) || usedUrls.has(article.url)) continue;
    const date = new Date(article.dateTimePub || article.publishedOn || 0).getTime();
    if (!date || date < oldest) continue;
    if (!isLikelyFrench(`${article.title || ''} ${article.summary || ''}`)) continue;
    usedUrls.add(article.url);
    picked.push(article);
  }
  if (picked.length > 0) console.log(`♻️  ${picked.length} vraie(s) news récente(s) reprise(s) depuis les archives`);
  return picked;
}

// Étape finale commune : images, archivage, écriture
async function publish(articles) {
  let finalArticles = articles.slice(0, MAX_NEWS);

  console.log('🖼️  Recherche des images officielles...');
  finalArticles = await enrichWithOfficialImages(finalArticles);
  finalArticles = dedupeImages(fixImages(finalArticles));

  const publicPath = path.join(__dirname, '..', 'public');
  const publishedOn = new Date().toISOString();
  finalArticles = finalArticles.map(article => ({
    ...article,
    publishedOn: article.publishedOn || article.dateTimePub || publishedOn,
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

  // Réécriture IA directe (Mistral puis Gemini en fallback), en variant les sujets
  const hasAI = process.env.MISTRAL_API_KEY || process.env.GEMINI_API_KEY;
  let finalArticles = [];

  if (gaming.length > 0 && hasAI) {
    console.log('🔄 Réécriture IA en cours...');
    const candidates = diversify(gaming).slice(0, MAX_NEWS + 2); // petite marge si l'IA échoue sur un article
    for (let i = 0; i < candidates.length; i++) {
      const result = await rewriteArticleWithAI(candidates[i]);
      if (result) {
        finalArticles.push(result);
        console.log(`   ✅ [${finalArticles.length}] ${result.title.substring(0, 60)}`);
        if (finalArticles.length >= MAX_NEWS) break;
      }
      await new Promise(r => setTimeout(r, 800));
    }
    console.log(`✅ ${finalArticles.length} articles réécrits en français`);
  } else if (!hasAI) {
    console.log('ℹ️  Aucune clé IA (MISTRAL_API_KEY / GEMINI_API_KEY) : pas de réécriture.');
  }

  // Pas assez de news fraîches : on reprend de vraies news récentes des archives
  if (finalArticles.length < MIN_NEWS) {
    finalArticles = [...finalArticles, ...recycleFromArchive(path.join(__dirname, '..', 'public'), finalArticles, MIN_NEWS - finalArticles.length)];
  }

  // Dernier recours seulement : le stock de secours
  if (finalArticles.length === 0) {
    console.log('⚠️  Aucune vraie news disponible : stock de secours utilisé.');
    finalArticles = generateNews().articles;
  }

  await publish(finalArticles);
}

if (require.main === module) main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { isFpsArticle, isLikelyFrench, keywordMatches, categorizeArticle, transformArticle, imageForText, fixImages, dedupeImages, diversify, extractOgImage, decodeHTMLEntities };
