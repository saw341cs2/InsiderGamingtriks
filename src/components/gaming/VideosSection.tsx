﻿import React, { useState } from 'react';
import { Play, ExternalLink, Clock, Eye, ThumbsUp, ChevronRight } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'CS2 - TOP 10 DES MOMENTS LES PLUS DRÔLES (Fail & Win)',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    duration: '12:45',
    views: '45K',
    likes: '3.2K',
    date: 'Il y a 4 heures',
    game: 'CS2',
    youtubeId: 'dQw4w9WgXcQ', // Exemple
    featured: true,
  },
  {
    id: 2,
    title: '⭐ MASTERCLASS : Pourquoi vous ne progresserez JAMAIS sans ces astuces (SÉRIEUX)',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    duration: '59:59',
    views: '1.2K',
    likes: '450',
    date: 'Il y a 2 minutes',
    game: 'CS2',
    youtubeId: 'yv_2I_6_i_U',
    featured: false,
  },
  {
    id: 3,
    title: 'FUNNY : Les pires bugs de collision sur Battlefield (Compilation)',
    thumbnail: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=640&h=360&fit=crop',
    duration: '03:40',
    views: '42K',
    likes: '3.1K',
    date: 'Il y a 12 minutes',
    game: 'BF',
    youtubeId: 'Yv7H_K_k6fE',
    featured: false,
  },
  {
    id: 4,
    title: 'ANALYSE PRO : Pourquoi cette lunette change tout sur Warzone',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=640&h=360&fit=crop',
    duration: '45:00',
    views: '5.4K',
    likes: '420',
    date: 'Il y a 20 minutes',
    game: 'CoD',
    youtubeId: 'pS-rS6K_Kq8',
    featured: false,
  },
  {
    id: 5,
    title: 'TROLL : Je gagne une game au lance-patate (C\'est n\'importe quoi)',
    thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bb9f75c?w=640&h=360&fit=crop',
    duration: '08:15',
    views: '125K',
    likes: '18K',
    date: 'Il y a 45 minutes',
    game: 'CoD',
    youtubeId: 'C_N0ZpS_o_Q',
    featured: false,
  },
];

const gameTagColors: Record<string, string> = {
  'CS2': 'bg-orange-500/20 text-orange-400',
  'BF': 'bg-blue-500/20 text-blue-400',
  'CoD': 'bg-green-500/20 text-green-400',
  'Fortnite': 'bg-purple-500/20 text-purple-400',
  'LoL': 'bg-cyan-500/20 text-cyan-400',
  'Valorant': 'bg-red-500/20 text-red-400',
  'RL': 'bg-sky-500/20 text-sky-400',
  'GTA': 'bg-yellow-500/20 text-yellow-400',
  'Apex': 'bg-rose-500/20 text-rose-400',
};

const VideosSection: React.FC = () => {
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const featuredVideo = videos.find(v => v.featured) || videos[0];

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
        <div className="mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group shadow-2xl">
            {playingVideoId === featuredVideo.id ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title={featuredVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
              ></iframe>
            ) : (
              <>
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <button
                onClick={() => setPlayingVideoId(featuredVideo.id)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-600/30"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${gameTagColors[featuredVideo.game]}`}>
                    {featuredVideo.game}
                  </span>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Video de la semaine
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {featuredVideo.title}
                </h3>
                <div className="flex items-center gap-6 text-gray-300">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {featuredVideo.views} vues
                  </span>
                  <span className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    {featuredVideo.likes}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredVideo.date}
                  </span>
                </div>
              </div>
              </>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.filter(v => !v.featured).slice(0, 4).map((video) => (
            <div
              key={video.id}
              onClick={() => setPlayingVideoId(video.id)}
              className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                {playingVideoId === video.id ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                  ></iframe>
                ) : (
                  <>
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium">{video.duration}</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </>
                )}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
