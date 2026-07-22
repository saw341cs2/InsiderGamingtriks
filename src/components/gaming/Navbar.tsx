import React, { useState } from 'react';
import { Crosshair, Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import AuthModal from './AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenProfile?: () => void;
}

const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'astuces', label: 'Astuces' },
  { id: 'videos', label: 'Vidéos' },
  { id: 'communaute', label: 'Communauté' },
  { id: 'membres', label: 'Membres' },
  { id: 'forum', label: 'Forum' },
  { id: 'premium', label: 'Premium' },
  { id: 'aimrush', label: 'Jeu gratuit' },
  { id: 'classement', label: 'Classement' },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenProfile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut, loading, username } = useAppContext();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => onNavigate('accueil')}>
              <Crosshair className="w-7 h-7 text-red-500" />
              <div className="flex items-center">
                <span className="text-white font-bold text-xl tracking-wide">#InsiderGaming</span>
                <span className="text-red-500 font-bold text-xl tracking-wide ml-1">Tricks</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-0.5 lg:gap-1 ml-4 lg:ml-8 min-w-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded whitespace-nowrap ${
                    activeSection === item.id
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0 ml-auto pl-4">
              <a href="https://www.youtube.com/@InsiderHackGaming" target="_blank" rel="noopener noreferrer" className="p-1.5 lg:p-2 text-red-500 hover:text-red-400 transition-colors flex-shrink-0" title="YouTube">
                <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://discord.gg/PPgXeC2ZW" target="_blank" rel="noopener noreferrer" className="p-1.5 lg:p-2 text-red-500 hover:text-red-400 transition-colors flex-shrink-0" title="Discord">
                <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
              <a href="https://x.com/InsiderGamingTr/likes" target="_blank" rel="noopener noreferrer" className="p-1.5 lg:p-2 text-gray-300 hover:text-white transition-colors flex-shrink-0" title="X">
                <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@insidergamingtricks2?lang=fr" target="_blank" rel="noopener noreferrer" className="p-1.5 lg:p-2 text-pink-500 hover:text-pink-400 transition-colors flex-shrink-0" title="TikTok">
                <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {(username || user?.email)?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-white font-medium">
                        {username || user?.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                    <DropdownMenuItem onClick={onOpenProfile} className="text-white hover:bg-gray-800">
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={signOut} className="text-red-400 hover:bg-gray-800">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!loading && !user && (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </button>
              )}
              <button
                onClick={() => onNavigate('premium')}
                className="ml-1 lg:ml-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs lg:text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-lg shadow-red-900/30 whitespace-nowrap flex-shrink-0"
              >
                Go Premium
              </button>
            </div>

            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-black/98 border-t border-red-900/30 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded transition-all ${
                    activeSection === item.id
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800 mt-4">
                <a href="https://www.youtube.com/@InsiderHackGaming" target="_blank" rel="noopener noreferrer" className="p-2 text-red-500 hover:text-red-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://discord.gg/PPgXeC2ZW" target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-500 hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
                <a href="https://x.com/InsiderGamingTr/likes" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@insidergamingtricks2?lang=fr" target="_blank" rel="noopener noreferrer" className="p-2 text-pink-500 hover:text-pink-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                  </svg>
                </a>
                <button
                  onClick={() => {
                    onNavigate('premium');
                    setMobileOpen(false);
                  }}
                  className="ml-auto px-4 py-2 bg-red-600 text-white text-sm font-bold uppercase rounded"
                >
                  Go Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
