import React from 'react';
import type { QuestionStatus } from '@/types/question';
import { QuestionStatusConfig } from '@/types/question';

interface QuestionStatusBadgeProps {
  status: QuestionStatus;
}

export function QuestionStatusBadge({ status }: QuestionStatusBadgeProps) {
  const config = QuestionStatusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} bg-secondary/50`}>
      {config.label}
    </span>
  );
}