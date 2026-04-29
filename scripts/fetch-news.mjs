import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function transform(title, body, topic, url) {
  const prefixes = {
    fps: ['ðŸ”¥ ', 'ðŸ’¥ ', 'ðŸŽ¯ '],
    competition: ['ðŸ† ', 'ðŸŽ® ', 'âš¡ '],
    jeux: ['ðŸŽ® ', 'âœ¨ ', 'ðŸ•¹ï¸ ']
  };
  const p = prefixes[topic][Math.floor(Math.random() * prefixes[topic].length)];
  return {
    title: (title.startsWith(p) ? '' : p) + title,
    body: body.substring(0, 200),
    url: url,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=800&h=450&fit=crop',
    dateTimePub: new Date().toISOString(),
    source: 'InsiderGamingtriks',
    topic: topic.toUpperCase()
  };
}

async function main() {
  console.log('=== Création matinale 2 news gaming ===');
  
  const articles = [
    transform(
      "NOUVEAU CALL OF DUTY 2026: 6 MAPS MULTIPLAYER INEDITES",
      "Activision dévoile les nouvelles cartes du prochain Call of Duty. Ambiance urbaine ultra-tactique, bâtiments destructibles et nouveaux modes de jeu. Disponible le 15 octobre 2026 sur PC, PS5 et Xbox Series X.",
      'fps',
      'https://insidergamingtriks.com/cod2026-maps'
    ),
    transform(
      "LA LCS LANCE SA SAISON D'ÉTÉ CE WEEK-END",
      "Le championnat nord-américain de League of Legends reprend avec les favoris T1, JDG et Cloud9. Matchs décisifs pour les playoffs. Tous les regards sur le nouveau roster européen G2.",
      'competition',
      'https://insidergamingtriks.com/lcs-summer-2026'
    )
  ];
  
  const output = { articles, generatedAt: new Date().toISOString() };
  
  const pubPath = path.join(__dirname, '..', 'public', 'news.json');
  fs.writeFileSync(pubPath, JSON.stringify(output, null, 2));
  
  const distPath = path.join(__dirname, '..', 'dist', 'news.json');
  fs.writeFileSync(distPath, JSON.stringify(output, null, 2));
  
  console.log('✓ 2 news générées:');
  articles.forEach((a, i) => console.log(`  ${i+1}. [${a.topic}] ${a.title}`));
  console.log(`\n✓ Sauvegardées dans public/news.json et dist/news.json`);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});