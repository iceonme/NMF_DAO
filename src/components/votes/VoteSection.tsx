import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

interface VoteSectionProps {
  questionId: string;
}

export function VoteSection({ questionId }: VoteSectionProps) {
  // Mock votes based on question context
  const mockVotes = [
    {
      id: '1',
      title: '火星基地选址方案',
      options: [
        { id: '1', name: '火星赤道地区', votes: 156 },
        { id: '2', name: '火星极地', votes: 89 },
        { id: '3', name: '火星山谷', votes: 45 },
      ],
      total_votes: 290,
      end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: '火星资源分配机制',
      options: [
        { id: '1', name: '平均分配制', votes: 234 },
        { id: '2', name: '贡献度分配制', votes: 567 },
        { id: '3', name: '混合分配制', votes: 189 },
      ],
      total_votes: 990,
      end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>投票</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockVotes.map((vote) => (
          <div key={vote.id} className="space-y-4">
            <h3 className="font-medium">{vote.title}</h3>
            <div className="space-y-4">
              {vote.options.map((option) => {
                const percentage = (option.votes / vote.total_votes) * 100;
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{option.name}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" />
                {vote.total_votes} 已投票
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {new Date(vote.end_time) > new Date() ? '进行中' : '已结束'}
              </span>
            </div>
          </div>
        ))}
        {mockVotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            暂无投票
          </div>
        )}
      </CardContent>
    </Card>
  );
}