import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Pin, Clock, User, Heart, Send, ArrowLeft, Shield, X } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface ForumPostRow {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  created_at: string;
  likes_count: number;
  liked_by_me: boolean;
  replies_count: number;
}

interface ForumReplyRow {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
}

const CATEGORIES = ['Discussion', 'Recrutement', 'Guides', 'Bugs', 'Esport', 'Hardware', 'Événements'];

const categoryColors: Record<string, string> = {
  'Hardware': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Événements': 'text-red-400 bg-red-500/10 border-red-500/20',
  'Discussion': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Bugs': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Recrutement': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Guides': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Esport': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
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

const ForumPage: React.FC = () => {
  const { user, username } = useAppContext();
  const [posts, setPosts] = useState<ForumPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Discussion');
  const [posting, setPosting] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [replies, setReplies] = useState<ForumReplyRow[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadPosts = async () => {
    setLoading(true);
    const { data: postsData, error } = await supabase.from('forum_posts').select('*').order('pinned', { ascending: false }).order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Erreur', description: "Impossible de charger le forum", variant: 'destructive' });
      setLoading(false);
      return;
    }
    const { data: likesData } = await supabase.from('forum_likes').select('post_id, user_id');
    const { data: repliesData } = await supabase.from('forum_replies').select('post_id');

    const enriched: ForumPostRow[] = (postsData || []).map((p: any) => {
      const postLikes = (likesData || []).filter((l: any) => l.post_id === p.id);
      return {
        ...p,
        likes_count: postLikes.length,
        liked_by_me: user ? postLikes.some((l: any) => l.user_id === user.id) : false,
        replies_count: (repliesData || []).filter((r: any) => r.post_id === p.id).length,
      };
    });
    setPosts(enriched);
    setLoading(false);
  };

  const getAuthorInfo = () => {
    const name = username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Membre');
    const avatarUrl = user?.user_metadata?.avatarUrl || null;
    return { name, avatarUrl };
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    const { name, avatarUrl } = getAuthorInfo();
    const { error } = await supabase.from('forum_posts').insert({
      author_id: user.id,
      author_name: name,
      author_avatar: avatarUrl,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
    });
    setPosting(false);
    if (error) {
      toast({ title: 'Erreur', description: "Le sujet n'a pas pu être publié", variant: 'destructive' });
      return;
    }
    setNewTitle('');
    setNewContent('');
    setShowNewPostForm(false);
    toast({ title: 'Sujet publié !', description: 'Ton message est maintenant visible par tous.' });
    loadPosts();
  };

  const toggleLike = async (post: ForumPostRow) => {
    if (!user) {
      toast({ title: 'Connecte-toi', description: 'Tu dois avoir un compte pour liker un sujet.' });
      return;
    }
    if (post.liked_by_me) {
      await supabase.from('forum_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
    } else {
      await supabase.from('forum_likes').insert({ post_id: post.id, user_id: user.id });
    }
    loadPosts();
  };

  const openPost = async (id: string) => {
    setSelectedPostId(id);
    setLoadingReplies(true);
    const { data } = await supabase.from('forum_replies').select('*').eq('post_id', id).order('created_at', { ascending: true });
    setReplies(data || []);
    setLoadingReplies(false);
  };

  const closePost = () => {
    setSelectedPostId(null);
    setReplies([]);
    setNewReply('');
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPostId || !newReply.trim()) return;
    setSendingReply(true);
    const { name, avatarUrl } = getAuthorInfo();
    const { error } = await supabase.from('forum_replies').insert({
      post_id: selectedPostId,
      author_id: user.id,
      author_name: name,
      author_avatar: avatarUrl,
      content: newReply.trim(),
    });
    setSendingReply(false);
    if (error) {
      toast({ title: 'Erreur', description: "La réponse n'a pas pu être envoyée", variant: 'destructive' });
      return;
    }
    setNewReply('');
    openPost(selectedPostId);
    loadPosts();
  };

  const filteredPosts = posts.filter((p) => {
    const matchesFilter = filter === 'all' ? true : filter === 'pinned' ? p.pinned : p.category === filter;
    const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedPost = posts.find((p) => p.id === selectedPostId) || null;

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-red-500">Forum</span> Communautaire
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Rejoins les discussions, partage tes tips et connecte avec d'autres joueurs !
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-bold text-white">Règles du forum</h3>
              <p className="text-sm text-gray-400">Soyez respectueux, pas de triche, discussions constructives</p>
            </div>
          </div>
        </div>

        {selectedPost ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <button onClick={closePost} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour au forum
              </button>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {selectedPost.pinned && <Pin className="w-4 h-4 text-red-500" />}
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${categoryColors[selectedPost.category] || 'text-gray-400 bg-gray-800 border-gray-700'}`}>
                  {selectedPost.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{selectedPost.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                  {selectedPost.author_avatar ? <img src={selectedPost.author_avatar} alt={selectedPost.author_name} className="w-full h-full object-cover" /> : initialsOf(selectedPost.author_name)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{selectedPost.author_name}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelative(selectedPost.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedPost.content}</p>
              <button onClick={() => toggleLike(selectedPost)} className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedPost.liked_by_me ? 'text-red-500 bg-red-500/10' : 'text-gray-400 bg-gray-800 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${selectedPost.liked_by_me ? 'fill-red-500' : ''}`} />
                {selectedPost.likes_count} {selectedPost.likes_count > 1 ? "j'aime" : "j'aime"}
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-white font-bold mb-4">{replies.length} réponse{replies.length !== 1 ? 's' : ''}</h3>
              {loadingReplies ? (
                <p className="text-gray-500 text-sm">Chargement...</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {replies.map((r) => (
                    <div key={r.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                        {r.author_avatar ? <img src={r.author_avatar} alt={r.author_name} className="w-full h-full object-cover" /> : initialsOf(r.author_name)}
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{r.author_name}</span>
                          <span className="text-gray-500 text-xs">{formatRelative(r.created_at)}</span>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{r.content}</p>
                      </div>
                    </div>
                  ))}
                  {replies.length === 0 && <p className="text-gray-500 text-sm">Pas encore de réponse. Sois le premier à répondre !</p>}
                </div>
              )}

              {user ? (
                <form onSubmit={handleReply} className="flex gap-3">
                  <input type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="Écris une réponse..." className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50" />
                  <button type="submit" disabled={sendingReply || !newReply.trim()} className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <p className="text-gray-500 text-sm">Connecte-toi pour répondre à ce sujet.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Rechercher un sujet..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              </div>
              {user ? (
                <button onClick={() => setShowNewPostForm(!showNewPostForm)} className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap">
                  <Plus className="w-5 h-5" />
                  Nouveau sujet
                </button>
              ) : (
                <p className="flex items-center justify-center px-5 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 text-sm whitespace-nowrap">Connecte-toi pour poster</p>
              )}
            </div>

            {showNewPostForm && user && (
              <form onSubmit={handleCreatePost} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold">Nouveau sujet</h3>
                  <button type="button" onClick={() => setShowNewPostForm(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre de ton sujet..." required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500" />
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Écris ton message..." required rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500" />
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" disabled={posting} className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {posting ? 'Publication...' : 'Publier le sujet'}
                </button>
              </form>
            )}

            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
              {['all', 'pinned', ...CATEGORIES].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${filter === f ? 'bg-red-600/20 text-red-400 border-red-500/30' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:text-white'}`}>
                  {f === 'all' ? 'Tous' : f === 'pinned' ? 'Épinglés' : f}
                </button>
              ))}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl divide-y divide-gray-800/50 overflow-hidden">
              {loading && <div className="p-8 text-center text-gray-500">Chargement du forum...</div>}

              {!loading && filteredPosts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Aucun sujet pour le moment. {user ? 'Sois le premier à publier !' : 'Connecte-toi pour lancer la discussion.'}
                </div>
              )}

              {!loading && filteredPosts.map((post) => (
                <div key={post.id} onClick={() => openPost(post.id)} className="px-5 py-4 hover:bg-gray-800/20 transition-colors cursor-pointer group flex items-start gap-3">
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
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(post); }} className={`p-2 rounded-lg transition-all shrink-0 ${post.liked_by_me ? 'text-red-500 bg-red-500/10' : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'}`}>
                    <Heart className={`w-4 h-4 ${post.liked_by_me ? 'fill-red-500' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
