import type { Discussion } from '@/types/discussion';
import type { DiscussionResponse } from './types';

export function mapDiscussionResponse(discussion: DiscussionResponse): Discussion {
  return {
    id: discussion.id,
    question_id: discussion.question_id,
    author_id: discussion.author_id,
    content: discussion.content,
    created_at: discussion.created_at,
    reply_count: discussion.reply_count,
    author: {
      username: discussion.author.username
    },
    replies: discussion.replies.map(reply => ({
      id: reply.id,
      discussion_id: discussion.id,
      author_id: discussion.author_id,
      content: reply.content,
      created_at: reply.created_at,
      author: {
        username: reply.author.username
      }
    }))
  };
}