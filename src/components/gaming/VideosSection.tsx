import React, { useState } from 'react';
import { Play, ExternalLink, Clock, Eye, ThumbsUp, ChevronRight } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'CS2 - Les 10 Smokes que TOUT le monde doit connatre',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    duration: '14:32',
    views: '12K',
    likes: '890',
    date: 'Il y a 1 jour',
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
    date: 'Il y a 2 jours',
    game: 'CoD',
    featured: false,
  },
  {
    id: 3,
    title: 'Battlefield - Guide Pilotage Helico (De Noob a Pro)',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=640&h=360&fit=crop',
    duration: '22:10',
    views: '6.2K',
    likes: '540',
    date: 'Il y a 2 jours',
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
    date: 'Il y a 3 jours',
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
    date: 'Il y a 3 jours',
    game: 'CoD',
    featured: false,
  },
  {
    id: 6,
    title: 'Battlefield - Strategies Squad Avancees',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
    duration: '16:40',
    views: '4.1K',
    likes: '380',
    date: 'Il y a 4 jours',
    game: 'BF',
    featured: false,
  },
  {
    id: 7,
    title: 'CS2 - Economie et Buy Rounds Expliques',
    thumbnail: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop',
    duration: '13:15',
    views: '7.3K',
    likes: '510',
    date: 'Il y a 4 jours',
    game: 'CS2',
    featured: false,
  },
  {
    id: 8,
    title: 'Warzone - Drop Spots Secrets (Personne ne les connoit)',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
    duration: '20:05',
    views: '11K',
    likes: '950',
    date: 'Il y a 5 jours',
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
  const [activeVideo, setActiveVideo] = useState<number | null>(1);

  return (
    <section id="videos-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Play className="w-3.5 h-3.5" />
              Vidéos
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Dernières <span className="text-red-500">Vidéos</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Une nouvelle vidéo chaque semaine. Abonne-toi pour ne rien manquer.
            </p>
          </div>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Featured Video */}
        {videos.find(v => v.featured) && (
          <div className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group">
              <img
                src={videos[0].thumbnail}
                alt={videos[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Play Button */}
              <button
                onClick={() => setActiveVideo(videos[0].id)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-600/30"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </button>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${gameTagColors[videos[0].game]}`}>
                    {videos[0].game}
                  </span>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Video de la semaine
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {videos[0].title}
                </h3>
                <div className="flex items-center gap-6 text-gray-300">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {videos[0].views} vues
                  </span>
                  <span className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    {videos[0].likes}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {videos[0].date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.filter(v => !v.featured).slice(0, 4).map((video) => (
            <a
              key={video.id}
              href="#"
              className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
                  {video.duration}
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${gameTagColors[video.game]}`}>
                    {video.game}
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {video.likes}
                  </span>
                  <span>{video.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
