import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/gaming/Navbar';

type NewsArticle = {
  title: string;
  body: string;
  content?: string;
  url: string;
  image: string;
  dateTimePub: string;
  source: string;
  topic: string;
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
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition"
        >
          Retour
        </button>
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-red-400">
              <span>{article.topic}</span>
              <span className="text-gray-500">|</span>
              <span>{formatDate(article.dateTimePub)}</span>
              <span className="text-gray-500">|</span>
              <span>{article.source}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{article.title}</h1>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{article.content || article.body}</p>
            {article.url && !article.url.includes('insidergamingtriks.com/news/') && (
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition">
                Lire l'article complet
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;