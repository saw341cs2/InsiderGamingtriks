import { createClient } from '@supabase/supabase-js';

type AuthChangeCallback = (event: string, session: unknown) => void;

interface AuthOptions {
  email?: string;
  password?: string;
  options?: Record<string, unknown>;
}

const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: AuthChangeCallback) => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signUp: (_options: AuthOptions) => Promise.resolve({ data: null, error: null }),
    signInWithPassword: (_options: AuthOptions) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};

export { supabase };
