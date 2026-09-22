const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

const { isFpsArticle, isLikelyFrench } = require('./fetch-news.cjs');
const { generateNews } = require('./generate-news.cjs');
const { isParisPublicationTime } = require('./should-publish-news.cjs');

test('filtre les FPS et rejette les autres jeux', () => {
  assert.equal(isFpsArticle('Valorant patch compétitif', 'Riot modifie les agents'), true);
  assert.equal(isFpsArticle('Battlefield présente sa nouvelle carte', ''), true);
  assert.equal(isFpsArticle('Nintendo annonce un nouveau jeu', 'Mario arrive bientôt'), false);
  assert.equal(isFpsArticle('Tournoi esport', 'finale sans jeu FPS identifié'), false);
  assert.equal(isFpsArticle('Guide souris gaming', 'comparatif 240 Hz'), false);
});

test('refuse un contenu anglais après réécriture IA', () => {
  assert.equal(isLikelyFrench(
    'Bungie decide their destiny is to do more Destiny after all, pledging to bring back vaulted campaigns. Read more',
  ), false);
  assert.equal(isLikelyFrench(
    'Bungie annonce le retour de campagnes mises au coffre. Cette actualité concerne les joueurs et présente une nouvelle direction pour le jeu.',
  ), true);
});

test('le fallback génère exactement trois articles FPS distincts', () => {
  const data = generateNews();
  assert.equal(data.articles.length, 3);
  assert.ok(data.articles.every(article => ['FPS', 'COMPETITION', 'JOUEURS'].includes(article.topic)));
  assert.equal(new Set(data.articles.map(article => article.url)).size, 3);
  assert.ok(data.articles.every(article => article.image.startsWith('http')));
});

test('le créneau suit Europe/Paris en hiver et en été', () => {
  assert.equal(isParisPublicationTime(new Date('2026-01-15T04:30:00Z')), true);
  assert.equal(isParisPublicationTime(new Date('2026-07-15T03:30:00Z')), true);
  assert.equal(isParisPublicationTime(new Date('2026-07-15T04:30:00Z')), false);
});

test('la sortie GitHub Actions ne contient qu une propriété output', () => {
  const output = execFileSync(process.execPath, ['scripts/should-publish-news.cjs'], {
    encoding: 'utf8',
    env: { ...process.env, ALLOW_MANUAL: 'true' },
  });
  assert.equal(output.trim(), 'publish=true');
});
