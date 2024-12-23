/*
  # Fix answers table structure

  1. Changes
    - Add missing columns to answers table
    - Add proper foreign key constraints
    - Update RLS policies
    - Fix answer creation function
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS answer_comments CASCADE;
DROP TABLE IF EXISTS answer_likes CASCADE;
DROP TABLE IF EXISTS answers CASCADE;

-- Create answers table
CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Create answer likes table
CREATE TABLE answer_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Create answer comments table
CREATE TABLE answer_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Enable RLS
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Answers are viewable by everyone"
  ON answers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON answers FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Answer likes are viewable by everyone"
  ON answer_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like answers"
  ON answer_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Answer comments are viewable by everyone"
  ON answer_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON answer_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Function to reward answer creation
CREATE OR REPLACE FUNCTION reward_answer_creation()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 10; -- 10 MARS per answer
BEGIN
  -- Award MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for answer rewards
DROP TRIGGER IF EXISTS reward_answer_trigger ON answers;
CREATE TRIGGER reward_answer_trigger
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION reward_answer_creation();