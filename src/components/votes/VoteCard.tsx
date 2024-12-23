import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { castVote } from '@/api/votes';
import { toast } from '../ui/use-toast';
import { AuthDialog } from '../auth/AuthDialog';
import type { Vote } from '@/types/vote';

interface VoteCardProps {
  vote: Vote;
  onVote: () => void;
}

export function VoteCard({ vote, onVote }: VoteCardProps) {
  const { user } = useAuth();
  const [votingId, setVotingId] = useState<string | null>(null);
  const isActive = vote.status === 'active';

  const handleVote = async (optionId: string) => {
    if (!user) return;

    setVotingId(optionId);
    try {
      await castVote(optionId);
      onVote();
      toast({
        title: "投票成功",
        description: "感谢你的参与！",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      if (message.includes("Already voted")) {
        toast({
          title: "已经投票过了",
          description: "每个投票只能参与一次哦",
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{vote.title}</CardTitle>
          <span className={`px-2 py-1 text-xs rounded-full ${
            isActive ? 'bg-green-500/20 text-green-500' : 'bg-secondary text-muted-foreground'
          }`}>
            {isActive ? '进行中' : '已结束'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{vote.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {vote.options.map((option) => {
          const percentage = (option.vote_count / (vote.total_votes || 1)) * 100;
          
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{option.content}</span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <Progress value={percentage} />
              {user && isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(option.id)}
                  disabled={votingId === option.id}
                  className="w-full"
                >
                  {votingId === option.id ? '投票中...' : '投票'}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <UserGroupIcon className="w-4 h-4" />
            {vote.total_votes} 已投票
          </span>
        </div>
        <span className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          {isActive ? (
            <>
              {formatDistanceToNow(new Date(vote.end_time), {
                addSuffix: true,
                locale: zhCN,
              })}结束
            </>
          ) : '已结束'}
        </span>
      </CardFooter>
    </Card>
  );
}