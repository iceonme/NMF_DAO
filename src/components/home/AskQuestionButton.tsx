import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CreateQuestionDialog } from '../questions/CreateQuestionDialog';
import { AuthDialog } from '../auth/AuthDialog';

export function AskQuestionButton() {
  const { user } = useAuth();

  if (user) {
    return <CreateQuestionDialog />;
  }

  return (
    <AuthDialog 
      defaultTab="signup"
      trigger={
        <Button className="bg-mars-sky hover:bg-mars-sky/90">
          提出问题
        </Button>
      }
    />
  );
}