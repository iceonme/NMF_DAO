import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createResearchProposal } from '@/api/research';
import { toast } from '../ui/use-toast';
import type { ButtonProps } from '../ui/button';

interface CreateResearchProposalProps {
  questionId: string;
  onSuccess: () => void;
  buttonProps?: Partial<ButtonProps>;
}

export function CreateResearchProposal({ 
  questionId, 
  onSuccess,
  buttonProps = {
    children: '提交研究计划'
  }
}: CreateResearchProposalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredFunding, setRequiredFunding] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createResearchProposal({
        question_id: questionId,
        title,
        description,
        required_funding: parseInt(requiredFunding, 10),
      });
      setOpen(false);
      setTitle('');
      setDescription('');
      setRequiredFunding('');
      onSuccess();
      toast({
        title: "研究计划已提交",
      });
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>提交研究计划</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              研究标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
              placeholder="简明扼要地描述你的研究计划"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              研究详情
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
              placeholder="详细描述你的研究计划，包括研究方法、预期成果等"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="funding" className="text-sm font-medium">
              所需资金 (MARS)
            </label>
            <input
              id="funding"
              type="number"
              min="0"
              value={requiredFunding}
              onChange={(e) => setRequiredFunding(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
              placeholder="输入所需的 MARS 代币数量"
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
              {isSubmitting ? '提交中...' : '提交计划'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}