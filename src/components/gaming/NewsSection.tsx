import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface NewsArticle {
  uri: string;
  title: string;
  body: string;
  url: string;
  image: string;
  dateTimePub: string;
  source: { title: string };
}

interface DailyNewsRow {
  id: string;
  title: string;
  body: string | null;
  url: string | null;
  image: string | null;
  publish_date: string;
  source: string | null;
  created_at: string;
}

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('daily_news')
        .select('*')
        .order('publish_date', { ascending: false })
        .limit(9);

      if (error) {
        console.error('Erreur Supabase:', error);
        toast({
          title: 'Erreur de chargement',
          description: 'Impossible de charger les news',
          variant: 'destructive',
        });
      } else if (data && data.length > 0) {
        // Transformer les données pour le format attendu
        const transformedArticles = data.map((item: DailyNewsRow) => ({
          uri: String(item.id),
          title: item.title,
          body: item.body || '',
          url: item.url || '#',
          image: item.image || '',
          dateTimePub: item.publish_date,
          source: { title: item.source || 'InsiderGamingtriks' },
        }));
        setArticles(transformedArticles);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="news-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              Actualites
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              News <span className="text-red-500">Gaming</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Les news gaming sont publiees automatiquement chaque matin a 7h.
            </p>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No News Yet */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
              <Newspaper className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Les news arrivent bientot!
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Les news gaming sont publiees automatiquement chaque jour a 7h du matin par notre bot IA.
            </p>
            <div className="bg-gray-800 rounded-lg p-4 max-w-lg mx-auto text-left">
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-yellow-400 font-bold">Prochaine etape:</span>
              </p>
              <p className="text-sm text-gray-300">
                Utilise ton bot GitHub Actions pour generer les news. Le bot ecrit les news dans la base de donnees et elles s'afficheront ici automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 9).map((article, index) => (
              <a
                key={article.uri || index}
                href={article.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-red-900/10"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {index === 0 && (
                      <div className="px-2 py-1 bg-red-600 rounded text-xs font-bold text-white">
                        NOUVEAU
                      </div>
                    )}
                    {article.dateTimePub && (
                      <div className="px-2 py-1 bg-black/70 rounded text-xs text-white">
                        {formatDate(article.dateTimePub)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {article.body}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.dateTimePub)}
                    </span>
                    <span className="truncate max-w-[120px]">{article.source?.title}</span>
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
