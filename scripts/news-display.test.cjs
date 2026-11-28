const test = require('node:test');
const assert = require('node:assert/strict');

test('does not show an old archive day as yesterday when yesterday has no news', async () => {
  const { selectNewsDays } = await import('../src/lib/news-display.mjs');
  const today = [{ date: '2026-11-25', articles: ['today'] }];
  const archive = { date: '2026-11-07', articles: ['old'] };

  const result = selectNewsDays([...today, archive], '2026-11-25');

  assert.deepEqual(result.todayArticles, ['today']);
  assert.equal(result.previousDay, undefined);
  assert.deepEqual(result.olderDays, [archive]);
});

test('selects only the immediately previous calendar day across a year boundary', async () => {
  const { selectNewsDays } = await import('../src/lib/news-display.mjs');
  const yesterday = { date: '2026-12-31', articles: ['yesterday'] };
  const older = { date: '2026-12-30', articles: ['older'] };

  const result = selectNewsDays([yesterday, older], '2027-01-01');

  assert.equal(result.previousDay, yesterday);
  assert.deepEqual(result.olderDays, [older]);
});

test('sans news du jour ni de la veille, le jour le plus récent remonte en haut de page', async () => {
  const { selectNewsDays, withLatestDayFallback } = await import('../src/lib/news-display.mjs');
  const latest = { date: '2026-11-25', articles: ['recente'] };
  const old = { date: '2026-11-07', articles: ['ancienne'] };

  const selected = selectNewsDays([latest, old], '2026-11-28');
  const result = withLatestDayFallback(selected);

  assert.deepEqual(result.todayArticles, ['recente']);
  assert.equal(result.previousDay, undefined);
  assert.deepEqual(result.olderDays, [old]);
});

test("le filet de sécurité ne s'applique pas quand le jour ou la veille existent", async () => {
  const { withLatestDayFallback } = await import('../src/lib/news-display.mjs');

  const withToday = withLatestDayFallback({
    todayArticles: ['du jour'],
    previousDay: undefined,
    olderDays: [{ date: '2026-11-07', articles: ['ancienne'] }],
  });
  assert.deepEqual(withToday.todayArticles, ['du jour']);
  assert.deepEqual(withToday.olderDays, [{ date: '2026-11-07', articles: ['ancienne'] }]);

  const withPrevious = withLatestDayFallback({
    todayArticles: [],
    previousDay: { date: '2026-11-27', articles: ['veille'] },
    olderDays: [],
  });
  assert.equal(withPrevious.previousDay.date, '2026-11-27');
  assert.deepEqual(withPrevious.todayArticles, []);
});

test('aucune news du tout : rien à remonter', async () => {
  const { withLatestDayFallback } = await import('../src/lib/news-display.mjs');
  const result = withLatestDayFallback({ todayArticles: [], previousDay: undefined, olderDays: [] });
  assert.deepEqual(result.todayArticles, []);
  assert.deepEqual(result.olderDays, []);
});
