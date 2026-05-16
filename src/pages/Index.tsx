import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Navbar from '@/components/gaming/Navbar';
import AstucesSection from '@/components/gaming/AstucesSection';
import GamesSection from '@/components/gaming/GamesSection';
import NewsSection from '@/components/gaming/NewsSection';
import VideosSection from '@/components/gaming/VideosSection';
import CommunitySection from '@/components/gaming/CommunitySection';
import PremiumSection from '@/components/gaming/PremiumSection';
import TestimonialsSection from '@/components/gaming/TestimonialsSection';

export default function Index() {
  const [searchParams] = useSearchParams();

  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <NewsSection />
          <GamesSection />
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