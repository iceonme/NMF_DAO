import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { ChatBubbleLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface ResearchResult {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  discussion_count: number;
  question_id: string;
}

// 模拟数据
const mockResults: ResearchResult[] = [
  {
    id: '1',
    title: '火星土壤改良研究报告',
    content: '通过引入特定微生物和有机物质，我们成功提高了火星土壤的养分含量...',
    likes_count: 156,
    discussion_count: 23,
    question_id: '1',
  },
  {
    id: '2',
    title: '火星大气压力测量分析',
    content: '最新测量数据显示，在实验区域内，大气压力已提升至原始水平的1.2倍...',
    likes_count: 89,
    discussion_count: 15,
    question_id: '2',
  },
];

export function ResultsList() {
  const navigate = useNavigate();
  const results = mockResults;
  
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card 
          key={result.id}
          className="cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => navigate(`/questions/${result.question_id}#results`)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{result.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2">{result.content}</p>
          </CardContent>
          <CardFooter className="justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
              {result.discussion_count} 评论
            </span>
            <span className="flex items-center">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              {result.likes_count} 赞同
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}