import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/gaming/Navbar';

type Astuce = {
  id: number;
  title: string;
  game: string;
  difficulty: string;
  category: string;
  image: string;
  summary?: string;
  content?: string;
  description: string;
  review?: string;
  date: string;
  rating: number;
  views: number;
};

const AstucePage: React.FC = () => {
  const navigate = useNavigate();
  const [astuce, setAstuce] = useState<Astuce | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedAstuce');
    if (stored) {
      setAstuce(JSON.parse(stored));
    } else {
      navigate('/astuces');
    }
  }, []);

  if (!astuce) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar activeSection="" onNavigate={() => navigate('/astuces')} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/astuces')} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition">
          ← Retour aux astuces
        </button>
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
          <img src={astuce.image} alt={astuce.title} className="w-full h-64 object-cover" />
          <div className="p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-red-400">
              <span>{astuce.game}</span>
              <span className="text-gray-500">|</span>
              <span>{astuce.category}</span>
              <span className="text-gray-500">|</span>
              <span>{astuce.difficulty}</span>
              <span className="text-gray-500">|</span>
              <span>{astuce.date}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white">{astuce.title}</h1>

            {astuce.summary && (
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-950/20 rounded-r-lg">
                <p className="text-gray-200 text-base italic leading-relaxed">{astuce.summary}</p>
              </div>
            )}

            <div className="text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
              {(astuce.content || astuce.description || '').split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {astuce.review && (
              <div className="mt-6 p-5 border border-red-500/30 bg-gradient-to-r from-red-950/30 to-gray-900 rounded-xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
                  🎯 Notre avis
                </span>
                <p className="text-gray-200 text-base leading-relaxed mt-2">{astuce.review}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstucePage;
