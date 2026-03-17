import React, { useState } from 'react';
import { Crosshair, Target, Shield, Zap, ChevronRight, BarChart3 } from 'lucide-react';

interface Weapon {
  id: number;
  name: string;
  game: string;
  type: string;
  image: string;
  damage: number;
  accuracy: number;
  fireRate: number;
  mobility: number;
  difficulty: string;
  description: string;
}

const weapons: Weapon[] = [
  { id: 1, name: 'AK-47', game: 'CS2', type: 'Fusil d\'assaut', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=200&fit=crop', damage: 90, accuracy: 65, fireRate: 70, mobility: 60, difficulty: 'Avancé', description: 'Le roi des fusils. Maîtrise son spray pour des headshots dévastateurs.' },
  { id: 2, name: 'AWP', game: 'CS2', type: 'Sniper', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=200&fit=crop', damage: 100, accuracy: 95, fireRate: 20, mobility: 30, difficulty: 'Expert', description: 'Un tir, un kill. L\'arme ultime pour les joueurs patients et précis.' },
  { id: 3, name: 'M4A4', game: 'CS2', type: 'Fusil d\'assaut', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', damage: 75, accuracy: 75, fireRate: 80, mobility: 65, difficulty: 'Intermédiaire', description: 'Polyvalent et fiable. Le choix par défaut des CT en compétitif.' },
  { id: 4, name: 'MP7', game: 'CoD', type: 'SMG', image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&h=200&fit=crop', damage: 55, accuracy: 60, fireRate: 95, mobility: 90, difficulty: 'Débutant', description: 'Cadence de tir élevée et mobilité maximale pour le CQB.' },
  { id: 5, name: 'HDR', game: 'CoD', type: 'Sniper', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=200&fit=crop', damage: 95, accuracy: 90, fireRate: 15, mobility: 25, difficulty: 'Avancé', description: 'Le sniper longue portée de Warzone. Zéro drop à 200m.' },
  { id: 6, name: 'LCMG', game: 'BF', type: 'Mitrailleuse', image: 'https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=300&h=200&fit=crop', damage: 70, accuracy: 50, fireRate: 85, mobility: 35, difficulty: 'Intermédiaire', description: 'Suppression massive. Idéale pour couvrir les objectifs.' },
];

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
  </div>
);

const WeaponGuidesSection: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [gameFilter, setGameFilter] = useState<string>('all');

  const filtered = weapons.filter((w) => gameFilter === 'all' || w.game === gameFilter);

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            Arsenal
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Guides <span className="text-red-500">d'Armes</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Statistiques détaillées, spray patterns et conseils pour chaque arme.
          </p>
        </div>

        {/* Game Filter */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['all', 'CS2', 'CoD', 'BF'].map((g) => (
            <button
              key={g}
              onClick={() => setGameFilter(g)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                gameFilter === g
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {g === 'all' ? 'Toutes' : g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((weapon) => (
            <div
              key={weapon.id}
              onClick={() => setSelectedWeapon(selectedWeapon?.id === weapon.id ? null : weapon)}
              className={`group bg-gray-900/50 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedWeapon?.id === weapon.id ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-gray-800 hover:border-red-500/30'
              }`}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={weapon.image} alt={weapon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-lg">{weapon.name}</h3>
                  <p className="text-gray-400 text-xs">{weapon.game} · {weapon.type}</p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-400 text-sm mb-4">{weapon.description}</p>
                <div className="space-y-2">
                  <StatBar label="Dégâts" value={weapon.damage} color="bg-red-500" />
                  <StatBar label="Précision" value={weapon.accuracy} color="bg-blue-500" />
                  <StatBar label="Cadence" value={weapon.fireRate} color="bg-yellow-500" />
                  <StatBar label="Mobilité" value={weapon.mobility} color="bg-green-500" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Difficulté: <span className="text-white font-semibold">{weapon.difficulty}</span></span>
                  <span className="text-red-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Voir guide <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeaponGuidesSection;
