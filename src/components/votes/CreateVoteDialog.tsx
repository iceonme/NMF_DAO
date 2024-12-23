import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { createVote } from '@/api/votes';
import { toast } from '../ui/use-toast';
import { addDays } from 'date-fns';

interface CreateVoteDialogProps {
  questionId: string;
  onSuccess: () => void;
}

export function CreateVoteDialog({ questionId, onSuccess }: CreateVoteDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        throw new Error('至少需要两个选项');
      }

      await createVote({
        question_id: questionId,
        title,
        description,
        options: validOptions,
        end_time: addDays(new Date(), 7).toISOString(),
      });

      setOpen(false);
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      onSuccess();
      toast({
        title: "投票已创建",
        description: "投票将持续7天",
      });
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-mars-sky hover:bg-mars-sky/90">
          <PlusIcon className="w-4 h-4 mr-2" />
          发起投票
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>发起新投票</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              投票标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
              placeholder="简明扼要地描述投票内容"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              投票说明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
              placeholder="详细说明投票目的和背景"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">投票选项</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
                  placeholder={`选项 ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                添加选项
              </Button>
            )}
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
              {isSubmitting ? '创建中...' : '创建投票'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}