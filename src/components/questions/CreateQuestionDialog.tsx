import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { createQuestion } from '@/api/questions';
import { toast } from '../ui/use-toast';
import { showRewardToast } from '../ui/reward-toast';

export function CreateQuestionDialog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createQuestion(title, content, user.id);
      showRewardToast({
        title: "问题已提交",
        amount: 10
      });
      setOpen(false);
      setTitle('');
      setContent('');
      // 刷新页面以显示新问题
      window.location.reload();
    } catch (error) {
      toast({
        title: "提交失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-mars-sky hover:bg-mars-sky/90">
          <PlusIcon className="w-4 h-4 mr-2" />
          提出问题
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>提出新问题</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              问题标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
              placeholder="简明扼要地描述你的问题"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              问题详情
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
              placeholder="详细描述你的问题，包括背景、目标和期望等"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-mars-sky hover:bg-mars-sky/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '提交问题'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}