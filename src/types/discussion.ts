export interface DiscussionReply {
  id: string;
  discussion_id: string;
  author_id: string;
  author: {
    username: string;
  };
  content: string;
  created_at: string;
}

export interface Discussion {
  id: string;
  question_id: string;
  author_id: string;
  author: {
    username: string;
  };
  content: string;
  created_at: string;
  replies?: DiscussionReply[];
  reply_count: number;
}

export interface CreateDiscussionInput {
  question_id: string;
  content: string;
}

export interface CreateReplyInput {
  discussion_id: string;
  content: string;
}