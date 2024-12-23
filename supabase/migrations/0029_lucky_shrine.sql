-- Function to reward excellent answer
CREATE OR REPLACE FUNCTION reward_excellent_answer()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 50; -- 50 MARS for excellent answer
BEGIN
  IF NEW.is_accepted = true AND OLD.is_accepted = false THEN
    -- Award MARS tokens
    UPDATE profiles
    SET mars_balance = mars_balance + reward_amount
    WHERE id = NEW.author_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for excellent answer rewards
DROP TRIGGER IF EXISTS reward_excellent_answer_trigger ON answers;
CREATE TRIGGER reward_excellent_answer_trigger
  AFTER UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION reward_excellent_answer();

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Question authors can accept answers" ON answers;

-- Add RLS policy for accepting answers
CREATE POLICY "Question authors can accept answers"
  ON answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM questions
      WHERE id = answers.question_id
      AND author_id = auth.uid()
    )
  )
  WITH CHECK (true);