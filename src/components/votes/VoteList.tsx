import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Vote {
  id: string;
  title: string;
  description: string;
  end_time: string;
  total_votes: number;
  question_id: string;
}

// 模拟数据
const mockVotes: Vote[] = [
  {
    id: '1',
    title: '火星基地选址方案投票',
    description: '为火星第一个永久定居点选择最佳位置',
    end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    total_votes: 234,
    question_id: '1',
  },
  {
    id: '2',
    title: '能源系统方案决策',
    description: '选择火星基地主要能源系统类型',
    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    total_votes: 189,
    question_id: '2',
  },
];

export function VoteList() {
  const navigate = useNavigate();
  const votes = mockVotes;
  
  return (
    <div className="space-y-4">
      {votes.map((vote) => (
        <Card 
          key={vote.id}
          className="cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => navigate(`/questions/${vote.question_id}#vote`)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{vote.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2">{vote.description}</p>
          </CardContent>
          <CardFooter className="justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {vote.total_votes} 已投票
            </span>
            <span className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(vote.end_time), { 
                addSuffix: true,
                locale: zhCN 
              })}后结束
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}