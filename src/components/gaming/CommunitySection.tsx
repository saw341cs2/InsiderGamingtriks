import React, { useState } from 'react';
import { MessageCircle, Users, Hash, Send, ThumbsUp, MessageSquare, Pin, ChevronRight, Clock, User } from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  author: string;
  avatar: string;
  game: string;
  replies: number;
  views: number;
  lastActivity: string;
  pinned: boolean;
  category: string;
}

const forumPosts: ForumPost[] = [
  { id: 1, title: 'Meilleure config PC pour CS2 en 2026 ?', author: 'FragMaster', avatar: 'FM', game: 'CS2', replies: 47, views: 1200, lastActivity: 'Il y a 2h', pinned: true, category: 'Hardware' },
  { id: 2, title: 'Tournoi communautaire #3 - Inscriptions', author: 'InsiderHack', avatar: 'IH', game: 'Général', replies: 89, views: 3400, lastActivity: 'Il y a 3h', pinned: true, category: 'Événements' },
  { id: 3, title: 'Warzone : Quelle est votre classe préférée ?', author: 'SniperElite', avatar: 'SE', game: 'CoD', replies: 34, views: 890, lastActivity: 'Il y a 5h', pinned: false, category: 'Discussion' },
  { id: 4, title: 'Bug smoke sur Inferno - quelqu\'un a trouvé ?', author: 'TacticalPro', avatar: 'TP', game: 'CS2', replies: 12, views: 340, lastActivity: 'Il y a 8h', pinned: false, category: 'Bugs' },
  { id: 5, title: 'Battlefield : Les tanks sont-ils trop OP ?', author: 'BFVeteran', avatar: 'BV', game: 'BF', replies: 56, views: 1500, lastActivity: 'Il y a 12h', pinned: false, category: 'Discussion' },
  { id: 6, title: 'Cherche team pour ranked CS2 (Faceit lvl 7+)', author: 'AimBot99', avatar: 'AB', game: 'CS2', replies: 23, views: 670, lastActivity: 'Il y a 1j', pinned: false, category: 'Recrutement' },
  { id: 7, title: 'Guide : Optimiser ses FPS sur Warzone', author: 'TechGuru', avatar: 'TG', game: 'CoD', replies: 41, views: 2100, lastActivity: 'Il y a 1j', pinned: false, category: 'Guides' },
  { id: 8, title: 'Retour sur le Major CS2 - Analyse des finales', author: 'EsportFan', avatar: 'EF', game: 'CS2', replies: 67, views: 2800, lastActivity: 'Il y a 2j', pinned: false, category: 'Esport' },
];

const categoryColors: Record<string, string> = {
  'Hardware': 'text-purple-400 bg-purple-500/10',
  'Événements': 'text-red-400 bg-red-500/10',
  'Discussion': 'text-blue-400 bg-blue-500/10',
  'Bugs': 'text-yellow-400 bg-yellow-500/10',
  'Recrutement': 'text-green-400 bg-green-500/10',
  'Guides': 'text-orange-400 bg-orange-500/10',
  'Esport': 'text-cyan-400 bg-cyan-500/10',
};

const CommunitySection: React.FC = () => {
  const [forumFilter, setForumFilter] = useState<string>('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [localPosts, setLocalPosts] = useState<ForumPost[]>(forumPosts);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const filteredPosts = localPosts.filter((p) => {
    if (forumFilter === 'all') return true;
    if (forumFilter === 'pinned') return p.pinned;
    return p.category === forumFilter;
  });

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;
    const newPost: ForumPost = {
      id: Date.now(),
      title: newPostTitle,
      author: 'Vous',
      avatar: 'VS',
      game: 'Général',
      replies: 0,
      views: 0,
      lastActivity: 'À l\'instant',
      pinned: false,
      category: 'Discussion',
    };
    setLocalPosts([newPost, ...localPosts]);
    setNewPostTitle('');
    setShowNewPostForm(false);
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="community-section" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" />
            Communauté
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Rejoins la <span className="text-red-500">Communauté</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Échange avec d'autres joueurs, partage tes astuces et participe aux événements communautaires.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Discord</h3>
                  <p className="text-indigo-300 text-sm">Insider Gaming</p>
                </div>
              </div>

              {/* Server Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-white">1.2K</div>
                  <div className="text-xs text-indigo-300">Membres</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-green-400">342</div>
                  <div className="text-xs text-indigo-300">En ligne</div>
                </div>
              </div>

              {/* Channels Preview */}
              <div className="space-y-2 mb-6">
                <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-2">Salons populaires</p>
                {[
                  { name: 'général', members: 89 },
                  { name: 'astuces-cs2', members: 45 },
                  { name: 'warzone-tips', members: 67 },
                  { name: 'battlefield', members: 34 },
                  { name: 'recherche-team', members: 28 },
                  { name: 'clips-gaming', members: 56 },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-indigo-400" />
                      <span className="text-gray-300 text-sm">{ch.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ch.members}</span>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center rounded-xl transition-colors"
              >
                Rejoindre le Discord
              </a>
            </div>
          </div>

          {/* Forum */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Forum Header */}
              <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  Forum
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Nouveau Post
                  </button>
                </div>
              </div>

              {/* New Post Form */}
              {showNewPostForm && (
                <form onSubmit={handleNewPost} className="p-5 border-b border-gray-800 bg-gray-900/80">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Titre de votre post..."
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}

              {/* Filter Tabs */}
              <div className="px-5 pt-4 flex items-center gap-2 overflow-x-auto pb-3">
                {['all', 'pinned', 'Discussion', 'Guides', 'Recrutement', 'Esport', 'Bugs'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setForumFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      forumFilter === f
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'Tous' : f === 'pinned' ? 'Épinglés' : f}
                  </button>
                ))}
              </div>

              {/* Posts */}
              <div className="divide-y divide-gray-800/50">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="px-5 py-4 hover:bg-gray-800/20 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {post.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {post.pinned && (
                            <Pin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          <h4 className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors truncate">
                            {post.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${categoryColors[post.category] || 'text-gray-400 bg-gray-800'}`}>
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.lastActivity}
                          </span>
                        </div>
                      </div>

                      {/* Like */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                        className={`p-2 rounded-lg transition-all shrink-0 ${
                          likedPosts.has(post.id)
                            ? 'text-red-500 bg-red-500/10'
                            : 'text-gray-600 hover:text-red-400 hover:bg-red-500/5'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Aucun post dans cette catégorie.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
