import React, { useState } from 'react';
import { Crosshair, Menu, X, Youtube, MessageCircle } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'astuces', label: 'Astuces' },
  { id: 'videos', label: 'Vidéos' },
  { id: 'communaute', label: 'Communauté' },
  { id: 'premium', label: 'Premium' },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('accueil')}>
            <Crosshair className="w-7 h-7 text-red-500" />
            <span className="text-white font-bold text-lg tracking-wider">
              INSIDER<span className="text-red-500">HACK</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded ${
                  activeSection === item.id
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Social + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.youtube.com/@InsiderHackGaming"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
              title="Discord"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => onNavigate('premium')}
              className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-lg shadow-red-900/30"
            >
              Go Premium
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
              <a
                href="https://www.youtube.com/@InsiderHackGaming"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
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
  );
};

export default Navbar;
