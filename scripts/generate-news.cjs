#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const articlesPool = [
  // Jour 1
  [
    {
      title: "🔫 CS2 : Le nouveau patch change complètement le méta",
      body: "Valve vient de déployer une mise à jour majeure sur CS2. Nouvelles smokes, équilibrage des armes et corrections de bugs.",
      url: "https://insidertricks.fr/news/cs2-patch-meta",
      image: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "🖱️ Top 5 des souris gaming pour les FPS en 2026",
      body: "Logitech, Razer, SteelSeries : on a testé les meilleures souris pour dominer en FPS. Notre classement complet.",
      url: "https://insidertricks.fr/news/top-souris-fps-2026",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    }
  ],
  // Jour 2
  [
    {
      title: "🏆 Major CS2 : Les équipes qualifiées pour les playoffs",
      body: "Le Major CS2 bat son plein. NaVi, Vitality, FaZe Clan et G2 Esports sont en lice pour le titre mondial.",
      url: "https://insidertricks.fr/news/major-cs2-playoffs",
      image: "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    },
    {
      title: "⭐ s1mple revient en compétition : ce qu'on sait",
      body: "Le légendaire joueur ukrainien s1mple serait en discussions avec plusieurs équipes top tier pour un retour.",
      url: "https://insidertricks.fr/news/s1mple-retour",
      image: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    }
  ],
  // Jour 3
  [
    {
      title: "🎮 Call of Duty 2027 : premières infos officielles",
      body: "Activision confirme le prochain opus de Call of Duty. Nouveau moteur graphique, mode Battle Royale entièrement refondu.",
      url: "https://insidertricks.fr/news/cod-2027-infos",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "🎯 Warzone : les meilleures armes de la saison actuelle",
      body: "Notre tier list complète des armes Warzone. SMG, AR, sniper : tout sur le méta actuel pour dominer.",
      url: "https://insidertricks.fr/news/warzone-armes-meta",
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 4
  [
    {
      title: "🎧 Test : le casque HyperX Cloud Alpha 2026 vaut-il son prix ?",
      body: "On a testé le nouveau casque HyperX Cloud Alpha pendant 2 semaines. Son de qualité, micro précis, confort optimal.",
      url: "https://insidertricks.fr/news/test-hyperx-cloud-2026",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🏅 Valorant Champions 2026 : le programme complet",
      body: "Le tournoi Valorant Champions 2026 se déroulera à Paris. 16 équipes mondiales s'affrontent pour le titre.",
      url: "https://insidertricks.fr/news/valorant-champions-2026",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 5
  [
    {
      title: "🌟 ZywOo : le meilleur joueur CS2 du monde en 2026 ?",
      body: "Mathieu ZywOo Herbaut continue d'impressionner la scène mondiale. Analyse complète de ses stats et son style de jeu.",
      url: "https://insidertricks.fr/news/zywoo-meilleur-2026",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    },
    {
      title: "💥 Battlefield 2025 : nouveau mode de jeu dévoilé",
      body: "EA et DICE annoncent un nouveau mode 128 joueurs pour Battlefield. Destruction améliorée et nouvelles cartes.",
      url: "https://insidertricks.fr/news/battlefield-nouveau-mode",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 6
  [
    {
      title: "🖥️ Meilleurs moniteurs gaming 144Hz en 2026 : notre sélection",
      body: "On a comparé les meilleurs écrans gaming 144Hz et 240Hz du marché. IPS, VA ou TN : lequel choisir pour les FPS ?",
      url: "https://insidertricks.fr/news/moniteurs-gaming-2026",
      image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🎮 Apex Legends : la nouvelle légende change tout",
      body: "Respawn Entertainment dévoile la nouvelle légende de la saison. Ses capacités vont bouleverser le méta compétitif.",
      url: "https://insidertricks.fr/news/apex-nouvelle-legende",
      image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=450&fit=crop",
      topic: "JEUX"
    }
  ],
  // Jour 7
  [
    {
      title: "🏆 Fnatic remporte l'IEM Cologne 2026 face à NaVi",
      body: "Fnatic s'impose en finale de l'IEM Cologne dans un match épique en 3 maps. Retour au sommet pour la légende britannique.",
      url: "https://insidertricks.fr/news/fnatic-iem-cologne-2026",
      image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    },
    {
      title: "⌨️ Guide : choisir son clavier mécanique pour le gaming",
      body: "Cherry MX Red, Blue ou Brown ? On t'explique tout sur les switchs mécaniques pour trouver le clavier parfait.",
      url: "https://insidertricks.fr/news/guide-clavier-mecanique",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    }
  ],
  // Jour 8
  [
    {
      title: "🎯 Valorant : patch 9.0 — tous les changements d'agents",
      body: "Riot Games déploie le patch 9.0 de Valorant. Nerfs, buffs et reworks : voici tout ce qui change pour les agents.",
      url: "https://insidertricks.fr/news/valorant-patch-9",
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "🌍 Rainbow Six Siege : la nouvelle opération dévoilée",
      body: "Ubisoft présente la nouvelle opération de Rainbow Six Siege avec deux nouveaux opérateurs et une map remasterisée.",
      url: "https://insidertricks.fr/news/r6-nouvelle-operation",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 9
  [
    {
      title: "💻 RTX 5090 vs RX 9900 XTX : le duel des GPU gaming",
      body: "On a comparé les deux monstres du marché GPU. Performances en 4K, ray tracing et rapport qualité/prix analysés.",
      url: "https://insidertricks.fr/news/rtx5090-vs-rx9900",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🎮 Overwatch 2 : la saison 15 apporte des changements majeurs",
      body: "Blizzard annonce des changements profonds pour la saison 15 d'Overwatch 2. Nouveau mode de jeu et héros retravaill.",
      url: "https://insidertricks.fr/news/overwatch2-saison15",
      image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&h=450&fit=crop",
      topic: "JEUX"
    }
  ],
  // Jour 10
  [
    {
      title: "🏅 EWC 2026 : l'Esport World Cup bat tous les records",
      body: "L'Esport World Cup 2026 à Riyad affiche un prize pool record de 60 millions de dollars. Les meilleures équipes mondiales présentes.",
      url: "https://insidertricks.fr/news/ewc-2026-record",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    },
    {
      title: "🎙️ shroud revient sur Twitch : ses premiers streams analysés",
      body: "Michael shroud Grzesiek est de retour sur Twitch après une longue pause. Ses performances sur CS2 et Valorant impressionnent.",
      url: "https://insidertricks.fr/news/shroud-retour-twitch",
      image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    }
  ],
  // Jour 11
  [
    {
      title: "🔧 Comment optimiser CS2 pour avoir plus de FPS",
      body: "Guide complet pour booster tes FPS sur CS2. Paramètres graphiques, launch options et config Windows optimale.",
      url: "https://insidertricks.fr/news/optimiser-cs2-fps",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "🎮 GTA VI : ce qu'on sait sur le mode multijoueur",
      body: "Rockstar Games lève le voile sur GTA Online VI. Nouvelles mécaniques, map étendue et mode compétitif inédit.",
      url: "https://insidertricks.fr/news/gta6-multijoueur",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
      topic: "JEUX"
    }
  ],
  // Jour 12
  [
    {
      title: "🎧 Comparatif : les meilleurs DAC/AMP pour gamer en 2026",
      body: "Tu veux le meilleur son possible pour entendre les pas ennemis ? On compare les meilleurs DAC/AMP du marché.",
      url: "https://insidertricks.fr/news/dac-amp-gaming-2026",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🏆 NiKo rejoint une nouvelle équipe : les détails",
      body: "Nikola NiKo Kovač quitte G2 Esports et signe dans une nouvelle organisation. Analyse de ce transfert qui secoue la scène.",
      url: "https://insidertricks.fr/news/niko-nouveau-transfert",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    }
  ],
  // Jour 13
  [
    {
      title: "🎮 Escape from Tarkov : la nouvelle map Arena dévoilée",
      body: "Battlestate Games présente Arena, une nouvelle map compétitive pour Escape from Tarkov. Format 5v5 et ranked intégré.",
      url: "https://insidertricks.fr/news/tarkov-arena-map",
      image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "📊 Classement mondial FPS 2026 : les meilleurs joueurs",
      body: "Notre classement des 10 meilleurs joueurs FPS du monde en 2026. CS2, Valorant, R6 : qui domine la scène mondiale ?",
      url: "https://insidertricks.fr/news/classement-mondial-fps-2026",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 14
  [
    {
      title: "🖱️ Guide tapis de souris gaming : grand format ou petit ?",
      body: "Quel tapis de souris choisir pour le gaming compétitif ? On compare les formats, matières et marques du marché.",
      url: "https://insidertricks.fr/news/guide-tapis-souris-gaming",
      image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🎮 Hunt Showdown 2 : le FPS extraction qui monte",
      body: "Hunt Showdown 2 s'impose comme le FPS extraction incontournable. Analyse du gameplay, des mécaniques et du méta actuel.",
      url: "https://insidertricks.fr/news/hunt-showdown-2-analyse",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
];

function generateNews() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

  const allArticles = [];
  for (let i = 0; i < 3; i++) {
    const dayIndex = ((dayOfYear - 1 - i) % articlesPool.length + articlesPool.length) % articlesPool.length;
    const pool = articlesPool[dayIndex] || articlesPool[0];
    const date = new Date();
    date.setDate(date.getDate() - i);
    allArticles.push(...pool.map(article => ({
      ...article,
      dateTimePub: date.toISOString(),
      source: 'InsiderGamingtriks',
    })));
  }

  return {
    articles: allArticles,
    generatedAt: new Date().toISOString(),
  };
}

const NEWS_TARGETS = [
  path.join(__dirname, '..', 'public', 'news.json'),
  path.join(__dirname, '..', 'docs', 'news.json'),
  path.join(__dirname, '..', 'news.json'),
];

const ARCHIVE_TARGETS = [
  path.join(__dirname, '..', 'public', 'news-archives.json'),
  path.join(__dirname, '..', 'docs', 'news-archives.json'),
  path.join(__dirname, '..', 'news-archives.json'),
];

function readJson(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.warn(`⚠️  Lecture impossible de ${file}: ${error.message}`);
  }
  return fallback;
}

function archiveOldNews(freshArticles) {
  const previous = readJson(NEWS_TARGETS[0], { articles: [] });
  const previousArticles = Array.isArray(previous.articles) ? previous.articles : [];
  const freshUrls = new Set(freshArticles.map(a => a.url));
  const droppedFromHome = previousArticles.filter(a => !freshUrls.has(a.url));
  if (droppedFromHome.length === 0) return;

  const archive = readJson(ARCHIVE_TARGETS[0], { articles: [] });
  const archiveArticles = Array.isArray(archive.articles) ? archive.articles : [];
  const existingUrls = new Set(archiveArticles.map(a => a.url));
  const newlyArchived = droppedFromHome.filter(a => !existingUrls.has(a.url));
  const merged = [...newlyArchived, ...archiveArticles].slice(0, 100);
  const output = { articles: merged, generatedAt: new Date().toISOString() };
  for (const target of ARCHIVE_TARGETS) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, JSON.stringify(output, null, 2), 'utf8');
  }
  console.log(`🗄️  ${newlyArchived.length} news archivée(s)`);
}

function saveNews(data) {
  for (const target of NEWS_TARGETS) {
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
    archiveOldNews(newsData.articles);
    saveNews(newsData);
    console.log(`\n✅ ${newsData.articles.length} articles générés`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { articlesPool, generateNews, main };
