export const DISCUSSION_WITH_REPLIES_QUERY = `
  id,
  question_id,
  content,
  created_at,
  author_id,
  reply_count,
  author:profiles!discussions_author_id_fkey (
    username
  ),
  replies:discussion_replies (
    id,
    content,
    created_at,
    author:profiles!discussion_replies_author_id_fkey (
      username
    )
  )
`;