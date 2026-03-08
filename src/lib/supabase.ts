import { createClient } from '@supabase/supabase-js';

// Initialize database client (with fallback for when Supabase is unavailable)
let supabase;
try {
  const supabaseUrl = 'https://wtvlbyaxkixlnnzpplhw.databasepad.com';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIzNDVhY2I5LTdlM2UtNDJlMS05OWQyLTExMWVjMTU4YjYxOCJ9.eyJwcm9qZWN0SWQiOiJ3dHZsYnlheGtpeGxubnpwcGxodyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcwNjY3NjE0LCJleHAiOjIwODYwMjc2MTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.7jT0WASlQkZdjsMTNbYUugwcRZCpmT-aH68WiNr_yl8';
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.warn('Supabase initialization failed, using mock client');
  // @ts-ignore
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

export { supabase };