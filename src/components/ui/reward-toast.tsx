import { toast } from './use-toast';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface RewardToastProps {
  title: string;
  amount: number;
}

export function showRewardToast({ title, amount }: RewardToastProps) {
  toast({
    title: (
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-mars-sky" />
        <span>{title}</span>
      </div>
    ),
    description: (
      <div className="font-medium text-mars-sky">
        获得 {amount} MARS 奖励！
      </div>
    ),
  });
}