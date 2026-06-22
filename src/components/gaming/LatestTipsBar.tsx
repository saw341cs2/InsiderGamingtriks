import React from 'react';
import { Zap } from 'lucide-react';

const tips = [
  'CS2 : Nouvelle smoke lineup pour Inferno',
  'CoD Warzone : Meta loadout saison 3 disponible',
  'Battlefield : Guide véhicules mis à jour',
  'CS2 : Crosshair placement masterclass',
  'CoD : Slide cancel technique 2026',
  'Tournoi communautaire #3 - Inscriptions ouvertes',
];

const LatestTipsBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-900/80 via-red-800/60 to-red-900/80 border-b border-red-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:inline">Dernières Astuces</span>
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...tips, ...tips].map((tip, i) => (
              <span key={i} className="text-xs text-red-100/80 font-medium">
                {tip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestTipsBar;
