// Database response types
export interface ProfileResponse {
  username: string;
}

export interface DiscussionResponse {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
  author_id: string;
  reply_count: number;
  author: ProfileResponse;
  replies: DiscussionReplyResponse[];
}

export interface DiscussionReplyResponse {
  id: string;
  content: string;
  created_at: string;
  author: ProfileResponse;
}