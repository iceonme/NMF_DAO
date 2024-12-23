/*
  # Fix question votes table and related functions

  1. Changes
    - Add missing columns to question_votes table
    - Update RLS policies
    - Fix vote_for_question function
*/

-- Ensure question_votes table has correct structure
CREATE TABLE IF NOT EXISTS question_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(question_id, voter_id)
);

-- Enable RLS
ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Question votes are viewable by everyone" ON question_votes;
CREATE POLICY "Question votes are viewable by everyone"
  ON question_votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON question_votes;
CREATE POLICY "Authenticated users can vote"
  ON question_votes FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

-- Update vote_for_question function
CREATE OR REPLACE FUNCTION vote_for_question(
  question_id UUID,
  voter_id UUID
)
RETURNS void AS $$
BEGIN
  -- Check if already voted
  IF EXISTS (
    SELECT 1 FROM question_votes
    WHERE question_votes.question_id = vote_for_question.question_id
    AND question_votes.voter_id = vote_for_question.voter_id
  ) THEN
    RAISE EXCEPTION 'Already voted for this question';
  END IF;

  -- Record the vote
  INSERT INTO question_votes (question_id, voter_id)
  VALUES (question_id, voter_id);

  -- Promote question immediately
  UPDATE questions
  SET is_pending = false
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;