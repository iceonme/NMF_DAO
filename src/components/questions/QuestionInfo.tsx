import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { ShareButton } from '../share/ShareButton';
import { QuestionStats } from './QuestionStats';
import { ClockIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import type { Question } from '@/types/question';

interface QuestionInfoProps {
  question: Question;
}

export function QuestionInfo({ question }: QuestionInfoProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{question.title}</CardTitle>
          <div className="flex items-center gap-4">
            <QuestionStatusBadge status={question.status} />
            <ShareButton questionId={question.id} title={question.title} />
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {formatDistanceToNow(new Date(question.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
          <span className="flex items-center gap-1">
            <ArrowUpIcon className="w-4 h-4" />
            {question.vote_count} 票
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{question.content}</p>
        </div>
        <QuestionStats question={question} />
      </CardContent>
    </Card>
  );
}