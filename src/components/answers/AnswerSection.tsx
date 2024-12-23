import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { AnswerList } from './AnswerList';
import { CreateAnswer } from './CreateAnswer';
import type { Answer } from '@/types/answer';

interface AnswerSectionProps {
  questionId: string;
  answers: Answer[];
  onAnswerCreate: () => void;
  onAnswerLike: () => void;
}

export function AnswerSection({ 
  questionId, 
  answers,
  onAnswerCreate,
  onAnswerLike
}: AnswerSectionProps) {
  const excellentAnswers = answers.filter(a => a.is_accepted);
  const regularAnswers = answers.filter(a => !a.is_accepted);

  return (
    <Card className="bg-gradient-to-br from-secondary/80 to-background border-border/50">
      <CardHeader className="border-b border-border/50">
        <div className="space-y-2">
          <CardTitle className="text-xl">回答 ({answers.length})</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-mars-sky" />
            回答问题可以获得10 MARS奖励，成为优秀回答并被收录到最终结果条款中可以获得更多奖励！
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <CreateAnswer 
          questionId={questionId}
          onSuccess={onAnswerCreate}
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">全部回答</TabsTrigger>
            <TabsTrigger value="excellent" className="relative">
              优秀回答
              {excellentAnswers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-mars-sky rounded-full flex items-center justify-center">
                  {excellentAnswers.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <AnswerList 
              answers={regularAnswers}
              onLike={onAnswerLike}
            />
          </TabsContent>
          <TabsContent value="excellent" className="mt-6">
            <AnswerList 
              answers={excellentAnswers}
              onLike={onAnswerLike}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}