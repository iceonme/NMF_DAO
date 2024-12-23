import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { CreateDiscussionInput, CreateReplyInput } from '@/types/discussion';

export async function createDiscussion(input: CreateDiscussionInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('discussions')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function createReply(input: CreateReplyInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('discussion_replies')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}