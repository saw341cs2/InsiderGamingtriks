const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { buildFallbackContent, buildFallbackReview } = require('./generate-news.cjs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FALLBACK_IMAGES = {
  fps: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop',
  ],
  competition: ['https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop'],
  jeux: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

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

  // Garder la vraie image de l'article, sinon fallback par topic
  const topicImages = FALLBACK_IMAGES[topic] || FALLBACK_IMAGES.jeux;
  const fallbackImage = Array.isArray(topicImages) ? topicImages[index % topicImages.length] : topicImages;
  const image = (article.image && article.image.startsWith('http'))
    ? article.image 
    : fallbackImage;

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

/**
 * Appelle le script rewrite-news.cjs pour réécrire les articles via Mistral AI.
 * Retourne les articles réécrits, ou null en cas d'échec.
 */
function rewriteWithAI(rawArticles) {
  if (!process.env.MISTRAL_API_KEY) {
    console.log('ℹ️  MISTRAL_API_KEY non définie, pas de réécriture IA.');
    return null;
  }

  const scriptPath = path.join(__dirname, 'rewrite-news.cjs');
  if (!fs.existsSync(scriptPath)) {
    console.log('ℹ️  rewrite-news.cjs non trouvé, pas de réécriture IA.');
    return null;
  }

  console.log('🔄 Appel de rewrite-news.cjs pour réécriture IA...');

  // Passer les articles bruts via stdin au script de réécriture
  const tmpFile = path.join(__dirname, '_tmp_articles.json');
  fs.writeFileSync(tmpFile, JSON.stringify(rawArticles), 'utf-8');
  const result = spawnSync('node', [scriptPath, tmpFile], {
    encoding: 'utf-8',
    timeout: 120000,
    env: { ...process.env },
  });
  try { fs.unlinkSync(tmpFile); } catch {}

  if (result.error) {
    console.error(`⚠️  Erreur rewrite-news: ${result.error.message}`);
    return null;
  }

  if (result.status !== 0) {
    console.error(`⚠️  rewrite-news exit code ${result.status}: ${result.stderr?.substring(0, 1000)}`);
    return null;
  }

  // La sortie stdout du script contient le JSON des articles réécrits
  try {
    const output = JSON.parse(result.stdout);
    if (output.articles && output.articles.length > 0) {
      console.log(`✅ ${output.articles.length} articles réécrits avec succès via Mistral AI`);
      return output.articles;
    }
    console.error(`⚠️  output.articles vide: ${result.stderr?.substring(0, 500)}`);
  } catch (e) {
    console.error(`⚠️  Erreur de parsing: ${e.message}`);
  }

  return null;
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

const ENGLISH_MARKERS = [
  'this week', 'how to ', 'the ', ' and ', ' win ', 'players', 'rewards',
  'what we know', 'revealed', 'event ', ' all ',
];

function isGamingArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some(kw => text.includes(kw))) return false;
  return GAMING_KEYWORDS.some(kw => text.includes(kw));
}

function isFrenchArticle(title, description) {
  const text = ` ${title} ${description} `.toLowerCase();
  const englishMarkers = ENGLISH_MARKERS.filter(marker => text.includes(marker));
  return englishMarkers.length < 2;
}

async function fetchFromRSS() {
  const rssUrls = [
    'https://www.jeuxvideo.com/rss/rss.xml',       // FR général gaming
    'https://www.vlr.gg/rss',                       // Valorant esport
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
          if (!isGamingArticle(title, description) || !isFrenchArticle(title, description)) continue;
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
  const gaming = unique.filter(a => isGamingArticle(a.title, a.description || a.content || '') && isFrenchArticle(a.title, a.description || a.content || ''));
  const fpsNews = gaming.filter(a => categorizeArticle(a.title, a.description || a.content || '') === 'fps');
  console.log(`Articles gaming: ${gaming.length}, FPS: ${fpsNews.length}`);

  // Si pas assez d'articles gaming, utiliser generate-news comme fallback
  if (fpsNews.length < 3) {
    console.log('Pas assez de news gaming, utilisation du fallback...');
    const gen = require('./generate-news.cjs');
    await gen.main();
    return;
  }

  // Trier par date décroissante avant de prendre les 6 plus récents
  fpsNews.sort((a, b) => new Date(b.publishedAt || b.dateTimePub || 0) - new Date(a.publishedAt || a.dateTimePub || 0));

  // Prendre les 5 articles les plus récents pour transformation (marge si Mistral en rate)
  const topArticles = fpsNews.slice(0, 3);

  // Étape 1 : Transformer avec les métadonnées de base
  const baseArticles = topArticles.map((a, index) => {
    const topic = categorizeArticle(a.title, a.description || a.content || '');
    return transformArticle(a, topic, index);
  });

  // Étape 2 : Réécriture IA via Mistral AI (si configuré)
  let finalArticles;
  const rewritten = rewriteWithAI(topArticles);
  if (rewritten && rewritten.length > 0) {
    // On garde les images et URLs des articles de base, mais on prend le contenu réécrit
    const rewrittenArticles = rewritten.map((rw, i) => ({
      ...rw,
      image: baseArticles[i]?.image || rw.image,
      url: baseArticles[i]?.url || rw.url,
      dateTimePub: baseArticles[i]?.dateTimePub || rw.dateTimePub,
      source: 'InsiderGamingtriks',
      originalSource: baseArticles[i]?.originalSource || rw.originalSource || '',
    })).filter(article => article.content || article.body || article.summary);
    const byUrl = new Map([...baseArticles, ...rewrittenArticles].map(article => [article.url, article]));
    finalArticles = [...byUrl.values()].slice(0, 3);
    console.log('✅ Articles réécrits avec contenu original Insider Gaming Tricks');
  } else {
    // Fallback : utiliser les articles de base (non réécrits)
    finalArticles = baseArticles.map(article => ({
      ...article,
      content: buildFallbackContent(article),
      summary: article.body,
      review: buildFallbackReview(article),
      categories: [article.topic],
    })).slice(0, 3);
    console.log('ℹ️  Utilisation des articles sans réécriture IA (fallback)');
  }

  const usedImages = new Set();
  finalArticles = finalArticles.map((article, index) => {
    let image = article.image;
    if (!image || usedImages.has(image)) {
      const candidates = FALLBACK_IMAGES.fps;
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
