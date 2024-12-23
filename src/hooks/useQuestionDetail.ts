import { useState, useEffect } from 'react';
import { fetchQuestionById } from '../api/questions';
import type { Question } from '../types/question';

export function useQuestionDetail(id: string) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await fetchQuestionById(id);
        setQuestion(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch question'));
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  return { question, loading, error };
}