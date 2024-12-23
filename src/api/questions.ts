import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';
import type { Question } from '../types/question';

interface QuestionsState {
  pending: Question[];
  active: Question[];
}

export async function fetchQuestions(): Promise<QuestionsState> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        author:profiles!questions_author_id_fkey (
          id,
          username
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const questions = data || [];
    return {
      pending: questions.filter(q => q.is_pending),
      active: questions.filter(q => !q.is_pending),
    };
  } catch (error) {
    throw handleError(error);
  }
}

export async function fetchQuestionById(id: string): Promise<Question | null> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        author:profiles!questions_author_id_fkey (
          id,
          username
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function createQuestion(title: string, content: string, authorId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('questions')
      .insert([{
        title,
        content,
        author_id: authorId,
        is_pending: true,
        status: 'pending',
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function voteForQuestion(questionId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('vote_for_question', {
      question_id: questionId,
      voter_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function shareQuestion(questionId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('share_question', {
      question_id: questionId
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}