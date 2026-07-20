import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { useSectionNavigate } from '@/hooks/useSectionNavigate';
import Navbar from '@/components/gaming/Navbar';
import CommunitySection from '@/components/gaming/CommunitySection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

export default function CommunautePage() {
  const navigate = useNavigate();
  const handleNavigate = useSectionNavigate();

  useSEO(
    'Communauté Gaming | Insider Gaming Tricks',
    'Rejoins la communauté Insider Gaming Tricks : discussions, actualités et échanges entre joueurs de CS2, Battlefield et Call of Duty.',
    'communauté gaming, discussion FPS, joueurs CS2',
    false,
    '/communaute',
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeSection="communaute"
        onNavigate={handleNavigate}
        onOpenProfile={() => navigate('/profile')}
      />
      <main className="pt-16">
        <CommunitySection />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}