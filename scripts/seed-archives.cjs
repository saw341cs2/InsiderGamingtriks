#!/usr/bin/env node

// Initialise news-archives.json avec les articles du pool qui ne sont pas
// affichés sur la page d'accueil du jour. Cela garantit qu'une "page 2"
// (archive) existe immédiatement. Le script quotidien (generate-news.cjs)
// continuera ensuite à y ajouter les news qui sortent de la page d'accueil.

const fs = require('fs');
const path = require('path');
const { articlesPool, generateNews } = require('./generate-news.cjs');

const ARCHIVE_TARGETS = [
  path.join(__dirname, '..', 'public', 'news-archives.json'),
  path.join(__dirname, '..', 'docs', 'news-archives.json'),
  path.join(__dirname, '..', 'news-archives.json'),
];

const home = generateNews();
const homeUrls = new Set(home.articles.map(article => article.url));

const oldestHome = home.articles
  .map(article => new Date(article.dateTimePub).getTime())
  .reduce((min, value) => Math.min(min, value), Date.now());

const seen = new Set();
const archived = [];
let dayOffset = 1;
for (const day of articlesPool) {
  for (const article of day) {
    if (homeUrls.has(article.url) || seen.has(article.url)) continue;
    seen.add(article.url);
    const date = new Date(oldestHome - dayOffset * 86400000);
    archived.push({ ...article, dateTimePub: date.toISOString(), source: 'InsiderGamingtriks' });
    dayOffset += 1;
  }
}

const output = { articles: archived, generatedAt: new Date().toISOString() };
for (const target of ARCHIVE_TARGETS) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(target, JSON.stringify(output, null, 2), 'utf8');
  console.log(`🗄️  Seed archive: ${target}`);
}
console.log(`🗄️  ${archived.length} news placées dans les archives (page 2).`);
