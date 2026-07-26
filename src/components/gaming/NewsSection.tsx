import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, Heart, Mail, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { FOUNDER_ID, FOUNDER_USERNAME } from '@/lib/founder';

interface Member {
  id: string;
  username: string;
  game: string;
  created_at: string;
  avatar_url?: string | null;
}

const MembersSection: React.FC = () => {
  const { user, username } = useAppContext();
  const [members, setMembers] = useState<Member[]>([]);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, username:pseudo, game, created_at, avatar_url')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = data || [];
        const hasFounder = list.some((m) => m.id === FOUNDER_ID);
        if (!hasFounder) {
          list.unshift({
            id: FOUNDER_ID,
            username: FOUNDER_USERNAME,
            game: 'Fondateur',
            created_at: new Date().toISOString(),
            avatar_url: null,
          });
        }
        list.sort((a, b) => {
          if (a.id === FOUNDER_ID) return -1;
          if (b.id === FOUNDER_ID) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setMembers(list);
      });
  }, []);

  // Présence en direct : qui est connecté sur le site en ce moment
  useEffect(() => {
    const presenceKey = user?.id || `guest-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel('online-members', {
      config: { presence: { key: presenceKey } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineIds(new Set(Object.keys(state)));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            username: username || user.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, username]);

  return (
    <section id="membres" className="bg-gray-950 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" />
            Membres
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Notre <span className="text-indigo-500">Communauté</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chaque membre inscrit fait vivre ce site. Merci à vous ! 🙏
          </p>
          {onlineIds.size > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {onlineIds.size} personne{onlineIds.size > 1 ? 's' : ''} en ligne
            </div>
          )}
        </div>

        {/* Remerciement */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-8 mb-12 text-center">
          <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Merci à tous nos membres ! ❤️</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            C'est grâce à vous que ce site existe et grandit chaque jour. Vos retours, votre présence sur le Discord et le forum, et votre soutien font toute la différence. Vous êtes le cœur d'Insider Gaming Tricks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/X6D6zzrTf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Rejoindre le Discord
            </a>
            <a
              href="#community-section"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold rounded-xl transition-colors"
            >
              <Users className="w-5 h-5" /> Accéder au Forum
            </a>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">Aucun membre pour l'instant.</p>
          ) : members.map((member) => (
            <div key={member.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/80 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.username || 'Avatar'} className="w-full h-full object-cover" />
                    ) : (
                      (member.username || '?')[0].toUpperCase()
                    )}
                  </div>
                  {onlineIds.has(member.id) && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full" title="En ligne" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    {member.username || 'Anonyme'}
                    {member.id === FOUNDER_ID && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold">
                        <Crown className="w-3 h-3" />Fondateur
                      </span>
                    )}
                    {onlineIds.has(member.id) && (
                      <span className="text-green-400 text-xs font-semibold">● En ligne</span>
                    )}
                  </h3>
                  {member.game && <p className="text-indigo-400 text-sm">{member.game}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Membre depuis {new Date(member.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </span>
                <a
                  href={`https://discord.gg/X6D6zzrTf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Contacter
                </a>
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
                  href="https://discord.gg/X6D6zzrTf"
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
                 href="https://discord.gg/X6D6zzrTf"
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
