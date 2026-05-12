import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsohltltdfobdnldlihtw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb2hsdGx0ZGZvYm5sZGxpaHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDg1MzksImV4cCI6MjA4NzM4NDUzOX0.cnjw3RSXhwqGNRI2zh-huFXDULa_vBHxSVDkfDu7GfQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);