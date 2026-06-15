import React from 'react';

function Video() {
  return (
    <div className="video-section">
      <h2>Vidéos</h2>
      <h3>Dernières Vidéos</h3>
      <p>Une nouvelle vidéo chaque jour. Abonne-toi pour ne rien manquer.</p>

      <div className="video-container">
        
        {/* Vidéo 1 : FPS */}
        <div className="video-card">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Vidéo FPS" 
            allowFullScreen>
          </iframe>
          <p>🎮 Gameplay FPS</p>
        </div>

        {/* Vidéo 2 : Team / Joueur Pro */}
        <div className="video-card">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Vidéo Joueur Pro" 
            allowFullScreen>
          </iframe>
          <p>🏆 Team & Joueur Pro</p>
        </div>

        {/* Vidéo 3 : Optimisation PC */}
        <div className="video-card">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Vidéo Optimisation" 
            allowFullScreen>
          </iframe>
          <p>💻 Optimisation PC</p>
        </div>

      </div>
    </div>
  );
}

export default Video;
