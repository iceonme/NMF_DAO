import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { Comment, CreateCommentInput } from '@/types/answer';

export async function fetchComments(answerId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('answer_comments')
      .select(`
        *,
        author:profiles!answer_comments_author_id_fkey (
          id,
          username
        )
      `)
      .eq('answer_id', answerId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
}

export async function createComment(input: CreateCommentInput): Promise<void> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('answer_comments')
      .insert([{
        answer_id: input.answer_id,
        author_id: user.id,
        content: input.content
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}