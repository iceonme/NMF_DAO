import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';
import type { Discussion, CreateDiscussionInput, CreateReplyInput } from '../types/discussion';
import { DISCUSSION_WITH_REPLIES_QUERY } from './discussions/queries';
import type { DiscussionResponse } from './discussions/types';
import { mapDiscussionResponse } from './discussions/mappers';

export async function fetchDiscussions(questionId: string): Promise<Discussion[]> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select(DISCUSSION_WITH_REPLIES_QUERY)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data as DiscussionResponse[]).map(mapDiscussionResponse);
  } catch (error) {
    throw handleError(error);
  }
}

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