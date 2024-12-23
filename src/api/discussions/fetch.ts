import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import { DISCUSSION_WITH_REPLIES_QUERY } from './queries';
import type { Discussion } from '@/types/discussion';
import type { DiscussionResponse } from './types';
import { mapDiscussionResponse } from './mappers';

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