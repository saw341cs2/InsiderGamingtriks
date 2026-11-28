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

// Filet de sécurité : si ni le jour même ni la veille n'ont de news (par exemple
// une publication manquée), on remonte le jour le plus récent disponible en
// haut de page pour ne jamais afficher une rubrique vide. Le jour remonté
// n'est jamais présenté comme "veille", il garde sa vraie date sur les cartes.
export function withLatestDayFallback({ todayArticles, previousDay, olderDays }) {
  if (todayArticles.length > 0 || previousDay || olderDays.length === 0) {
    return { todayArticles, previousDay, olderDays };
  }
  const [latest, ...rest] = olderDays;
  return { todayArticles: latest.articles, previousDay: undefined, olderDays: rest };
}
