import React from 'react';
import { useParams } from 'react-router-dom';
import { useResearchDetail } from '@/hooks/useResearchDetail';
import { ResearchInfo } from '@/components/research/ResearchInfo';
import { FundingProgress } from '@/components/research/FundingProgress';
import { ResearchDiscussions } from '@/components/research/ResearchDiscussions';

export default function ResearchDetail() {
  const { id } = useParams<{ id: string }>();
  const { proposal, loading, error } = useResearchDetail(id!);

  if (loading) {
    return <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-secondary rounded-lg" />
      <div className="h-48 bg-secondary rounded-lg" />
      <div className="h-96 bg-secondary rounded-lg" />
    </div>;
  }

  if (error || !proposal) {
    return <div className="text-destructive">加载研究计划失败</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ResearchInfo proposal={proposal} />
      <FundingProgress proposal={proposal} />
      <ResearchDiscussions proposalId={id!} />
    </div>
  );
}