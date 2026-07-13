import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Hash, MessageSquare, Pin, Clock, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LivePost {
  id: string;
  title: string;
  author_name: string;
  author_avatar: string | null;
  category: string;
  pinned: boolean;
  created_at: string;
  likes_count: number;
  replies_count: number;
}

const categoryColors: Record<string, string> = {
  'Hardware': 'text-purple-400 bg-purple-500/10',
  'Événements': 'text-red-400 bg-red-500/10',
  'Discussion': 'text-blue-400 bg-blue-500/10',
  'Bugs': 'text-yellow-400 bg-yellow-500/10',
  'Recrutement': 'text-green-400 bg-green-500/10',
  'Guides': 'text-orange-400 bg-orange-500/10',
  'Esport': 'text-cyan-400 bg-cyan-500/10',
};

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ < 30) return `il y a ${diffJ}j`;
  return date.toLocaleDateString('fr-FR');
}

function initialsOf(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

const CommunitySection: React.FC = () => {
  const navigate = useNavigate();
  const [livePosts, setLivePosts] = useState<LivePost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const loadLatestPosts = async () => {
      const { data: postsData } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(4);
      const { data: likesData } = await supabase.from('forum_likes').select('post_id');
      const { data: repliesData } = await supabase.from('forum_replies').select('post_id');

      const enriched: LivePost[] = (postsData || []).map((p: any) => ({
        ...p,
        likes_count: (likesData || []).filter((l: any) => l.post_id === p.id).length,
        replies_count: (repliesData || []).filter((r: any) => r.post_id === p.id).length,
      }));
      setLivePosts(enriched);
      setLoadingPosts(false);
    };
    loadLatestPosts();
  }, []);

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

              <a href="https://discord.gg/rnh32gTDjp" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center rounded-xl transition-colors" target="_blank" rel="noopener noreferrer">
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
                <button onClick={() => navigate('/forum')} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors">
                  Nouveau sujet
                </button>
              </div>

              {/* FAQ épinglée */}
              <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800/50 border-b border-red-500/20">
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
                    <p>Via le Discord (à droite) et sur le forum.</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-1">📢 Nous suivre</h4>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/@InsiderHackGaming" target="_blank" rel="noopener noreferrer" className="block text-red-400 hover:text-red-300">▶️ YouTube : @InsiderHackGaming</a>
                      <a href="https://discord.gg/rnh32gTDjp" target="_blank" rel="noopener noreferrer" className="block text-indigo-400 hover:text-indigo-300">💬 Discord : Rejoindre le serveur</a>
                      <a href="https://x.com/InsiderGamingTr" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">🐦 X (Twitter) : @InsiderGamingTr</a>
                      <a href="https://www.tiktok.com/@insidergamingtricks2" target="_blank" rel="noopener noreferrer" className="block text-pink-400 hover:text-pink-300">🎵 TikTok : @insidergamingtricks2</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recrutement épinglé */}
              <div className="p-5 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b border-green-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Pin className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-xs font-bold">RECRUTEMENT ACTIF</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    SA
                  </div>
                  <div>
                    <p className="text-white font-semibold">Saw341</p>
                    <p className="text-gray-400 text-sm">Fondateur</p>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">🚀 RECRUTEMENT ACTIF - Rejoins l'Équipe ! 🎯</h3>
                <p className="text-gray-300 text-sm mb-3">
                  On cherche des créateurs vidéo, des rédacteurs news et des développeurs pour rejoindre l'équipe.
                </p>
                <p className="text-gray-400 text-sm">
                  Candidature par email : <span className="text-indigo-300 font-medium">insiderhackgaming@gmail.com</span> ou en réponse sur le forum.
                </p>
              </div>

              {/* Derniers sujets réels */}
              <div className="p-5 border-b border-gray-800">
                <h4 className="text-white font-semibold text-sm mb-1">Derniers sujets des membres</h4>
                <p className="text-gray-500 text-xs">Ce que la communauté publie en ce moment, en direct.</p>
              </div>

              <div className="divide-y divide-gray-800/50">
                {loadingPosts && <div className="p-6 text-center text-gray-500 text-sm">Chargement...</div>}

                {!loadingPosts && livePosts.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Aucun sujet publié pour l'instant. Sois le premier sur le forum !
                  </div>
                )}

                {!loadingPosts && livePosts.map((post) => (
                  <div key={post.id} onClick={() => navigate('/forum')} className="px-5 py-4 hover:bg-gray-800/20 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                        {post.author_avatar ? <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" /> : initialsOf(post.author_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {post.pinned && <Pin className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                          <h4 className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors truncate">{post.title}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author_name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${categoryColors[post.category] || 'text-gray-400 bg-gray-800'}`}>{post.category}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.replies_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelative(post.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4">
                <button onClick={() => navigate('/forum')} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                  Voir le forum complet
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
