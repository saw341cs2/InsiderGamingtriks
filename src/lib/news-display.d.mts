export type NewsDay<T> = {
  date: string;
  articles: T[];
};

export function selectNewsDays<T>(
  articleDays: NewsDay<T>[],
  todayKey: string,
): {
  todayArticles: T[];
  previousDay: NewsDay<T> | undefined;
  olderDays: NewsDay<T>[];
};

export function withLatestDayFallback<T>(selected: {
  todayArticles: T[];
  previousDay: NewsDay<T> | undefined;
  olderDays: NewsDay<T>[];
}): {
  todayArticles: T[];
  previousDay: NewsDay<T> | undefined;
  olderDays: NewsDay<T>[];
};
