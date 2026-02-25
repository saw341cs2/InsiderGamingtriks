
import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import HeroSection from '@/components/gaming/HeroSection';
import AstucesSection from '@/components/gaming/AstucesSection';
import GamesSection from '@/components/gaming/GamesSection';
import NewsSection from '@/components/gaming/NewsSection';
import VideosSection from '@/components/gaming/VideosSection';
import CommunitySection from '@/components/gaming/CommunitySection';
import PremiumSection from '@/components/gaming/PremiumSection';
import TestimonialsSection from '@/components/gaming/TestimonialsSection';
import WeaponGuidesSection from '@/components/gaming/WeaponGuidesSection';

const Index: React.FC = () => {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectGame = (gameId: string) => {
    console.log('Game selected:', gameId);
  };

  return (
    <AppProvider>
      <HeroSection bannerUrl="/InsiderGamingTricks/gaming-banner.jpg" />
      <div className="space-y-12 md:space-y-16">
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
    </AppProvider>
  );
};

export default Index;
