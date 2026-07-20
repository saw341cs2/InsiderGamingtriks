import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { useSectionNavigate } from '@/hooks/useSectionNavigate';
import Navbar from '@/components/gaming/Navbar';
import VideosSection from '@/components/gaming/VideosSection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

export default function VideosPage() {
  const navigate = useNavigate();
  const handleNavigate = useSectionNavigate();

  useSEO(
    'Vidéos Gaming CS2, Battlefield, Call of Duty | Insider Gaming Tricks',
    'Retrouve toutes nos vidéos YouTube : gameplay, tutoriels et astuces pour CS2, Battlefield et Call of Duty.',
    'vidéos gaming, gameplay CS2, tutoriels FPS, YouTube gaming',
    false,
    '/videos',
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeSection="videos"
        onNavigate={handleNavigate}
        onOpenProfile={() => navigate('/profile')}
      />
      <main className="pt-16">
        <VideosSection />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}