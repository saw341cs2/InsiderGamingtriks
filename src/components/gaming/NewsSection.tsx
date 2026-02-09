import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Newspaper, ExternalLink, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsArticle {
  uri: string;
  title: string;
  body: string;
  url: string;
  image: string;
  dateTimePub: string;
  source: { title: string };
}

const fallbackNews = [
  { uri: '1', title: 'Counter-Strike 2 : Nouvelle mise à jour majeure avec de nouvelles cartes', body: 'Valve déploie une mise à jour massive pour CS2 incluant de nouvelles cartes compétitives et des ajustements d\'armes.', url: '#', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop', dateTimePub: '2026-02-09', source: { title: 'Gaming News' } },
  { uri: '2', title: 'Battlefield : La saison 4 arrive avec du contenu inédit', body: 'EA annonce la saison 4 de Battlefield avec de nouvelles armes, véhicules et une carte inspirée de batailles historiques.', url: '#', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=250&fit=crop', dateTimePub: '2026-02-08', source: { title: 'EA News' } },
  { uri: '3', title: 'Call of Duty Warzone : Nouveau mode de jeu Ranked', body: 'Activision lance le mode Ranked tant attendu pour Warzone avec un système de classement compétitif.', url: '#', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop', dateTimePub: '2026-02-08', source: { title: 'Activision Blog' } },
  { uri: '4', title: 'Esport : Le Major CS2 2026 annoncé à Paris', body: 'Le prochain Major Counter-Strike se tiendra à Paris avec une prize pool record de 2 millions de dollars.', url: '#', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop', dateTimePub: '2026-02-07', source: { title: 'Esports World' } },
  { uri: '5', title: 'Guide : Les meilleures sensibilités souris pour FPS en 2026', body: 'Analyse des sensibilités utilisées par les joueurs pro dans CS2, Valorant et Call of Duty.', url: '#', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=250&fit=crop', dateTimePub: '2026-02-07', source: { title: 'Pro Settings' } },
  { uri: '6', title: 'Battlefield : Patch notes 3.2 - Équilibrage des véhicules', body: 'DICE publie un patch majeur rééquilibrant les véhicules aériens et terrestres suite aux retours de la communauté.', url: '#', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop', dateTimePub: '2026-02-06', source: { title: 'DICE Updates' } },
  { uri: '7', title: 'Call of Duty : Nouveau DLC Zombies annoncé', body: 'Treyarch dévoile le prochain chapitre du mode Zombies avec une nouvelle carte et des armes Wonder inédites.', url: '#', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop', dateTimePub: '2026-02-06', source: { title: 'CoD Blog' } },
  { uri: '8', title: 'CS2 : Changements de l\'économie en compétitif', body: 'Valve modifie le système économique en mode compétitif pour favoriser des rounds plus dynamiques.', url: '#', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=250&fit=crop', dateTimePub: '2026-02-05', source: { title: 'Valve News' } },
  { uri: '9', title: 'Tournoi Insider Gaming : Inscriptions ouvertes', body: 'Le premier tournoi communautaire Insider Gaming Tricks est ouvert ! Inscris-toi sur notre Discord.', url: '#', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=250&fit=crop', dateTimePub: '2026-02-05', source: { title: 'Insider Gaming' } },
];

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-gaming-news', {
        body: { query: 'FPS gaming Counter-Strike Battlefield Call of Duty esports', count: 9 },
      });

      if (fnError) throw fnError;

      const arts = data?.articles?.results;
      if (arts && arts.length > 0) {
        setArticles(arts);
      } else {
        setArticles(fallbackNews as any);
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setArticles(fallbackNews as any);
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
              Actualités
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              News <span className="text-red-500">Gaming</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              L'actualité FPS en temps réel. Mises à jour, patchs, tournois et annonces.
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

        {/* Articles Grid */}
        {!loading && (
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
                    src={article.image || `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  {index === 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 rounded text-xs font-bold text-white">
                      NOUVEAU
                    </div>
                  )}
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
