const fs = require('fs');
const path = require('path');

const TOPICS = {
  fps: ['fps', 'shooter', 'call of duty', 'valorant', 'counter-strike', 'battlefield', 'halo'],
  competition: ['esport', 'tournoi', 'competition', 'league of legends', 'csgo', 'dota'],
  jeux: ['jeu vidéo', 'game', 'sortie', 'release', 'test', 'review', 'gaming', 'video']
};

const IMAGE_KEYWORDS = {
  fps: ['video game shooter', 'gaming controller', 'esports arena'],
  competition: ['esports tournament', 'gaming competition', 'prize cup'],
  jeux: ['video game', 'gaming', 'playstation', 'xbox', 'pc gaming']
};

function categorizeArticle(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  for (const topic of TOPICS.fps) {
    if (text.includes(topic)) return 'fps';
  }
  for (const topic of TOPICS.competition) {
    if (text.includes(topic)) return 'competition';
  }
  for (const topic of TOPICS.jeux) {
    if (text.includes(topic)) return 'jeux';
  }
  return null;
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
  
  newDesc = newDesc
    .replace(/[Â«Â»""'']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
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
  if (!apiKey) {
    console.log('No GNews API key, skipping...');
    return [];
  }
  
  try {
    const queries = ['gaming', 'esport', 'video game'];
    let allArticles = [];
    
    for (const query of queries) {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=fr&max=15&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.articles) {
        allArticles = [...allArticles, ...data.articles];
      }
    }
    
    return allArticles;
  } catch (error) {
    console.log('GNews error:', error.message);
    return [];
  }
}

async function fetchFromNewsDataIO() {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    console.log('No NewsData API key, skipping...');
    return [];
  }
  
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=gaming&language=fr&category=technology`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results) {
      return data.results.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.link,
        image: article.image_url,
        publishedAt: article.pubDate
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
      'https://www.presse-citron.net/feed/'
    ];
    
    let allArticles = [];
    
    for (const rssUrl of rssUrls) {
      const response = await fetch(rssUrl);
      const text = await response.text();
      
      const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      
      for (const item of items.slice(0, 10)) {
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const imageMatch = item.match(/<media:content url="(.*?)"|<enclosure url="(.*?)"/);
        const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
        
        if (titleMatch && linkMatch) {
          allArticles.push({
            title: titleMatch[1],
            description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').substring(0, 200) : '',
            url: linkMatch[1],
            image: imageMatch ? (imageMatch[1] || imageMatch[2]) : null,
            publishedAt: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString()
          });
        }
      }
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
    {
      title: "Les meilleures ventes de jeux vidéo cette semaine",
      description: "Découvrez le classement des jeux les plus vendus sur toutes les plateformes. PS5, Xbox, PC : les chiffres sont tombés ! #JeuxVideo",
      url: `https://insidergamingtriks.com/news/ventes-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: 'jeux'
    },
    {
      title: "Nouveau jeu FPS annoncé pour 2026",
      description: "Un nouveau jeu FPS arrive sur PC et console. Les joueurs attendent avec impatience ce titre prometteur. #FPS #Gaming",
      url: `https://insidergamingtriks.com/news/fps-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop",
      topic: 'fps'
    },
    {
      title: "Tournoi esport: les équipes favorites",
      description: "Analyse des équipes favorites pour les prochains tournois majeurs. Qui va remporter le titre ? #Esport #Competition",
      url: `https://insidergamingtriks.com/news/esport-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      topic: 'competition'
    },
    {
      title: "Guide complet : améliorer son aim en FPS",
      description: "Nos conseils et astuces pour progresser rapidement dans tous les jeux de tir. Entraînement, paramètres, matériel. #FPS #Gaming",
      url: `https://insidergamingtriks.com/news/aim-guide-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
      topic: 'fps'
    },
    {
      title: "Les meilleures configurations PC gaming en 2026",
      description: "Notre sélection des meilleurs PC gaming selon votre budget. De l'entrée de gamme au haut de gamme. #Gaming #PC",
      url: `https://insidergamingtriks.com/news/pc-gaming-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop",
      topic: 'jeux'
    },
    {
      title: "Mise à jour majeure pour ce jeu compétitif",
      description: "Les développeurs ont dévoilé une mise à jour importante avec de nouveaux contenus et équilibrages. #Esport #Competition",
      url: `https://insidergamingtriks.com/news/update-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
      topic: 'competition'
    },
    {
      title: "Sortie gaming : les dates à retenir ce mois-ci",
      description: "Voici tous les jeux vidéo qui sortiront ce mois-ci. Il y en a pour tous les goûts ! #JeuxVideo #Gaming",
      url: `https://insidergamingtriks.com/news/sorties-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
      topic: 'jeux'
    },
    {
      title: "Clavier gaming : notre top 5 du moment",
      description: "Mécanique, membrane, sans fil : nous avons testé les meilleurs claviers gaming pour vous aider à choisir. #Gaming #Setup",
      url: `https://insidergamingtriks.com/news/clavier-${today.toISOString().split('T')[0]}`,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop",
      topic: 'jeux'
    }
  ];
  
// Rotate articles based on day of year to ensure variety
const startIndex = dayOfYear % articlesPool.length;
const selectedArticles = [];

// Select up to 6 articles for variety
const articlesToSelect = Math.min(6, articlesPool.length);
for (let i = 0; i < articlesToSelect; i++) {
  selectedArticles.push(articlesPool[(startIndex + i) % articlesPool.length]);
}
  
  return selectedArticles.map(a => ({
    ...a,
    publishedAt: new Date().toISOString()
  }));
}

function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

function isArticleFromTodayOrRecent(article) {
  if (!article.dateTimePub && !article.publishedAt) return true;
  const dateStr = article.dateTimePub || article.publishedAt;
  const articleDate = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((today - articleDate) / 86400000);
  return diffDays <= 2; // Articles from last 2 days are considered fresh
}

function mergeArticles(existingArticles, newArticles, maxTotal = 6) {
  const freshArticles = newArticles.filter(a => a.url);
  
  let merged = [...freshArticles];
  const seenUrls = new Set(freshArticles.map(a => a.url));
  
  for (const old of existingArticles) {
    if (merged.length >= maxTotal) break;
    if (!old.url) continue;
    if (!seenUrls.has(old.url)) {
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
      const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
      existingArticles = existingData.articles || [];
      console.log(`Loaded ${existingArticles.length} existing articles`);
    } catch (e) {
      console.log('No existing news found');
    }
  }
   
  let allArticles = [];
   
  // Try RSS feeds first (free, no API key needed)
  console.log('Trying RSS feeds...');
  allArticles = await fetchFromRSS();
  console.log(`RSS articles: ${allArticles.length}`);
   
  // Try GNews if API key available
  const gnews = await fetchFromGNews();
  allArticles = [...allArticles, ...gnews];
   
  // Try NewsData if API key available
  const newsdata = await fetchFromNewsDataIO();
  allArticles = [...allArticles, ...newsdata];
   
  if (allArticles.length === 0) {
    console.log('No articles from APIs, using fallback...');
    allArticles = getFallbackArticles();
  }
   
  // Filter to recent articles
  const recentArticles = allArticles.filter(isArticleFromTodayOrRecent);
  console.log(`Recent articles: ${recentArticles.length} out of ${allArticles.length}`);
   
  const articlesToProcess = recentArticles.length > 0 ? recentArticles : allArticles;
   
  console.log(`Processing ${articlesToProcess.length} articles`);
   
  const categorized = {
    fps: [],
    competition: [],
    jeux: []
  };
   
  for (const article of articlesToProcess) {
    const topic = categorizeArticle(article.title, article.description || article.content);
    if (topic && categorized[topic]) {
      categorized[topic].push(article);
    }
  }
  
  console.log('Categorized:', {
    fps: categorized.fps.length,
    competition: categorized.competition.length,
    jeux: categorized.jeux.length
  });
  
    const finalArticles = [];
    
    // Generate up to 6 articles: aim for 2 from each category (FPS, Competition, Jeux)
    // First, try to get up to 2 FPS articles
    if (categorized.fps.length > 0) {
      const fpsCount = Math.min(2, categorized.fps.length);
      const usedIndices = new Set();
      for (let i = 0; i < fpsCount; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * categorized.fps.length);
        } while (usedIndices.has(randomIndex));
        usedIndices.add(randomIndex);
        const article = categorized.fps[randomIndex];
        finalArticles.push(transformContent(article, 'fps'));
      }
    }
    
    // Second, try to get up to 2 Competition articles
    if (categorized.competition.length > 0) {
      const competitionCount = Math.min(2, categorized.competition.length);
      const usedIndices = new Set();
      for (let i = 0; i < competitionCount; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * categorized.competition.length);
        } while (usedIndices.has(randomIndex) || 
                 finalArticles.some(f => f.url === categorized.competition[randomIndex].url));
        usedIndices.add(randomIndex);
        const article = categorized.competition[randomIndex];
        finalArticles.push(transformContent(article, 'competition'));
      }
    }
    
    // Third, try to get up to 2 Jeux articles
    if (categorized.jeux.length > 0) {
      const jeuxCount = Math.min(2, categorized.jeux.length);
      const usedIndices = new Set();
      for (let i = 0; i < jeuxCount; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * categorized.jeux.length);
        } while (usedIndices.has(randomIndex) || 
                 finalArticles.some(f => f.url === categorized.jeux[randomIndex].url));
        usedIndices.add(randomIndex);
        const article = categorized.jeux[randomIndex];
        finalArticles.push(transformContent(article, 'jeux'));
      }
    }
    
    // Final fallback: if we still have less than 6 articles, use fallback articles
    if (finalArticles.length < 6) {
      const fallback = getFallbackArticles();
      let needed = 6 - finalArticles.length;
      const usedUrls = new Set(finalArticles.map(a => a.url));
      for (let i = 0; i < Math.min(needed, fallback.length); i++) {
        // Avoid duplicates by checking URL
        const fallbackArticle = fallback[i];
        if (!usedUrls.has(fallbackArticle.url) && 
            !finalArticles.some(f => f.url === fallbackArticle.url)) {
          const topic = fallbackArticle.topic || 'jeux';
          finalArticles.push(transformContent(fallbackArticle, topic));
          usedUrls.add(fallbackArticle.url);
        }
      }
    }

  const mergedArticles = mergeArticles(existingArticles, finalArticles, 6);

  const output = {
    articles: mergedArticles,
    generatedAt: new Date().toISOString()
  };
  
  const outputPath = path.join(__dirname, '..', 'public', 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n=== Generated ${finalArticles.length} new articles ===`);
  finalArticles.forEach((a, i) => {
    console.log(`${i + 1}. [${a.topic}] ${a.title.substring(0, 50)}...`);
  });
  
  console.log(`\nSaved to: ${outputPath}`);
}

main().catch(console.error);

