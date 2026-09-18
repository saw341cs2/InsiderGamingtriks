const fs = require('fs');
const path = require('path');
const { buildFallbackContent, buildFallbackReview } = require('./generate-news.cjs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const TOPIC_IMAGES = {
  FPS:         'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  COMPETITION: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop',
  MATERIEL:    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop',
  JOUEURS:     'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
  ESPORT:      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=450&fit=crop',
  JEUX:        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

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

async function callMistral(prompt) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
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
  if (!parsed?.title) return null;
  const cats = Array.isArray(parsed.categories) ? parsed.categories : ['JEUX'];
  return {
    title: parsed.title,
    summary: parsed.summary || '',
    content: parsed.content || '',
    review: parsed.review || '',
    categories: cats,
    topic: cats[0]?.toUpperCase() || 'JEUX',
    url: article.url || '#',
    image: (article.image && article.image.startsWith('http')) ? article.image : (TOPIC_IMAGES[cats[0]?.toUpperCase()] || TOPIC_IMAGES.JEUX),
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

function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    .replace(/"/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function transformArticle(article, topic, index = 0) {
  const title = decodeHTMLEntities(article.title || '').trim();
  let body = decodeHTMLEntities((article.description || article.content || article.summary || '').replace(/<[^>]*>/g, '').trim());
  if (!body) body = title;
  if (body.length > 1600) body = body.substring(0, 1597) + '...';

  const topicImages = TOPIC_IMAGES[topic.toUpperCase()] || TOPIC_IMAGES.JEUX;
  const image = (article.image && article.image.startsWith('http')) ? article.image : topicImages;

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
  try {
    const queries = ['cs2 counter-strike valorant', 'battlefield call of duty warzone', 'esport fps tournoi', 'souris clavier gaming promo', 'apex legends overwatch pro player'];
    let all = [];
    for (const q of queries) {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=fr&max=10&apikey=${apiKey}`;
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if (data.articles) all = [...all, ...data.articles.map(a => ({ ...a, image: a.image }))];
    }
    // Requêtes en anglais aussi pour plus de contenu FPS
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

const GAMING_KEYWORDS = [
  // FPS titres spécifiques
  'cs2', 'counter-strike', 'valorant', 'warzone', 'battlefield', 'call of duty', 'black ops', 'cod', 'apex legends', 'halo', 'overwatch', 'rainbow six siege', 'r6 siege', 'hunt showdown', 'escape from tarkov', 'delta force', 'xdefiant', 'the finals',
  // Esport FPS
  'esport', 'esports', 'major', 'vct', 'blast', 'iem', 'esl', 'pgl', 'faceit', 'pro league',
  // Matériel gaming
  'gaming mouse', 'gaming keyboard', 'gaming headset', 'gaming monitor', '144hz', '240hz', 'souris gaming', 'clavier gaming',
];

const EXCLUDE_KEYWORDS = [
  'nba', 'fifa', 'football', 'pokemon', 'nintendo', 'mario', 'zelda', 'persona', 'final fantasy', 'dragon quest',
  'mobile game', 'candy crush', 'clash of clans', 'minecraft', 'roblox', 'the sims', 'civilization',
  'openai', 'chatgpt', 'ai model', 'machine learning',
  'mlbb', 'mobile legends', 'free fire', 'pubg mobile',
];

function isGamingArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some(kw => text.includes(kw))) return false;
  return GAMING_KEYWORDS.some(kw => text.includes(kw));
}

async function fetchFromRSS() {
  const rssUrls = [
    'https://www.jeuxvideo.com/rss/rss.xml',
    'https://www.vlr.gg/rss',
    'https://dotesports.com/feed',
    'https://www.rockpapershotgun.com/feed',
    'https://www.eurogamer.net/feed',
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
        // Chercher l'image dans media:content, enclosure ou og:image
        const imgMatch = item.match(/url="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i) ||
                         item.match(/<enclosure[^>]+url="(https?:\/\/[^"]+)"/i);
        if (titleMatch && linkMatch) {
          const title = decodeHTMLEntities(titleMatch[1].trim());
          const description = decodeHTMLEntities((descMatch ? descMatch[1] : '').replace(/<[^>]*>/g, '').trim());
          if (!isGamingArticle(title, description)) continue;
          all.push({
            title,
            description,
            url: linkMatch[1].trim(),
            image: imgMatch ? imgMatch[1] : null,
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
  archives.articles = [...toArchive, ...archives.articles].slice(0, 100); // garder max 100 anciennes news
  fs.writeFileSync(archivePath, JSON.stringify(archives, null, 2), 'utf-8');
  console.log(`Archivé ${toArchive.length} news (total: ${archives.articles.length})`);
}

async function main() {
  console.log('=== Récupération des news gaming ===');

  let all = [];
  all = [...all, ...(await fetchFromRSS())];
  all = [...all, ...(await fetchFromNewsAPI())];
  all = [...all, ...(await fetchFromGNews())];
  all = [...all, ...(await fetchFromNewsDataIO())];

  console.log(`Total brut: ${all.length} articles`);

  // Dédoublonner par URL
  const seen = new Set();
  const unique = all.filter(a => {
    const url = a.url || a.link;
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });

  // Filtrer uniquement les articles gaming
  const gaming = unique.filter(a => isGamingArticle(a.title, a.description || a.content || ''));
  console.log(`Articles gaming: ${gaming.length}`);

  // Si pas assez d'articles gaming, utiliser generate-news comme fallback
  if (gaming.length < 1) {
    console.log('Pas assez de news gaming, utilisation du fallback...');
    const gen = require('./generate-news.cjs');
    await gen.main();
    return;
  }

  // Trier par date décroissante
  gaming.sort((a, b) => new Date(b.publishedAt || b.dateTimePub || 0) - new Date(a.publishedAt || a.dateTimePub || 0));

  const topArticles = gaming.slice(0, 7); // marge pour Mistral

  // Étape 1 : Transformer avec les métadonnées de base
  const baseArticles = topArticles.map((a, index) => {
    const topic = categorizeArticle(a.title, a.description || a.content || '');
    return transformArticle(a, topic, index);
  });

  // Étape 2 : Réécriture IA directe (Mistral puis Gemini en fallback)
  const hasAI = process.env.MISTRAL_API_KEY || process.env.GEMINI_API_KEY;
  let finalArticles;

  if (hasAI) {
    console.log('🔄 Réécriture IA en cours...');
    const rewritten = [];
    for (let i = 0; i < topArticles.length; i++) {
      const result = await rewriteArticleWithAI(topArticles[i]);
      if (result) {
        rewritten.push(result);
        console.log(`   ✅ [${rewritten.length}] ${result.title.substring(0, 60)}`);
        if (rewritten.length >= 6) break;
      }
      if (i < topArticles.length - 1) await new Promise(r => setTimeout(r, 1000));
    }
    if (rewritten.length > 0) {
      finalArticles = rewritten;
      console.log(`✅ ${finalArticles.length} articles réécrits en français`);
    }
  }

  if (!finalArticles || finalArticles.length === 0) {
    finalArticles = baseArticles.map(article => ({
      ...article,
      content: buildFallbackContent(article),
      summary: article.body,
      review: buildFallbackReview(article),
      categories: [article.topic],
    })).slice(0, 6);
    console.log('ℹ️  Utilisation des articles sans réécriture IA (fallback)');
  }

  const usedImages = new Set();
  finalArticles = finalArticles.map((article, index) => {
    let image = article.image;
    if (!image || usedImages.has(image)) {
      const candidates = Object.values(TOPIC_IMAGES);
      image = candidates.find(candidate => !usedImages.has(candidate)) || candidates[index % candidates.length];
    }
    usedImages.add(image);
    return { ...article, image };
  });

  const publicPath = path.join(__dirname, '..', 'public');

  // Archiver les anciennes news avant d'écraser
  archiveOldNews(publicPath);

  const output = { articles: finalArticles, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(publicPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');

  const docsPath = path.join(__dirname, '..', 'docs');
  if (fs.existsSync(docsPath)) {
    fs.writeFileSync(path.join(docsPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');
  }

  console.log(`\n=== ${finalArticles.length} news générées ===`);
  finalArticles.forEach((a, i) => console.log(`${i + 1}. [${(a.categories || [a.topic || 'JEUX']).join(', ')}] ${a.title.substring(0, 60)}`));
}

main().catch(console.error);
