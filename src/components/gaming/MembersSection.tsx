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
    name: "Saw341",
    role: "Fondateur & CEO",
    avatar: "SA",
    level: 100,
    games: ["CS2", "Warzone", "BF2042", "Valorant"],
    achievements: 500,
    joinedDate: "2020"
  },
  {
    id: 2,
    name: "InsiderHack",
    role: "Directeur Technique & Coach Principal",
    avatar: "IH",
    level: 99,
    games: ["CS2", "Warzone", "BF2042"],
    achievements: 247,
    joinedDate: "2020"
  },
  {
    id: 3,
    name: "ProGamer_X",
    role: "Coach Élite",
    avatar: "PG",
    level: 85,
    games: ["CS2", "Valorant"],
    achievements: 189,
    joinedDate: "2021"
  },
  {
    id: 4,
    name: "FPS_Master",
    role: "Spécialiste Wallbang",
    avatar: "FM",
    level: 78,
    games: ["CS2", "Rainbow Six"],
    achievements: 156,
    joinedDate: "2022"
  },
  {
    id: 5,
    name: "TacticalNinja",
    role: "Stratège Pro",
    avatar: "TN",
    level: 82,
    games: ["Warzone", "Apex Legends"],
    achievements: 134,
    joinedDate: "2021"
  },
  {
    id: 6,
    name: "BattlefieldKing",
    role: "Expert Battlefield",
    avatar: "BK",
    level: 76,
    games: ["BF2042", "BFV"],
    achievements: 98,
    joinedDate: "2023"
  },
  {
    id: 7,
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
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
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
            <div className="text-2xl font-black text-white mb-1">7</div>
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
              🚀 Recrutement Actif - Rejoignez l'Aventure !
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Nous sommes en pleine expansion et recrutons activement pour renforcer notre équipe ! Si vous êtes passionné par le gaming et souhaitez contribuer à la plus grande communauté FPS francophone, nous avons des postes pour vous.
            </p>

            {/* Job Openings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/30 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🎥</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Créateur Vidéo</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Monteur, réalisateur, voice-over. Créez du contenu vidéo de qualité pour notre chaîne YouTube.
                </p>
                <span className="inline-block px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                  Postes ouverts
                </span>
              </div>

              <div className="bg-black/30 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📰</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Rédacteur News</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Rédigez des articles, couvrez les actualités gaming, partagez vos analyses et découvertes.
                </p>
                <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                  Postes ouverts
                </span>
              </div>

              <div className="bg-black/30 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">💻</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Développeur</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Développeur web, mobile, ou spécialisé dans les outils gaming. Améliorez notre plateforme.
                </p>
                <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                  Postes ouverts
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-black/20 rounded-xl p-6 mb-6">
              <h4 className="text-white font-bold text-lg mb-4">Comment nous contacter ?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://discord.gg/XsHYc4tQpx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <div className="text-left">
                    <div className="text-white font-semibold">Discord</div>
                    <div className="text-indigo-300 text-sm">Rejoins notre serveur</div>
                  </div>
                </a>
                <a
                  href="mailto:insiderhackgaming@gmail.com?subject=Candidature%20-%20Poste%20[Précisez]&body=Bonjour%20l'équipe%20Insider%20Gaming%2C%0A%0AJe%20souhaite%20postuler%20pour%20le%20poste%20de%20[Créateur%20Vidéo%20/%20Rédacteur%20News%20/%20Développeur].%0A%0AMon%20expérience%20:%0A[Parlez-nous%20de%20vous%2C%20vos%20compétences%2C%20vos%20motivations]%0A%0ACordialement%2C%0A[Votre%20nom]"
                  className="flex items-center justify-center gap-3 p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors"
                >
                  <span className="text-2xl">📧</span>
                  <div className="text-left">
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-red-300 text-sm">insiderhackgaming@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              💡 <strong>Envoyez-nous votre candidature</strong> avec votre CV, portfolio, ou exemples de travaux. Nous reviendrons vers vous rapidement !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/XsHYc4tQpx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
              >
                <Users className="w-5 h-5" />
                Postuler sur Discord
              </a>
              <a
                href="mailto:insiderhackgaming@gmail.com?subject=Candidature%20-%20Poste%20[Précisez]&body=Bonjour%20l'équipe%20Insider%20Gaming%2C%0A%0AJe%20souhaite%20postuler%20pour%20le%20poste%20de%20[Créateur%20Vidéo%20/%20Rédacteur%20News%20/%20Développeur].%0A%0AMon%20expérience%20:%0A[Parlez-nous%20de%20vous%2C%20vos%20compétences%2C%20vos%20motivations]%0A%0ACordialement%2C%0A[Votre%20nom]"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
              >
                📧 Envoyer un Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersSection;