import React from 'react';
import { ChevronDown, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const scrollToContent = () => {
    const el = document.getElementById('games-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative">
      {/* Banner Image - Full Width, No Text */}
      <div className="w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] overflow-hidden">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/698a3e1733669e4bf0335d17_1770667565190_18673510.jpg"
          alt="Insider Gaming Tricks Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Below Banner */}
      <div className="relative bg-gradient-to-b from-black via-gray-950 to-gray-950">
        {/* Red glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Nouvelle vidéo chaque semaine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Domine le <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Champ de Bataille</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Astuces exclusives, guides avancés et stratégies de pro pour 
            <span className="text-white font-semibold"> Counter-Strike</span>,
            <span className="text-white font-semibold"> Battlefield</span> et
            <span className="text-white font-semibold"> Call of Duty</span>.
            Rejoins la communauté et passe au niveau supérieur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('astuces')}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-xl shadow-red-900/40 hover:shadow-red-800/60 flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Découvrir les Astuces
            </button>
            <a
              href="https://www.youtube.com/@InsiderHackGaming"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Voir la Chaîne YouTube
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '150+', label: 'Astuces' },
              { value: '3', label: 'Jeux FPS' },
              { value: '1K+', label: 'Membres' },
              { value: '52', label: 'Vidéos/An' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="text-2xl md:text-3xl font-black text-red-500">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToContent}
            className="mt-12 mx-auto flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors animate-bounce"
          >
            <span className="text-xs uppercase tracking-widest mb-1">Explorer</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
