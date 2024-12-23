import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { Vote, CreateVoteInput } from '@/types/vote';

export async function fetchQuestionVotes(questionId: string): Promise<Vote[]> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        author:profiles!votes_author_id_fkey (
          id,
          username
        ),
        options:vote_options (
          id,
          content,
          vote_count
        )
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
}

export async function createVote(input: CreateVoteInput): Promise<void> {
  try {
    const { error: voteError } = await supabase.rpc('create_vote', {
      question_id: input.question_id,
      title: input.title,
      description: input.description,
      end_time: input.end_time,
      options: input.options
    });

    if (voteError) throw voteError;
  } catch (error) {
    throw handleError(error);
  }
}

export async function castVote(optionId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('cast_vote', {
      option_id: optionId
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}