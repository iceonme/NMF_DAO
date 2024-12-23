import { useState, useEffect } from 'react';
import { fetchResearchProposalById } from '@/api/research';
import type { ResearchProposal } from '@/types/research';

export function useResearchDetail(id: string) {
  const [proposal, setProposal] = useState<ResearchProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProposal = async () => {
      try {
        const data = await fetchResearchProposalById(id);
        setProposal(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch research proposal'));
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [id]);

  return { proposal, loading, error };
}