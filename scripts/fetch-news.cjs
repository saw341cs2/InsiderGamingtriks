const fs = require('fs');
const path = require('path');

const TOPICS = {
  fps: ['fps', 'shooter', 'call of duty', 'valorant', 'counter-strike', 'battlefield', 'halo'],
  competition: ['esport', 'esports', 'tournoi', 'competition', 'competitive', 'league of legends', 'lol', 'csgo', 'dota'],
  jeux: ['jeu video', 'jeux video', 'gaming', 'gamer', 'game', 'sortie', 'release', 'test', 'review', 'console', 'pc gaming', 'switch', 'ps5', 'xbox', 'steam', 'minecraft', 'gta', 'zelda', 'mario']
};

const IMAGE_KEYWORDS = {
  fps: ['video game shooter', 'gaming controller', 'esports arena'],
  competition: ['esports tournament', 'gaming competition', 'prize cup'],
  jeux: ['video game', 'gaming', 'playstation', 'xbox', 'pc gaming']
};

function normalizeText(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function categorizeArticle(title, description) {
  const text = normalizeText(`${title} ${description}`).toLowerCase();
  for (const topic of TOPICS.fps) {
    if (text.includes(topic)) return 'fps';
  }
  for (const topic of TOPICS.competition) {
    if (text.includes(topic)) return 'competition';
  }
  for (const topic of TOPICS.jeux) {
    if (text.includes(topic)) return 'jeux';
  }
  return 'jeux';
}

function transformContent(article, topic) {
  const transformations = {
    fps: {
      prefixes: ['ðŸ”¥ ', 'ðŸ’¥ ', 'ðŸŽ¯ ', 'âš”ï¸ '],
      suffixes: [' #FPS #Gaming', ' #Shooter', ' #JeuxVideo']
    },
    competition: {
      prefixes: ['ðŸ† ', 'ðŸŽ® ', 'âš¡ ', 'ðŸ… '],
      suffixes: [' #Esport', ' #Competition', ' #Tournoi']
    },
    jeux: {
      prefixes: ['ðŸŽ® ', 'âœ¨ ', 'ðŸ•¹ï¸ ', 'ðŸ“¢ '],
      suffixes: [' #JeuxVideo', ' #Gaming', ' #Actualites']
    }
  };
  const transform = transformations[topic] || transformations.jeux;
  let newTitle = article.title;
  let newDesc = article.description || article.content?.substring(0, 150) || '';
  const prefix = transform.prefixes[Math.floor(Math.random() * transform.prefixes.length)];
  if (!newTitle.startsWith(prefix)) {
    newTitle = prefix + newTitle;
  }
  const suffix = transform.suffixes[Math.floor(Math.random() * transform.suffixes.length)];
  if (!newDesc.endsWith(suffix)) {
    newDesc = newDesc + suffix;
  }
  newDesc = newDesc.replace(/[""''’]/g, '').replace(/\s+/g, ' ').trim();
  if (newDesc.length > 200) {
    newDesc = newDesc.substring(0, 197) + '...';
  }
  const images = IMAGE_KEYWORDS[topic] || IMAGE_KEYWORDS.jeux;
  const imageKeyword = images[Math.floor(Math.random() * images.length)];
  const customImage = `https://source.unsplash.com/800x450/?${encodeURIComponent(imageKeyword)}`;
  return {
    title: newTitle,
    body: newDesc,
    url: article.url,
    image: article.image || customImage,
    dateTimePub: new Date().toISOString(),
    source: 'InsiderGamingtriks',
    topic: topic.toUpperCase()
  };
}

async function fetchFromGNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) { console.log('No GNews API key, skipping...'); return []; }
  try {
    const queries = ['gaming', 'esport', 'video game', 'fps', 'counter-strike'];
    let allArticles = [];
    for (const query of queries) {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=fr&max=15&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.articles) { allArticles = [...allArticles, ...data.articles]; }
    }
    return allArticles;
  } catch (error) {
    console.log('GNews error:', error.message);
    return [];
  }
}

async function fetchFromNewsDataIO() {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) { console.log('No NewsData API key, skipping...'); return []; }
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=gaming&language=fr&category=technology`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results) {
      return data.results.map(article => ({
        title: article.title, description: article.description, content: article.content,
        url: article.link, image: article.image_url, publishedAt: article.pubDate
      }));
    }
    return [];
  } catch (error) {
    console.log('NewsData error:', error.message);
    return [];
  }
}

async function fetchFromRSS() {
  try {
    const rssUrls = [
      'https://www.journaldugeek.com/feed/',
      'https://www.frandroid.com/feed',
      'https://www.presse-citron.net/feed/',
      'https://korben.info/feed',
      'https://www.01net.com/feed/'
    ];
    let allArticles = [];
    for (const rssUrl of rssUrls) {
      try {
        const response = await fetch(rssUrl);
        const text = await response.text();
        const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
        for (const item of items.slice(0, 10)) {
          const titleMatchCD = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
          const titleMatch = titleMatchCD || item.match(/<title>(.*?)<\/title>/);
          const descMatchCD = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
          const descMatch = descMatchCD || item.match(/<description>(.*?)<\/description>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const imageMatch = item.match(/<media:content url="(.*?)"|<enclosure url="(.*?)"/);
          if (titleMatch && linkMatch) {
            let cleanDesc = '';
            if (descMatch) { cleanDesc = descMatch[1].replace(/<[^>]*>/g, '').substring(0, 200); }
            allArticles.push({
              title: titleMatch[1], description: cleanDesc, url: linkMatch[1],
              image: imageMatch ? (imageMatch[1] || imageMatch[2]) : null,
              publishedAt: new Date().toISOString()
            });
          }
        }
      } catch (e) { console.log(`RSS feed ${rssUrl} failed:`, e.message); }
    }
    return allArticles;
  } catch (error) {
    console.log('RSS fetch error:', error.message);
    return [];
  }
}

function getFallbackArticles() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const articlesPool = [
    { title: "Les meilleures ventes de jeux video cette semaine",
      description: "Decouvrez le classement des jeux les plus vendus sur toutes les plateformes. PS5, Xbox, PC : les chiffres sont tombes !",
      url: `https://insidergamingtriks.com/news/ventes-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop", topic: 'jeux' },
    { title: "Nouveau jeu FPS annonce pour 2026",
      description: "Un nouveau jeu FPS arrive sur PC et console. Les joueurs attendent avec impatience ce titre prometteur.",
      url: `https://insidergamingtriks.com/news/fps-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop", topic: 'fps' },
    { title: "Tournoi esport: les equipes favorites",
      description: "Analyse des equipes favorites pour les prochains tournois majeurs. Qui va remporter le titre ?",
      url: `https://insidergamingtriks.com/news/esport-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop", topic: 'competition' },
    { title: "Guide complet : ameliorer son aim en FPS",
      description: "Nos conseils et astuces pour progresser rapidement dans tous les jeux de tir. Entrainement, parametres, materiel.",
      url: `https://insidergamingtriks.com/news/aim-guide-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop", topic: 'fps' },
    { title: "Les meilleures configurations PC gaming en 2026",
      description: "Notre selection des meilleurs PC gaming selon votre budget.",
      url: `https://insidergamingtriks.com/news/pc-gaming-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop", topic: 'jeux' },
    { title: "Mise a jour majeure pour ce jeu competitif",
      description: "Les developpeurs ont devoile une mise a jour importante.",
      url: `https://insidergamingtriks.com/news/update-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop", topic: 'competition' },
    { title: "Sortie gaming : les dates a retenir ce mois-ci",
      description: "Voici tous les jeux video qui sortiront ce mois-ci.",
      url: `https://insidergamingtriks.com/news/sorties-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop", topic: 'jeux' },
    { title: "Clavier gaming : notre top 5 du moment",
      description: "Mecanique, membrane, sans fil : nous avons teste les meilleurs claviers gaming.",
      url: `https://insidergamingtriks.com/news/clavier-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop", topic: 'jeux' }
  ];
  const startIndex = dayOfYear % articlesPool.length;
  const selectedArticles = [];
  for (let i = 0; i < 4; i++) {
    selectedArticles.push(articlesPool[(startIndex + i) % articlesPool.length]);
  }
  return selectedArticles.map(a => ({ ...a, publishedAt: new Date().toISOString() }));
}

function isArticleFromTodayOrRecent(article) {
  if (!article.dateTimePub && !article.publishedAt) return true;
  const dateStr = article.dateTimePub || article.publishedAt;
  const diffDays = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  return diffDays <= 7;
}

function mergeArticles(existingArticles, newArticles, maxTotal = 6) {
  const fresh = newArticles.filter(a => a.url);
  let merged = [...fresh];
  const seenUrls = new Set(fresh.map(a => a.url));
  for (const old of existingArticles) {
    if (merged.length >= maxTotal) break;
    if (old.url && !seenUrls.has(old.url)) {
      merged.push(old);
      seenUrls.add(old.url);
    }
  }
  return merged;
}

async function main() {
  console.log('=== Fetching Gaming News ===');
  const existingPath = path.join(__dirname, '..', 'public', 'news.json');
  let existingArticles = [];
  if (fs.existsSync(existingPath)) {
    try {
      existingArticles = JSON.parse(fs.readFileSync(existingPath, 'utf8')).articles || [];
      console.log(`Loaded ${existingArticles.length} existing articles`);
    } catch (e) { console.log('No existing news found'); }
  }

  let allArticles = [];
  console.log('Trying RSS feeds...');
  allArticles = await fetchFromRSS();
  console.log(`RSS articles: ${allArticles.length}`);

  const gnews = await fetchFromGNews();
  allArticles = [...allArticles, ...gnews];
  const newsdata = await fetchFromNewsDataIO();
  allArticles = [...allArticles, ...newsdata];

  const gamingArticles = allArticles.filter(a => {
    const t = normalizeText(`${a.title} ${a.description || a.content || ''}`).toLowerCase();
    const kw = ['jeu video', 'gaming', 'gamer', 'jeux video', 'fps', 'esport', 'tournoi', 'competition', 'console', 'pc gaming', 'switch', 'ps5', 'ps4', 'xbox', 'steam', 'valorant', 'csgo', 'lol', 'dota', 'battlefield', 'cod', 'minecraft', 'gta', 'zelda', 'mario', 'sonic', 'pokemon', 'halo', 'fortnite', 'apex', 'pubg', 'rocket league', 'overwatch', 'wow', 'final fantasy', 'street fighter', 'tekken', 'rpg', 'mmo', 'vr', 'nintendo', 'playstation', 'xbox series', 'twitch', 'cyberpunk', 'red dead', 'gta'];
    return kw.some(k => t.includes(k));
  });

  const fallback = getFallbackArticles();
  const allWithFallback = [...fallback, ...gamingArticles];
  const deduped = [];
  const seen = new Set();
  for (const a of allWithFallback) {
    if (!seen.has(a.url)) { deduped.push(a); seen.add(a.url); }
  }

  console.log(`Total gaming articles: ${deduped.length} (${fallback.length} fallback + ${gamingArticles.length} RSS/API)`);
  const recent = deduped.filter(isArticleFromTodayOrRecent);
  console.log(`Recent articles: ${recent.length}`);
  const toProcess = recent.length > 0 ? recent : deduped;
  console.log(`Processing ${toProcess.length} articles`);

  const categorized = { fps: [], competition: [], jeux: [] };
  for (const a of toProcess) {
    const t = categorizeArticle(a.title, a.description || a.content);
    if (categorized[t]) categorized[t].push(a);
  }
  console.log('Categorized:', { fps: categorized.fps.length, competition: categorized.competition.length, jeux: categorized.jeux.length });

  const fpsArticles = categorized.fps.length > 0
    ? [transformContent(categorized.fps[Math.floor(Math.random() * categorized.fps.length)], 'fps')] : [];
  const compArticles = categorized.competition.length > 0
    ? [transformContent(categorized.competition[Math.floor(Math.random() * categorized.competition.length)], 'competition')] : [];

  const result = [];
  const usedUrls = new Set();
  fpsArticles.forEach(a => { if (!usedUrls.has(a.url)) result.push(a); usedUrls.add(a.url); });
  compArticles.forEach(a => { if (!usedUrls.has(a.url)) result.push(a); usedUrls.add(a.url); });

  let idx = 0;
  while (result.length < 6 && idx < categorized.jeux.length) {
    const a = categorized.jeux[idx];
    if (!usedUrls.has(a.url)) {
      result.push(transformContent(a, 'jeux'));
      usedUrls.add(a.url);
    }
    idx++;
  }

  if (result.length === 0) {
    const fb = getFallbackArticles();
    for (let i = 0; i < Math.min(6, fb.length); i++) {
      result.push(transformContent(fb[i], fb[i].topic || 'jeux'));
    }
  }

  const merged = mergeArticles(existingArticles, result, 6);
  const output = { articles: merged, generatedAt: new Date().toISOString() };
  const outPath = path.join(__dirname, '..', 'public', 'news.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  // Also copy to dist for production
  const distPath = path.join(__dirname, '..', 'dist', 'news.json');
  if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
    fs.writeFileSync(distPath, JSON.stringify(output, null, 2));
    console.log('Copied to dist/news.json');
  }

  console.log(`\n=== Generated ${result.length} new articles ===`);
  result.forEach((a, i) => console.log(`${i + 1}. [${a.topic}] ${a.title.substring(0, 50)}...`));
  console.log(`\nSaved to: ${outPath}`);
}

main().catch(console.error);