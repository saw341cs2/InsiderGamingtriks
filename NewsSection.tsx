import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios'; // Importez axios si vous l'utilisez pour les requêtes API

interface NewsArticle {
  title: string;
  body: string;
  url: string;
  image: string;
  source: string;
  dateTimePub: string;
  topic: string;
}

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération de la clé API depuis les variables d'environnement de Vite
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=gaming&apiKey=${NEWS_API_KEY}&language=fr`;
  const CORS_PROXY_URL = 'https://corsproxy.io/?'; // Un proxy CORS générique

  const fetchNews = async () => {
    setLoading(true);
    try {
      if (!NEWS_API_KEY) {
        console.error("La clé API NewsAPI n'est pas configurée. Veuillez ajouter VITE_NEWS_API_KEY dans votre fichier .env");
        setArticles([]);
        return;
      }

      // Utilisation du proxy CORS pour contourner les restrictions de domaine
      const response = await axios.get(`${CORS_PROXY_URL}${encodeURIComponent(NEWS_API_URL)}`);
      const fetchedArticles = response.data.articles.map((article: any) => ({
        title: article.title,
        body: article.description,
        url: article.url,
        image: article.urlToImage,
        source: article.source.name,
        dateTimePub: article.publishedAt,
        topic: 'GAMING', // Ou une logique pour déterminer le topic
      }));
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Erreur News:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section id="news" className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              Actualités
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              News <span className="text-red-500">Gaming</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Le bot actualise 2 nouvelles pépites chaque matin à 5h30.
            </p>
          </div>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900 h-80 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article, idx) => (
              <a 
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-red-600 rounded text-[10px] font-bold text-white uppercase tracking-tighter">
                      {article.topic}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {article.body}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold border-t border-gray-800 pt-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.dateTimePub).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="text-gray-400">{article.source}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;