import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, ThumbsUp, ChevronRight, ChevronLeft } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  date: string;
  game: string;
  youtubeId: string;
  youtubeUrl: string;
  featured: boolean;
  topic: string;
  localVideoPath?: string;
}

const gameTagColors: Record<string, string> = {
  'CS2': 'bg-orange-500/20 text-orange-400',
  'BF': 'bg-blue-500/20 text-blue-400',
  'CoD': 'bg-green-500/20 text-green-400',
  'Valorant': 'bg-red-500/20 text-red-400',
  'Apex': 'bg-rose-500/20 text-rose-400',
  'PC': 'bg-purple-500/20 text-purple-400',
};

const VIDEOS_PER_PAGE = 2;

const fallbackVideos: Video[] = [
  {
    id: 1,
    title: "CS2 - Guide complet pour débuter en compétitif",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop",
    duration: "18:32",
    views: "245K",
    likes: "12K",
    date: "Aujourd'hui",
    game: "CS2",
    youtubeId: "V-_O7nl0Ii0",
    youtubeUrl: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
    featured: true,
    topic: "FPS"
  },
  {
    id: 2,
    title: "Warzone - Top loadouts et stratégies saison actuelle",
    thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop",
    duration: "12:15",
    views: "89K",
    likes: "5.4K",
    date: "Aujourd'hui",
    game: "CoD",
    youtubeId: "9nL_FhWE7SQ",
    youtubeUrl: "https://www.youtube.com/watch?v=9nL_FhWE7SQ",
    featured: false,
    topic: "FPS"
  },
  {
    id: 3,
    title: "Valorant - Améliorer son aim et sa précision",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop",
    duration: "15:20",
    views: "156K",
    likes: "9.8K",
    date: "Hier",
    game: "Valorant",
    youtubeId: "pSBMRJuWBsc",
    youtubeUrl: "https://www.youtube.com/watch?v=pSBMRJuWBsc",
    featured: false,
    topic: "FPS"
  },
  {
    id: 4,
    title: "Battlefield 2042 - Maîtriser les véhicules et classes",
    thumbnail: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=640&h=360&fit=crop",
    duration: "09:47",
    views: "34K",
    likes: "2.1K",
    date: "Hier",
    game: "BF",
    youtubeId: "wYPJFCQxHQE",
    youtubeUrl: "https://www.youtube.com/watch?v=wYPJFCQxHQE",
    featured: false,
    topic: "FPS"
  },
  {
    id: 5,
    title: "CS2 - Les meilleures smokes et flashs sur Mirage",
    thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=640&h=360&fit=crop",
    duration: "22:08",
    views: "312K",
    likes: "18K",
    date: "Il y a 2 jours",
    game: "CS2",
    youtubeId: "ScNTWbKMZX4",
    youtubeUrl: "https://www.youtube.com/watch?v=ScNTWbKMZX4",
    featured: false,
    topic: "FPS"
  },
  {
    id: 6,
    title: "Video Short",
    thumbnail: "",
    duration: "0:00",
    views: "0",
    likes: "0",
    date: "Aujourd'hui",
    game: "PC",
    youtubeId: "",
    youtubeUrl: "#",
    featured: false,
    topic: "FPS",
    localVideoPath: "/videos/video-short.mp4"
  }
];

const VideosSection: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const url = new URL('videos.json', document.baseURI);
        url.searchParams.set('t', Date.now().toString());
        const res = await fetch(url.href);
        if (!res.ok) throw new Error('videos.json unavailable');
        const data = await res.json();
        setVideos(Array.isArray(data.videos) && data.videos.length ? data.videos : fallbackVideos);
      } catch {
        setVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featuredVideo = videos.find(v => v.localVideoPath) || videos.find(v => v.featured) || videos[0];
  const otherVideos = videos.filter(v => !v.featured && !v.localVideoPath);
  const totalPages = Math.ceil(otherVideos.length / VIDEOS_PER_PAGE);
  const currentVideos = otherVideos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE);

  if (loading) return (
    <section id="videos-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-48" />
          <div className="aspect-video bg-gray-800 rounded-2xl" />
        </div>
      </div>
    </section>
  );

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
              Une nouvelle vidéo chaque jour. Abonne-toi pour ne rien manquer.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@InsiderHackGaming"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Featured Video */}
        {featuredVideo && (
          <div className="mb-12">
            <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border border-gray-800">
              {featuredVideo.localVideoPath ? (
                <video controls className="w-full aspect-video">
                  <source src={featuredVideo.localVideoPath} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
                  title={featuredVideo.title}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-gray-300">
              <span className={`px-2 py-1 rounded text-xs font-bold ${gameTagColors[featuredVideo.game] || 'bg-gray-500/20 text-gray-400'}`}>
                {featuredVideo.game}
              </span>
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">Vidéo du jour</span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4" />{featuredVideo.views} vues</span>
              <span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4" />{featuredVideo.likes}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{featuredVideo.date}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-3">{featuredVideo.title}</h3>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {currentVideos.map((video) => (
            <a key={video.id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium">{video.duration}</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${gameTagColors[video.game] || 'bg-gray-500/20 text-gray-400'}`}>{video.game}</span>
                  <span className="text-xs text-gray-500">{video.date}</span>
                </div>
                <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">{video.title}</h4>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{video.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === p ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideosSection;
