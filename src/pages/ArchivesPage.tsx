import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/gaming/Navbar';
import { Star, Eye, Clock, Crosshair, Target, Bomb } from 'lucide-react';

type NewsArticle = {
  title: string;
  body: string;
  url: string;
  image: string;
  dateTimePub: string;
  source: string;
  topic: string;
};

interface Astuce {
  id: number;
  title: string;
  game: string;
  difficulty: string;
  category: string;
  views: number;
  rating: number;
  date: string;
  image?: string;
  description: string;
  isPremium: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const gameIcons: Record<string, React.ElementType> = {
  'CS2': Crosshair, 'BF': Bomb, 'CoD': Target, 'FPS': Star,
};
const gameColors: Record<string, string> = {
  'CS2': 'text-orange-400', 'BF': 'text-blue-400', 'CoD': 'text-green-400', 'FPS': 'text-purple-400',
};
const defaultImages: Record<string, string> = {
  'CS2': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
  'BF': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80',
  'CoD': 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80',
  'FPS': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
};

const ArchivesPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'news' | 'astuces'>('news');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [astuces, setAstuces] = useState<Astuce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [newsRes, astucesRes] = await Promise.all([
          fetch(new URL('news.json', document.baseURI).href),
          fetch(new URL('astuces.json', document.baseURI).href),
        ]);
        if (newsRes.ok) {
          const data = await newsRes.json();
          setArticles(Array.isArray(data.articles) ? data.articles : []);
        }
        if (astucesRes.ok) {
          const data = await astucesRes.json();
          setAstuces(Array.isArray(data.astuces) ? data.astuces : []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleNewsClick = (article: NewsArticle, index: number) => {
    localStorage.setItem('selectedNews', JSON.stringify(article));
    navigate(`/news/${index}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/')} className="mb-8 text-sm text-gray-400 hover:text-red-400 transition">
          ← Retour
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Archives <span className="text-red-500">& Historique</span>
          </h1>
          <p className="text-gray-400">Toutes les news et astuces publiées.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setTab('news')}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${tab === 'news' ? 'border-red-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            News ({articles.length})
          </button>
          <button
            onClick={() => setTab('astuces')}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${tab === 'astuces' ? 'border-red-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            Astuces ({astuces.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-900 rounded-xl h-48 animate-pulse" />)}
          </div>
        ) : tab === 'news' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map((article, index) => (
              <div
                key={article.url}
                onClick={() => handleNewsClick(article, index)}
                className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 cursor-pointer"
              >
                <div className="relative h-36 overflow-hidden bg-gray-800">
                  <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {astuces.map((astuce) => {
              const GameIcon = gameIcons[astuce.game] || Crosshair;
              const imgSrc = astuce.image || defaultImages[astuce.game];
              return (
                <div key={astuce.id} className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition duration-300 hover:-translate-y-1 hover:border-red-500/30">
                  <div className="relative h-36 overflow-hidden bg-gray-800">
                    <img src={imgSrc} alt={astuce.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = defaultImages['CS2']; }} />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-2 text-xs">
                      <GameIcon className={`w-3.5 h-3.5 ${gameColors[astuce.game] || 'text-gray-400'}`} />
                      <span className={`font-semibold ${gameColors[astuce.game] || 'text-gray-400'}`}>{astuce.game}</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-gray-500">{astuce.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{astuce.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2">{astuce.description.split('\n')[0]}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{astuce.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{astuce.rating}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{astuce.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesPage;
