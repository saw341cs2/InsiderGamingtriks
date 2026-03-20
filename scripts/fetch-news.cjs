const fs = require('fs');
const path = require('path');

const TOPICS = {
  fps: ['fps', 'shooter', 'call of duty', 'valorant', 'counter-strike', 'battlefield', 'halo'],
  competition: ['esport', 'tournoi', 'competition', 'league of legends', 'csgo', 'dota'],
  jeux: ['jeu vidéo', 'game', 'sortie', 'release', 'test', 'review', 'gaming']
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
      prefixes: ['🔥 ', '💥 ', '🎯 ', '⚔️ '],
      suffixes: [' #FPS #Gaming', ' #Shooter', ' #JeuxVideo']
    },
    competition: {
      prefixes: ['🏆 ', '🎮 ', '⚡ ', '🏅 '],
      suffixes: [' #Esport', ' #Competition', ' #Tournoi']
    },
    jeux: {
      prefixes: ['🎮 ', '✨ ', '🕹️ ', '📢 '],
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
    .replace(/[«»""'']/g, '')
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

function getFallbackArticles() {
  return [
    {
      title: "Les meilleures ventes de jeux vidéo cette semaine",
      description: "Découvrez le classement des jeux les plus vendus sur toutes les plateformes. Un独占只看 ta liste! #JeuxVideo",
      url: "https://example.com/news1",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Nouveau jeu fps annoncé",
      description: "Un nuevo jeu fps arrive sur PC et console. Les joueurs attendent avec impatience ce titre prometteur. #FPS #Gaming",
      url: "https://example.com/news3",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Tournoi esport: les équipes favorites",
      description: "Analyse des équipes favorites pour les prochains tournois majeurs. Qui va gagner? #Esport #Competition",
      url: "https://example.com/news2", 
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      publishedAt: new Date().toISOString()
    }
  ];
}

async function main() {
  console.log('=== Fetching Gaming News ===');
  
  let allArticles = [];
  
  const [gnews, newsdata] = await Promise.all([
    fetchFromGNews(),
    fetchFromNewsDataIO()
  ]);
  
  allArticles = [...gnews, ...newsdata];
  
  if (allArticles.length === 0) {
    console.log('No articles from APIs, using fallback...');
    allArticles = getFallbackArticles();
  }
  
  console.log(`Total articles fetched: ${allArticles.length}`);
  
  const categorized = {
    fps: [],
    competition: [],
    jeux: []
  };
  
  for (const article of allArticles) {
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
  
  if (categorized.fps.length > 0) {
    const article = categorized.fps[Math.floor(Math.random() * categorized.fps.length)];
    finalArticles.push(transformContent(article, 'fps'));
  }
  
  if (categorized.competition.length > 0) {
    const article = categorized.competition[Math.floor(Math.random() * categorized.competition.length)];
    finalArticles.push(transformContent(article, 'competition'));
  } else if (categorized.jeux.length > 0 && finalArticles.length < 2) {
    const article = categorized.jeux[Math.floor(Math.random() * categorized.jeux.length)];
    finalArticles.push(transformContent(article, 'jeux'));
  }
  
  while (finalArticles.length < 2 && categorized.jeux.length > 0) {
    const available = categorized.jeux.filter(a => !finalArticles.includes(a));
    if (available.length === 0) break;
    const article = available[Math.floor(Math.random() * available.length)];
    finalArticles.push(transformContent(article, 'jeux'));
  }
  
  if (finalArticles.length === 0) {
    const fallback = getFallbackArticles();
    finalArticles.push(transformContent(fallback[0], 'jeux'));
    if (fallback[1]) {
      finalArticles.push(transformContent(fallback[1], 'competition'));
    }
  }
  
  const output = {
    articles: finalArticles.slice(0, 2),
    generatedAt: new Date().toISOString()
  };
  
  const outputPath = path.join(__dirname, '..', 'public', 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n=== Generated ${finalArticles.length} articles ===`);
  finalArticles.forEach((a, i) => {
    console.log(`${i + 1}. [${a.topic}] ${a.title.substring(0, 50)}...`);
  });
  
  console.log(`\nSaved to: ${outputPath}`);
}

main().catch(console.error);
