import React, { useEffect, useState } from 'react';

type NewsArticle = {
  title: string;
  body: string;
  url: string;
  image: string;
  dateTimePub: string;
  source: string;
  topic: string;
};

type NewsResponse = {
  articles: NewsArticle[];
  generatedAt?: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const newsUrl = new URL('news.json', document.baseURI);
      newsUrl.searchParams.set('t', Date.now().toString());
      const response = await fetch(newsUrl.href);
      if (!response.ok) {
        throw new Error(`Impossible de charger les news (${response.status}).`);
      }
      const data = (await response.json()) as NewsResponse;
      if (!Array.isArray(data.articles)) {
        throw new Error('Format de données invalide.');
      }
      setArticles(data.articles);
    } catch (catchError) {
      const message = catchError instanceof Error ? catchError.message : 'Erreur inconnue';
      setError(message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <section className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest">
              Actualités
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black text-white">
              Actualités <span className="text-red-500">Gaming</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl">
              Deux news sont publiées chaque matin à 5h30 et affichées dans la rubrique actualités du site.
            </p>
          </div>

          <button
            type="button"
            onClick={loadNews}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Chargement...' : 'Actualiser les news'}
          </button>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center text-red-200">
            <p className="font-semibold">Erreur lors du chargement des actualités</p>
            <p className="mt-2 text-sm text-red-300">{error}</p>
          </div>
        ) : null}

        {!loading && articles.length === 0 && !error ? (
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-12 text-center text-gray-300">
            <p className="text-xl font-semibold">Aucune actualité disponible pour le moment.</p>
            <p className="mt-2 text-sm text-gray-400">Vérifie ton fichier <code className="rounded bg-gray-800 px-2 py-1">public/news.json</code> ou la source de données.</p>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {articles.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 transition duration-300 hover:-translate-y-1 hover:border-red-500/30"
            >
              <div className="relative h-56 overflow-hidden bg-gray-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-red-400">
                  <span>{article.topic}</span>
                  <span className="text-gray-500">•</span>
                  <span>{formatDate(article.dateTimePub)}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{article.title}</h3>
                <p className="text-gray-400 line-clamp-3">{article.body}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.source}</span>
                  <span className="font-semibold text-red-400">Lire</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
