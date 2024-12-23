import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { PendingQuestionList } from './PendingQuestionList';
import { QuestionCard } from './QuestionCard';
import { Link } from 'react-router-dom';
import { CreateQuestionDialog } from './CreateQuestionDialog';
import { useAuth } from '@/contexts/AuthContext';
import type { Question } from '@/types/question';

interface QuestionTabsProps {
  questions: {
    pending: Question[];
    active: Question[];
  };
  onVote: () => void;
}

export function QuestionTabs({ questions, onVote }: QuestionTabsProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">探索问题</h2>
        {user && <CreateQuestionDialog />}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="data-[state=active]:bg-mars-sky/20">
            正式问题
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-mars-sky/20">
            待定问题
            {questions.pending.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-mars-sky/20 rounded-full">
                {questions.pending.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {questions.active.map((question) => (
            <Link key={question.id} to={`/questions/${question.id}`}>
              <QuestionCard question={question} />
            </Link>
          ))}
          {questions.active.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              暂无正式问题
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          <PendingQuestionList 
            questions={questions.pending}
            onVote={onVote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}