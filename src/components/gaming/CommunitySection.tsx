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
  { id: 0, title: '🎮 FAQ – Insider Gaming Tricks', author: 'InsiderHack', avatar: 'IH', game: 'Général', replies: 0, views: 0, lastActivity: 'Il y a 1j', pinned: true, category: 'Événements' },
  { id: 1, title: '📢 Bienvenue sur le forum communautaire !', author: 'InsiderHack', avatar: 'IH', game: 'Général', replies: 12, views: 456, lastActivity: 'Il y a 2h', pinned: false, category: 'Discussion' },
  { id: 2, title: '🚀 RECRUTEMENT ACTIF - Rejoins l\'Équipe ! 🎯', author: 'Saw341', avatar: 'SA', game: 'Général', replies: 8, views: 234, lastActivity: 'Il y a 30min', pinned: true, category: 'Recrutement' },
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
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

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

  const getPostContent = (postId: number) => {
    if (postId === 2) { // Post de recrutement
      return {
        author: 'Saw341',
        avatar: 'SA',
        title: '🚀 RECRUTEMENT ACTIF - Rejoins l\'Équipe ! 🎯',
        content: `
<div class="space-y-4">
  <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
    <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
      🎉 Recrutement Actif ! 🎉
    </h3>
    <p class="text-gray-300 text-lg mb-4">
      Salut la communauté ! 👋 C'est <strong class="text-green-400">Saw341</strong>, le fondateur d'Insider Gaming Tricks ! 
      Nous sommes en pleine expansion et nous cherchons des talents pour rejoindre notre équipe ! 🚀
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
      <div class="text-4xl mb-2">🎥</div>
      <h4 class="text-white font-bold text-lg mb-2">Créateur Vidéo</h4>
      <p class="text-gray-400 text-sm">Montage, réalisation, voice-over pour nos vidéos YouTube !</p>
    </div>
    <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-center">
      <div class="text-4xl mb-2">📰</div>
      <h4 class="text-white font-bold text-lg mb-2">Rédacteur News</h4>
      <p class="text-gray-400 text-sm">Rédaction d'articles, news gaming, analyses et découvertes !</p>
    </div>
    <div class="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
      <div class="text-4xl mb-2">💻</div>
      <h4 class="text-white font-bold text-lg mb-2">Développeur</h4>
      <p class="text-gray-400 text-sm">Développement web, mobile, outils gaming pour la communauté !</p>
    </div>
  </div>

  <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
    <h4 class="text-yellow-400 font-bold text-xl mb-4 flex items-center gap-2">
      ⚠️ Règles importantes ⚠️
    </h4>
    <ul class="text-gray-300 space-y-2">
      <li>✅ <strong>Âge minimum :</strong> 16 ans (pour les mineurs, accord parental requis)</li>
      <li>✅ <strong>Expérience :</strong> Pas obligatoire, motivation et passion du gaming suffisent !</li>
      <li>✅ <strong>Disponibilité :</strong> Au moins 5-10h/semaine selon le poste</li>
      <li>✅ <strong>Équipe :</strong> Travail en équipe, respect mutuel, bonne ambiance ! 😊</li>
      <li>✅ <strong>Confidentialité :</strong> Respect de la vie privée de chacun</li>
    </ul>
  </div>

  <div class="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
    <h4 class="text-indigo-400 font-bold text-xl mb-4 flex items-center gap-2">
      📧 Comment postuler ? 📧
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-3xl mb-2">💬</div>
        <p class="text-white font-semibold">Sur le Forum</p>
        <p class="text-gray-400 text-sm">Réponds à ce post avec ta candidature !</p>
      </div>
      <div class="text-center">
        <div class="text-3xl mb-2">📧</div>
        <p class="text-white font-semibold">Par Email</p>
        <p class="text-indigo-300 font-medium">insiderhackgaming@gmail.com</p>
      </div>
    </div>
  </div>

  <div class="bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
    <h4 class="text-pink-400 font-bold text-xl mb-4 flex items-center gap-2">
      📝 Ce qu'on attend de toi 📝
    </h4>
    <div class="text-gray-300 space-y-2">
      <p><strong>Ton pseudo :</strong> [Ton pseudo gaming]</p>
      <p><strong>Ton âge :</strong> [Ton âge]</p>
      <p><strong>Tes jeux préférés :</strong> [CS2, Valorant, etc.]</p>
      <p><strong>Ton expérience :</strong> [Ce que tu sais faire]</p>
      <p><strong>Tes motivations :</strong> [Pourquoi tu veux nous rejoindre ?]</p>
      <p><strong>Tes disponibilités :</strong> [Quand tu es dispo]</p>
      <p><strong>Portfolio (optionnel) :</strong> [Liens vers tes travaux]</p>
    </div>
  </div>

  <div class="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
    <p class="text-white text-xl font-bold mb-2">On a hâte de te rencontrer ! 🎮✨</p>
    <p class="text-gray-400">L'équipe Insider Gaming Tricks 💜</p>
  </div>
</div>
        `,
        date: 'Aujourd\'hui à 14:30'
      };
    }
    return null;
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
                  <p className="text-indigo-300 text-sm">Communauté FPS</p>
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
                href="https://discord.gg/XsHYc4tQpx"
                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center rounded-xl transition-colors"
                target="_blank"
                rel="noopener noreferrer"
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
                  post.id === 0 ? (
                  <div key={post.id} className="p-5 bg-gradient-to-r from-gray-900 to-gray-800/50 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="w-4 h-4 text-red-500" />
                      <span className="text-red-400 text-xs font-bold">POST IMPORTANT</span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-4">🎮 FAQ – Insider Gaming Tricks</h3>
                    
                    <div className="space-y-4 text-sm text-gray-300">
                      <div>
                        <h4 className="text-white font-semibold mb-1">❓ Qu'est-ce que Insider Gaming Tricks ?</h4>
                        <p>Insider Gaming Tricks est un site dédié aux jeux vidéo, principalement les FPS comme Counter-Strike, Battlefield, Call of Duty. Tu y trouveras les dernières actualités, des astuces exclusives, et du contenu vidéo pour améliorer ton gameplay.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-1">🎯 Que propose le site ?</h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li><strong className="text-white">Astuces</strong> : guides et techniques pour progresser</li>
                          <li><strong className="text-white">Vidéos</strong> : une nouvelle vidéo chaque semaine</li>
                          <li><strong className="text-white">Communauté</strong> : Discord + forum pour échanger</li>
                          <li><strong className="text-white">Premium</strong> : contenu exclusif (gratuit et payant)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-1">📺 Fréquence de publication</h4>
                        <p>Une vidéo par semaine + des mises à jour régulières avec de nouvelles astuces.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-1">💡 Astuces gratuites ?</h4>
                        <p>Oui ! Une partie est gratuite, certaines techniques avancées sont premium.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-1">💬 Rejoindre la communauté</h4>
                        <p>Via le Discord (à droite) et bientôt sur le forum.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-1">📢 Nous suivre</h4>
                        <a href="https://www.youtube.com/@InsiderHackGaming" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">YouTube : @InsiderHackGaming</a>
                      </div>
                    </div>
                  </div>
                ) : post.id === 2 ? (
                  <div key={post.id} className="p-5 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="w-4 h-4 text-green-500" />
                      <span className="text-green-400 text-xs font-bold">RECRUTEMENT ACTIF</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        SA
                      </div>
                      <div>
                        <p className="text-white font-semibold">Saw341</p>
                        <p className="text-gray-400 text-sm">Fondateur • Aujourd'hui à 14:30</p>
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-6">🚀 RECRUTEMENT ACTIF - Rejoins l'Équipe ! 🎯</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                          🎉 Recrutement Actif ! 🎉
                        </h3>
                        <p className="text-gray-300 text-lg mb-4">
                          Salut la communauté ! 👋 C'est <strong className="text-green-400">Saw341</strong>, le fondateur d'Insider Gaming Tricks ! 
                          Nous sommes en pleine expansion et nous cherchons des talents pour rejoindre notre équipe ! 🚀
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                          <div className="text-4xl mb-2">🎥</div>
                          <h4 className="text-white font-bold text-lg mb-2">Créateur Vidéo</h4>
                          <p className="text-gray-400 text-sm">Montage, réalisation, voice-over pour nos vidéos YouTube !</p>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-center">
                          <div className="text-4xl mb-2">📰</div>
                          <h4 className="text-white font-bold text-lg mb-2">Rédacteur News</h4>
                          <p className="text-gray-400 text-sm">Rédaction d'articles, news gaming, analyses et découvertes !</p>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
                          <div className="text-4xl mb-2">💻</div>
                          <h4 className="text-white font-bold text-lg mb-2">Développeur</h4>
                          <p className="text-gray-400 text-sm">Développement web, mobile, outils gaming pour la communauté !</p>
                        </div>
                      </div>

                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
                        <h4 className="text-yellow-400 font-bold text-xl mb-4 flex items-center gap-2">
                          ⚠️ Règles importantes ⚠️
                        </h4>
                        <ul className="text-gray-300 space-y-2">
                          <li>✅ <strong>Âge minimum :</strong> 16 ans (pour les mineurs, accord parental requis)</li>
                          <li>✅ <strong>Expérience :</strong> Pas obligatoire, motivation et passion du gaming suffisent !</li>
                          <li>✅ <strong>Disponibilité :</strong> Au moins 5-10h/semaine selon le poste</li>
                          <li>✅ <strong>Équipe :</strong> Travail en équipe, respect mutuel, bonne ambiance ! 😊</li>
                          <li>✅ <strong>Confidentialité :</strong> Respect de la vie privée de chacun</li>
                        </ul>
                      </div>

                      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                        <h4 className="text-indigo-400 font-bold text-xl mb-4 flex items-center gap-2">
                          📧 Comment postuler ? 📧
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-white font-semibold">Sur le Forum</p>
                            <p className="text-gray-400 text-sm">Réponds à ce post avec ta candidature !</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-2">📧</div>
                            <p className="text-white font-semibold">Par Email</p>
                            <p className="text-indigo-300 font-medium">insiderhackgaming@gmail.com</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
                        <h4 className="text-pink-400 font-bold text-xl mb-4 flex items-center gap-2">
                          📝 Ce qu'on attend de toi 📝
                        </h4>
                        <div className="text-gray-300 space-y-2">
                          <p><strong>Ton pseudo :</strong> [Ton pseudo gaming]</p>
                          <p><strong>Ton âge :</strong> [Ton âge]</p>
                          <p><strong>Tes jeux préférés :</strong> [CS2, Valorant, etc.]</p>
                          <p><strong>Ton expérience :</strong> [Ce que tu sais faire]</p>
                          <p><strong>Tes motivations :</strong> [Pourquoi tu veux nous rejoindre ?]</p>
                          <p><strong>Tes disponibilités :</strong> [Quand tu es dispo]</p>
                          <p><strong>Portfolio (optionnel) :</strong> [Liens vers tes travaux]</p>
                        </div>
                      </div>

                      <div className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
                        <p className="text-white text-xl font-bold mb-2">On a hâte de te rencontrer ! 🎮✨</p>
                        <p className="text-gray-400">L'équipe Insider Gaming Tricks 💜</p>
                      </div>
                    </div>
                  </div>
                ) : (
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
                            : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                      <ThumbsUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )))}
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
