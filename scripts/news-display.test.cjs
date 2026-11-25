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
