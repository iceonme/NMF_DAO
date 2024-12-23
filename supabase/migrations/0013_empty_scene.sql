/*
  # Update vote threshold for question promotion

  1. Changes
    - Reduce the vote threshold from 10 to 1 vote for promoting questions
    - Keep all other functionality the same (MARS cost, duplicate vote check, etc.)
*/

-- Function to vote for a question with 1 vote threshold
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

  -- Promote question immediately after first vote
  UPDATE questions
  SET is_pending = false
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;