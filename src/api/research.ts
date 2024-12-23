import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';
import type { ResearchProposal, CreateResearchProposalInput } from '@/types/research';

export async function fetchResearchProposalById(id: string): Promise<ResearchProposal | null> {
  try {
    const { data, error } = await supabase
      .from('research_proposals')
      .select(`
        *,
        researcher:profiles(username)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function createResearchProposal(input: CreateResearchProposalInput): Promise<void> {
  try {
    const { error } = await supabase.rpc('create_research_proposal', {
      question_id: input.question_id,
      title: input.title,
      description: input.description,
      required_funding: input.required_funding
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function fetchResearchProposals(questionId: string): Promise<ResearchProposal[]> {
  try {
    const { data, error } = await supabase
      .from('research_proposals')
      .select(`
        *,
        researcher:profiles(username)
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
}

export async function fundResearchProposal(proposalId: string, amount: number): Promise<void> {
  try {
    const { error } = await supabase.rpc('fund_research_proposal', {
      proposal_id: proposalId,
      amount: amount
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function fetchResearchDiscussions(proposalId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('research_discussions')
      .select(`
        *,
        author:profiles(username)
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
}

export async function createResearchDiscussion(proposalId: string, content: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('research_discussions')
      .insert([{
        proposal_id: proposalId,
        content,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}