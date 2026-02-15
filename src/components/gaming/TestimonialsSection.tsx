import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex "FragMaster"',
    game: 'CS2',
    avatar: 'AF',
    rank: 'Global Elite',
    text: 'Grâce aux guides d\'Insider Gaming Tricks, j\'ai grimpé de Gold Nova à Global Elite en 3 mois. Les smoke lineups sont incroyables.',
    rating: 5,
    color: 'from-orange-500 to-yellow-600',
  },
  {
    name: 'Marie "SniperQueen"',
    game: 'CoD Warzone',
    avatar: 'MS',
    rank: 'Top 500',
    text: 'Les loadouts meta sont toujours à jour. J\'ai augmenté mon K/D de 1.2 à 2.8 en suivant les guides Premium.',
    rating: 5,
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Thomas "TankBuster"',
    game: 'Battlefield',
    avatar: 'TT',
    rank: 'Colonel 100',
    text: 'Le guide de pilotage hélicoptère a changé ma façon de jouer. Les sessions coaching Élite valent chaque centime.',
    rating: 5,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Lucas "HeadshotKing"',
    game: 'CS2',
    avatar: 'LH',
    rank: 'Faceit Level 10',
    text: 'La routine d\'aim training m\'a fait passer de level 5 à level 10 sur Faceit. Contenu de qualité pro.',
    rating: 5,
    color: 'from-red-500 to-pink-600',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gray-950 py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Témoignages
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Ce que disent nos <span className="text-red-500">Membres</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Des joueurs comme toi qui ont amélioré leur gameplay grâce à nos astuces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-red-500/20 transition-all duration-300 group"
            >
              <Quote className="w-8 h-8 text-red-500/20 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.game} · {t.rank}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
