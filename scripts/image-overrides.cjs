// Visuels officiels par jeu (key arts des éditeurs), utilisés en priorité
// à la place des vignettes des sites d'actualité quand une news parle du jeu.
// Une entrée = mots-clés de titre (minuscules) + URL d'image officielle stable.
// Tu peux ajouter/modifier librement des entrées ici.

const OFFICIAL_IMAGES = [
  {
    title: 'grand theft auto',
    image: 'https://www.rockstargames.com/VI/_next/static/media/meta.0t8ty~nlmxq2s.jpg',
  },
  {
    title: 'gta 6',
    image: 'https://www.rockstargames.com/VI/_next/static/media/meta.0t8ty~nlmxq2s.jpg',
  },
  {
    title: 'gta',
    image: 'https://www.rockstargames.com/VI/_next/static/media/meta.0t8ty~nlmxq2s.jpg',
  },
  {
    title: 'call of duty',
    image: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/store/games/bo6/Store_BO6PDP_Hero.webp',
  },
  {
    title: 'warzone',
    image: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/store/games/bo6/Store_BO6PDP_Hero.webp',
  },
  {
    title: 'black ops',
    image: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/store/games/bo6/Store_BO6PDP_Hero.webp',
  },
  {
    title: 'apex legends',
    image: 'https://drop-assets.ea.com/images/3y7UvygiXzw9jlo05Mn3I5/3d6885fa12103d27c410646df999b979/Apex_S31-Season-Page-16x9.jpg',
  },
  {
    title: 'battlefield',
    image: 'https://drop-assets.ea.com/images/2I7VhVjwdzBgmbpeldmM8t/4f2dcad2d115abd786aa2bb9ff38d89f/battlefield-6-standard-edition-16x9.jpg',
  },
];

// Retourne l'URL du visuel officiel si le titre correspond, sinon null.
function findOfficialImage(title) {
  const normalized = String(title || '').toLowerCase();
  if (!normalized) return null;
  const match = OFFICIAL_IMAGES.find(entry => normalized.includes(entry.title));
  return match ? match.image : null;
}

module.exports = { OFFICIAL_IMAGES, findOfficialImage };
