import React from 'react';

const videos = [
  {
    id: 1,
    title: "CS2 - Guide complet pour débuter en compétitif",
    youtubeId: "V-_O7nl0Ii0",
    duration: "18:32",
    views: "245K",
    date: "Aujourd'hui"
  },
  {
    id: 2,
    title: "Warzone - Top loadouts et stratégies saison actuelle",
    youtubeId: "9nL_FhWE7SQ",
    duration: "12:15",
    views: "89K",
    date: "Aujourd'hui"
  },
  {
    id: 3,
    title: "Valorant - Améliorer son aim et sa précision",
    youtubeId: "pSBMRJuWBsc",
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
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                style={{ width: '100%', borderRadius: '8px' }}
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