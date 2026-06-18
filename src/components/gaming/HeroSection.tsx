import React from 'react';
import { Crosshair, Play, Trophy, Users } from 'lucide-react';

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
