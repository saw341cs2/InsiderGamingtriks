#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const articlesPool = [
  // Jour 1
  [
    {
      title: "🔫 CS2 : Le nouveau patch change complètement le méta",
      body: "Valve vient de déployer une mise à jour majeure sur CS2. Nouvelles smokes, équilibrage des armes et corrections de bugs.",
      content: `Valve a déployé une mise à jour majeure sur Counter-Strike 2 qui bouleverse complètement le méta compétitif. Voici tout ce que tu dois savoir.

**Les changements d'armes**

L'AK-47 voit sa précision légèrement réduite en mouvement, ce qui favorise les joueurs qui maîtrisent le counter-strafing. Le M4A4 reçoit un buff sur sa cadence de tir, le rendant plus compétitif face à l'AK en side CT.

Le Desert Eagle subit un nerf sur sa précision après le premier tir, ce qui pénalise les joueurs qui spamment. Les AWPers seront contents : le sniper gagne en vitesse de déplacement avec l'arme dégainée.

**Les nouvelles smokes**

Le système de smokes volumétriques reçoit plusieurs corrections. Les smokes sur Mirage mid sont maintenant plus cohérentes, et certains bugs permettant de voir à travers les smokes ont été corrigés.

**Impact sur le méta**

Les équipes pro vont devoir retravailler leurs stratégies. Le buff du M4A4 pourrait relancer le débat M4A4 vs M4A1-S en side CT. Côté T, l'AK reste dominant mais demande plus de précision.

**Notre verdict**

Ce patch va dans le bon sens. Valve écoute la communauté et équilibre progressivement les armes. À toi d'adapter ton jeu !`,
      url: "https://insidergamingtriks.com/news/cs2-patch-meta",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "FPS"
    },
    {
      title: "🖱️ Top 5 des souris gaming pour les FPS en 2026",
      body: "Logitech, Razer, SteelSeries : on a testé les meilleures souris pour dominer en FPS.",
      content: `Choisir la bonne souris gaming peut faire une vraie différence dans tes performances en FPS. On a testé les 5 meilleures du marché en 2026.

**1. Logitech G Pro X Superlight 2 - La référence**

Poids : 60g | DPI : 100-32000 | Prix : ~160€

La souris préférée des pros. Ultra légère, capteur HERO 2 irréprochable, forme ambidextre. Idéale pour le flicking et le tracking. Seul bémol : le prix élevé.

**2. Razer DeathAdder V3 Pro - Le confort avant tout**

Poids : 64g | DPI : 100-30000 | Prix : ~150€

Forme ergonomique parfaite pour les grandes mains. Capteur Focus Pro 30K excellent. La meilleure pour les longues sessions de jeu sans fatigue.

**3. SteelSeries Aerox 5 - Le rapport qualité/prix**

Poids : 74g | DPI : 100-18000 | Prix : ~100€

Coque perforée ultra légère, 9 boutons programmables. Parfaite pour Warzone et les FPS qui demandent beaucoup de raccourcis.

**4. Zowie EC2-C - La souris des pros CS2**

Poids : 73g | DPI : 400-3200 | Prix : ~70€

Plug and play, pas de logiciel, capteur fiable. La souris la plus utilisée sur le circuit CS2 pro. Simple et efficace.

**5. Pulsar X2 Mini - La surprise du classement**

Poids : 52g | DPI : 100-26000 | Prix : ~90€

La plus légère du classement. Capteur PixArt 3395 de référence. Idéale pour les petites mains et les joueurs qui préfèrent les souris compactes.

**Notre recommandation**

Pour débuter : Zowie EC2-C. Pour progresser : SteelSeries Aerox 5. Pour les pros : Logitech G Pro X Superlight 2.`,
      url: "https://insidergamingtriks.com/news/top-souris-fps-2026",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    }
  ],
  // Jour 2
  [
    {
      title: "🏆 Major CS2 : Les équipes qualifiées pour les playoffs",
      body: "Le Major CS2 bat son plein. NaVi, Vitality, FaZe Clan et G2 Esports sont en lice pour le titre.",
      content: `Le Major CS2 entre dans sa phase la plus intense avec les playoffs. Voici l'analyse complète des équipes encore en lice.

**Les favoris**

Team Vitality avec ZywOo reste la grande favorite. Le Français est en forme exceptionnelle avec un rating de 1.38 sur le tournoi. L'équipe affiche une cohésion tactique impressionnante.

NaVi sans s1mple doit prouver qu'elle peut gagner un Major. electronic et b1t portent l'équipe avec brio. Leur jeu collectif est leur plus grande force.

**Les outsiders**

FaZe Clan avec karrigan en IGL reste dangereuse. NiKo est capable de performances individuelles qui changent une partie à lui seul. Leur style agressif peut surprendre n'importe quelle équipe.

G2 Esports avec HooXi et NiKo forme un duo redoutable. L'équipe a montré des progrès tactiques importants ces derniers mois.

**Le bracket des playoffs**

Quarts de finale :
- Vitality vs MOUZ
- NaVi vs Heroic  
- FaZe vs Spirit
- G2 vs Liquid

**Notre pronostic**

Finale : Vitality vs NaVi. Vainqueur : Vitality. ZywOo est tout simplement inarrêtable en ce moment.`,
      url: "https://insidergamingtriks.com/news/major-cs2-playoffs",
      image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    },
    {
      title: "⭐ s1mple revient en compétition : ce qu'on sait",
      body: "Le légendaire joueur ukrainien s1mple serait en discussions avec plusieurs équipes top tier.",
      content: `Le retour de s1mple agite toute la scène CS2. Voici tout ce qu'on sait sur le come-back du meilleur joueur de l'histoire de CS.

**Pourquoi il est parti**

Oleksandr s1mple Kostyliev avait annoncé une pause indéfinie en septembre 2023, évoquant la fatigue mentale et le besoin de se ressourcer. Après des années au sommet avec NaVi, le joueur ukrainien avait besoin de souffler.

**Les rumeurs de retour**

Plusieurs sources proches de la scène indiquent que s1mple s'entraîne à nouveau sérieusement depuis 3 mois. Son niveau serait déjà proche de son meilleur niveau selon des joueurs qui ont scrimé contre lui.

**Les équipes intéressées**

Team Vitality serait la principale candidate. Remplacer un joueur de l'effectif par s1mple créerait l'équipe la plus forte de l'histoire du CS. NaVi serait également intéressée par un retour de leur légende.

**Ce que ça changerait**

S1mple reste le joueur avec le plus haut pic de performance de l'histoire. Son retour redéfinirait complètement la hiérarchie mondiale. Les bookmakers le placent déjà favori pour le prochain Major s'il revient.

**Notre avis**

Un retour de s1mple serait le meilleur événement possible pour la scène CS2. Le jeu a besoin de sa superstar. On croise les doigts !`,
      url: "https://insidergamingtriks.com/news/s1mple-retour",
      image: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    }
  ],
  // Jour 3
  [
    {
      title: "🎮 Call of Duty 2027 : premières infos officielles",
      body: "Activision confirme le prochain opus de Call of Duty. Nouveau moteur graphique, mode Battle Royale amélioré.",
      content: `Activision a officiellement confirmé Call of Duty 2027 lors d'un événement presse. Voici tout ce qu'on sait sur le prochain opus.

**Le nouveau moteur graphique**

CoD 2027 tourne sur un moteur entièrement repensé. Les développeurs promettent des destructions d'environnement en temps réel, une physique des balles améliorée et des effets météo dynamiques. Les screenshots sont impressionnants.

**Le mode campagne**

La campagne solo revient en force avec une histoire se déroulant dans un futur proche. Infiltration, action et choix moraux seront au programme. Durée annoncée : 12-15 heures.

**Warzone 3.0**

Le mode Battle Royale est entièrement refondu. Nouvelle carte de 150km², système de construction à la Fortnite en option, et un mode ranked revu de fond en comble. Les leaks parlent d'une mécanique de véhicules révolutionnaire.

**Le multijoueur**

Retour des maps classiques remasterisées + 20 nouvelles maps au lancement. Système de progression revu, moins de pay-to-win selon Activision. Le crossplay PC/Console sera amélioré avec une meilleure détection des cheaters.

**Date de sortie et prix**

Sortie prévue : novembre 2027. Prix : 69,99€ sur PC, 79,99€ sur console. Une bêta ouverte est prévue 2 mois avant la sortie.

**Notre verdict**

Ça s'annonce prometteur. Si Activision tient ses promesses sur l'anti-cheat, CoD 2027 pourrait être le meilleur opus depuis des années.`,
      url: "https://insidergamingtriks.com/news/cod-2027-infos",
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&h=450&fit=crop",
      topic: "JEUX"
    },
    {
      title: "🎯 Warzone : les meilleures armes de la saison 6",
      body: "Notre tier list complète des armes Warzone saison 6. SMG, AR, sniper : on vous dit tout sur le méta actuel.",
      content: `La saison 6 de Warzone a apporté son lot de changements. Voici notre tier list complète pour dominer le Battle Royale.

**Tier S - Les incontournables**

MTZ-556 (AR) : Le roi de la saison. Dégâts élevés, recul maîtrisable, efficace à toutes distances. Attachements recommandés : canon long, chargeur 60 balles, crosse légère.

WSP Swarm (SMG) : Le meilleur SMG du jeu. Cadence de tir folle, parfait pour le close range. Indispensable en deuxième arme.

**Tier A - Très bons choix**

Longbow (Sniper) : Le sniper le plus polyvalent. One-shot en tête, vitesse de balle excellente. Parfait pour le mid-range.

RAM-7 (AR) : Solide et fiable. Légèrement moins fort que le MTZ mais plus facile à maîtriser pour les débutants.

**Tier B - Situationnels**

Lockwood 680 (Shotgun) : Dévastateur en intérieur. À utiliser uniquement dans les zones urbaines.

KATT-AMR (Sniper) : Le sniper longue distance de référence mais difficile à maîtriser.

**Tier C - À éviter**

La plupart des pistolets et les LMG trop lents pour le rythme actuel du jeu.

**Notre loadout recommandé**

Arme principale : MTZ-556 avec canon Bruen Venom, chargeur 60 balles, crosse FTAC Ripper.
Arme secondaire : WSP Swarm avec canon WSanti, chargeur 50 balles.`,
      url: "https://insidergamingtriks.com/news/warzone-armes-s6",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800&h=450&fit=crop",
      topic: "FPS"
    }
  ],
  // Jour 4
  [
    {
      title: "🎧 Test : le casque HyperX Cloud Alpha 2026 vaut-il son prix ?",
      body: "On a testé le nouveau casque HyperX Cloud Alpha pendant 2 semaines. Son de qualité, micro précis.",
      content: `Après 2 semaines d'utilisation intensive sur CS2, Warzone et Battlefield, voici notre test complet du HyperX Cloud Alpha 2026.

**Design et confort**

Le Cloud Alpha 2026 reprend le design iconique de la gamme avec des améliorations notables. Les coussinets en mousse à mémoire de forme sont plus épais et respirants. Après 4 heures de jeu, aucune douleur aux oreilles. Le serre-tête en aluminium est solide et ajustable facilement.

Poids : 298g - léger pour un casque filaire de cette qualité.

**Qualité audio**

HyperX a intégré de nouveaux drivers 53mm qui font une vraie différence. Les basses sont profondes sans être envahissantes, les médiums clairs pour entendre les pas ennemis, et les aigus précis pour les coups de feu.

En CS2, on entend parfaitement la direction des pas et des grenades. En Warzone, les sons d'ambiance sont immersifs. Le son surround virtuel 7.1 est convaincant.

**Le microphone**

Micro détachable avec réduction de bruit améliorée. La voix est claire et naturelle selon nos coéquipiers Discord. Le bruit de fond est bien filtré même dans un environnement bruyant.

**Compatibilité**

Compatible PC, PS5, Xbox Series X, Switch. Connexion jack 3.5mm + adaptateur USB inclus.

**Prix et verdict**

Prix : 99€. Pour ce prix, c'est excellent. Meilleur rapport qualité/prix de sa catégorie.

Note : 9/10 - Recommandé chaudement pour tous les gamers.`,
      url: "https://insidergamingtriks.com/news/test-hyperx-cloud-2026",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=450&fit=crop",
      topic: "MATERIEL"
    },
    {
      title: "🏅 Valorant Champions 2026 : le programme complet",
      body: "Le tournoi Valorant Champions 2026 se déroulera à Paris. 16 équipes mondiales s'affrontent.",
      content: `Valorant Champions 2026 arrive à Paris ! C'est le tournoi le plus prestigieux du circuit Valorant. Voici tout ce qu'il faut savoir.

**Le lieu et les dates**

L'Accor Arena de Paris accueillera l'événement du 15 au 30 août 2026. C'est la première fois que le Champions se déroule en France. Les billets sont déjà en vente sur le site officiel de Riot Games.

**Les équipes qualifiées**

16 équipes du monde entier :
- Europe : Team Vitality, Fnatic, G2 Esports, Team Heretics
- Amérique du Nord : Sentinels, NRG, Cloud9, 100 Thieves
- Asie-Pacifique : Paper Rex, DRX, ZETA Division, T1
- Amérique Latine : LOUD, KRÜ Esports
- Moyen-Orient : Bleed Esports, Team Falcons

**Le format**

Phase de groupes : 4 groupes de 4 équipes, les 2 premiers qualifiés pour les playoffs.
Playoffs : Format double élimination jusqu'à la grande finale.

**Les favoris**

LOUD reste la grande favorite après leur victoire l'an dernier. Paper Rex avec leur style agressif unique est l'outsider le plus dangereux. Côté Europe, Fnatic avec leur roster remanié veut prouver sa valeur.

**Comment regarder**

Diffusion en direct sur Twitch et YouTube sur la chaîne officielle Valorant. Commentaires disponibles en français sur la chaîne VCT France.

**Notre pronostic**

Finale : LOUD vs Paper Rex. Vainqueur : Paper Rex. Leur méta agressive est parfaite pour ce type de tournoi.`,
      url: "https://insidergamingtriks.com/news/valorant-champions-2026",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
      topic: "COMPETITION"
    }
  ],
  // Jour 5
  [
    {
      title: "🌟 ZywOo : le meilleur joueur CS2 du monde en 2026 ?",
      body: "Mathieu ZywOo Herbaut continue d'impressionner la scène mondiale. Stats et analyse de son jeu.",
      content: `Mathieu ZywOo Herbaut est-il le meilleur joueur CS2 du monde en 2026 ? Les chiffres parlent d'eux-mêmes.

**Ses stats en 2026**

Rating HLTV : 1.41 (meilleur du monde)
K/D ratio : 1.35
KAST : 76.2%
Impact rating : 1.58

Ces chiffres sont tout simplement stratosphériques. ZywOo domine ses adversaires dans tous les aspects du jeu.

**Son style de jeu**

Ce qui rend ZywOo unique c'est sa polyvalence. Il peut jouer AWP, rifle, et même SMG avec la même efficacité. Sa lecture du jeu est exceptionnelle - il est souvent au bon endroit au bon moment.

Sa capacité à clutcher des rounds impossibles est légendaire. En 2026, il affiche un taux de clutch 1v2 de 48%, ce qui est incroyable au niveau pro.

**Sa progression**

À seulement 23 ans, ZywOo est déjà considéré comme l'un des meilleurs de tous les temps. Certains analystes le placent déjà au-dessus de s1mple dans les discussions GOAT.

**Ce que les pros disent de lui**

NiKo : "ZywOo est le joueur le plus difficile à affronter. Tu ne sais jamais ce qu'il va faire."
karrigan : "Il change une partie à lui seul. On doit toujours avoir un plan spécial contre lui."

**Notre verdict**

Oui, ZywOo est le meilleur joueur CS2 du monde en 2026. Et il n'a pas encore atteint son pic. L'avenir lui appartient.`,
      url: "https://insidergamingtriks.com/news/zywoo-meilleur-2026",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      topic: "JOUEURS"
    },
    {
      title: "💥 Battlefield 2025 : nouveau mode de jeu dévoilé",
      body: "EA et DICE annoncent un nouveau mode de jeu pour Battlefield. Batailles 128 joueurs, destruction améliorée.",
      content: `EA et DICE viennent de dévoiler un nouveau mode de jeu pour Battlefield 2025 qui promet de révolutionner l'expérience multijoueur.

**Le nouveau mode : "All-Out War"**

Ce mode 128 joueurs repense complètement la formule Battlefield. Deux équipes de 64 joueurs s'affrontent sur une carte géante avec des objectifs dynamiques qui évoluent en temps réel.

**La destruction améliorée**

Le moteur Frostbite a été mis à jour pour permettre une destruction encore plus poussée. Les bâtiments peuvent s'effondrer progressivement, créant de nouvelles lignes de tir et de nouveaux abris. Les ponts peuvent être détruits pour couper les routes d'approvisionnement ennemies.

**Les nouvelles cartes**

3 nouvelles cartes sont annoncées pour ce mode :
- Désert de Gobi : combat de véhicules à grande échelle
- Forêt amazonienne : combat d'infanterie dense
- Ville côtière : mélange naval, aérien et terrestre

**Les véhicules**

15 nouveaux véhicules dont des sous-marins, des drones de combat et des mechs légers. Le pilotage a été entièrement revu pour être plus accessible aux nouveaux joueurs.

**Date de sortie**

Ce mode sera disponible gratuitement pour tous les possesseurs de Battlefield 2025 le 15 juillet 2026.

**Notre avis**

Ça ressemble exactement à ce que les fans demandaient depuis des années. DICE semble avoir écouté la communauté. On a hâte de tester !`,
      url: "https://insidergamingtriks.com/news/battlefield-nouveau-mode",
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=450&fit=crop",
      topic: "FPS"
    }
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
