-- Create question votes table if not exists
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS question_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
    voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(question_id, voter_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
  ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Question votes are viewable by everyone" ON question_votes;
CREATE POLICY "Question votes are viewable by everyone"
  ON question_votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON question_votes;
CREATE POLICY "Authenticated users can vote"
  ON question_votes FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

-- Function to vote for a question with duplicate check
CREATE OR REPLACE FUNCTION vote_for_question(
  question_id UUID,
  voter_id UUID
)
RETURNS void AS $$
DECLARE
  current_balance INTEGER;
  vote_cost INTEGER := 1;
  vote_count INTEGER;
BEGIN
  -- Check if already voted
  IF EXISTS (
    SELECT 1 FROM question_votes
    WHERE question_votes.question_id = vote_for_question.question_id
    AND question_votes.voter_id = vote_for_question.voter_id
  ) THEN
    RAISE EXCEPTION 'Already voted for this question';
  END IF;

  -- Check voter's balance
  SELECT mars_balance INTO current_balance
  FROM profiles
  WHERE id = voter_id
  FOR UPDATE;

  IF current_balance < vote_cost THEN
    RAISE EXCEPTION 'Insufficient MARS balance';
  END IF;

  -- Deduct MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance - vote_cost
  WHERE id = voter_id;

  -- Record the vote
  INSERT INTO question_votes (question_id, voter_id)
  VALUES (question_id, voter_id);

  -- Check if question should be promoted
  SELECT COUNT(*) INTO vote_count
  FROM question_votes
  WHERE question_votes.question_id = vote_for_question.question_id;

  -- Promote question if it has 10 or more votes
  IF vote_count >= 10 THEN
    UPDATE questions
    SET is_pending = false
    WHERE id = question_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;