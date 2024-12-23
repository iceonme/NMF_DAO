/*
  # Add sharing rewards functionality
  
  1. Changes
    - Add share_count to questions table
    - Add question_shares table to track shares
    - Add functions for sharing rewards
  
  2. Security
    - Enable RLS on question_shares table
    - Add policies for viewing and creating shares
*/

-- Add share_count to questions if not exists
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0;

-- Create question shares table
CREATE TABLE IF NOT EXISTS question_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  sharer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(question_id, sharer_id)
);

-- Enable RLS
ALTER TABLE question_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Question shares are viewable by everyone"
  ON question_shares FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can share"
  ON question_shares FOR INSERT
  WITH CHECK (auth.uid() = sharer_id);

-- Function to share a question and get reward
CREATE OR REPLACE FUNCTION share_question(question_id UUID)
RETURNS void AS $$
DECLARE
  reward_amount INTEGER := 5; -- 5 MARS per share
BEGIN
  -- Check if already shared
  IF EXISTS (
    SELECT 1 FROM question_shares
    WHERE question_shares.question_id = share_question.question_id
    AND sharer_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already shared this question';
  END IF;

  -- Record the share
  INSERT INTO question_shares (question_id, sharer_id)
  VALUES (question_id, auth.uid());

  -- Update share count
  UPDATE questions
  SET share_count = share_count + 1
  WHERE id = question_id;

  -- Award MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;