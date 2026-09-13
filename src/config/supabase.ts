import { createClient } from '@supabase/supabase-js';

// Supabase Project credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://scgzcxslqewxqewblkwc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UAPy5l8W57aMMHbggyKjfw_MvHtJI8j';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'DriveIQ',
    },
  },
});

export default supabase;
