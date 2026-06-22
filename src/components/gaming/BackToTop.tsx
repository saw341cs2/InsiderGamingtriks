import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-900/40 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
