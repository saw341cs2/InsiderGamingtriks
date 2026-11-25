const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  isFpsArticle,
  isLikelyFrench,
  isRealImage,
  fixImages,
  dedupeImages,
  prepareArticlesWithoutAI,
  selectImageBackedArticles,
  enrichWithOfficialImages,
  applyOfficialImages,
  parsePublishedAt,
} = require('./fetch-news.cjs');
const { generateNews } = require('./generate-news.cjs');
const { parisDateKey, shouldPublishNews } = require('./should-publish-news.cjs');

test('filtre les FPS et rejette les autres jeux', () => {
  assert.equal(isFpsArticle('Valorant patch compétitif', 'Riot modifie les agents'), true);
  assert.equal(isFpsArticle('Battlefield présente sa nouvelle carte', ''), true);
  assert.equal(isFpsArticle('Nintendo annonce un nouveau jeu', 'Mario arrive bientôt'), false);
  assert.equal(isFpsArticle('Tournoi esport', 'finale sans jeu FPS identifié'), false);
  assert.equal(isFpsArticle('Guide souris gaming', 'comparatif 240 Hz'), false);
  assert.equal(isFpsArticle('Avengers: Doomsday révèle ses prochaines scènes', ''), false);
  assert.equal(isFpsArticle('Doom: The Dark Ages reçoit une mise à jour', ''), true);
});

test('refuse un contenu anglais après réécriture IA', () => {
  assert.equal(isLikelyFrench(
    'Bungie decide their destiny is to do more Destiny after all, pledging to bring back vaulted campaigns. Read more',
  ), false);
  assert.equal(isLikelyFrench(
    'Bungie annonce le retour de campagnes mises au coffre. Cette actualité concerne les joueurs et présente une nouvelle direction pour le jeu.',
  ), true);
});

test('le fallback génère six articles sur deux jours sans images inventées', () => {
  const data = generateNews();
  assert.equal(data.articles.length, 6);
  assert.equal(new Set(data.articles.map(article => article.url)).size, 6);
  assert.ok(data.articles.every(article => article.image === null));
  assert.ok(data.articles.slice(0, 3).every(article => article.publishedOn === data.generatedAt));
  assert.notEqual(data.articles[3].publishedOn, data.generatedAt);
});

test('accepte les images d’article mais écarte les jaquettes et visuels génériques', () => {
  assert.equal(isRealImage('https://media.example.com/articles/tournament-final.jpg'), true);
  assert.equal(isRealImage('https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'), false);
  assert.equal(isRealImage('https://images.unsplash.com/photo-123'), false);
  assert.equal(isRealImage('https://www.vlr.gg/img/vlr/card.png'), false);
  assert.equal(isRealImage('data:image/svg+xml,<svg></svg>'), false);
  assert.equal(isRealImage('not-a-url'), false);
});

test('ne devine pas de remplacement et écarte une image répétée', () => {
  const image = 'https://media.example.com/articles/shared.jpg';
  const [withImage, withoutSourceImage] = fixImages([
    { title: 'Une news', image },
    { title: 'Sans source', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' },
  ]);
  assert.equal(withImage.image, image);
  assert.equal(withoutSourceImage.image, null);

  const [first, duplicate] = dedupeImages([withImage, withImage]);
  assert.equal(first.image, image);
  assert.equal(duplicate.image, null);
});

test('sans clé IA, publie les articles français avec leur image de source', () => {
  const image = 'https://media.example.com/articles/cs2-update.jpg';
  const articles = prepareArticlesWithoutAI([
    {
      title: 'Counter-Strike 2 reçoit une mise à jour',
      description: 'Valve annonce une mise à jour qui concerne les joueurs et les équipes de la scène compétitive.',
      url: 'https://news.example.com/cs2-update',
      image,
      source: 'News source',
    },
    {
      title: 'Counter-Strike gets a major update',
      description: 'The latest update changes the competitive scene for players.',
      url: 'https://news.example.com/cs2-update-en',
      image: 'https://media.example.com/articles/cs2-update-en.jpg',
      source: 'English source',
    },
  ]);

  assert.equal(articles.length, 1);
  assert.equal(articles[0].url, 'https://news.example.com/cs2-update');
  assert.equal(articles[0].image, image);
  assert.equal(articles[0].originalSource, 'News source');
  assert.deepEqual(prepareArticlesWithoutAI([
    {
      title: 'Counter-Strike 2 reçoit une mise à jour',
      description: 'Valve annonce une mise à jour qui concerne les joueurs et les équipes de la scène compétitive.',
      url: 'https://news.example.com/cs2-update',
      image,
      source: 'News source',
    },
  ], articles), []);
});

test('ne publie jamais un article source en anglais, même sans IA', () => {
  assert.deepEqual(prepareArticlesWithoutAI([
    {
      title: 'Counter-Strike update shakes up the competitive scene',
      description: 'Valve reveals a major change for players before the next tournament.',
      url: 'https://news.example.com/cs2-update',
      image: 'https://media.example.com/articles/cs2-update.jpg',
      source: 'News source',
    },
  ]), []);
});

test('fallback rejette les articles non FPS dont seule la description mentionne un FPS', () => {
  assert.deepEqual(prepareArticlesWithoutAI([
    {
      title: 'Avengers: Doomsday révèle ses prochaines scènes',
      description: 'Un ancien développeur de Destiny 2 a commenté le film.',
      url: 'https://news.example.com/avengers-movie',
      image: 'https://media.example.com/articles/avengers.jpg',
      source: 'News source',
    },
  ]), []);
});

test('le fallback ne sélectionne que des images source valides et distinctes', () => {
  const sharedImage = 'https://media.example.com/articles/shared.jpg';
  const selected = selectImageBackedArticles([
    { url: 'https://news.example.com/duplicate', image: sharedImage },
    { url: 'https://news.example.com/first', image: 'https://media.example.com/articles/first.jpg' },
    { url: 'https://news.example.com/second', image: 'https://media.example.com/articles/second.jpg' },
    { url: 'https://news.example.com/missing', image: null },
  ], [{ url: 'https://news.example.com/existing', image: sharedImage }], 2);

  assert.deepEqual(selected.map(article => article.url), [
    'https://news.example.com/first',
    'https://news.example.com/second',
  ]);
});

test('conserve l’image RSS sans la remplacer par une image différente de la page', async () => {
  const article = {
    url: 'https://news.example.com/cs2-update',
    image: 'https://media.example.com/articles/rss-image.jpg',
  };
  assert.deepEqual(await enrichWithOfficialImages([article]), [article]);
});

test('une date RSS invalide ne rejette pas tout le flux', () => {
  const fallbackDate = new Date('2026-11-25T12:00:00.000Z');
  assert.equal(parsePublishedAt('not a date', fallbackDate), fallbackDate.toISOString());
  assert.equal(parsePublishedAt('2026-11-24T12:00:00.000Z', fallbackDate), '2026-11-24T12:00:00.000Z');
});

test('un article français de la veille est repris tel quel côté archives', () => {
  // Les news de la veille affichées par le site viennent des archives :
  // elles sont prises telles quelles, en français, avec leur image d'origine.
  const article = {
    title: 'Valorant annonce une nouvelle équipe compétitive',
    summary: 'Une nouvelle composition est annoncée avant le prochain tournoi.',
    url: 'https://news.example.com/valorant-roster',
    image: 'https://media.example.com/articles/valorant-roster.jpg',
    dateTimePub: new Date().toISOString(),
  };
  assert.equal(isRealImage(article.image), true);
  assert.equal(isLikelyFrench(`${article.title} ${article.summary}`), true);
});

test('les news des grands jeux utilisent le visuel officiel du jeu', () => {
  const [gta, cod, autr] = applyOfficialImages([
    {
      title: "GTA 6 : la course aux portages PC non officiels raillée par un ex-développeur",
      image: 'https://media.example.com/articles/gta.jpg',
    },
    {
      title: 'Call of Duty aurait perdu 44 % de ses joueurs',
      image: 'https://media.example.com/articles/cod.jpg',
    },
    { title: 'Une news sur un jeu inconnu', image: 'https://media.example.com/articles/autre.jpg' },
  ]);
  assert.ok(gta.image.startsWith('https://www.rockstargames.com/VI/'));
  assert.ok(cod.image.startsWith('https://www.callofduty.com/'));
  assert.equal(autr.image, 'https://media.example.com/articles/autre.jpg');
});

test('deux news du même jeu ne partagent pas le même visuel officiel', () => {
  const [first, second] = applyOfficialImages([
    { title: 'GTA 6 enflamme les joueurs', image: 'https://media.example.com/articles/gta1.jpg' },
    { title: 'Nouvelle bande-annonce de GTA 6', image: 'https://media.example.com/articles/gta2.jpg' },
  ]);
  assert.ok(first.image.startsWith('https://www.rockstargames.com/VI/'));
  assert.equal(second.image, 'https://media.example.com/articles/gta2.jpg');
});

test('le fallback date les trois premiers articles au jour de génération', () => {
  const runDate = new Date('2026-09-28T19:02:00.000Z');
  const data = generateNews(runDate);
  assert.equal(data.generatedAt, runDate.toISOString());
  assert.ok(data.articles.slice(0, 3).every(article => article.publishedOn === data.generatedAt));
  const yesterday = new Date(runDate);
  yesterday.setDate(yesterday.getDate() - 1);
  assert.ok(data.articles.slice(3).every(article => article.publishedOn === yesterday.toISOString()));
});

test('la publication planifiée n’intervient qu’à partir de 05:30 Europe/Paris', () => {
  const delayedMorningRun = new Date('2026-09-28T08:03:00Z');
  assert.equal(parisDateKey(delayedMorningRun), '2026-09-28');
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-22T14:32:00Z' }), true);
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-28T03:30:00Z' }), false);
  assert.equal(shouldPublishNews({ date: new Date('2026-09-29T00:30:00Z'), generatedAt: '2026-09-28T22:00:00Z' }), false);
  assert.equal(shouldPublishNews({ date: delayedMorningRun, generatedAt: '2026-09-28T03:30:00Z', allowManual: true }), true);
});

test('le créneau 05:30 Europe/Paris fonctionne hiver comme été', () => {
  // Hiver : le premier créneau UTC (03:30) tombe à 04:30 à Paris, donc refusé.
  assert.equal(shouldPublishNews({ date: new Date('2026-01-15T03:30:00Z'), generatedAt: '2026-01-10T08:00:00Z' }), false);
  // Hiver : 04:30 UTC = 05:30 à Paris, autorisé.
  assert.equal(shouldPublishNews({ date: new Date('2026-01-15T04:30:00Z'), generatedAt: '2026-01-10T08:00:00Z' }), true);
  // Été : 03:30 UTC = 05:30 à Paris, autorisé.
  assert.equal(shouldPublishNews({ date: new Date('2026-07-15T03:30:00Z'), generatedAt: '2026-07-10T08:00:00Z' }), true);
  // Été : 05:29 à Paris (03:29 UTC), refusé.
  assert.equal(shouldPublishNews({ date: new Date('2026-07-15T03:29:00Z'), generatedAt: '2026-07-10T08:00:00Z' }), false);
  // Manuel (workflow_dispatch) : toujours autorisé.
  assert.equal(shouldPublishNews({ date: new Date('2026-01-15T03:30:00Z'), generatedAt: '2026-01-10T08:00:00Z', allowManual: true }), true);
});

test('la clé de date respecte les décalages hiver/été Europe/Paris', () => {
  assert.equal(parisDateKey(new Date('2026-01-15T23:30:00Z')), '2026-01-16');
  assert.equal(parisDateKey(new Date('2026-07-15T22:30:00Z')), '2026-07-16');
});
