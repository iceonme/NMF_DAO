import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fundResearchProposal } from '@/api/research';
import { toast } from '../ui/use-toast';
import type { ResearchProposal } from '@/types/research';

interface FundingProgressProps {
  proposal: ResearchProposal;
}

export function FundingProgress({ proposal }: FundingProgressProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progress = (proposal.current_funding / proposal.required_funding) * 100;

  const handleFund = async () => {
    if (!user || !amount) return;

    setIsSubmitting(true);
    try {
      await fundResearchProposal(proposal.id, parseInt(amount, 10));
      setAmount('');
      toast({
        title: "资助成功",
        description: `成功资助 ${amount} MARS`,
      });
    } catch (error) {
      toast({
        title: "资助失败",
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
        <CardTitle>众筹进度</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>已筹集: {proposal.current_funding} MARS</span>
            <span>目标: {proposal.required_funding} MARS</span>
          </div>
        </div>

        {user && proposal.status === 'pending' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
                placeholder="输入资助金额"
              />
              <Button
                onClick={handleFund}
                disabled={isSubmitting || !amount}
                className="bg-mars-sky hover:bg-mars-sky/90"
              >
                {isSubmitting ? '资助中...' : '资助'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}