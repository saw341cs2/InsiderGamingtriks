import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './gaming/Navbar';
import LatestTipsBar from './gaming/LatestTipsBar';
import HeroSection from './gaming/HeroSection';
import GamesSection from './gaming/GamesSection';
import AstucesSection from './gaming/AstucesSection';
import VideosSection from './gaming/VideosSection';
import NewsSection from './gaming/NewsSection';
import WeaponGuidesSection from './gaming/WeaponGuidesSection';
import TestimonialsSection from './gaming/TestimonialsSection';
import CommunitySection from './gaming/CommunitySection';
import PremiumSection from './gaming/PremiumSection';
import Footer from './gaming/Footer';
import BackToTop from './gaming/BackToTop';

const sectionMap: { id: string; section: string }[] = [
  { id: 'premium-section', section: 'premium' },
  { id: 'community-section', section: 'communaute' },
  { id: 'videos-section', section: 'videos' },
  { id: 'astuces-section', section: 'astuces' },
  { id: 'hero-section', section: 'accueil' },
];

const AppLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const offset = 120;
      for (const { id, section } of sectionMap) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('accueil');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = useCallback((section: string) => {
    setActiveSection(section);
    const mapping: Record<string, string> = {
      accueil: 'hero-section',
      astuces: 'astuces-section',
      videos: 'videos-section',
      communaute: 'community-section',
      premium: 'premium-section',
    };
    const targetId = mapping[section];
    if (section === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const navbarHeight = 64;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, []);

  const handleSelectGame = useCallback((gameId: string) => {
    navigateTo('astuces');
  }, [navigateTo]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Fixed Navbar */}
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Latest Tips Ticker */}
      <LatestTipsBar />

      {/* Hero */}
      <div id="hero-section">
        <HeroSection 
          bannerUrl="https://d64gsuwffb70l.cloudfront.net/698a3e1733669e4bf0335d17_1770667565190_18673510.jpg"
        />
      </div>

      {/* Games */}
      <GamesSection onSelectGame={handleSelectGame} />

      {/* Weapon Guides */}
      <WeaponGuidesSection />

      {/* Astuces */}
      <AstucesSection onNavigate={navigateTo} />

      {/* Videos */}
      <VideosSection />

      {/* News */}
      <NewsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Community */}
      <CommunitySection />

      {/* Premium */}
      <PremiumSection />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
};

export default AppLayout;
