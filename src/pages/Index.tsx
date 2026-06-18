import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
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
        <main>
          <section id="top" className="relative overflow-hidden bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-red-500 font-black text-lg tracking-[0.3em] uppercase mb-3">
                Insider Gaming Tricks
              </p>
              <h1 className="text-4xl md:text-7xl font-black">
                <span className="text-white">#InsiderGaming</span>
                <span className="text-red-500">Tricks</span>
              </h1>
              <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
                Actualités FPS, astuces gaming, vidéos et communauté.
              </p>
            </div>
          </section>
          <NewsSection />
          <AstucesSection />
          <VideosSection />
          <CommunitySection />
          <TestimonialsSection />
          <PremiumSection />
        </main>
      </div>
    </AppProvider>
  );
}
