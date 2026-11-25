function getPreviousDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
}

export function selectNewsDays(articleDays, todayKey) {
  const previousDateKey = getPreviousDateKey(todayKey);

  return {
    todayArticles: articleDays.find(({ date }) => date === todayKey)?.articles || [],
    previousDay: articleDays.find(({ date }) => date === previousDateKey),
    olderDays: articleDays.filter(({ date }) => date !== todayKey && date !== previousDateKey),
  };
}
