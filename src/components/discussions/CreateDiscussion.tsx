import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createDiscussion } from '@/api/discussions';
import { toast } from '../ui/use-toast';
import { showRewardToast } from '../ui/reward-toast';

interface CreateDiscussionProps {
  questionId: string;
  onSuccess: () => void;
}

export function CreateDiscussion({ questionId, onSuccess }: CreateDiscussionProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createDiscussion({
        question_id: questionId,
        content,
      });
      setContent('');
      showRewardToast({
        title: "讨论已发布",
        amount: 5
      });
      // 立即刷新讨论列表
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
        className="w-full h-32 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
        placeholder="分享你的想法..."
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-mars-sky hover:bg-mars-sky/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布讨论'}
        </Button>
      </div>
    </form>
  );
}