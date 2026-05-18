import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import Navbar from '@/components/gaming/Navbar';
import AstucesSection from '@/components/gaming/AstucesSection';
import NewsSection from '@/components/gaming/NewsSection';
import VideosSection from '@/components/gaming/VideosSection';
import CommunitySection from '@/components/gaming/CommunitySection';
import PremiumSection from '@/components/gaming/PremiumSection';
import TestimonialsSection from '@/components/gaming/TestimonialsSection';

const sectionIds: Record<string, string> = {
  accueil: 'top',
  astuces: 'astuces-section',
  videos: 'videos-section',
  communaute: 'community-section',
  membres: 'members-section',
  forum: 'forum-section',
  premium: 'premium-section',
};

export default function Index() {
  const [activeSection, setActiveSection] = useState('accueil');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = sectionIds[section];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
        <main>
          <NewsSection />
          <AstucesSection onNavigate={handleNavigate} />
          <VideosSection />
          <CommunitySection />
          <TestimonialsSection />
          <PremiumSection />
        </main>
      </div>
    </AppProvider>
  );
}
