#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const articlesPool = [
  // Jour 1 - FPS + Matériel
  [
    { title: "🔫 CS2 : Le nouveau patch change complètement le méta", body: "Valve vient de déployer une mise à jour majeure sur CS2. Nouvelles smokes, équilibrage des armes et corrections de bugs. Les pros réagissent. #CS2 #FPS #Gaming", url: "https://insidergamingtriks.com/news/cs2-patch-meta", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop", topic: "FPS" },
    { title: "🖱️ Top 5 des souris gaming pour les FPS en 2026", body: "Logitech, Razer, SteelSeries : on a testé les meilleures souris pour dominer en FPS. Légèreté, précision et DPI au programme. #Materiel #Gaming #Setup", url: "https://insidergamingtriks.com/news/top-souris-fps-2026", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop", topic: "MATERIEL" }
  ],
  // Jour 2 - Compétition + Joueurs
  [
    { title: "🏆 Major CS2 : Les équipes qualifiées pour les playoffs", body: "Le Major CS2 bat son plein. NaVi, Vitality, FaZe Clan et G2 Esports sont en lice pour le titre. Analyse des matchs clés. #CS2 #Esport #Major", url: "https://insidergamingtriks.com/news/major-cs2-playoffs", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop", topic: "COMPETITION" },
    { title: "⭐ s1mple revient en compétition : ce qu'on sait", body: "Le légendaire joueur ukrainien s1mple serait en discussions avec plusieurs équipes top tier. Son retour ferait trembler la scène CS2. #s1mple #CS2 #Joueur", url: "https://insidergamingtriks.com/news/s1mple-retour", image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop", topic: "JOUEURS" }
  ],
  // Jour 3 - Jeux + FPS
  [
    { title: "🎮 Call of Duty 2027 : premières infos officielles", body: "Activision confirme le prochain opus de Call of Duty. Nouveau moteur graphique, mode Battle Royale amélioré et campagne solo inédite. #CoD #FPS #Gaming", url: "https://insidergamingtriks.com/news/cod-2027-infos", image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&h=450&fit=crop", topic: "JEUX" },
    { title: "🎯 Warzone : les meilleures armes de la saison 6", body: "Notre tier list complète des armes Warzone saison 6. SMG, AR, sniper : on vous dit tout sur le méta actuel pour gagner plus de parties. #Warzone #CoD #FPS", url: "https://insidergamingtriks.com/news/warzone-armes-s6", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800&h=450&fit=crop", topic: "FPS" }
  ],
  // Jour 4 - Matériel + Compétition
  [
    { title: "🎧 Test : le casque HyperX Cloud Alpha 2026 vaut-il son prix ?", body: "On a testé le nouveau casque HyperX Cloud Alpha pendant 2 semaines. Son de qualité, micro précis, confort optimal. Notre verdict complet. #Materiel #Gaming #Casque", url: "https://insidergamingtriks.com/news/test-hyperx-cloud-2026", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop", topic: "MATERIEL" },
    { title: "🏅 Valorant Champions 2026 : le programme complet", body: "Le tournoi Valorant Champions 2026 se déroulera à Paris. 16 équipes mondiales s'affrontent pour le titre suprême. Dates, format et équipes qualifiées. #Valorant #Esport", url: "https://insidergamingtriks.com/news/valorant-champions-2026", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop", topic: "COMPETITION" }
  ],
  // Jour 5 - Joueurs + FPS
  [
    { title: "🌟 ZywOo : le meilleur joueur CS2 du monde en 2026 ?", body: "Mathieu ZywOo Herbaut continue d'impressionner la scène mondiale. Stats, performances et analyse de son jeu exceptionnel cette saison. #ZywOo #CS2 #Joueur", url: "https://insidergamingtriks.com/news/zywoo-meilleur-2026", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop", topic: "JOUEURS" },
    { title: "💥 Battlefield 2025 : nouveau mode de jeu dévoilé", body: "EA et DICE annoncent un nouveau mode de jeu pour Battlefield. Batailles 128 joueurs, destruction améliorée et nouvelles cartes. #Battlefield #FPS #Gaming", url: "https://insidergamingtriks.com/news/battlefield-nouveau-mode", image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=450&fit=crop", topic: "FPS" }
  ],
  // Jour 6 - Jeux + Matériel
  [
    { title: "🕹️ PlayStation 6 : date de sortie et prix confirmés", body: "Sony officialise enfin la PS6. Prix de lancement, jeux disponibles au day one et performances techniques. Tout ce qu'il faut savoir. #PS6 #Sony #Gaming", url: "https://insidergamingtriks.com/news/ps6-date-prix", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop", topic: "JEUX" },
    { title: "⌨️ Clavier mécanique gaming : notre top 5 pour 2026", body: "Switch Cherry MX, Gateron ou Kailh ? On compare les meilleurs claviers mécaniques gaming du marché pour tous les budgets. #Materiel #Clavier #Gaming", url: "https://insidergamingtriks.com/news/top-claviers-2026", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop", topic: "MATERIEL" }
  ],
  // Jour 7 - Compétition + Joueurs
  [
    { title: "🥊 IEM Cologne 2026 : résultats et highlights", body: "L'IEM Cologne a livré des matchs épiques. Retour sur les meilleures actions, les surprises et les déceptions du tournoi. #IEM #CS2 #Esport", url: "https://insidergamingtriks.com/news/iem-cologne-2026", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop", topic: "COMPETITION" },
    { title: "🎮 shroud revient sur CS2 : ses impressions après 6 mois", body: "L'ancien pro et streamer légendaire shroud partage son analyse de CS2 en 2026. Méta, changements et comparaison avec CS:GO. #shroud #CS2 #Joueur", url: "https://insidergamingtriks.com/news/shroud-cs2-impressions", image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop", topic: "JOUEURS" }
  ],
  // Jour 8 - FPS + Jeux
  [
    { title: "🔥 Apex Legends : la nouvelle légende change tout", body: "La saison 22 d'Apex Legends introduit une nouvelle légende avec des capacités inédites. Analyse complète de ses skills et impact sur le méta. #Apex #FPS #Gaming", url: "https://insidergamingtriks.com/news/apex-nouvelle-legende", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop", topic: "FPS" },
    { title: "📅 Sorties jeux vidéo : les titres à ne pas manquer ce mois", body: "RPG, FPS, aventure : voici tous les jeux qui sortent ce mois-ci. Notre sélection des titres les plus attendus avec dates et plateformes. #JeuxVideo #Gaming #Sorties", url: "https://insidergamingtriks.com/news/sorties-jeux-mois", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop", topic: "JEUX" }
  ],
  // Jour 9 - Matériel + Compétition
  [
    { title: "🖥️ Meilleurs moniteurs gaming 144Hz et 240Hz en 2026", body: "On compare les meilleurs écrans gaming du marché. Temps de réponse, résolution, HDR : notre guide complet pour choisir son moniteur. #Materiel #Moniteur #Gaming", url: "https://insidergamingtriks.com/news/meilleurs-moniteurs-2026", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop", topic: "MATERIEL" },
    { title: "🏆 ESL Pro League : classement et résultats de la semaine", body: "Retour sur les matchs de l'ESL Pro League cette semaine. Surprises, performances et analyse des équipes en forme. #ESL #CS2 #Esport #Competition", url: "https://insidergamingtriks.com/news/esl-pro-league-resultats", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop", topic: "COMPETITION" }
  ],
  // Jour 10 - Joueurs + FPS
  [
    { title: "⚡ NiKo : interview exclusive sur sa carrière et ses objectifs", body: "Nikola NiKo Kovač se confie sur sa carrière, ses ambitions pour 2026 et sa vision du CS2 compétitif. Une interview à ne pas manquer. #NiKo #CS2 #Joueur", url: "https://insidergamingtriks.com/news/niko-interview-2026", image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop", topic: "JOUEURS" },
    { title: "🎯 Rainbow Six Siege : les changements de la saison Y11", body: "Ubisoft dévoile les nouveautés de la saison Y11 de Rainbow Six Siege. Nouvel opérateur, nouvelle carte et rééquilibrages majeurs. #R6 #FPS #Gaming", url: "https://insidergamingtriks.com/news/r6-siege-y11", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800&h=450&fit=crop", topic: "FPS" }
  ],
  // Jour 11 - Jeux + Compétition
  [
    { title: "🎮 Xbox Series X2 : Microsoft prépare sa prochaine console", body: "Des leaks crédibles révèlent les specs de la prochaine Xbox. Puissance, rétrocompatibilité et Game Pass amélioré au programme. #Xbox #Microsoft #Gaming", url: "https://insidergamingtriks.com/news/xbox-series-x2-leaks", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop", topic: "JEUX" },
    { title: "🌍 Worlds League of Legends 2026 : les équipes favorites", body: "Le championnat du monde LoL approche. T1, G2, Cloud9 : analyse des équipes favorites et prédictions pour le titre mondial. #LoL #Worlds #Esport", url: "https://insidergamingtriks.com/news/worlds-lol-2026-favoris", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop", topic: "COMPETITION" }
  ],
  // Jour 12 - Matériel + Joueurs
  [
    { title: "🎮 Manette vs Clavier-Souris : quel setup pour les FPS ?", body: "Le débat éternel tranché par les données. On analyse les avantages et inconvénients de chaque setup pour les jeux de tir compétitifs. #Materiel #FPS #Gaming", url: "https://insidergamingtriks.com/news/manette-vs-km-fps", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop", topic: "MATERIEL" },
    { title: "🌟 Faker : le roi de LoL toujours au sommet à 30 ans", body: "Lee Faker Sang-hyeok continue de dominer la scène League of Legends mondiale. Retour sur sa carrière légendaire et ses performances actuelles. #Faker #LoL #Joueur", url: "https://insidergamingtriks.com/news/faker-roi-lol-2026", image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop", topic: "JOUEURS" }
  ],
  // Jour 13 - FPS + Jeux
  [
    { title: "💣 CS2 : les meilleures maps de la pool compétitive 2026", body: "Dust2, Mirage, Inferno, Nuke : analyse complète des maps du pool compétitif CS2. Stratégies, callouts et tips pour chaque carte. #CS2 #FPS #Maps", url: "https://insidergamingtriks.com/news/cs2-maps-pool-2026", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=450&fit=crop", topic: "FPS" },
    { title: "🕹️ Les 10 meilleurs jeux PC de 2026 selon les joueurs", body: "Le classement des jeux PC les mieux notés par la communauté en 2026. FPS, RPG, stratégie : tous les genres représentés. #JeuxVideo #PC #Gaming", url: "https://insidergamingtriks.com/news/top-jeux-pc-2026", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop", topic: "JEUX" }
  ],
  // Jour 14 - Compétition + Matériel
  [
    { title: "🏅 BLAST Premier 2026 : résultats et prochains matchs", body: "Le BLAST Premier continue avec des matchs de haute volée. Résultats, classements et preview des prochaines rencontres à ne pas manquer. #BLAST #CS2 #Esport", url: "https://insidergamingtriks.com/news/blast-premier-2026", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop", topic: "COMPETITION" },
    { title: "💺 Test : chaise gaming DXRacer vs SecretLab en 2026", body: "On compare deux références du marché des chaises gaming. Confort, durabilité, prix : notre verdict après 3 mois d'utilisation intensive. #Materiel #Chaise #Gaming", url: "https://insidergamingtriks.com/news/test-chaises-gaming-2026", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop", topic: "MATERIEL" }
  ],
];

function generateNews() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const dayIndex = (dayOfYear - 1) % articlesPool.length;
  const todayArticles = articlesPool[dayIndex] || articlesPool[0];

  return {
    articles: todayArticles.map(article => ({
      ...article,
      dateTimePub: new Date().toISOString(),
      source: 'InsiderGamingtriks',
    })),
    generatedAt: new Date().toISOString(),
  };
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
    console.log(`\n✅ ${newsData.articles.length} articles générés:`);
    newsData.articles.forEach((a, i) => console.log(`  ${i + 1}. [${a.topic}] ${a.title}`));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
