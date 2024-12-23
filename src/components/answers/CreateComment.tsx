import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createComment } from '@/api/answers';
import { toast } from '../ui/use-toast';
import { showRewardToast } from '../ui/reward-toast';

interface CreateCommentProps {
  answerId: string;
  onSuccess: () => void;
}

export function CreateComment({ answerId, onSuccess }: CreateCommentProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createComment({
        answer_id: answerId,
        content,
      });
      setContent('');
      showRewardToast({
        title: "评论已发布",
        amount: 5
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "发布失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-20 px-3 py-2 bg-secondary/50 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none text-sm"
        placeholder="写下你的评论..."
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          className="bg-mars-sky hover:bg-mars-sky/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布评论'}
        </Button>
      </div>
    </form>
  );
}