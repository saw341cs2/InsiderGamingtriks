import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  loading: boolean;
  username: string | null;
  signUp: (email: string, password: string, username: string, age?: number, game?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  loading: true,
  username: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      const metadataUsername = session?.user?.user_metadata?.username;
      const pendingUsername = localStorage.getItem('pendingUsername');
      
      if (metadataUsername) {
        setUsername(metadataUsername);
        localStorage.removeItem('pendingUsername');
      } else if (pendingUsername) {
        setUsername(pendingUsername);
      } else {
        setUsername(null);
      }
      
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      const metadataUsername = session?.user?.user_metadata?.username;
      const pendingUsername = localStorage.getItem('pendingUsername');
      
      if (metadataUsername) {
        setUsername(metadataUsername);
        localStorage.removeItem('pendingUsername');
      } else if (pendingUsername) {
        setUsername(pendingUsername);
      } else {
        setUsername(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string, age?: number, game?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://saw341cs2.github.io/InsiderGamingtriks/index.html',
          data: { username, age: age || 18, game: game || '' }
        }
      });
      
      if (error) throw error;
      
      if (data.user?.identities && data.user.identities.length === 0) {
        throw new Error("Cette adresse email est déjà utilisée");
      }
      
      toast({
        title: "Inscription réussie ! 🎮",
        description: "Un email de vérification a été envoyé à " + email + ". Vérifie ta boîte de réception et tes spams.",
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message?.includes('rate limit') || err.message?.includes('Rate limit')) {
        throw new Error("Trop de demandes. Patiente quelques minutes avant de réessayer.");
      }
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    setUsername(data.user?.user_metadata?.username || null);
    localStorage.removeItem('pendingUsername');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        loading,
        username,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
