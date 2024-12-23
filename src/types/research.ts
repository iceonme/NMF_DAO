export interface ResearchProposal {
  id: string;
  question_id: string;
  researcher_id: string;
  researcher: {
    username: string;
  };
  title: string;
  description: string;
  required_funding: number;
  current_funding: number;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
}

export interface CreateResearchProposalInput {
  question_id: string;
  title: string;
  description: string;
  required_funding: number;
}