import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpyvpfjertxklktxlmux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweXZwZmplcnR4a2xrdHhsbXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTYzOTAsImV4cCI6MjA5MTQ3MjM5MH0.J6IWSYrmH2IJ8Hrjd5hgICqGiM39lwgOz8uZE8sKyGw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);