import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Progress } from '../ui/progress';
import { BeakerIcon, UserIcon } from '@heroicons/react/24/outline';
import type { ResearchProposal } from '@/types/research';

interface ResearchProposalListProps {
  proposals: ResearchProposal[];
}

export function ResearchProposalList({ proposals }: ResearchProposalListProps) {
  return (
    <>
      {proposals.map((proposal) => {
        const progress = (proposal.current_funding / proposal.required_funding) * 100;
        
        return (
          <Link 
            key={proposal.id}
            to={`/research/${proposal.id}`}
            className="group block"
          >
            <div className="h-full p-4 bg-gradient-to-br from-mars-sky/10 to-transparent backdrop-blur-sm border border-border/50 rounded-lg 
              hover:from-mars-sky/20 hover:border-mars-sky/30 transition-all duration-300 
              hover:shadow-lg hover:shadow-mars-sky/5 hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-mars-sky">
                      <BeakerIcon className="w-4 h-4" />
                      <h3 className="font-medium line-clamp-2 group-hover:text-mars-sky transition-colors">
                        {proposal.title}
                      </h3>
                    </div>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UserIcon className="w-3 h-3" />
                      {proposal.researcher.username}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-1.5" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">已筹集</span>
                    <span className="font-medium text-mars-sky">
                      {proposal.current_funding}/{proposal.required_funding} MARS
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(proposal.created_at), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
      {proposals.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          暂无研究计划
        </div>
      )}
    </>
  );
}