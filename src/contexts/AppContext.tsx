import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, age?: number, game?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  loading: true,
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

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      // Supabase not available, continue without auth
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendWelcomeEmail = async (email: string, username: string) => {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer re_b4CbPPMu_JA269CNTX1pHSbE1PtV1T9mX',
        },
        body: JSON.stringify({
          from: 'Insider Gaming Tricks <onboarding@resend.dev>',
          to: email,
          subject: '🎮 Bienvenue sur Insider Gaming Tricks !',
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
              <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px;">
                <h1 style="color: #8b5cf6;">🎮 Bienvenue ${username} !</h1>
                <p>Merci de t'être inscrit sur Insider Gaming Tricks !</p>
                <p>Rejoins notre communauté pour:</p>
                <ul>
                  <li>Recevoir des tips exclusifs</li>
                  <li>Participer aux tournois</li>
                  <li>Échanger avec d'autres joueurs</li>
                </ul>
                <p><strong>Discord:</strong> <a href="https://discord.gg/XsHYc4tQpx" style="background: #5865F2; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Rejoindre le Discord</a></p>
                <p><strong>YouTube:</strong> <a href="https://www.youtube.com/@InsiderHackGaming" style="background: #FF0000; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">S'abonner</a></p>
                <a href="https://fab34.github.io/InsiderGamingtriks/" style="display: block; width: 200px; margin: 20px auto; padding: 15px; background: #8b5cf6; color: white; text-align: center; border-radius: 8px; text-decoration: none;">Commencer</a>
              </div>
            </body>
            </html>
          `,
        }),
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  };

  const signUp = async (email: string, password: string, username: string, age?: number, game?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://fab34.github.io/InsiderGamingtriks/',
        data: {
          username,
          age: age || 18,
          game: game || '',
        }
      }
    });
    if (error) throw error;
    
    await sendWelcomeEmail(email, username);
    
    toast({
      title: "Bienvenue " + username + " ! 🎮",
      description: "Ton compte a été créé. Profite des astuces exclusives!",
    });
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Fetch user data to get updated metadata
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    setUser(user);
    
    const username = user?.user_metadata?.username || 'Joueur';
    toast({
      title: "Bon retour " + username + " ! 👋",
      description: "Content de te revoir sur Insider Gaming Tricks!",
    });
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
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
