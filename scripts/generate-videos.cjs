#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 2 vidéos tous les 2 jours, même thème par paire
const videosPool = [
  // Paire 1 - FPS
  [
    { title: "InsiderGamingTricks - Intro", game: "PC", topic: "FPS", duration: "", youtubeId: "ShXz6WTI280", thumbnail: "https://img.youtube.com/vi/ShXz6WTI280/maxresdefault.jpg", views: "0", likes: "0" },
    { title: "CS2 : Guide des smokes indispensables sur Mirage", game: "CS2", topic: "FPS", duration: "16:42", youtubeId: "9nL_FhWE7SQ", thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=640&h=360&fit=crop", views: "189K", likes: "9K" },
  ],
  // Paire 2 - Compétition
  [
    { title: "Comment se qualifier pour un tournoi CS2 amateur", game: "CS2", topic: "COMPETITION", duration: "18:30", youtubeId: "wYPJFCQxHQE", thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=640&h=360&fit=crop", views: "312K", likes: "18K" },
    { title: "Valorant : Tuto pour monter en rang rapidement", game: "Valorant", topic: "COMPETITION", duration: "22:15", youtubeId: "pSBMRJuWBsc", thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop", views: "412K", likes: "24K" },
  ],
  // Paire 3 - Jeux
  [
    { title: "GTA 6 : Tout ce qu'on sait sur le gameplay", game: "PC", topic: "JEUX", duration: "20:10", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=360&fit=crop", views: "890K", likes: "52K" },
    { title: "Top 10 jeux FPS à tester absolument en 2026", game: "PC", topic: "JEUX", duration: "15:45", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop", views: "445K", likes: "28K" },
  ],
  // Paire 4 - Matériel
  [
    { title: "Tuto : Choisir sa souris gaming selon son grip", game: "PC", topic: "MATERIEL", duration: "12:00", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=640&h=360&fit=crop", views: "167K", likes: "9K" },
    { title: "Meilleur setup gaming 2026 pour moins de 1000€", game: "PC", topic: "MATERIEL", duration: "25:30", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=640&h=360&fit=crop", views: "298K", likes: "16K" },
  ],
  // Paire 5 - Gamers
  [
    { title: "ZywOo : Comment il vise aussi bien ? Analyse complète", game: "CS2", topic: "GAMERS", duration: "19:50", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=640&h=360&fit=crop", views: "534K", likes: "32K" },
    { title: "s1mple : Les habitudes d'entraînement d'un pro", game: "CS2", topic: "GAMERS", duration: "17:20", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=640&h=360&fit=crop", views: "623K", likes: "38K" },
  ],
  // Paire 6 - FPS
  [
    { title: "Warzone : Tuto rotations pro pour finir top 1", game: "CoD", topic: "FPS", duration: "17:45", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop", views: "223K", likes: "13K" },
    { title: "Apex Legends : Guide complet pour débuter en ranked", game: "Apex", topic: "FPS", duration: "21:10", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop", views: "256K", likes: "14K" },
  ],
  // Paire 7 - Compétition
  [
    { title: "ESL Pro League : Analyse tactique des meilleures équipes", game: "CS2", topic: "COMPETITION", duration: "28:00", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=640&h=360&fit=crop", views: "445K", likes: "27K" },
    { title: "Valorant Champions 2026 : Preview et favoris", game: "Valorant", topic: "COMPETITION", duration: "24:30", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=640&h=360&fit=crop", views: "389K", likes: "22K" },
  ],
  // Paire 8 - Jeux
  [
    { title: "Battlefield 2042 : Tuto maîtriser les véhicules", game: "BF", topic: "JEUX", duration: "13:55", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=640&h=360&fit=crop", views: "78K", likes: "4.2K" },
    { title: "CS2 : Tuto économie et gestion des rounds", game: "CS2", topic: "JEUX", duration: "10:15", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop", views: "312K", likes: "17K" },
  ],
  // Paire 9 - Matériel
  [
    { title: "Tuto : Optimiser Windows 11 pour le gaming FPS", game: "PC", topic: "MATERIEL", duration: "22:40", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=640&h=360&fit=crop", views: "534K", likes: "31K" },
    { title: "Casque gaming : lequel choisir en 2026 ? Comparatif", game: "PC", topic: "MATERIEL", duration: "18:00", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=640&h=360&fit=crop", views: "145K", likes: "8K" },
  ],
  // Paire 10 - Gamers
  [
    { title: "NiKo : Analyse de sa technique de visée unique", game: "CS2", topic: "GAMERS", duration: "16:30", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1516382799247-4ca8e1eeabf3?w=640&h=360&fit=crop", views: "478K", likes: "29K" },
    { title: "Shroud : Pourquoi il reste le meilleur aim du monde", game: "PC", topic: "GAMERS", duration: "14:50", youtubeId: "ScNTWbKMZX4", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=640&h=360&fit=crop", views: "712K", likes: "45K" },
  ],
];

// Toujours présent : vidéo locale (lecteur HTML5)
const localVideo = {
  id: 0,
  title: "Video Short - InsiderGamingTricks",
  game: "PC",
  topic: "FPS",
  duration: "",
  youtubeId: "",
  thumbnail: "",
  views: "0",
  likes: "0",
  date: "Aujourd'hui",
  youtubeUrl: "",
  featured: false,
  localVideoPath: "videos/video-short.mp4",
};

function generateVideos() {
  // Changer de paire tous les 2 jours
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 2)) % videosPool.length;
  const pair = videosPool[dayIndex];

  const youtubeVideos = pair.map((v, idx) => ({
    id: idx + 1,
    ...v,
    date: "Aujourd'hui",
    youtubeUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    featured: idx === 0,
  }));

  // La vidéo locale est toujours en premier
  const videos = [localVideo, ...youtubeVideos];

  return {
    videos,
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