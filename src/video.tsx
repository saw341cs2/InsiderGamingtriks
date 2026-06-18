import React from 'react';

const videos = [
  {
    id: 1,
    title: "CS2 - Guide complet pour débuter en compétitif",
    youtubeId: "ScNTWbKMZX4",
    thumbnail: "https://img.youtube.com/vi/ScNTWbKMZX4/hqdefault.jpg",
    duration: "18:32",
    views: "245K",
    date: "Aujourd'hui"
  },
  {
    id: 2,
    title: "Warzone - Top loadouts et stratégies saison actuelle",
    youtubeId: "ScNTWbKMZX4",
    thumbnail: "https://img.youtube.com/vi/ScNTWbKMZX4/hqdefault.jpg",
    duration: "12:15",
    views: "89K",
    date: "Aujourd'hui"
  },
  {
    id: 3,
    title: "Valorant - Améliorer son aim et sa précision",
    youtubeId: "ScNTWbKMZX4",
    thumbnail: "https://img.youtube.com/vi/ScNTWbKMZX4/hqdefault.jpg",
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
            <a
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