import React, { useState } from 'react';
import { Hash, MessageCircle, Users, Shield, HelpCircle, Tv, Trophy, Settings, Plus, Search, ChevronDown } from 'lucide-react';

interface ForumCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  topics: number;
  posts: number;
  sections: ForumSection[];
}

interface ForumSection {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const forumCategories: ForumCategory[] = [
  {
    id: 'annonces',
    name: '📢 Annonces',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-red-500',
    topics: 5,
    posts: 128,
    sections: [
      { id: 'bienvenue', name: 'Bienvenue sur le forum', description: 'Presentation et regles', icon: '👋' },
      { id: 'actus', name: 'Annonces importantes', description: 'Regles, mises a jour', icon: '📌' },
      { id: 'sondages', name: 'Sondages en cours', description: 'Votez et donnez votre avis', icon: '📊' },
    ]
  },
  {
    id: 'presentations',
    name: '👋 Présentations',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-500',
    topics: 234,
    posts: 1847,
    sections: [
      { id: 'presentations', name: 'Presente-toi ici !', description: 'Fais connaissance avec la communaute', icon: '🎮' },
      { id: 'rejoindre', name: 'Comment rejoindre la communaute', description: 'Guide pour integrer le serveur', icon: '🚪' },
    ]
  },
  {
    id: 'cs2',
    name: '🔫 Counter-Strike 2',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-yellow-500',
    topics: 567,
    posts: 8934,
    sections: [
      { id: 'cs2-general', name: 'Discussions generales', description: 'Tout sur CS2', icon: '💬' },
      { id: 'cs2-strategies', name: 'Strategies et tactiques', description: 'Smokes, flashes, executes', icon: '🧠' },
      { id: 'cs2-config', name: 'Configurations et optimisations', description: 'Settings, binds, FPS', icon: '⚙️' },
      { id: 'cs2-team', name: 'Recherche de coequipiers', description: 'Trouve ton duo ou ta team', icon: '👥' },
    ]
  },
  {
    id: 'cod',
    name: '🎯 Call of Duty',
    icon: <Trophy className="w-5 h-5" />,
    color: 'bg-blue-500',
    topics: 342,
    posts: 4521,
    sections: [
      { id: 'cod-news', name: 'Actualites et mises a jour', description: 'Nouveautes du jeu', icon: '📰' },
      { id: 'cod-classes', name: 'Equipements et classes', description: 'Loadouts preferes', icon: '🎒' },
      { id: 'cod-mp', name: 'Multijoueur / Zone de guerre', description: 'Modes de jeu', icon: '🗺️' },
    ]
  },
  {
    id: 'bf',
    name: '⚔️ Champ de bataille',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-orange-500',
    topics: 189,
    posts: 2341,
    sections: [
      { id: 'bf-maps', name: 'Cartes et modes', description: 'Strategies par map', icon: '🗺️' },
      { id: 'bf-classes', name: 'Classes et vehicules', description: 'Builds et compositions', icon: '🚛' },
      { id: 'bf-events', name: 'Evenements en direct', description: 'Tournois et competitions', icon: '🏆' },
    ]
  },
  {
    id: 'autres',
    name: '🎮 Autres jeux',
    icon: <Tv className="w-5 h-5" />,
    color: 'bg-purple-500',
    topics: 156,
    posts: 987,
    sections: [
      { id: 'autres-libre', name: 'Section libre', description: 'Pour tous les autres jeux', icon: '🎲' },
    ]
  },
  {
    id: 'communaute',
    name: '💬 Communauté',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-pink-500',
    topics: 423,
    posts: 5678,
    sections: [
      { id: 'hors-sujet', name: 'Hors-sujet', description: 'Discussions generales', icon: '☕' },
      { id: 'videos', name: 'Videos et diffusions', description: 'Partage tes clips et streams', icon: '🎬' },
      { id: 'tournois', name: 'Tournois et evenements', description: 'Competitions communautaires', icon: '🎪' },
    ]
  },
  {
    id: 'support',
    name: '🛟 Soutien et aide',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'bg-cyan-500',
    topics: 89,
    posts: 432,
    sections: [
      { id: 'aide', name: 'Techniques de resolution', description: 'Problemes techniques', icon: '🔧' },
      { id: 'suggestions', name: 'Suggestions pour le forum', description: 'Ameliorations', icon: '💡' },
    ]
  },
];

const ForumPage: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('annonces');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center py-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-red-500">Forum</span> Communautaire
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Rejoins les discussions, partage tes tips et connecte avec d'autres joueurs !
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Rules Banner */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-bold text-white">Règles du forum</h3>
              <p className="text-sm text-gray-400">Soyez respectueux, pas de triche, discussions constructives</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {forumCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.sections.length} sections</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-gray-500 hidden sm:block">
                    <span className="text-white">{category.topics} sujets</span> • {category.posts} posts
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Sections */}
              {expandedCategory === category.id && (
                <div className="border-t border-gray-800 bg-gray-900/30">
                  {category.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${index !== category.sections.length - 1 ? 'border-b border-gray-800' : ''}`}
                    >
                      <span className="text-2xl">{section.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{section.name}</h4>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-gray-500 text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>0 sujets</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-white">2,045</div>
            <div className="text-sm text-gray-500">Sujets</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-white">24,868</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-white">1,247</div>
            <div className="text-sm text-gray-500">Membres</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-green-400">342</div>
            <div className="text-sm text-gray-500">En ligne</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;