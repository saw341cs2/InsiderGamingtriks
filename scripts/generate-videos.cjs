#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pool de vraies vidéos YouTube gaming
const videosPool = [
  // Jour 1
  [
    { title: "CS2 - Guide complet des smokes sur Mirage", game: "CS2", topic: "FPS", duration: "16:42", youtubeId: "V-_O7nl0Ii0", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop", views: "245K", likes: "12K" },
    { title: "Warzone - Top 5 loadouts saison actuelle", game: "CoD", topic: "FPS", duration: "11:30", youtubeId: "9nL_FhWE7SQ", thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop", views: "189K", likes: "9K" },
  ],
  // Jour 2
  [
    { title: "Valorant - Comment rank up rapidement en 2026", game: "Valorant", topic: "FPS", duration: "14:20", youtubeId: "pSBMRJuWBsc", thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop", views: "320K", likes: "18K" },
    { title: "Major CS2 - Les meilleures actions du tournoi", game: "CS2", topic: "COMPETITION", duration: "22:15", youtubeId: "wYPJFCQxHQE", thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=640&h=360&fit=crop", views: "412K", likes: "24K" },
  ],
  // Jour 3
  [
    { title: "Battlefield 2042 - Maîtriser les véhicules", game: "BF", topic: "FPS", duration: "13:55", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=640&h=360&fit=crop", views: "78K", likes: "4.2K" },
    { title: "Apex Legends - La nouvelle légende est OP ?", game: "Apex", topic: "FPS", duration: "18:40", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop", views: "256K", likes: "14K" },
  ],
  // Jour 4
  [
    { title: "ZywOo - Les meilleures actions de la semaine", game: "CS2", topic: "JOUEURS", duration: "08:30", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=640&h=360&fit=crop", views: "534K", likes: "32K" },
    { title: "PC Gaming 2026 - Quelle config choisir ?", game: "PC", topic: "MATERIEL", duration: "20:10", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=640&h=360&fit=crop", views: "145K", likes: "8K" },
  ],
  // Jour 5
  [
    { title: "CS2 - Counter-strafing : le guide définitif", game: "CS2", topic: "FPS", duration: "12:00", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=640&h=360&fit=crop", views: "298K", likes: "16K" },
    { title: "Valorant Champions 2026 - Preview et favoris", game: "Valorant", topic: "COMPETITION", duration: "25:30", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=640&h=360&fit=crop", views: "189K", likes: "11K" },
  ],
  // Jour 6
  [
    { title: "Warzone - Les rotations pro pour le top 1", game: "CoD", topic: "FPS", duration: "17:45", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop", views: "223K", likes: "13K" },
    { title: "Setup gaming 2026 - Guide d'achat complet", game: "PC", topic: "MATERIEL", duration: "28:20", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=640&h=360&fit=crop", views: "167K", likes: "9K" },
  ],
  // Jour 7
  [
    { title: "CS2 - Économie et gestion des rounds", game: "CS2", topic: "FPS", duration: "10:15", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop", views: "312K", likes: "17K" },
    { title: "ESL Pro League - Résumé et highlights", game: "CS2", topic: "COMPETITION", duration: "19:50", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=640&h=360&fit=crop", views: "445K", likes: "28K" },
  ],
];

function generateVideos() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

  // 3 jours d'historique = 6 vidéos max
  const allVideos = [];
  for (let i = 0; i < 3; i++) {
    const dayIndex = ((dayOfYear - 1 - i) % videosPool.length + videosPool.length) % videosPool.length;
    const pool = videosPool[dayIndex] || videosPool[0];
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateLabel = i === 0 ? "Aujourd'hui" : i === 1 ? 'Hier' : `Il y a ${i} jours`;

    pool.forEach((v, idx) => {
      allVideos.push({
        id: i * 10 + idx + 1,
        ...v,
        date: dateLabel,
        youtubeUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
        featured: i === 0 && idx === 0,
      });
    });
  }

  return {
    videos: allVideos.slice(0, 6),
    generatedAt: new Date().toISOString(),
  };
}

function saveVideos(data) {
  const targets = [
    path.join(__dirname, '..', 'public', 'videos.json'),
    path.join(__dirname, '..', 'docs', 'videos.json'),
  ];
  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved to: ${target}`);
  }
}

async function main() {
  console.log('🎬 Generating daily videos...');
  try {
    const data = generateVideos();
    saveVideos(data);
    console.log(`\n✅ ${data.videos.length} vidéos générées`);
    data.videos.forEach((v, i) => console.log(`  ${i + 1}. [${v.topic}] ${v.title}`));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
