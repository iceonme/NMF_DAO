import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { Answer } from '@/types/answer';

export async function fetchAnswers(questionId: string): Promise<Answer[]> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    const { data, error } = await supabase
      .from('answers')
      .select(`
        *,
        author:profiles!answers_author_id_fkey (
          id,
          username,
          mars_balance
        ),
        likes_count,
        comments_count,
        has_liked:answer_likes!left(user_id),
        is_accepted
      `)
      .eq('question_id', questionId)
      .order('is_accepted', { ascending: false })
      .order('likes_count', { ascending: false });

    if (error) throw error;

    return (data || []).map(answer => ({
      ...answer,
      has_liked: user ? answer.has_liked.length > 0 : false
    }));
  } catch (error) {
    throw handleError(error);
  }
}