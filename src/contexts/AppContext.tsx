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
          from: 'Insider Gaming Tricks <contact@insidergamingtricks.com>',
          to: email,
          subject: '🎮 Bienvenue sur Insider Gaming Tricks !',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎮 Insider Gaming Tricks
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #dc2626; font-size: 24px;">
                Bienvenue ${username} !
              </h2>
              <p style="margin: 0 0 20px 0; color: #d1d5db; font-size: 16px; line-height: 1.6;">
                Merci de rejoindre la communauté <strong style="color: #ffffff;">Insider Gaming Tricks</strong> ! 
                Tu fais maintenant partie des joueurs qui ont accès aux meilleures astuces et guides.
              </p>
              <p style="margin: 0 0 30px 0; color: #d1d5db; font-size: 16px; line-height: 1.6;">
                Rejoins-nous sur Discord pour échanger avec d'autres joueurs, participer aux tournois et recevoir des tips exclusifs !
              </p>
              <!-- Discord Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="https://discord.gg/XsHYc4tQpx" style="display: inline-block; background-color: #5865F2; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
                      📱 Rejoindre le Discord
                    </a>
                  </td>
                </tr>
              </table>
              <!-- YouTube -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <a href="https://www.youtube.com/@InsiderHackGaming" style="display: inline-block; background-color: #FF0000; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
                      📺 S'abonner sur YouTube
                    </a>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://fab34.github.io/InsiderGamingtriks/" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: bold;">
                      Commencer maintenant →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                © 2026 Insider Gaming Tricks. Tous droits réservés.
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
                Cet email a été envoyé à ${email}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
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
    
    const { data: userData } = await supabase.auth.getUser();
    setUser(userData?.user || null);
    
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
