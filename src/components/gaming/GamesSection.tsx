import React from 'react';
import { Crosshair, Target, Bomb, ChevronRight } from 'lucide-react';

interface GamesSectionProps {
  onSelectGame: (game: string) => void;
}

const games = [
  {
    id: 'counter-strike',
    name: 'Counter-Strike 2',
    shortName: 'CS2',
    description: 'Maîtrise les smokes, flashs et positions clés pour dominer chaque round. Guides de spray, callouts et stratégies de pro.',
    icon: Crosshair,
    color: 'from-orange-500 to-yellow-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/50',
    textColor: 'text-orange-400',
    tips: 42,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
  },
  {
    id: 'battlefield',
    name: 'Battlefield',
    shortName: 'BF',
    description: 'Véhicules, classes et tactiques de squad. Apprends à contrôler la carte et à maximiser ton score par minute.',
    icon: Bomb,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/50',
    textColor: 'text-blue-400',
    tips: 38,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=600&h=400&fit=crop',
  },
  {
    id: 'call-of-duty',
    name: 'Call of Duty',
    shortName: 'CoD',
    description: 'Loadouts optimisés, mouvements avancés et astuces Warzone. Deviens le dernier survivant avec nos guides.',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    hoverBorder: 'hover:border-green-500/50',
    textColor: 'text-green-400',
    tips: 55,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
  },
];

const GamesSection: React.FC<GamesSectionProps> = ({ onSelectGame }) => {
  return (
    <section id="games-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Nos Jeux
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Choisis ton <span className="text-red-500">Terrain</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Des astuces spécialisées pour chaque FPS. Sélectionne ton jeu et accède à des guides exclusifs.
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className={`group relative overflow-hidden rounded-2xl border ${game.borderColor} ${game.hoverBorder} bg-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl text-left`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className={`absolute top-4 right-4 ${game.bgColor} backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold ${game.textColor} uppercase`}>
                    {game.tips} Astuces
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${game.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {game.description}
                  </p>
                  <div className={`flex items-center gap-1 ${game.textColor} text-sm font-semibold group-hover:gap-2 transition-all`}>
                    Voir les astuces
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
