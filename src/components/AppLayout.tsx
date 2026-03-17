import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './gaming/Navbar';
import Footer from './gaming/Footer';

const AppLayout = () => {
  const [activeSection, setActiveSection] = useState('accueil');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Le contenu principal de tes pages s'affichera ici */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Le footer en bas */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default AppLayout;