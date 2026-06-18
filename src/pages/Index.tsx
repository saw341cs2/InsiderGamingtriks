import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import NewsSection from '@/components/gaming/NewsSection';
import AstucesSection from '@/components/gaming/AstucesSection';
import VideosSection from '@/components/gaming/VideosSection';

export default function Index() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white">
        <main className="w-full">
          <NewsSection />
          <AstucesSection />
          <VideosSection />
        </main>
      </div>
    </AppProvider>
  );
}
