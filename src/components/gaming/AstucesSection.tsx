import React, { useState } from 'react';
import { Lock, Search, Filter, Star, Eye, Crosshair, Target, Bomb, Download, Unlock, X, ChevronRight } from 'lucide-react';

interface AstucesSectionProps {
  onNavigate: (section: string) => void;
}

type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
type GameFilter = 'all' | 'counter-strike' | 'battlefield' | 'call-of-duty';

interface Astuce {
  id: number;
  title: string;
  game: string;
  gameId: GameFilter;
  difficulty: Difficulty;
  isPremium: boolean;
  downloads: number;
  views: number;
  rating: number;
  description: string;
  category: string;
  image?: string;
}

const astuces: Astuce[] = [
  { id: 1, title: 'Crosshair Placement + Pré-Aim', game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false, downloads: 1850, views: 7200, rating: 4.8, category: 'Aim', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', description: "Travaille ton crosshair placement pour gagner tes duels plus facilement sur CS2.\n\nLe principe est simple : garde toujours ton viseur à hauteur de tête et place-le à l'endroit où un ennemi peut apparaître avant même de le voir.\n\nComment s'entraîner\n1. Lance une map d'entraînement ou une partie hors ligne.\n2. Déplace-toi lentement sur la carte en gardant le viseur au niveau de la tête.\n3. À chaque angle, vise l'endroit exact où un adversaire pourrait sortir.\n4. Répète l'exercice sans tirer, puis ajoute des bots pour travailler tes réflexes.\n\nConseil pratique\nCommence sur Mirage ou Dust2 avec un seul trajet précis, puis augmente progressivement la vitesse d'exécution." },
  { id: 2, title: 'Smoke Lineup Mirage - Site A', game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false, downloads: 2340, views: 8900, rating: 4.8, category: 'Grenades', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', description: 'Les 5 smokes essentielles pour prendre le site A sur Mirage.\n\nMaîtriser ces smokes te permettra de couper les lignes de vue critiques et d\'exécuter proprement sur le site A.' },
  { id: 3, title: 'Spray Control AK-47 Masterclass', game: 'CS2', gameId: 'counter-strike', difficulty: 'Avancé', isPremium: true, downloads: 1560, views: 6200, rating: 4.9, category: 'Aim', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80', description: 'Maîtrise le pattern de spray de l\'AK-47 en 7 étapes.' },
  { id: 4, title: 'Positions Sniper Dust2', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 3100, views: 12000, rating: 4.7, category: 'Positions', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80', description: 'Les meilleures positions AWP pour contrôler la carte Dust2.' },
  { id: 5, title: 'Pilotage Hélicoptère Avancé', game: 'BF', gameId: 'battlefield', difficulty: 'Expert', isPremium: true, downloads: 890, views: 4500, rating: 4.6, category: 'Véhicules', image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80', description: 'Techniques de vol avancées pour dominer le ciel dans Battlefield.' },
  { id: 6, title: 'Loadout Médecin Optimal', game: 'BF', gameId: 'battlefield', difficulty: 'Débutant', isPremium: false, downloads: 2100, views: 7800, rating: 4.5, category: 'Classes', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80', description: 'Le meilleur setup médecin pour maximiser les soins et XP dans Battlefield.' },
  { id: 7, title: 'Rush B Stratégie Complète', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 4200, views: 15000, rating: 4.8, category: 'Stratégies', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80', description: 'Exécution parfaite du rush B avec timings et utility.' },
  { id: 8, title: 'Warzone Meta Loadout S3', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Intermédiaire', isPremium: false, downloads: 5600, views: 22000, rating: 4.9, category: 'Loadouts', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80', description: 'Les meilleurs loadouts de la saison 3 de Warzone.' },
  { id: 9, title: 'Slide Cancel & Movement Tech', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Avancé', isPremium: true, downloads: 3200, views: 14000, rating: 4.7, category: 'Mouvement', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&q=80', description: 'Techniques de mouvement avancées pour gagner chaque gunfight dans CoD.' },
];

const difficultyColors: Record<Difficulty, string> = {
  'Débutant': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Intermédiaire': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Avancé': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Expert': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const gameIcons: Record<string, React.ElementType> = {
  'CS2': Crosshair,
  'BF': Bomb,
  'CoD': Target,
};

const gameColors: Record<string, string> = {
  'CS2': 'text-orange-400',
  'BF': 'text-blue-400',
  'CoD': 'text-green-400',
};

const defaultImages: Record<string, string> = {
  'CS2': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
  'BF': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80',
  'CoD': 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80',
};

const AstucesSection: React.FC<AstucesSectionProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedAstuce, setSelectedAstuce] = useState<Astuce | null>(null);

  const filtered = astuces.filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (gameFilter !== 'all' && a.gameId !== gameFilter) return false;
    if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
    if (showPremiumOnly && !a.isPremium) return false;
    return true;
  });

  const openModal = (astuce: Astuce) => {
    if (!astuce.isPremium) {
      setSelectedAstuce(astuce);
      document.body.style.overflow = 'hidden';
    } else {
      onNavigate('premium');
    }
  };

  const closeModal = () => {
    setSelectedAstuce(null);
    document.body.style.overflow = '';
  };

  return (
    <section id="astuces-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Bibliothèque
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Astuces & <span className="text-red-500">Guides</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Clique sur une carte pour lire l'astuce complète.
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" placeholder="Rechercher une astuce..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all" />
            </div>
            <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value as GameFilter)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none cursor-pointer">
              <option value="all">Tous les jeux</option>
              <option value="counter-strike">Counter-Strike 2</option>
              <option value="battlefield">Battlefield</option>
              <option value="call-of-duty">Call of Duty</option>
            </select>
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none cursor-pointer">
              <option value="all">Toute difficulté</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Expert">Expert</option>
            </select>
            <button onClick={() => setShowPremiumOnly(!showPremiumOnly)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${showPremiumOnly ? 'bg-red-600/20 border-red-500/50 text-red-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'}`}>
              <Filter className="w-4 h-4" /> Premium
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm"><span className="text-white font-semibold">{filtered.length}</span> astuce{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, 9).map((astuce) => {
            const GameIcon = gameIcons[astuce.game] || Crosshair;
            const imgSrc = astuce.image || defaultImages[astuce.game];
            return (
              <div key={astuce.id} onClick={() => openModal(astuce)} className={`group relative bg-gray-900/60 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 ${astuce.isPremium ? 'border-yellow-500/20 hover:border-yellow-500/50' : 'border-gray-800 hover:border-red-500/40'}`}>

                <div className="absolute top-3 right-3 z-20">
                  {astuce.isPremium ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-yellow-500/40 rounded-md text-xs font-bold text-yellow-400"><Lock className="w-3 h-3" />PREMIUM</span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-green-500/30 rounded-md text-xs font-bold text-green-400"><Unlock className="w-3 h-3" />GRATUIT</span>
                  )}
                </div>

                <div className="relative h-40 overflow-hidden">
                  <img src={imgSrc} alt={astuce.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {astuce.isPremium && <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center"><Lock className="w-8 h-8 text-yellow-400/70" /></div>}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GameIcon className={`w-3.5 h-3.5 ${gameColors[astuce.game]}`} />
                    <span className={`text-xs font-semibold ${gameColors[astuce.game]}`}>{astuce.game}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{astuce.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 leading-tight group-hover:text-red-400 transition-colors">{astuce.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{astuce.description.split('\n')[0]}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded border ${difficultyColors[astuce.difficulty]}`}>{astuce.difficulty}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{astuce.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{astuce.rating}</span>
                    </div>
                  </div>
                  <button className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${astuce.isPremium ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20'}`}>
                    {astuce.isPremium ? <>Débloquer Premium <Lock className="w-3 h-3" /></> : <>Lire l'astuce <ChevronRight className="w-3.5 h-3.5" /></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune astuce trouvée.</p>
            <button onClick={() => { setSearchQuery(''); setGameFilter('all'); setDifficultyFilter('all'); setShowPremiumOnly(false); }} className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm">Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      {selectedAstuce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

            <div className="relative h-52 overflow-hidden rounded-t-2xl">
              <img src={selectedAstuce.image || defaultImages[selectedAstuce.game]} alt={selectedAstuce.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-16">
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(gameIcons[selectedAstuce.game] || Crosshair, { className: `w-4 h-4 ${gameColors[selectedAstuce.game]}` })}
                  <span className={`text-xs font-semibold ${gameColors[selectedAstuce.game]}`}>{selectedAstuce.game}</span>
                  <span <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 h-8 overflow-hidden">>·</span>
                  <span className="text-xs text-gray-400">{selectedAstuce.category}</span>
                </div>
                <h2 className="text-white font-black text-xl leading-tight">{selectedAstuce.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-md border ${difficultyColors[selectedAstuce.difficulty]}`}>{selectedAstuce.difficulty}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><Eye className="w-3.5 h-3.5" />{selectedAstuce.views.toLocaleString()} vues</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><Download className="w-3.5 h-3.5" />{selectedAstuce.downloads.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3.5 h-3.5" />{selectedAstuce.rating}</span>
              </div>
              <div className="border-t border-gray-800 mb-5" />
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{selectedAstuce.description}</div>
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-600 text-xs">InsiderGamingTriks</span>
                <button onClick={closeModal} className="px-4 py-2 bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-bold transition-all">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AstucesSection;
