const fs = require('fs');
const path = require('path');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FALLBACK_IMAGES = {
  fps: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
  competition: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop',
  jeux: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
};

const TOPICS = {
  fps: ['fps', 'shooter', 'call of duty', 'valorant', 'counter-strike', 'battlefield', 'halo', 'warzone', 'apex'],
  competition: ['esport', 'tournoi', 'competition', 'league of legends', 'csgo', 'dota', 'equipe', 'team', 'championnat'],
  jeux: ['jeu video', 'jeu', 'game', 'sortie', 'release', 'test', 'review', 'gaming', 'playstation', 'xbox', 'nintendo'],
};

function categorizeArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const topic of TOPICS.fps) { if (text.includes(topic)) return 'fps'; }
  for (const topic of TOPICS.competition) { if (text.includes(topic)) return 'competition'; }
  for (const topic of TOPICS.jeux) { if (text.includes(topic)) return 'jeux'; }
  return 'jeux';
}

function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function transformArticle(article, topic) {
  const title = decodeHTMLEntities(article.title || '').trim();
  let body = decodeHTMLEntities((article.description || article.content || '').replace(/<[^>]*>/g, '').trim());
  if (body.length > 250) body = body.substring(0, 247) + '...';

  // Garder la vraie image de l'article, sinon fallback par topic
  const image = (article.image && article.image.startsWith('http')) 
    ? article.image 
    : FALLBACK_IMAGES[topic] || FALLBACK_IMAGES.jeux;

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

async function fetchFromGNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) { console.log('GNews: pas de clé API'); return []; }
  try {
    const queries = ['gaming fps', 'esport', 'jeu video'];
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

const GAMING_KEYWORDS = ['gaming', 'game', 'jeu', 'fps', 'esport', 'cs2', 'valorant', 'warzone', 'battlefield', 'playstation', 'xbox', 'nintendo', 'steam', 'twitch', 'streamer', 'tournoi', 'patch', 'update', 'meta', 'joueur', 'pro player'];

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
  if (gaming.length < 2) {
    console.log('Pas assez de news gaming, utilisation du fallback...');
    require('./generate-news.cjs');
    return;
  }

  // Transformer et catégoriser
  const articles = gaming.slice(0, 6).map(a => {
    const topic = categorizeArticle(a.title, a.description || a.content || '');
    return transformArticle(a, topic);
  });

  const publicPath = path.join(__dirname, '..', 'public');

  // Archiver les anciennes news avant d'écraser
  archiveOldNews(publicPath);

  const output = { articles, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(publicPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');

  const docsPath = path.join(__dirname, '..', 'docs');
  if (fs.existsSync(docsPath)) {
    fs.writeFileSync(path.join(docsPath, 'news.json'), JSON.stringify(output, null, 2), 'utf-8');
  }

  console.log(`\n=== ${articles.length} news générées ===`);
  articles.forEach((a, i) => console.log(`${i + 1}. [${a.topic}] ${a.title.substring(0, 60)}`));
}

main().catch(console.error);
