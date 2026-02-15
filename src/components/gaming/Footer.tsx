import React, { useState } from 'react';
import { Crosshair, Youtube, MessageCircle, Mail, Send, ChevronRight, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Entrez votre email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email invalide');
      return;
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 border-b border-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Reste informé des dernières astuces
              </h3>
              <p className="text-gray-400 text-sm">
                Reçois chaque semaine nos meilleures astuces et guides directement dans ta boîte mail.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); setSubscribed(false); }}
                  placeholder="ton@email.com"
                  className="w-full sm:w-72 pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                />
                {emailError && <p className="absolute -bottom-5 left-0 text-red-400 text-xs">{emailError}</p>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                S'inscrire
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-sm font-medium">Inscrit avec succès !</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <Crosshair className="w-6 h-6 text-red-500" />
              <span className="text-white font-bold text-lg tracking-wider">
                #Insider<span className="text-red-500">Gaming Tricks</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Astuces, guides et stratégies pour les meilleurs FPS. Rejoins la communauté et domine le champ de bataille.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/@InsiderHackGaming"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-900 hover:bg-red-600 border border-gray-800 hover:border-red-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-900 hover:bg-indigo-600 border border-gray-800 hover:border-indigo-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', id: 'accueil' },
                { label: 'Astuces', id: 'astuces' },
                { label: 'Vidéos', id: 'videos' },
                { label: 'Communauté', id: 'communaute' },
                { label: 'Premium', id: 'premium' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Jeux */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Jeux</h4>
            <ul className="space-y-3">
              {[
                { label: 'Counter-Strike 2', color: 'hover:text-orange-400' },
                { label: 'Battlefield', color: 'hover:text-blue-400' },
                { label: 'Call of Duty', color: 'hover:text-green-400' },
                { label: 'Warzone', color: 'hover:text-green-400' },
              ].map((game) => (
                <li key={game.label}>
                  <button
                    onClick={() => onNavigate('astuces')}
                    className={`text-gray-400 ${game.color} text-sm transition-colors flex items-center gap-1 group`}
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {game.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ressources</h4>
            <ul className="space-y-3">
              {[
                { label: 'Guides Gratuits', action: () => onNavigate('astuces') },
                { label: 'Contenu Premium', action: () => onNavigate('premium') },
                { label: 'Forum', action: () => onNavigate('communaute') },
                { label: 'Discord', action: () => {} },
                { label: 'YouTube', action: () => window.open('https://www.youtube.com/@InsiderHackGaming', '_blank') },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-3">
              {['Mentions Légales', 'CGV', 'Politique de Confidentialité', 'Cookies', 'Contact'].map((item) => (
                <li key={item}>
                  <button className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-1 group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 Insider Gaming Tricks. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-red-500" /> pour la communauté FPS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
