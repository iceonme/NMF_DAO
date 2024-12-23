import React from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { QuestionTabs } from './QuestionTabs';
import { Card } from '../ui/card';

export function QuestionList() {
  const { questions, loading, error, refetch } = useQuestions();

  if (loading) {
    return <div className="space-y-6">
      {[1,2,3].map(i => (
        <Card key={i} className="bg-secondary h-64 animate-pulse" />
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-destructive">加载问题失败</div>;
  }

  return (
    <QuestionTabs 
      questions={questions}
      onVote={refetch}
    />
  );
}