import React from 'react';

const videos = [
  {
    id: 1,
    title: "CS2 - Guide complet pour débuter en compétitif",
    youtubeId: "V-_O7nl0Ii0",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop",
    duration: "18:32",
    views: "245K",
    date: "Aujourd'hui"
  },
  {
    id: 2,
    title: "Warzone - Top loadouts et stratégies saison actuelle",
    youtubeId: "9nL_FhWE7SQ",
    thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=640&h=360&fit=crop",
    duration: "12:15",
    views: "89K",
    date: "Aujourd'hui"
  },
  {
    id: 3,
    title: "Valorant - Améliorer son aim et sa précision",
    youtubeId: "pSBMRJuWBsc",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop",
    duration: "15:20",
    views: "156K",
    date: "Hier"
  }
];

function Video() {
  return (
    <div className="video-section">
      <h2>Vidéos</h2>
      <h3>Dernières Vidéos</h3>
      <p>Une nouvelle vidéo chaque jour. Abonne-toi pour ne rien manquer.</p>

      <div className="video-container">
        {videos.map((video) => (
          <div className="video-card" key={video.id}>
            
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
              />
            </a>
            <p>{video.title}</p>
            <span>{video.duration} · {video.views} vues · {video.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Video;