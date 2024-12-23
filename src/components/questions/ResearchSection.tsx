import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BeakerIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { ResearchProposalList } from '../research/ResearchProposalList';
import { CreateResearchProposal } from '../research/CreateResearchProposal';
import { useAuth } from '@/contexts/AuthContext';
import type { ResearchProposal } from '@/types/research';

interface ResearchSectionProps {
  questionId: string;
  proposals: ResearchProposal[];
  onProposalCreate: () => void;
}

export function ResearchSection({ questionId, proposals, onProposalCreate }: ResearchSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-mars-night/80 to-mars-sky/10 backdrop-blur-sm border border-border/50">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative">
        <CardHeader className="space-y-6 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-mars-sky flex items-center gap-2">
                <BeakerIcon className="w-6 h-6" />
                研究计划
              </CardTitle>
              <p className="text-sm text-muted-foreground max-w-2xl">
                我们知道，有的问题没有那么容易回答。我们欢迎专业人士来参与研究，您可以在这里方便地填写研究计划申请经费。
              </p>
            </div>
            {user ? (
              <CreateResearchProposal 
                questionId={questionId}
                onSuccess={onProposalCreate}
                buttonProps={{
                  className: "bg-mars-sky hover:bg-mars-sky/90 flex items-center gap-2",
                  children: <>
                    <PlusIcon className="w-4 h-4" />
                    提交研究计划
                  </>
                }}
              />
            ) : (
              <Button
                className="bg-mars-sky hover:bg-mars-sky/90 flex items-center gap-2"
                onClick={handleSubmitClick}
              >
                <PlusIcon className="w-4 h-4" />
                提交研究计划
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResearchProposalList proposals={proposals} />
          </div>
        </CardContent>
      </div>
    </div>
  );
}