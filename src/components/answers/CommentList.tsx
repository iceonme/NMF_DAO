import React, { useState, useEffect } from 'react';
import { fetchComments } from '@/api/answers';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Comment } from '@/types/answer';

interface CommentListProps {
  answerId: string;
}

export function CommentList({ answerId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(answerId);
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [answerId]);

  if (loading) {
    return <div className="animate-pulse space-y-2">
      {[1,2].map(i => (
        <div key={i} className="h-12 bg-secondary/50 rounded" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          暂无评论
        </div>
      )}
    </div>
  );
}