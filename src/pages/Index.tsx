
import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import Navbar from '@/components/gaming/Navbar';
import AstucesSection from '@/components/gaming/AstucesSection';
import GamesSection from '@/components/gaming/GamesSection';
import NewsSection from '@/components/gaming/NewsSection';
import VideosSection from '@/components/gaming/VideosSection';
import CommunitySection from '@/components/gaming/CommunitySection';
import PremiumSection from '@/components/gaming/PremiumSection';
import TestimonialsSection from '@/components/gaming/TestimonialsSection';
import WeaponGuidesSection from '@/components/gaming/WeaponGuidesSection';
import Footer from '@/components/gaming/Footer';
import ProfilePage from '@/pages/Profile';
import ForumPage from '@/pages/Forum';

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');
  const [showProfile, setShowProfile] = useState(false);
  const [showForum, setShowForum] = useState(false);
  
  const handleNavigate = (section: string) => {
    if (section === 'profile') {
      setShowProfile(true);
      setShowForum(false);
      return;
    }
    if (section === 'forum') {
      setShowForum(true);
      setShowProfile(false);
      return;
    }
    setActiveSection(section);
    setShowProfile(false);
    setShowForum(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectGame = (gameId: string) => {
    console.log('Game selected:', gameId);
  };

  return (
    <AppProvider>
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenProfile={() => setShowProfile(true)} />
      <main className="min-h-screen bg-black pt-16">
        {showProfile ? (
          <ProfilePage />
        ) : showForum ? (
          <ForumPage />
        ) : (
          <div className="space-y-12 md:space-y-16 pb-20">
            <div id="news">
              <NewsSection />
            </div>
            <div id="astuces">
              <AstucesSection onNavigate={handleNavigate} />
            </div>
            <div id="videos">
              <VideosSection />
            </div>
            <div id="communaute">
              <CommunitySection />
            </div>
            <div id="premium">
              <PremiumSection />
            </div>
            <TestimonialsSection />
            <WeaponGuidesSection />
            <GamesSection onSelectGame={handleSelectGame} />
            <NewsSection />
          </div>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </AppProvider>
  );
};

export default Index;
