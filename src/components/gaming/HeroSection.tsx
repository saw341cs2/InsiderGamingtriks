import React from 'react';
import { Crosshair, Play, Trophy, Users } from 'lucide-react';

const impacts = [
  { x: 72, y: 18, delay: 0,   size: 90  },
  { x: 15, y: 55, delay: 1.2, size: 70  },
  { x: 88, y: 65, delay: 2.5, size: 110 },
  { x: 45, y: 30, delay: 3.8, size: 60  },
  { x: 60, y: 78, delay: 5.1, size: 80  },
  { x: 28, y: 20, delay: 6.4, size: 95  },
];

function BulletImpact({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  const cracks = [
    'M0,0 L18,6',   'M0,0 L-16,8',  'M0,0 L4,20',
    'M0,0 L-6,-18', 'M0,0 L20,-4',  'M0,0 L-18,-10',
    'M0,0 L10,16',  'M0,0 L-12,14',
  ];
  return (
    <svg
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        animation: `bulletImpact 4s ease-out ${delay}s infinite`,
        opacity: 0,
        pointerEvents: 'none',
      }}
      viewBox="-25 -25 50 50"
    >
      {/* Point d'impact central */}
      <circle cx="0" cy="0" r="2.5" fill="white" opacity="0.9" />
      <circle cx="0" cy="0" r="5" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6" />
      {/* Fissures */}
      {cracks.map((d, i) => (
        <path key={i} d={d} stroke="white" strokeWidth="0.6" fill="none" opacity="0.5"
          strokeDasharray="22" strokeDashoffset="22"
          style={{ animation: `crackGrow 0.4s ease-out ${delay + i * 0.05}s infinite` }}
        />
      ))}
      {/* Halo rouge */}
      <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

const HeroSection: React.FC = () => {
  return (
    <section id="top" className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gray-950 pt-24">
      <img
        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1800&q=80"
        alt="Setup gaming compétitif"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-gray-950/55 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.32),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.2),transparent_35%)]" />

      {/* Impacts de balle animés */}
      <style>{`
        @keyframes bulletImpact {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.3); }
          8%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          60%  { opacity: 0.8; }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes crackGrow {
          0%   { stroke-dashoffset: 22; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      {impacts.map((imp, i) => <BulletImpact key={i} {...imp} />)}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 backdrop-blur">
            <Crosshair className="h-4 w-4" />
            Astuces FPS, news gaming et communauté
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl lg:text-8xl">
            #Insider
            <span className="block text-red-500">Gaming Tricks</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Progression, configs, smokes, loadouts et actualités pour dominer CS2, Warzone, Battlefield et les autres FPS.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#astuces-section"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-500"
            >
              <Play className="h-5 w-5" />
              Voir les astuces
            </a>
            <a
              href="#videos-section"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/70 px-6 py-3 font-bold text-white transition hover:border-red-500/50 hover:bg-gray-800"
            >
              Regarder les vidéos
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-4 backdrop-blur">
              <Trophy className="mb-2 h-6 w-6 text-red-400" />
              <p className="text-2xl font-black text-white">50+</p>
              <p className="text-sm text-gray-400">Guides gratuits</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-4 backdrop-blur">
              <Users className="mb-2 h-6 w-6 text-red-400" />
              <p className="text-2xl font-black text-white">1.2K</p>
              <p className="text-sm text-gray-400">Membres Discord</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-4 backdrop-blur">
              <Play className="mb-2 h-6 w-6 text-red-400" />
              <p className="text-2xl font-black text-white">Quotidien</p>
              <p className="text-sm text-gray-400">Contenu gaming</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
