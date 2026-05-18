import React, { useState, useEffect } from 'react';
import { Lock, Search, Filter, Star, Eye, Crosshair, Target, Bomb, Download, Unlock, X, Clock } from 'lucide-react';

interface AstucesSectionProps {
  onNavigate: (section: string) => void;
}

type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
type GameFilter = 'all' | 'counter-strike' | 'battlefield' | 'call-of-duty' | 'general';

interface Astuce {
  id: number;
  title: string;
  game: string;
  gameId: GameFilter;
  difficulty: Difficulty;
  isPremium: boolean;
  downloads?: number;
  views: number;
  rating: number;
  description: string;
  category: string;
  date: string;
  image?: string;
}

interface AstucesData {
  astuces: Astuce[];
  generatedAt?: string;
  dailyPick?: number[];
}

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
  'FPS': Star,
};

const gameColors: Record<string, string> = {
  'CS2': 'text-orange-400',
  'BF': 'text-blue-400',
  'CoD': 'text-green-400',
  'FPS': 'text-purple-400',
};

const defaultImages: Record<string, string> = {
  'CS2': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
  'BF': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80',
  'CoD': 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80',
  'FPS': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
};

const AstucesSection: React.FC<AstucesSectionProps> = ({ onNavigate }) => {
  const [astuces, setAstuces] = useState<Astuce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedAstuce, setSelectedAstuce] = useState<Astuce | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  const loadAstuces = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('astuces.json', document.baseURI);
      url.searchParams.set('t', Date.now().toString());
      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`Impossible de charger les astuces (${response.status}).`);
      const data = (await response.json()) as AstucesData;
      if (!Array.isArray(data.astuces)) throw new Error('Format de données invalide.');
      setAstuces(data.astuces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setAstuces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAstuces(); }, []);

  const filtered = astuces.filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (gameFilter !== 'all' && a.gameId !== gameFilter) return false;
    if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
    if (showPremiumOnly && !a.isPremium) return false;
    return true;
  });

  const openModal = (astuce: Astuce) => {
    if (astuce.isPremium) {
      const el = document.getElementById('premium-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedAstuce(astuce);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleDownload = (e: React.MouseEvent, astuce: Astuce) => {
    e.stopPropagation();
    if (astuce.isPremium) { onNavigate('premium'); return; }
    setDownloadedIds((prev) => new Set(prev).add(astuce.id));
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
            Astuces FPS, tutos, guides et configs. Mis à jour chaque matin.
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher une astuce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value as GameFilter)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="all">Tous les jeux</option>
              <option value="counter-strike">Counter-Strike 2</option>
              <option value="battlefield">Battlefield</option>
              <option value="call-of-duty">Call of Duty</option>
              <option value="general">FPS Général</option>
            </select>
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
            <button
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${showPremiumOnly ? 'bg-red-600/20 border-red-500/50 text-red-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'}`}
            >
              <Filter className="w-4 h-4" /> Premium
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-center text-red-200 mb-6">
            <p className="font-semibold">Erreur lors du chargement des astuces</p>
            <p className="mt-1 text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> astuce{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={loadAstuces}
            disabled={loading}
            className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, 6).map((astuce) => {
              const GameIcon = gameIcons[astuce.game] || Crosshair;
              const imgSrc = astuce.image || defaultImages[astuce.game];
              const isDownloaded = downloadedIds.has(astuce.id);
              return (
                <div
                  key={astuce.id}
                  onClick={() => openModal(astuce)}
                  className={`group relative bg-gray-900/60 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 flex flex-col h-[420px] ${astuce.isPremium ? 'border-yellow-500/20 hover:border-yellow-500/50' : 'border-gray-800 hover:border-red-500/40'}`}
                >
                  <div className="absolute top-3 right-3 z-20">
                    {astuce.isPremium ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-yellow-500/40 rounded-md text-xs font-bold text-yellow-400">
                        <Lock className="w-3 h-3" />PREMIUM
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-900/90 border border-green-500/30 rounded-md text-xs font-bold text-green-400">
                        <Unlock className="w-3 h-3" />GRATUIT
                      </span>
                    )}
                  </div>

                  <div className="relative h-40 w-full flex-shrink-0 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={astuce.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[astuce.game] || defaultImages['CS2']; }}
                    />
                    {astuce.isPremium && <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center"><Lock className="w-8 h-8 text-yellow-400" /></div>}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <GameIcon className={`w-4 h-4 ${gameColors[astuce.game] || 'text-gray-400'}`} />
                      <span className={`text-xs font-semibold ${gameColors[astuce.game] || 'text-gray-400'}`}>{astuce.game}</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-xs text-gray-500">{astuce.category}</span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
                      {astuce.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {astuce.description.split('\n')[0]}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border ${difficultyColors[astuce.difficulty]}`}>
                        {astuce.difficulty}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{astuce.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" />{astuce.rating}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{astuce.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDownload(e, astuce)}
                      className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        astuce.isPremium
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                          : isDownloaded
                          ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                          : 'bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20'
                      }`}
                    >
                      {astuce.isPremium ? (
                        <><Lock className="w-4 h-4" />Débloquer Premium</>
                      ) : isDownloaded ? (
                        <><Unlock className="w-4 h-4" />Téléchargé</>
                      ) : (
                        <><Download className="w-4 h-4" />Télécharger Gratuit</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune astuce trouvée.</p>
            <button
              onClick={() => { setSearchQuery(''); setGameFilter('all'); setDifficultyFilter('all'); setShowPremiumOnly(false); }}
              className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10">
            <a
              href="/InsiderGamingtriks/archives"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold rounded-xl transition-all"
            >
              Voir toutes les astuces & anciennes news →
            </a>
          </div>
        )}
      </div>

      {selectedAstuce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img
                src={selectedAstuce.image || defaultImages[selectedAstuce.game]}
                alt={selectedAstuce.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[selectedAstuce.game] || defaultImages['CS2']; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-8 right-16">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(gameIcons[selectedAstuce.game] || Crosshair, { className: `w-5 h-5 ${gameColors[selectedAstuce.game]}` })}
                  <span className={`text-sm font-semibold ${gameColors[selectedAstuce.game]}`}>{selectedAstuce.game}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-sm text-gray-400">{selectedAstuce.category}</span>
                </div>
                <h2 className="text-white font-black text-2xl md:text-3xl leading-tight">{selectedAstuce.title}</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-md border ${difficultyColors[selectedAstuce.difficulty]}`}>
                  {selectedAstuce.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500"><Eye className="w-4 h-4" />{selectedAstuce.views.toLocaleString()} vues</span>
                <span className="flex items-center gap-1.5 text-sm text-yellow-400"><Star className="w-4 h-4" />{selectedAstuce.rating}</span>
              </div>
              <div className="border-t border-gray-800 mb-6" />
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {selectedAstuce.description}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-600 text-sm font-medium">InsiderGamingTriks Guide</span>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="px-6 py-2.5 bg-gray-800 text-white hover:bg-gray-700 rounded-xl text-sm font-bold transition-all">
                    Fermer
                  </button>
                  <button
                    onClick={(e) => { handleDownload(e, selectedAstuce); closeModal(); }}
                    className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Télécharger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AstucesSection;
