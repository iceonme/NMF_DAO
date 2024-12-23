import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { HandThumbUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { likeAnswer } from '@/api/answers';
import { toast } from '../ui/use-toast';
import { CommentList } from './CommentList';
import { CreateComment } from './CreateComment';
import type { Answer } from '@/types/answer';

interface AnswerListProps {
  answers: Answer[];
  onLike: () => void;
}

export function AnswerList({ answers, onLike }: AnswerListProps) {
  const { user } = useAuth();
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = async (answerId: string) => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后即可点赞回答",
        variant: "destructive",
      });
      return;
    }

    setLikingId(answerId);
    try {
      await likeAnswer(answerId);
      onLike();
      toast({
        title: "点赞成功",
        description: "感谢你的支持！",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      // 处理已点赞的情况
      if (message.includes("Already liked")) {
        toast({
          title: "已经点赞过了",
          description: "每个回答只能点赞一次哦",
        });
      } else {
        toast({
          title: "点赞失败",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setLikingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {answers.map((answer) => (
        <Card key={answer.id} className="bg-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{answer.author.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(answer.created_at), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
            {answer.is_accepted && (
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                已采纳
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{answer.content}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(answer.id)}
                  disabled={likingId === answer.id}
                  className={`text-muted-foreground hover:text-foreground ${
                    answer.has_liked ? 'text-mars-sky hover:text-mars-sky' : ''
                  }`}
                >
                  <HandThumbUpIcon className="w-4 h-4 mr-1" />
                  {answer.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedAnswerId(
                    expandedAnswerId === answer.id ? null : answer.id
                  )}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                  {answer.comments_count} 评论
                </Button>
              </div>
            </div>

            {expandedAnswerId === answer.id && (
              <div className="pl-6 border-l-2 border-secondary space-y-4">
                <CommentList answerId={answer.id} />
                <CreateComment 
                  answerId={answer.id}
                  onSuccess={() => {
                    setExpandedAnswerId(null);
                    onLike();
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {answers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无回答，来分享你的见解吧
        </div>
      )}
    </div>
  );
}