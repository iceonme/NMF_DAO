import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ShareIcon } from '@heroicons/react/24/outline';
import { toast } from '../ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { shareQuestion } from '@/api/questions';
import { showRewardToast } from '../ui/reward-toast';
import { getShareUrl } from '@/lib/url';

interface ShareButtonProps {
  questionId: string;
  title: string;
}

export function ShareButton({ questionId, title }: ShareButtonProps) {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后即可分享问题",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      // 生成分享链接
      const shareUrl = getShareUrl(questionId);
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareUrl);
      
      // 记录分享并获得奖励
      await shareQuestion(questionId);
      
      showRewardToast({
        title: "分享成功",
        amount: 5
      });
    } catch (error) {
      toast({
        title: "分享失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center gap-2"
    >
      <ShareIcon className="w-4 h-4" />
      {isSharing ? '分享中...' : '分享'}
    </Button>
  );
}