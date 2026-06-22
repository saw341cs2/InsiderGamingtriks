import React from "react";

const videos = [
  {
    id: 1,
    title: "CS2 - Guide complet",
    youtubeId: "ScNTWbKMZX4",
    thumbnail: "https://img.youtube.com/vi/ScNTWbKMZX4/hqdefault.jpg",
    duration: "18:32",
    views: "245K",
    date: "Aujourd'hui"
  }
];

function Video() {
  return (
    <div className="video-section">
      <h2>Videos</h2>
      <div className="video-container">
        {videos.map((video) => (
          <div className="video-card" key={video.id}>
            <a href={"https://www.youtube.com/watch?v=" + video.youtubeId} target="_blank" rel="noopener noreferrer">
              <img src={video.thumbnail} alt={video.title} style={{ width: "100%", borderRadius: "8px" }} />
            </a>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Video;