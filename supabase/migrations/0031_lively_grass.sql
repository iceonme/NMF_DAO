-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS reward_excellent_answer_trigger ON answers;
DROP FUNCTION IF EXISTS reward_excellent_answer();

-- Create improved function to reward excellent answer
CREATE OR REPLACE FUNCTION reward_excellent_answer()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 50; -- 50 MARS for excellent answer
BEGIN
  -- Only reward if answer is being marked as accepted
  IF NEW.is_accepted = true AND (OLD.is_accepted = false OR OLD.is_accepted IS NULL) THEN
    -- Award MARS tokens
    UPDATE profiles
    SET mars_balance = mars_balance + reward_amount
    WHERE id = NEW.author_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for excellent answer rewards
CREATE TRIGGER reward_excellent_answer_trigger
  AFTER UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION reward_excellent_answer();

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Question authors can accept answers" ON answers;

-- Add RLS policy for accepting answers with simplified check
CREATE POLICY "Question authors can accept answers"
  ON answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM questions
      WHERE id = answers.question_id
      AND author_id = auth.uid()
    )
  );

-- Create a trigger function to enforce update restrictions
CREATE OR REPLACE FUNCTION enforce_answer_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.question_id != OLD.question_id OR
     NEW.author_id != OLD.author_id OR
     NEW.content != OLD.content OR
     NEW.created_at != OLD.created_at THEN
    RAISE EXCEPTION 'Only is_accepted field can be updated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for enforcing update restrictions
DROP TRIGGER IF EXISTS enforce_answer_updates_trigger ON answers;
CREATE TRIGGER enforce_answer_updates_trigger
  BEFORE UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION enforce_answer_updates();