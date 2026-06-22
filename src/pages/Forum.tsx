import React, { useState } from 'react';
import { Hash, MessageCircle, Users, Shield, HelpCircle, Tv, Trophy, Settings, Plus, Search, ChevronDown, Gamepad2, Star, Send } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface ForumSection {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ForumCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  topics: number;
  posts: number;
  sections: ForumSection[];
}

const forumCategories: ForumCategory[] = [
  {
    id: 'bienvenue',
    name: '🎮 Bienvenue & Présentations',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-500',
    topics: 234,
    posts: 1847,
    sections: [
      { id: 'bienvenue', name: 'Charte du serveur', description: 'Les règles à respecter', icon: '📜' },
      { id: 'presentations', name: 'Présentations', description: 'Présente-toi pour obtenir le rôle Novice!', icon: '👋' },
    ]
  },
  {
    id: 'annonces',
    name: '📢 Annonces',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-red-500',
    topics: 5,
    posts: 128,
    sections: [
      { id: 'actus', name: 'Annonces importantes', description: 'Règles, mises à jour', icon: '📌' },
      { id: 'sondages', name: 'Sondages en cours', description: 'Votez et donnez votre avis', icon: '📊' },
    ]
  },
  {
    id: 'jeux',
    name: '🎯 Coins Jeux',
    icon: <Gamepad2 className="w-5 h-5" />,
    color: 'bg-purple-500',
    topics: 567,
    posts: 8934,
    sections: [
      { id: 'cs2', name: 'Counter-Strike 2', description: 'Stratégies, configs, tips', icon: '🔫' },
      { id: 'cod', name: 'Call of Duty', description: 'Loadouts, classes, tactiques', icon: '🎯' },
      { id: 'bf', name: 'Battlefield', description: 'Maps, véhicules, classes', icon: '⚔️' },
      { id: 'valorant', name: 'Valorant', description: 'Agents, stratégies', icon: '🎰' },
      { id: 'apex', name: 'Apex Legends', description: 'Legends, loadouts', icon: '🦊' },
      { id: 'fortnite', name: 'Fortnite', description: 'Builds, strategies', icon: '🏗️' },
      { id: 'autres', name: 'Autres Jeux', description: 'Tous les autres jeux', icon: '🎲' },
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
      { id: 'hors-sujet', name: 'Hors-sujet', description: 'Discussions générales', icon: '☕' },
      { id: 'videos', name: 'Vidéos et diffusions', description: 'Partage tes clips et streams', icon: '🎬' },
      { id: 'tournois', name: 'Tournois et événements', description: 'Compétitions communautaires', icon: '🎪' },
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
      { id: 'aide', name: 'Technique', description: 'Problèmes techniques', icon: '🔧' },
      { id: 'suggestions', name: 'Suggestions', description: 'Améliorations du forum', icon: '💡' },
    ]
  },
];

const ForumPage: React.FC = () => {
  const { user } = useAppContext();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('bienvenue');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresentation, setShowPresentation] = useState(false);
  const [presentation, setPresentation] = useState({
    pseudo: '',
    jeu: '',
    niveau: '',
    pourquoi: ''
  });

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleSubmitPresentation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presentation.pseudo || !presentation.pourquoi) return;
    setShowPresentation(false);
    alert('Ta présentation a été envoyée! Tu as maintenant le rôle Novice!');
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

        {/* Nouveau membre - Présentation obligatoire */}
        {user && (
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Bienvenue {user.user_metadata?.username || 'novice'}!</h3>
                  <p className="text-gray-400">Présente-toi pour obtenir le rôle <span className="text-green-400 font-bold">Novice</span></p>
                </div>
              </div>
              <button
                onClick={() => setShowPresentation(true)}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
              >
                Se présenter
              </button>
            </div>
          </div>
        )}

        {/* Modal de présentation */}
        {showPresentation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowPresentation(false)} />
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">🎮 Présentation</h2>
              <p className="text-gray-400 mb-6">Présente-toi pour obtenir le rôle Novice!</p>
              
              <form onSubmit={handleSubmitPresentation} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ton pseudo en jeu *</label>
                  <input
                    type="text"
                    value={presentation.pseudo}
                    onChange={(e) => setPresentation({...presentation, pseudo: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Ex: FaB34"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Jeu principal</label>
                  <select
                    value={presentation.jeu}
                    onChange={(e) => setPresentation({...presentation, jeu: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Sélectionne un jeu</option>
                    <option value="cs2">Counter-Strike 2</option>
                    <option value="cod">Call of Duty</option>
                    <option value="valorant">Valorant</option>
                    <option value="apex">Apex Legends</option>
                    <option value="fortnite">Fortnite</option>
                    <option value="autres">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ton niveau/rang</label>
                  <input
                    type="text"
                    value={presentation.niveau}
                    onChange={(e) => setPresentation({...presentation, niveau: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Ex: Global Elite, Diamond..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Pourquoi tu joins la communauté? *</label>
                  <textarea
                    value={presentation.pourquoi}
                    onChange={(e) => setPresentation({...presentation, pourquoi: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    rows={3}
                    placeholder="Ex: Apprendre des tricks, trouver des coequipiers..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPresentation(false)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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