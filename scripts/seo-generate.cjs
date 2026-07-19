const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

const pages = [
  {
    route: '/archives',
    file: 'archives/index.html',
    title: 'Archives - InsiderGamingTricks | Toutes les astuces gaming',
    description: 'Retrouve toutes les astuces gaming archivées par InsiderGamingTricks. Astuces, guides et solutions pour tes jeux préférés.',
    keywords: 'archives gaming, astuces gaming, guides jeux vidéo, solutions jeux',
  },
  {
    route: '/forum',
    file: 'forum/index.html',
    title: 'Forum - InsiderGamingTricks | Communauté gaming',
    description: 'Rejoins la communauté InsiderGamingTricks sur le forum. Échange des astuces, pose des questions et partage ton expérience gaming.',
    keywords: 'forum gaming, communauté gaming, discussion jeux vidéo, entraide gaming',
  },
  {
    route: '/news',
    file: 'news/index.html',
    title: 'News Gaming - InsiderGamingTricks | Actualités jeux vidéo',
    description: 'Toute l\'actualité gaming sur InsiderGamingTricks. News, sorties, mises à jour et événements du monde du jeu vidéo.',
    keywords: 'news gaming, actualités jeux vidéo, sorties jeux, événements gaming',
  },
  {
    route: '/profile',
    file: 'profile/index.html',
    title: 'Profil - InsiderGamingTricks | Espace membre',
    description: 'Connecte-toi à ton compte InsiderGamingTricks pour accéder aux fonctionnalités exclusives et personnaliser ton expérience.',
    keywords: 'profil gaming, compte membre, espace personnel',
  },
];

function generateHtml(page) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="keywords" content="${page.keywords}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://insidertricks.fr${page.route}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://insidertricks.fr${page.route}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:image" content="https://insidertricks.fr/splash.png" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="InsiderGamingTricks" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image" content="https://insidertricks.fr/splash.png" />
  <link rel="icon" type="image/png" href="/splash.png" />
  <meta http-equiv="refresh" content="0; url=/" />
</head>
<body>
  <h1>${page.title}</h1>
  <p>${page.description}</p>
  <p>Redirection vers l'application... <a href="/">Clique ici si tu n'es pas redirigé</a></p>
  <script>window.location.href = '/';</script>
</body>
</html>`;
}

console.log('🔍 Génération des pages SEO statiques (sans toucher à index.html)...');

pages.forEach(page => {
  const filePath = path.join(distDir, page.file);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, generateHtml(page), 'utf-8');
  console.log(`  ✅ ${page.file} - ${page.route}`);
});

console.log('✅ Pages SEO générées avec succès !');
console.log('⚠️  Attention : le fichier dist/index.html original n\'a PAS été modifié.');