import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchResearchDiscussions, createResearchDiscussion } from '@/api/research';
import { toast } from '../ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ResearchDiscussionsProps {
  proposalId: string;
}

export function ResearchDiscussions({ proposalId }: ResearchDiscussionsProps) {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDiscussions = async () => {
    try {
      const data = await fetchResearchDiscussions(proposalId);
      setDiscussions(data);
    } catch (error) {
      console.error('Error loading discussions:', error);
    }
  };

  useEffect(() => {
    loadDiscussions();
  }, [proposalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createResearchDiscussion(proposalId, content);
      setContent('');
      loadDiscussions();
      toast({
        title: "评论已发布",
      });
    } catch (error) {
      toast({
        title: "发布失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>研究讨论</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="space-y-2 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{discussion.author.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(discussion.created_at), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {discussion.content}
            </p>
          </div>
        ))}

        {user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
              placeholder="分享你的想法..."
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-mars-sky hover:bg-mars-sky/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? '发布中...' : '发布评论'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}