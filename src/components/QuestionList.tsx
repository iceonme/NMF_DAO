import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './ui/card';
import { ChatBubbleLeftIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Question {
  id: string;
  title: string;
  content: string;
  is_quality: boolean;
  discussion_count: number;
  researcher_count: number;
  vote_count: number;
  created_at: string;
}

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 gap-4 animate-pulse">
      {[1,2,3].map(i => (
        <Card key={i} className="bg-secondary">
          <CardHeader className="h-24" />
          <CardContent className="h-16" />
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {questions.map((question) => (
        <Link key={question.id} to={`/questions/${question.id}`}>
          <Card className="hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {question.title}
                {question.is_quality && (
                  <CheckCircleIcon className="w-6 h-6 text-mars-sky" />
                )}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {question.content}
              </CardDescription>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground space-x-6">
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                <span>{question.discussion_count} 讨论</span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                <span>{question.researcher_count} 研究者</span>
              </div>
              <div>
                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuestionList;