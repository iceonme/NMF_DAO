import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string;
  mars_balance: number;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}