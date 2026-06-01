#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Articles pool - 7 jours de contenu
const articlesPool = [
  // Jour 1
  [
    {
      title: "🎮 PlayStation 6 : Sony confirme les premiers détails",
      body: "Sony dévoile les caractéristiques de la PS6. Puissance, performances, date de sortie prévue. #JeuxVideo #PS6",
      url: "https://insidergamingtriks.com/news/ps6-details-2026",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "⚡ LEC 2026 : Les meilleures équipes du championnat",
      body: "Retour sur les équipes qui dominent la League of Legends. Prédictions pour les playoffs. #Esport #LEC #Competition",
      url: "https://insidergamingtriks.com/news/lec-2026",
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 2
  [
    {
      title: "🎯 Guide complet : améliorer son aim en FPS",
      body: "Conseils et astuces pour progresser en FPS. Entraînement, paramètres, matériel. #FPS #Gaming #Tips",
      url: "https://insidergamingtriks.com/news/fps-aim-guide",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "💻 Les meilleures configurations PC gaming 2026",
      body: "Notre sélection des meilleurs PC gaming par budget. De l'entrée de gamme au haut de gamme. #Gaming #PC",
      url: "https://insidergamingtriks.com/news/best-pc-gaming-2026",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop",
      topic: "JEUX"
    }
  ],
  // Jour 3
  [
    {
      title: "🏆 Xbox menace les joueurs de Forza Horizon",
      body: "Microsoft prend des mesures contre l'accès non autorisé à Forza Horizon 6. #Competition #Xbox #Gaming",
      url: "https://insidergamingtriks.com/news/xbox-forza-measures",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    },
    {
      title: "📢 LEC Spring Playoffs : Les favoris pour le titre",
      body: "Analyse des équipes favorites pour remporter le titre du printemps. Qui sera champion ? #Esport #LEC",
      url: "https://insidergamingtriks.com/news/lec-playoffs",
      image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 4
  [
    {
      title: "🕹️ Les meilleurs jeux indie de 2026",
      body: "Découvrez les jeux indépendants à ne pas manquer cette année. Innovation et créativité. #IndieGames #Gaming",
      url: "https://insidergamingtriks.com/news/indie-games-2026",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "⚔️ Valorant Pro : Le méta de 2026",
      body: "Analyse du méta actuel dans le pro Valorant. Agents, stratégies gagnantes, tendances. #Esport #Valorant",
      url: "https://insidergamingtriks.com/news/valorant-meta-2026",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 5
  [
    {
      title: "🎧 Le meilleur setup gaming 2026",
      body: "Chaise, bureau, casque : tout ce qu'il faut pour un setup gaming parfait. #Gaming #Setup #Guide",
      url: "https://insidergamingtriks.com/news/best-gaming-setup",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "🔫 Nouvelle arme révolutionnaire en FPS",
      body: "Découvrez la nouvelle arme qui change le méta des jeux FPS. Analyse complète. #FPS #Gaming #Meta",
      url: "https://insidergamingtriks.com/news/new-fps-weapon",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 6
  [
    {
      title: "🎮 Nintendo Switch 2 : Les premières images",
      body: "Premières images officielles de la Nintendo Switch 2. Specs, design, date de sortie. #Nintendo #Gaming",
      url: "https://insidergamingtriks.com/news/switch-2-images",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "💰 Salaires dans l'esport 2026",
      body: "Revenus des joueurs pro et des équipes esports. Comparaison avec les années précédentes. #Esport #Money",
      url: "https://insidergamingtriks.com/news/esport-salaries-2026",
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 7
  [
    {
      title: "📅 Sorties gaming : dates à retenir cette semaine",
      body: "Tous les jeux qui sortiront cette semaine. Blockbusters et pépites à ne pas manquer. #JeuxVideo #Sorties",
      url: "https://insidergamingtriks.com/news/game-releases-week",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "🎬 Streamers gaming : top 10 des plus regardés",
      body: "Découvrez les streamers les plus populaires du moment sur Twitch. Records d'audience. #Gaming #Twitch #Streamers",
      url: "https://insidergamingtriks.com/news/top-streamers",
      image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop",
      topic: "JEUX"
    }
  ]
];

function generateNews() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const dayIndex = (dayOfYear - 1) % 7; // 0-6 for 7 days rotation
  
  const todayArticles = articlesPool[dayIndex] || articlesPool[0];
  
  const output = {
    articles: todayArticles.map(article => ({
      ...article,
      dateTimePub: new Date().toISOString(),
      source: "InsiderGamingtriks"
    })),
    generatedAt: new Date().toISOString()
  };
  
  return output;
}

function saveNews(data) {
  const targets = [
    path.join(__dirname, '..', 'public', 'news.json'),
    path.join(__dirname, '..', 'docs', 'news.json'),
    path.join(__dirname, '..', 'news.json'),
  ];
  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved to: ${target}`);
  }
}

async function main() {
  console.log('📰 Generating daily gaming news...');
  
  try {
    const newsData = generateNews();
    saveNews(newsData);
    
    console.log(`\n✅ Generated ${newsData.articles.length} articles for today:`);
    newsData.articles.forEach((article, index) => {
      console.log(`  ${index + 1}. [${article.topic}] ${article.title}`);
    });
    
    console.log(`\n✅ Success! Generated at: ${newsData.generatedAt}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
