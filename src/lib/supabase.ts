import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpyvpfjertxklktxlmux.supabase.co';
const supabaseAnonKey = 'sb_publishable_bCpIi7bK0Zw68c69AOGAkQ_cojChbRL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
