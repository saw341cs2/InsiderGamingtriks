import React, { useState } from 'react';
<<<<<<< HEAD
import { Lock, Search, Filter, Star, Eye, Crosshair, Target, Bomb, Download, Unlock, X, ChevronRight } from 'lucide-react';
=======
import { Download, Lock, Unlock, Search, Filter, Star, Eye, ChevronRight, Crosshair, Target, Bomb } from 'lucide-react';
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb

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

<<<<<<< HEAD
const AstuceList: Astuce[] = [
  { id: 1, title: 'Smoke Lineup Mirage - Site A', game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false, downloads: 2340, views: 8900, rating: 4.8, category: 'Grenades', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', description: 'Les 5 smokes essentielles pour prendre le site A sur Mirage.\n\nMaîtriser ces smokes te permettra de couper les lignes de vue critiques et d\'exécuter proprement sur le site A.' },
  { id: 2, title: 'Spray Control AK-47 Masterclass', game: 'CS2', gameId: 'counter-strike', difficulty: 'Avancé', isPremium: true, downloads: 1560, views: 6200, rating: 4.9, category: 'Aim', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', description: 'Maîtrise le pattern de spray de l\'AK-47 en 7 étapes.' },
  { id: 3, title: 'Positions Sniper Dust2', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 3100, views: 12000, rating: 4.7, category: 'Positions', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', description: 'Les meilleures positions AWP pour contrôler la carte Dust2.' },
  { id: 4, title: 'Pilotage Hélicoptère Avancé', game: 'BF', gameId: 'battlefield', difficulty: 'Expert', isPremium: true, downloads: 890, views: 4500, rating: 4.6, category: 'Véhicules', image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop', description: 'Techniques de vol avancées pour dominer le ciel dans Battlefield.' },
  { id: 5, title: 'Loadout Médecin Optimal', game: 'BF', gameId: 'battlefield', difficulty: 'Débutant', isPremium: false, downloads: 2100, views: 7800, rating: 4.5, category: 'Classes', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop', description: 'Le meilleur setup médecin pour maximiser les soins et XP dans Battlefield.' },
  { id: 6, title: 'Rush B Stratégie Complète', game: 'CS2', gameId: 'counter-strike', difficulty: 'Intermédiaire', isPremium: false, downloads: 4200, views: 15000, rating: 4.8, category: 'Stratégies', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop', description: 'Exécution parfaite du rush B avec timings et utility.' },
  { id: 7, title: 'Warzone Meta Loadout S3', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Intermédiaire', isPremium: false, downloads: 5600, views: 22000, rating: 4.9, category: 'Loadouts', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop', description: 'Les meilleurs loadouts de la saison 3 de Warzone.' },
  { id: 8, title: 'Slide Cancel & Movement Tech', game: 'CoD', gameId: 'call-of-duty', difficulty: 'Avancé', isPremium: true, downloads: 3200, views: 14000, rating: 4.7, category: 'Mouvement', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=300&fit=crop', description: 'Techniques de mouvement avancées pour gagner chaque gunfight dans CoD.' },
=======
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
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
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
<<<<<<< HEAD
  const [selectedAstuce, setSelectedAstuce] = useState<Astuce | null>(null);

  const filtered = AstuceList.filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
=======
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  const filtered = astuces.filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
    if (gameFilter !== 'all' && a.gameId !== gameFilter) return false;
    if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
    if (showPremiumOnly && !a.isPremium) return false;
    return true;
  });

<<<<<<< HEAD
  const openModal = (astuce: Astuce) => {
    if (!astuce.isPremium) {
      setSelectedAstuce(astuce);
      document.body.style.overflow = 'hidden';
    } else {
      onNavigate('premium');
=======
  const handleDownload = (astuce: Astuce) => {
    if (astuce.isPremium) {
      onNavigate('premium');
      return;
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
    }
    setDownloadedIds((prev) => new Set(prev).add(astuce.id));
  };

  const closeModal = () => {
    setSelectedAstuce(null);
    document.body.style.overflow = '';
  };

  return (
    <section id="astuces-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD

=======
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Bibliothèque
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Astuces & <span className="text-red-500">Guides</span>
          </h2>
<<<<<<< HEAD
          <p className="text-gray-400 max-w-2xl mx-auto">
            Clique sur une carte pour lire l'astuce complète.
=======
          <p className="text-gray-400 text-sm leading-relaxed mb-4 astuce-desc"
            Plus de 150 astuces classées par jeu, difficulté et catégorie. Télécharge gratuitement ou passe Premium pour tout débloquer.
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" placeholder="Rechercher une astuce..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all" />
            </div>
<<<<<<< HEAD
            <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value as GameFilter)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none cursor-pointer">
=======
            <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value as GameFilter)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500/50 cursor-pointer">
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
              <option value="all">Tous les jeux</option>
              <option value="counter-strike">Counter-Strike 2</option>
              <option value="battlefield">Battlefield</option>
              <option value="call-of-duty">Call of Duty</option>
            </select>
<<<<<<< HEAD
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none cursor-pointer">
=======
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500/50 cursor-pointer">
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
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

<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ alignItems: 'stretch' }}>
          {filtered.slice(0, 9).map((astuce) => {
            const GameIcon = gameIcons[astuce.game] || Crosshair;
            const imgSrc = astuce.image || defaultImages[astuce.game];
            return (
              <div key={astuce.id} onClick={() => openModal(astuce)} className={`group relative bg-gray-900/60 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between h-[380px] ${astuce.isPremium ? 'border-yellow-500/20 hover:border-yellow-500/50' : 'border-gray-800 hover:border-red-500/40'}`}>

                <div className="absolute top-3 right-3 z-20">
                  {astuce.isPremium ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-yellow-500/40 rounded-md text-xs font-bold text-yellow-400"><Lock className="w-3 h-3" />PREMIUM</span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-green-500/30 rounded-md text-xs font-bold text-green-400"><Unlock className="w-3 h-3" />GRATUIT</span>
                  )}
                </div>

                <div className="relative h-32 w-full flex-shrink-0 overflow-hidden">
                  <img src={imgSrc} alt={astuce.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[astuce.game]; }} />
                  {astuce.isPremium && <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center"><Lock className="w-8 h-8 text-yellow-400" /></div>}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GameIcon className={`w-3.5 h-3.5 ${gameColors[astuce.game]}`} />
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((astuce) => {
            const GameIcon = gameIcons[astuce.game] || Crosshair;
            const isDownloaded = downloadedIds.has(astuce.id);

            return (
              <div
                key={astuce.id}
                className={`group relative bg-gray-900/60 border rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col ${
                  astuce.isPremium ? 'border-yellow-500/20 hover:border-yellow-500/40' : 'border-gray-800 hover:border-red-500/30'
                }`}
              >
                {astuce.isPremium && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-md text-xs font-bold text-white">
                    <Lock className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <GameIcon className={`w-4 h-4 ${gameColors[astuce.game]}`} />
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
                    <span className={`text-xs font-semibold ${gameColors[astuce.game]}`}>{astuce.game}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{astuce.category}</span>
                  </div>
<<<<<<< HEAD
                  <h3 className="text-white font-bold text-base mb-2 leading-tight group-hover:text-red-400 transition-colors line-clamp-2">{astuce.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-grow">{astuce.description.split('\n')[0]}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded border ${difficultyColors[astuce.difficulty]}`}>{astuce.difficulty}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{astuce.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{astuce.rating}</span>
                    </div>
                  </div>
                  <button className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${astuce.isPremium ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20'}`}>
                    {astuce.isPremium ? <>Débloquer Premium <Lock className="w-3 h-3" /></> : <>Lire l'astuce <ChevronRight className="w-3.5 h-3.5" /></>}
=======

                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                    {astuce.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {astuce.description}
                  </p>

                  <div className="mb-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border ${difficultyColors[astuce.difficulty]}`}>
                      {astuce.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{astuce.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{astuce.downloads.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" />{astuce.rating}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(astuce)}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      astuce.isPremium
                        ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-400 hover:from-yellow-600/30 hover:to-orange-600/30'
                        : isDownloaded
                        ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                        : 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30'
                    }`}
                  >
                    {astuce.isPremium ? (
                      <><Lock className="w-4 h-4" />Débloquer avec Premium</>
                    ) : isDownloaded ? (
                      <><Unlock className="w-4 h-4" />Téléchargé</>
                    ) : (
                      <><Download className="w-4 h-4" />Télécharger Gratuit</>
                    )}
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
<<<<<<< HEAD
            <p className="text-gray-400 text-lg">Aucune astuce trouvée.</p>
            <button onClick={() => { setSearchQuery(''); setGameFilter('all'); setDifficultyFilter('all'); setShowPremiumOnly(false); }} className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm">Réinitialiser les filtres</button>
=======
            <p className="text-gray-400 text-lg">Aucune astuce trouvée avec ces filtres.</p>
            <button onClick={() => { setSearchQuery(''); setGameFilter('all'); setDifficultyFilter('all'); setShowPremiumOnly(false); }} className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm">
              Réinitialiser les filtres
            </button>
>>>>>>> beb5ce4609b220e12d99b3dea5a9eebb214d21eb
          </div>
        )}
      </div>

      {selectedAstuce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

            <div className="relative h-52 overflow-hidden rounded-t-2xl">
              <img src={selectedAstuce.image || defaultImages[selectedAstuce.game]} alt={selectedAstuce.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[selectedAstuce.game]; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-16">
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(gameIcons[selectedAstuce.game] || Crosshair, { className: `w-4 h-4 ${gameColors[selectedAstuce.game]}` })}
                  <span className={`text-xs font-semibold ${gameColors[selectedAstuce.game]}`}>{selectedAstuce.game}</span>
                  <span className="text-gray-500">·</span>
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