import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { useSectionNavigate } from '@/hooks/useSectionNavigate';
import Navbar from '@/components/gaming/Navbar';
import AstucesSection from '@/components/gaming/AstucesSection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

export default function AstucesPage() {
  const navigate = useNavigate();
  const handleNavigate = useSectionNavigate();

  useSEO(
    'Astuces CS2, Battlefield, Call of Duty | Insider Gaming Tricks',
    'Toutes nos astuces gaming : configs, réglages, guides et techniques pour progresser sur CS2, Battlefield et Call of Duty.',
    'astuces CS2, guides gaming, configuration jeu, astuces FPS, Battlefield, Call of Duty',
    false,
    '/astuces',
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeSection="astuces"
        onNavigate={handleNavigate}
        onOpenProfile={() => navigate('/profile')}
      />
      <main className="pt-16">
        <AstucesSection onNavigate={handleNavigate} />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}