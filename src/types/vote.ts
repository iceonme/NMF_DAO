import type { Profile } from './auth';

export interface VoteOption {
  id: string;
  vote_id: string;
  content: string;
  vote_count: number;
}

export interface Vote {
  id: string;
  question_id: string;
  title: string;
  description: string;
  end_time: string;
  status: 'active' | 'completed';
  total_votes: number;
  options: VoteOption[];
  created_at: string;
  author: Profile;
}

export interface CreateVoteInput {
  question_id: string;
  title: string;
  description: string;
  end_time: string;
  options: string[];
}