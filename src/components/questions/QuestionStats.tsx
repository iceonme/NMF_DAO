import { 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  ArrowUpIcon,
  BeakerIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { Question } from '@/types/question';

interface QuestionStatsProps {
  question: Question;
  variant?: 'compact' | 'full';
}

export function QuestionStats({ question, variant = 'full' }: QuestionStatsProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <span className="flex items-center">
          <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
          {question.discussion_count}
        </span>
        <span className="flex items-center">
          <ArrowUpIcon className="w-4 h-4 mr-1" />
          {question.vote_count}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 text-mars-sky mb-2">
          <BeakerIcon className="w-5 h-5" />
          <span className="font-medium">研究计划</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {question.researcher_count} 位研究者参与
        </p>
      </div>

      <div className="p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 text-mars-dust mb-2">
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span className="font-medium">讨论</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {question.discussion_count} 条讨论
        </p>
      </div>

      <div className="p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 text-mars-surface mb-2">
          <DocumentTextIcon className="w-5 h-5" />
          <span className="font-medium">分享</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {question.share_count || 0} 次分享
        </p>
      </div>

      <div className="p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 text-green-500 mb-2">
          <UserGroupIcon className="w-5 h-5" />
          <span className="font-medium">参与者</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {question.researcher_count + question.discussion_count} 人
        </p>
      </div>
    </div>
  );
}