import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';

export async function likeAnswer(answerId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('like_answer', {
      answer_id: answerId
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}