import type { Profile } from './auth';

export interface Answer {
  id: string;
  question_id: string;
  author: Profile;
  content: string;
  likes_count: number;
  comments_count: number;
  is_accepted: boolean;
  has_liked: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  answer_id: string;
  author: Profile;
  content: string;
  created_at: string;
}

export interface CreateAnswerInput {
  question_id: string;
  content: string;
}

export interface CreateCommentInput {
  answer_id: string;
  content: string;
}