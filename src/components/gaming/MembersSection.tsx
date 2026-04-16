import React from 'react';
import { Crown, Star, Trophy, Users } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  level: number;
  games: string[];
  achievements: number;
  joinedDate: string;
}

const members: Member[] = [
  {
    id: 1,
    name: "InsiderHack",
    role: "Fondateur & Coach Principal",
    avatar: "IH",
    level: 99,
    games: ["CS2", "Warzone", "BF2042"],
    achievements: 247,
    joinedDate: "2020"
  },
  {
    id: 2,
    name: "ProGamer_X",
    role: "Coach Élite",
    avatar: "PG",
    level: 85,
    games: ["CS2", "Valorant"],
    achievements: 189,
    joinedDate: "2021"
  },
  {
    id: 3,
    name: "FPS_Master",
    role: "Spécialiste Wallbang",
    avatar: "FM",
    level: 78,
    games: ["CS2", "Rainbow Six"],
    achievements: 156,
    joinedDate: "2022"
  },
  {
    id: 4,
    name: "TacticalNinja",
    role: "Stratège Pro",
    avatar: "TN",
    level: 82,
    games: ["Warzone", "Apex Legends"],
    achievements: 134,
    joinedDate: "2021"
  },
  {
    id: 5,
    name: "BattlefieldKing",
    role: "Expert Battlefield",
    avatar: "BK",
    level: 76,
    games: ["BF2042", "BFV"],
    achievements: 98,
    joinedDate: "2023"
  },
  {
    id: 6,
    name: "AimGod",
    role: "Coach Aim",
    avatar: "AG",
    level: 88,
    games: ["CS2", "Valorant", "Overwatch"],
    achievements: 203,
    joinedDate: "2020"
  }
];

const MembersSection: React.FC = () => {
  return (
    <section id="membres" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" />
            Équipe
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Notre <span className="text-indigo-500">Équipe</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez les membres de notre équipe d'experts qui vous accompagnent dans votre progression gaming.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 text-center">
            <Crown className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <div className="text-2xl font-black text-white mb-1">6</div>
            <div className="text-sm text-indigo-300">Experts</div>
          </div>
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-2xl p-6 text-center">
            <Trophy className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-black text-white mb-1">934</div>
            <div className="text-sm text-red-300">Victoires</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-2xl p-6 text-center">
            <Star className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-black text-white mb-1">4.9/5</div>
            <div className="text-sm text-green-300">Note Moyenne</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/20 rounded-2xl p-6 text-center">
            <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-black text-white mb-1">1200+</div>
            <div className="text-sm text-yellow-300">Membres Aidés</div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/80 transition-all duration-300 group">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-indigo-400 text-sm">{member.role}</p>
                </div>
              </div>

              {/* Level & Achievements */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">Niveau {member.level}</div>
                  <div className="text-xs text-gray-400">Expertise</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400">{member.achievements}</div>
                  <div className="text-xs text-gray-400">Trophées</div>
                </div>
              </div>

              {/* Games */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Spécialités :</p>
                <div className="flex flex-wrap gap-2">
                  {member.games.map((game) => (
                    <span key={game} className="px-2 py-1 bg-indigo-600/20 text-indigo-300 text-xs rounded-full">
                      {game}
                    </span>
                  ))}
                </div>
              </div>

              {/* Joined Date */}
              <div className="text-xs text-gray-500">
                Membre depuis {member.joinedDate}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Rejoignez Notre Équipe
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Vous êtes un joueur expérimenté et passionné ? Vous souhaitez partager vos connaissances et aider d'autres gamers à progresser ?
            </p>
            <a
              href="https://discord.gg/XsHYc4tQpx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
            >
              <Users className="w-5 h-5" />
              Postuler sur Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersSection;