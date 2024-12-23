import { useState, useEffect, useCallback } from 'react';
import { fetchQuestions } from '../api/questions';
import type { Question } from '../types/question';

interface QuestionsState {
  pending: Question[];
  active: Question[];
}

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionsState>({ pending: [], active: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return { 
    questions, 
    loading, 
    error,
    refetch: loadQuestions
  };
}