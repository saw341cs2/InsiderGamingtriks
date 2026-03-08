import { createClient } from '@supabase/supabase-js';

// Mock client for demo (no real Supabase needed)
const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signUp: (options: any) => Promise.resolve({ data: null, error: null }),
    signInWithPassword: (options: any) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};

export { supabase };
