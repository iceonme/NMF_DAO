import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';

export async function deductMarsTokens(userId: string, amount: number): Promise<void> {
  try {
    const { error } = await supabase.rpc('deduct_mars_tokens', {
      user_id: userId,
      amount: amount,
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}