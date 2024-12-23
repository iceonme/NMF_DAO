import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BeakerIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { ResearchProposal } from '@/types/research';

interface ResearchInfoProps {
  proposal: ResearchProposal;
}

export function ResearchInfo({ proposal }: ResearchInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{proposal.title}</CardTitle>
          <span className="px-3 py-1 text-sm bg-mars-sky/20 text-mars-sky rounded-full">
            {proposal.status === 'pending' ? '筹款中' : 
             proposal.status === 'active' ? '研究中' : '已完成'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            {proposal.researcher.username}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {formatDistanceToNow(new Date(proposal.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{proposal.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}