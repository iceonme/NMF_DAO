import { supabase } from '../lib/supabase';
import type { Profile } from '../types/auth';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string, username: string) {
  const { error: signUpError, data } = await supabase.auth.signUp({ email, password });
  if (signUpError) throw signUpError;

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, username, mars_balance: 0 }
    ]);
    if (profileError) throw profileError;
  }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}