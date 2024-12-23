import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { QuestionStats } from './QuestionStats';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExpanded) {
      navigate(`/questions/${question.id}`);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 
        hover:bg-secondary/80 hover:shadow-lg
        ${isExpanded ? 'bg-secondary/50 ring-2 ring-mars-sky/50' : 'bg-card'}
      `}
      onClick={handleClick}
    >
      {/* Collapsed View */}
      <div className={`transition-all duration-300 ${isExpanded ? 'hidden' : 'block'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <h3 className="font-medium truncate">{question.title}</h3>
            <QuestionStatusBadge status={question.status} />
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(question.created_at), {
                addSuffix: true,
                locale: zhCN
              })}
            </span>
            <QuestionStats question={question} variant="compact" />
          </div>
        </div>
      </div>

      {/* Expanded View */}
      <div className={`transition-all duration-300 ${isExpanded ? 'animate-expand' : 'hidden'}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {question.title}
            <QuestionStatusBadge status={question.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">{question.content}</p>
          <QuestionStats question={question} />
        </CardContent>
        <CardFooter className="justify-end text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(question.created_at), { 
                addSuffix: true,
                locale: zhCN 
              })}
            </span>
            <ChevronRightIcon className="w-4 h-4 text-mars-sky animate-pulse" />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}