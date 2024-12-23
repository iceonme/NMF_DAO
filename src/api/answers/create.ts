import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { CreateAnswerInput } from '@/types/answer';

export async function createAnswer(input: CreateAnswerInput): Promise<void> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('answers')
      .insert([{
        question_id: input.question_id,
        author_id: user.id,
        content: input.content
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}