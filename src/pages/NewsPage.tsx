import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/gaming/Navbar';

type NewsArticle = {
  title: string;
  body: string;
  summary?: string;
  content?: string;
  review?: string;
  url: string;
  image: string;
  imageCredit?: { name: string; url?: string } | null;
  dateTimePub: string;
  source: string;
  topic: string;
  categories?: string[];
  originalSource?: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedNews');
    if (stored) {
      setArticle(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, []);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar activeSection="" onNavigate={() => navigate('/')} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/')} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition">
          Retour
        </button>
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
          <div className="relative">
            <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
            {article.imageCredit?.name && (
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-300/80 bg-black/40 px-2 py-0.5 rounded">
                Photo : {article.imageCredit.url ? (
                  <a href={article.imageCredit.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {article.imageCredit.name}
                  </a>
                ) : article.imageCredit.name} / Unsplash
              </span>
            )}
          </div>
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-red-400">
              <span>{article.topic}</span>
              <span className="text-gray-500">|</span>
              <span>{formatDate(article.dateTimePub)}</span>
              <span className="text-gray-500">|</span>
              <span>{article.source}</span>
            </div>

            {/* Badges catégories */}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.categories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-black text-white">{article.title}</h1>

            {/* Résumé */}
            {article.summary && (
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-950/20 rounded-r-lg">
                <p className="text-gray-200 text-base italic leading-relaxed">{article.summary}</p>
              </div>
            )}

            {/* Corps de l'article */}
            <div className="text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
              {(article.content || article.body || '').split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Section "Notre avis" */}
            {article.review && (
              <div className="mt-6 p-5 border border-red-500/30 bg-gradient-to-r from-red-950/30 to-gray-900 rounded-xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
                  🎯 Notre avis
                </span>
                <p className="text-gray-200 text-base leading-relaxed mt-2">{article.review}</p>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
