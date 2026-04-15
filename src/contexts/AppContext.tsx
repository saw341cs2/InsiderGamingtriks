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
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // Get username from metadata or localStorage
      const metadataUsername = session?.user?.user_metadata?.username;
      const pendingUsername = localStorage.getItem('pendingUsername');
      
      if (metadataUsername) {
        setUsername(metadataUsername);
        localStorage.removeItem('pendingUsername'); // Clean up
      } else if (pendingUsername) {
        setUsername(pendingUsername);
      } else {
        setUsername(null);
      }
      
      setLoading(false);
    }).catch(() => {
      // Supabase not available, continue without auth
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // Get username from metadata or localStorage
      const metadataUsername = session?.user?.user_metadata?.username;
      const pendingUsername = localStorage.getItem('pendingUsername');
      
      if (metadataUsername) {
        setUsername(metadataUsername);
        localStorage.removeItem('pendingUsername'); // Clean up
      } else if (pendingUsername) {
        setUsername(pendingUsername);
      } else {
        setUsername(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendWelcomeEmail = async (email: string, username: string) => {
    // Enable email sending for validation emails
    const ENABLE_EMAILS = true;

    if (!ENABLE_EMAILS) {
      console.log('Email sending disabled for testing');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, username }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return;
      }

      console.log('Welcome email sent successfully');
    } catch (err) {
      console.error('Email error:', err);
    }
  };

  const sendVerificationEmail = async (email: string, username: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { email, username }
      });

      if (error) {
        console.error('Verification email error:', error);
        return;
      }

      console.log('Verification email sent successfully');
    } catch (err) {
      console.error('Verification email error:', err);
    }
  };

  const signUp = async (email: string, password: string, username: string, age?: number, game?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://saw341cs2.github.io/InsiderGamingtriks/',
        data: {
          username,
          age: age || 18,
          game: game || '',
        }
      }
    });
    
    if (error) throw error;
    
    // If user is confirmed immediately (depends on Supabase settings)
    if (data.user && data.session) {
      setUser(data.user);
      setUsername(data.user.user_metadata?.username || username);
    } else {
      // User needs email confirmation
      // Store username temporarily for when they confirm
      localStorage.setItem('pendingUsername', username);
    }
    
    await sendWelcomeEmail(email, username);
    await sendVerificationEmail(email, username);
    
    toast({
      title: "Bienvenue " + username + " ! 🎮",
      description: data.user?.email_confirmed_at 
        ? "Ton compte a été créé. Profite des astuces exclusives!"
        : "Un email de confirmation a été envoyé. Vérifie ta boîte mail et confirme ton compte.",
    });
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    setUsername(data.user?.user_metadata?.username || null);
    localStorage.removeItem('pendingUsername'); // Clean up
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
