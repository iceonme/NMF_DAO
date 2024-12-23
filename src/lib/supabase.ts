import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { createSafeUrl } from './url';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const url = createSafeUrl(supabaseUrl);
if (!url) {
  throw new Error('Invalid Supabase URL');
}

export const supabase = createClient<Database>(
  url.toString(),
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);