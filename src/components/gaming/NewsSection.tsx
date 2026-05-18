import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const newsUrl = new URL('news.json', document.baseURI);
      newsUrl.searchParams.set('t', Date.now().toString());
      const response = await fetch(newsUrl.href);
      if (!response.ok) throw new Error(`Impossible de charger les news (${response.status}).`);
      const data = (await response.json()) as NewsResponse;
      if (!Array.isArray(data.articles)) throw new Error('Format de données invalide.');
      setArticles(data.articles.slice(0, 6));
    } catch (catchError) {
      setError(catchError instanceof Error ? catchError.message : 'Erreur inconnue');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNews(); }, []);

  const handleArticleClick = (article: NewsArticle, index: number) => {
    localStorage.setItem('selectedNews', JSON.stringify(article));
    navigate(`/news/${index}`);
  };

  return (
    <section className="bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest">
              News
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-black text-white">
              Actualités <span className="text-red-500">Gaming</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={loadNews}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-center text-red-200 mb-6">
            <p className="font-semibold">Erreur lors du chargement des actualités</p>
            <p className="mt-1 text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {articles.map((article, index) => (
            <div
              key={article.url}
              onClick={() => handleArticleClick(article, index)}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 cursor-pointer"
            >
              <div className="relative h-36 overflow-hidden bg-gray-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-red-400">
                  <span>{article.topic}</span>
                  <span className="text-gray-500">•</span>
                  <span>{formatDate(article.dateTimePub)}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2">{article.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{article.body}</p>
                <span className="text-xs font-semibold text-red-400">Lire →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;