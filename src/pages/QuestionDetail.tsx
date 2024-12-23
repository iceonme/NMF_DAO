import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionDetail } from '@/hooks/useQuestionDetail';
import { QuestionInfo } from '@/components/questions/QuestionInfo';
import { AnswerSection } from '@/components/answers/AnswerSection';
import { ResearchSection } from '@/components/questions/ResearchSection';
import { VoteSection } from '@/components/votes/VoteSection';
import { fetchAnswers } from '@/api/answers';
import { fetchResearchProposals } from '@/api/research';
import type { Answer } from '@/types/answer';
import type { ResearchProposal } from '@/types/research';

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const { question, loading, error } = useQuestionDetail(id!);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);

  const loadAnswers = async () => {
    if (!id) return;
    const data = await fetchAnswers(id);
    setAnswers(data);
  };

  const loadProposals = async () => {
    if (!id) return;
    const data = await fetchResearchProposals(id);
    setProposals(data);
  };

  useEffect(() => {
    loadAnswers();
    loadProposals();
  }, [id]);

  if (loading) {
    return <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-secondary rounded-lg" />
      <div className="h-48 bg-secondary rounded-lg" />
      <div className="h-96 bg-secondary rounded-lg" />
    </div>;
  }

  if (error || !question) {
    return <div className="text-destructive">加载问题详情失败</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <QuestionInfo question={question} />
      
      <ResearchSection 
        questionId={id!}
        proposals={proposals}
        onProposalCreate={loadProposals}
      />

      <AnswerSection 
        questionId={id!}
        answers={answers}
        onAnswerCreate={loadAnswers}
        onAnswerLike={loadAnswers}
      />

      <VoteSection questionId={id!} />
    </div>
  );
}