import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Navbar from '@/components/gaming/Navbar';
import HeroSection from '@/components/gaming/HeroSection';
import LatestTipsBar from '@/components/gaming/LatestTipsBar';
import NewsSection from '@/components/gaming/NewsSection';
import AstucesSection from '@/components/gaming/AstucesSection';
import VideosSection from '@/components/gaming/VideosSection';
import CommunitySection from '@/components/gaming/CommunitySection';
import MembersSection from '@/components/gaming/MembersSection';
import TestimonialsSection from '@/components/gaming/TestimonialsSection';
import PremiumSection from '@/components/gaming/PremiumSection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

const sectionIds: Record<string, string> = {
  accueil: 'top',
  astuces: 'astuces-section',
  videos: 'videos-section',
  communaute: 'community-section',
  membres: 'membres',
  premium: 'premium-section',
};

export default function Index() {
  const [activeSection, setActiveSection] = useState('accueil');
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    setActiveSection(section);

    if (section === 'forum') {
      navigate('/forum');
      return;
    }

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

  useEffect(() => {
    const ids = Object.values(sectionIds);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const match = Object.entries(sectionIds).find(([, id]) => id === visible.target.id);
        if (match) setActiveSection(match[0]);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenProfile={() => navigate('/profile')}
        />
        <main>
        <NewsSection />
         <AstucesSection onNavigate={handleNavigate} />
          <VideosSection />
          <CommunitySection />
          <MembersSection />
          <TestimonialsSection />
          <PremiumSection />
        </main>
        <Footer onNavigate={handleNavigate} />
        <BackToTop />
      </div>
    </AppProvider>
  );
}