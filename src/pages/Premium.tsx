import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { useSectionNavigate } from '@/hooks/useSectionNavigate';
import Navbar from '@/components/gaming/Navbar';
import PremiumSection from '@/components/gaming/PremiumSection';
import Footer from '@/components/gaming/Footer';
import BackToTop from '@/components/gaming/BackToTop';

export default function PremiumPage() {
  const navigate = useNavigate();
  const handleNavigate = useSectionNavigate();

  useSEO(
    'Offres Premium | Insider Gaming Tricks',
    'Débloque les astuces premium, les guides vidéo exclusifs et le support prioritaire avec un abonnement Insider Gaming Tricks.',
    'abonnement premium gaming, astuces exclusives CS2',
    false,
    '/premium',
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeSection="premium"
        onNavigate={handleNavigate}
        onOpenProfile={() => navigate('/profile')}
      />
      <main className="pt-16">
        <PremiumSection />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}