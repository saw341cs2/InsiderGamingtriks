const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

const { isFpsArticle, isLikelyFrench } = require('./fetch-news.cjs');
const { generateNews } = require('./generate-news.cjs');
const { parisDateKey, shouldPublishNews } = require('./should-publish-news.cjs');

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

test('les trois articles du fallback partagent la date de publication du lot', () => {
  const runDate = new Date('2026-09-28T19:02:00.000Z');
  const data = generateNews(runDate);
  assert.equal(data.generatedAt, runDate.toISOString());
  assert.ok(data.articles.every(article => article.publishedOn === data.generatedAt));
});

test('la publication planifiée tolère le retard de GitHub et reste unique par date Paris', () => {
  const delayedMorningRun = new Date('2026-09-28T08:03:00Z');
  assert.equal(parisDateKey(delayedMorningRun), '2026-09-28');
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-22T14:32:00Z' }), true);
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-28T03:30:00Z' }), false);
  assert.equal(shouldPublishNews({ date: new Date('2026-09-29T00:30:00Z'), generatedAt: '2026-09-28T22:00:00Z' }), false);
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-28T03:30:00Z', allowManual: true }), true);
});

test('la clé de date respecte les décalages hiver/été Europe/Paris', () => {
  assert.equal(parisDateKey(new Date('2026-01-15T23:30:00Z')), '2026-01-16');
  assert.equal(parisDateKey(new Date('2026-07-15T22:30:00Z')), '2026-07-16');
});
