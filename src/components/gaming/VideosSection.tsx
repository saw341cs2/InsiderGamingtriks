import React, { useState } from 'react';
import { Play, ExternalLink, Clock, Eye, ThumbsUp, ChevronRight } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'CS2 - Les 10 Smokes que TOUT le monde doit connaître',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    duration: '14:32',
    views: '12K',
    likes: '890',
    date: 'Il y a 2 jours',
    game: 'CS2',
    featured: true,
  },
  {
    id: 2,
    title: 'Warzone - Loadout META Saison 3 (Imbattable)',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop',
    duration: '18:45',
    views: '8.5K',
    likes: '720',
    date: 'Il y a 5 jours',
    game: 'CoD',
    featured: false,
  },
  {
    id: 3,
    title: 'Battlefield - Guide Pilotage Hélicoptère (De Noob à Pro)',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=640&h=360&fit=crop',
    duration: '22:10',
    views: '6.2K',
    likes: '540',
    date: 'Il y a 1 semaine',
    game: 'BF',
    featured: false,
  },
  {
    id: 4,
    title: 'CS2 - Aim Training Routine (30 min/jour)',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=640&h=360&fit=crop',
    duration: '11:20',
    views: '15K',
    likes: '1.2K',
    date: 'Il y a 1 semaine',
    game: 'CS2',
    featured: false,
  },
  {
    id: 5,
    title: 'CoD MW3 - Les Meilleurs Settings Pro 2026',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=360&fit=crop',
    duration: '09:55',
    views: '9.8K',
    likes: '680',
    date: 'Il y a 2 semaines',
    game: 'CoD',
    featured: false,
  },
  {
    id: 6,
    title: 'Battlefield - Stratégies Squad Avancées',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
    duration: '16:40',
    views: '4.1K',
    likes: '380',
    date: 'Il y a 2 semaines',
    game: 'BF',
    featured: false,
  },
  {
    id: 7,
    title: 'CS2 - Économie & Buy Rounds Expliqués',
    thumbnail: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop',
    duration: '13:15',
    views: '7.3K',
    likes: '510',
    date: 'Il y a 3 semaines',
    game: 'CS2',
    featured: false,
  },
  {
    id: 8,
    title: 'Warzone - Drop Spots Secrets (Personne ne les connaît)',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
    duration: '20:05',
    views: '11K',
    likes: '950',
    date: 'Il y a 3 semaines',
    game: 'CoD',
    featured: false,
  },
];

const gameTagColors: Record<string, string> = {
  'CS2': 'bg-orange-500/20 text-orange-400',
  'BF': 'bg-blue-500/20 text-blue-400',
  'CoD': 'bg-green-500/20 text-green-400',
};

const VideosSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [playingId, setPlayingId] = useState<number | null>(null);

  const featured = videos.find((v) => v.featured);
  const filtered = videos.filter((v) => !v.featured && (selectedGame === 'all' || v.game === selectedGame));

  return (
    <section id="videos-section" className="bg-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
              YouTube
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Dernières <span className="text-red-500">Vidéos</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Une nouvelle vidéo chaque semaine. Abonne-toi pour ne rien manquer.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@InsiderHackGaming"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            S'abonner
          </a>
        </div>

        {/* Featured Video */}
        {featured && (
          <div className="mb-12 group">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Thumbnail / Player */}
                <div className="lg:col-span-3 relative aspect-video cursor-pointer" onClick={() => setPlayingId(playingId === featured.id ? null : featured.id)}>
                  {playingId === featured.id ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-red-500 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Lecture en cours...</p>
                        <p className="text-gray-500 text-xs mt-1">Regarde sur YouTube pour la vidéo complète</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono">
                        {featured.duration}
                      </div>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
                  <div className={`inline-flex self-start px-2.5 py-1 rounded text-xs font-bold mb-4 ${gameTagColors[featured.game]}`}>
                    {featured.game}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{featured.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{featured.views} vues</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{featured.likes}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featured.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Vidéo de la semaine
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'CS2', 'BF', 'CoD'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedGame === g
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              {g === 'all' ? 'Toutes' : g}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative aspect-video cursor-pointer" onClick={() => setPlayingId(playingId === video.id ? null : video.id)}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white font-mono">
                  {video.duration}
                </div>
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold ${gameTagColors[video.game]}`}>
                  {video.game}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune vidéo pour ce filtre.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@InsiderHackGaming"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Voir toutes les vidéos sur YouTube
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
