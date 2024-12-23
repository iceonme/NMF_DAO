import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionSectionProps {
  questionId: string;
}

export function DiscussionSection({ questionId }: DiscussionSectionProps) {
  const { user } = useAuth();
  
  // 模拟数据
  const discussions = [
    {
      id: '1',
      author: '李四',
      content: '我认为可以考虑使用生物酶来提高土壤活性...',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: '王五',
      content: '建议研究火星本土微生物的可能性...',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>讨论</CardTitle>
        {user && (
          <Button variant="outline" size="sm">
            参与讨论
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">{discussion.author}</span>
              <span className="text-muted-foreground">
                {new Date(discussion.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground">{discussion.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}