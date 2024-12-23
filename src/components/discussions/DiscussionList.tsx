import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from '../ui/button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { CreateReply } from './CreateReply';
import type { Discussion } from '@/types/discussion';

interface DiscussionListProps {
  discussions: Discussion[];
  onReply: () => void;
}

export function DiscussionList({ discussions, onReply }: DiscussionListProps) {
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="space-y-4">
          {/* Main discussion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{discussion.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(discussion.created_at), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </div>
              {discussion.reply_count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedDiscussionId(
                    expandedDiscussionId === discussion.id ? null : discussion.id
                  )}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                  {discussion.reply_count} 条回复
                </Button>
              )}
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">{discussion.content}</p>
            
            {/* Reply button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedDiscussionId(
                  expandedDiscussionId === discussion.id ? null : discussion.id
                )}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                回复
              </Button>
            </div>
          </div>

          {/* Replies and reply form */}
          {expandedDiscussionId === discussion.id && (
            <div className="pl-6 border-l-2 border-secondary space-y-4 animate-expand">
              {/* Reply list */}
              {discussion.replies?.map((reply) => (
                <div key={reply.id} className="space-y-2 bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{reply.author.username}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}

              {/* Reply form */}
              <CreateReply
                discussionId={discussion.id}
                onSuccess={onReply}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}