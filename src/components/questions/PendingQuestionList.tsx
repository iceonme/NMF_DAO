import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { HandThumbUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { voteForQuestion } from '@/api/questions';
import { toast } from '../ui/use-toast';
import { AuthDialog } from '../auth/AuthDialog';
import type { Question } from '@/types/question';

interface PendingQuestionListProps {
  questions: Question[];
  onVote: () => void;
}

export function PendingQuestionList({ questions, onVote }: PendingQuestionListProps) {
  const { user } = useAuth();
  const [votingId, setVotingId] = useState<string | null>(null);

  const handleVote = async (questionId: string) => {
    if (!user) return;

    setVotingId(questionId);
    try {
      await voteForQuestion(questionId);
      onVote();
      toast({
        title: "投票成功",
        description: "感谢你的支持！",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      if (message.includes("Already voted")) {
        toast({
          title: "已经投票过了",
          description: "每个问题只能投票一次哦",
        });
      } else {
        toast({
          title: "投票失败",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card 
          key={question.id} 
          className="hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="text-base">{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {question.content}
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(question.created_at), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(question.id)}
                disabled={votingId === question.id}
                className="flex items-center hover:bg-mars-sky/10 hover:text-mars-sky transition-colors"
              >
                <HandThumbUpIcon className="w-4 h-4 mr-1" />
                {votingId === question.id ? '投票中...' : '是个好问题'}
              </Button>
            ) : (
              <AuthDialog 
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center hover:bg-mars-sky/10 hover:text-mars-sky transition-colors"
                  >
                    <HandThumbUpIcon className="w-4 h-4 mr-1" />
                    登录后投票
                  </Button>
                }
              />
            )}
          </CardFooter>
        </Card>
      ))}
      {questions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无待定问题
        </div>
      )}
    </div>
  );
}