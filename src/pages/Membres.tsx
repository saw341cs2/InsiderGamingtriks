import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { useSectionNavigate } from '@/hooks/useSectionNavigate';
import Navbar from '@/components/gaming/Navbar';
import MembersSection from '@/components/gaming/MembersSection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

export default function MembresPage() {
  const navigate = useNavigate();
  const handleNavigate = useSectionNavigate();

  useSEO(
    'Nos Membres | Insider Gaming Tricks',
    'Découvre les membres de la communauté Insider Gaming Tricks.',
    'membres communauté gaming, joueurs CS2',
    false,
    '/membres',
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeSection="membres"
        onNavigate={handleNavigate}
        onOpenProfile={() => navigate('/profile')}
      />
      <main className="pt-16">
        <MembersSection />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}