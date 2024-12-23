import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createReply } from '@/api/discussions';
import { toast } from '../ui/use-toast';
import { showRewardToast } from '../ui/reward-toast';

interface CreateReplyProps {
  discussionId: string;
  onSuccess: () => void;
}

export function CreateReply({ discussionId, onSuccess }: CreateReplyProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createReply({
        discussion_id: discussionId,
        content,
      });
      setContent('');
      showRewardToast({
        title: "回复已发布",
        amount: 5
      });
      // 立即刷新回复列表
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-24 px-3 py-2 bg-secondary/50 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
        placeholder="写下你的回复..."
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          className="bg-mars-sky hover:bg-mars-sky/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布回复'}
        </Button>
      </div>
    </form>
  );
}