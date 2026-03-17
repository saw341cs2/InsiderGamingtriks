import React, { useState } from 'react';
import { Download, Lock, Unlock, Search, Filter, Star, Eye, ChevronRight, Crosshair, Target, Bomb } from 'lucide-react';

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
}

const astuces: Astuce[] = [
  { id: 1, title: 'Smoke Lineup Mirage - Site A', game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false, downloads: 2340, views: 8900, rating: 4.8, description: 'Les 5 smokes essentielles pour prendre le site A sur Mirage.', category: 'Grenades' },
  { id: 2, title: 'Spray Control AK-47 Masterclass', game: 'CS2', gameId: 'counter-strike', difficulty: 'Avancé', isPremium: true, downloads: 1560, views: 6200, rating: 4.9, description: 'Maîtrise le pattern de spray de l\'AK-47 en 7 étapes.', category: 'Aim' },
  { id: 3, title: 'Positions Sniper Dust2', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 3100, views: 12000, rating: 4.7, description: 'Les meilleures positions AWP pour contrôler la carte.', category: 'Positions' },
  { id: 4, title: 'Pilotage Hélicoptère Avancé', game: 'BF', gameId: 'battlefield', difficulty: 'Expert', isPremium: true, downloads: 890, views: 4500, rating: 4.6, description: 'Techniques de vol avancées pour dominer le ciel.', category: 'Véhicules' },
  { id: 5, title: 'Loadout Médecin Optimal', game: 'BF', gameId: 'battlefield', difficulty: 'Débutant', isPremium: false, downloads: 2100, views: 7800, rating: 4.5, description: 'Le meilleur setup médecin pour maximiser les soins et XP.', category: 'Classes' },
  { id: 6, title: 'Rush B Stratégie Complète', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 4200, views: 15000, rating: 4.8, description: 'Exécution parfaite du rush B avec timings et utility.', category: 'Stratégies' },
  { id: 7, title: 'Warzone Meta Loadout S3', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Intermédiaire', isPremium: false, downloads: 5600, views: 22000, rating: 4.9, description: 'Les meilleurs loadouts de la saison 3 de Warzone.', category: 'Loadouts' },
  { id: 8, title: 'Slide Cancel & Movement Tech', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Avancé', isPremium: true, downloads: 3200, views: 14000, rating: 4.7, description: 'Techniques de mouvement avancées pour gagner chaque gunfight.', category: 'Mouvement' },
  { id: 9, title: 'Rotation Map Control Guide', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Expert', isPremium: true, downloads: 1200, views: 5600, rating: 4.8, description: 'Maîtrise les rotations et le contrôle de carte en Warzone.', category: 'Stratégies' },
  { id: 10, title: 'Tank Warfare Tactics', game: 'BF', gameId: 'battlefield', difficulty: 'Avancé', isPremium: false, downloads: 1800, views: 6700, rating: 4.4, description: 'Dominer avec les chars : positionnement et angles.', category: 'Véhicules' },
  { id: 11, title: 'Flash Pop Techniques', game: 'CS2', gameId: 'counter-strike', difficulty: 'Expert', isPremium: true, downloads: 980, views: 4100, rating: 4.9, description: 'Flashs popées parfaites pour entry frag à chaque round.', category: 'Grenades' },
  { id: 12, title: 'Sniper Quickscope Mastery', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Expert', isPremium: true, downloads: 2400, views: 11000, rating: 4.6, description: 'Deviens un quickscoper redoutable en multijoueur.', category: 'Aim' },
  { id: 13, title: 'Conquest Point Capture Order', game: 'BF', gameId: 'battlefield', difficulty: 'Intermédiaire', isPremium: false, downloads: 1500, views: 5400, rating: 4.3, description: 'L\'ordre optimal de capture des points en Conquest.', category: 'Stratégies' },
  { id: 14, title: 'Crosshair Placement Guide', game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false, downloads: 6800, views: 28000, rating: 4.9, description: 'La base du headshot : placement de viseur parfait.', category: 'Aim' },
  { id: 15, title: 'Audio Settings Pro Config', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Débutant', isPremium: false, downloads: 3900, views: 16000, rating: 4.5, description: 'Configuration audio optimale pour entendre les pas ennemis.', category: 'Settings' },
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

const AstucesSection: React.FC<AstucesSectionProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  const filtered = astuces.filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (gameFilter !== 'all' && a.gameId !== gameFilter) return false;
    if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
    if (showPremiumOnly && !a.isPremium) return false;
    return true;
  });

  const handleDownload = (astuce: Astuce) => {
    if (astuce.isPremium) {
      onNavigate('premium');
      return;
    }
    setDownloadedIds((prev) => new Set(prev).add(astuce.id));
  };

  return (
    <section id="astuces-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Bibliothèque
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Astuces & <span className="text-red-500">Guides</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Plus de 150 astuces classées par jeu, difficulté et catégorie. Télécharge gratuitement ou passe Premium pour tout débloquer.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher une astuce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
            </div>

            {/* Game Filter */}
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value as GameFilter)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="all">Tous les jeux</option>
              <option value="counter-strike">Counter-Strike 2</option>
              <option value="battlefield">Battlefield</option>
              <option value="call-of-duty">Call of Duty</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="all">Toute difficulté</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Expert">Expert</option>
            </select>

            {/* Premium Toggle */}
            <button
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
                showPremiumOnly
                  ? 'bg-red-600/20 border-red-500/50 text-red-400'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Premium
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> astuce{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Astuces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((astuce) => {
            const GameIcon = gameIcons[astuce.game] || Crosshair;
            const isDownloaded = downloadedIds.has(astuce.id);

            return (
              <div
                key={astuce.id}
                className={`group relative bg-gray-900/60 border rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  astuce.isPremium ? 'border-yellow-500/20 hover:border-yellow-500/40' : 'border-gray-800 hover:border-red-500/30'
                }`}
              >
                {/* Premium Badge */}
                {astuce.isPremium && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-md text-xs font-bold text-white">
                    <Lock className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}

                <div className="p-5">
                  {/* Game & Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <GameIcon className={`w-4 h-4 ${gameColors[astuce.game]}`} />
                    <span className={`text-xs font-semibold ${gameColors[astuce.game]}`}>{astuce.game}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-xs text-gray-500">{astuce.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors">
                    {astuce.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {astuce.description}
                  </p>

                  {/* Difficulty */}
                  <div className="mb-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border ${difficultyColors[astuce.difficulty]}`}>
                      {astuce.difficulty}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {astuce.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {astuce.downloads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      {astuce.rating}
                    </span>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(astuce)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      astuce.isPremium
                        ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-400 hover:from-yellow-600/30 hover:to-orange-600/30'
                        : isDownloaded
                        ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                        : 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30'
                    }`}
                  >
                    {astuce.isPremium ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Débloquer avec Premium
                      </>
                    ) : isDownloaded ? (
                      <>
                        <Unlock className="w-4 h-4" />
                        Téléchargé
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Télécharger Gratuit
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune astuce trouvée avec ces filtres.</p>
            <button
              onClick={() => { setSearchQuery(''); setGameFilter('all'); setDifficultyFilter('all'); setShowPremiumOnly(false); }}
              className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AstucesSection;
