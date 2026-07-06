import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  loading: boolean;
  username: string |null;
  signUp: (
    email: string,
    password: string,
    username: string,
    age?: number,
    game?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  loading: true,
  username: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username: string,
    age?: number,
    game?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://saw341cs2.github.io/InsiderGamingtriks/"
        data: {
          username,
          age: age ?? 18,
          game: game ?? "",
        },
      },
    });

    if (error) throw error;

    if (data.user?.identities?.length === 0) {
      throw new Error("Cette adresse email est déjà utilisée.");
    }

    toast({
      title: "Compte créé 🎉",
      description:
        "Nous avons envoyé un email de confirmation. Pense à vérifier aussi ton dossier Spam.",
    });
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();

      throw new Error(
        "Tu dois confirmer ton adresse email avant de pouvoir te connecter."
      );
    }

    setUser(data.user);
    setUsername(data.user.user_metadata?.username ?? null);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    setUsername(null);

    toast({
      title: "Déconnexion",
      description: "À bientôt 👋",
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

export default AppContext;