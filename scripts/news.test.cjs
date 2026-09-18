const test = require('node:test');
const assert = require('node:assert/strict');

const { isFpsArticle } = require('./fetch-news.cjs');
const { generateNews } = require('./generate-news.cjs');
const { isParisPublicationTime } = require('./should-publish-news.cjs');

test('filtre les FPS et rejette les autres jeux', () => {
  assert.equal(isFpsArticle('Valorant patch compétitif', 'Riot modifie les agents'), true);
  assert.equal(isFpsArticle('Battlefield présente sa nouvelle carte', ''), true);
  assert.equal(isFpsArticle('Nintendo annonce un nouveau jeu', 'Mario arrive bientôt'), false);
  assert.equal(isFpsArticle('Tournoi esport', 'finale sans jeu FPS identifié'), false);
  assert.equal(isFpsArticle('Guide souris gaming', 'comparatif 240 Hz'), false);
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
