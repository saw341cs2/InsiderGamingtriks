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
  // Fissures longues avec ramifications — style vrai impact de balle sur verre
  const cracks = [
    'M0,0 L24,3 L32,8 M24,3 L26,10',
    'M0,0 L-22,6 L-30,4 M-22,6 L-20,14',
    'M0,0 L4,26 L2,34 M4,26 L10,28',
    'M0,0 L-6,-24 L-4,-32 M-6,-24 L-14,-22',
    'M0,0 L26,-5 L34,-10 M26,-5 L28,4',
    'M0,0 L-24,-6 L-32,-2 M-24,-6 L-22,-14',
    'M0,0 L12,22 L10,30 M12,22 L20,20',
    'M0,0 L-16,20 L-22,26 M-16,20 L-10,26',
    'M0,0 L20,-18 L26,-24 M20,-18 L26,-12',
    'M0,0 L-20,-16 L-28,-20 M-20,-16 L-16,-24',
    'M0,0 L8,-26 L14,-30',
    'M0,0 L-10,24 L-8,32',
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
        animation: `bulletImpact 5s ease-out ${delay}s infinite`,
        opacity: 0,
        pointerEvents: 'none',
      }}
      viewBox="-40 -40 80 80"
    >
      {/* Fissures */}
      {cracks.map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="70" strokeDashoffset="70"
          style={{ animation: `crackGrow 0.6s ease-out ${delay + i * 0.05}s forwards` }}
        />
      ))}
      {/* Trou central noir cerclé blanc — vrai impact de balle */}
      <circle cx="0" cy="0" r="7" fill="black" opacity="0.9" />
      <circle cx="0" cy="0" r="7" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="4" fill="black" />
      <circle cx="0" cy="0" r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
      {/* Anneau de choc */}
      <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
      <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth="0.5" />
      {/* Micro-éclats autour du trou */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <circle key={i}
          cx={Math.cos(angle * Math.PI / 180) * 9}
          cy={Math.sin(angle * Math.PI / 180) * 9}
          r="0.9" fill="white" opacity="0.7"
        />
      ))}
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
