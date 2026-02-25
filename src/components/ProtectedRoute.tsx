
import React, { useState, useEffect } from 'react';
import { Crosshair, Lock } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import AuthModal from './gaming/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAppContext();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setAuthModalOpen(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-900/20 rounded-full">
              <Crosshair className="w-16 h-16 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            #Insider<span className="text-red-500">Gaming Tricks</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Ce contenu est réservé aux membres inscrits.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all"
          >
            <Lock className="w-5 h-5" />
            Se connecter / s'inscrire
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
