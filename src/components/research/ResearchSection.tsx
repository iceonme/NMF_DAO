import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface ResearchSectionProps {
  questionId: string;
}

export function ResearchSection({ questionId }: ResearchSectionProps) {
  const { user } = useAuth();

  // 模拟数据
  const researches = [
    {
      id: '1',
      title: '火星土壤微生物培育研究',
      researcher: '赵六',
      required_funding: 5000,
      current_funding: 3200,
      status: 'active',
    },
    {
      id: '2',
      title: '土壤养分循环系统开发',
      researcher: '钱七',
      required_funding: 8000,
      current_funding: 2500,
      status: 'active',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>研究计划</CardTitle>
        {user && (
          <Button variant="outline" size="sm">
            提出研究计划
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {researches.map((research) => {
          const progress = (research.current_funding / research.required_funding) * 100;
          
          return (
            <div key={research.id} className="space-y-4">
              <div>
                <h3 className="font-medium">{research.title}</h3>
                <p className="text-sm text-muted-foreground">
                  研究者：{research.researcher}
                </p>
              </div>
              <div className="space-y-2">
                <Progress value={progress} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>已筹集: {research.current_funding} MARS</span>
                  <span>目标: {research.required_funding} MARS</span>
                </div>
              </div>
              {user && (
                <Button size="sm" className="w-full">
                  支持这项研究
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}