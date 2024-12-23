/*
  # Add answers functionality

  1. New Tables
    - `answers` - Stores question answers
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `content` (text)
      - `likes_count` (integer)
      - `created_at` (timestamp)
    - `answer_likes` - Tracks answer likes
      - `id` (uuid, primary key)
      - `answer_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Functions
    - `reward_answer_creation()` - Rewards users for creating answers
    - `like_answer()` - Handles answer liking functionality

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Answers are viewable by everyone" ON answers;
  DROP POLICY IF EXISTS "Authenticated users can create answers" ON answers;
  DROP POLICY IF EXISTS "Answer likes are viewable by everyone" ON answer_likes;
  DROP POLICY IF EXISTS "Authenticated users can like answers" ON answer_likes;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

CREATE TABLE IF NOT EXISTS answer_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Enable RLS
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_likes ENABLE ROW LEVEL SECURITY;

-- Create new policies
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

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS reward_answer_creation CASCADE;
DROP FUNCTION IF EXISTS like_answer CASCADE;

-- Create functions
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

CREATE OR REPLACE FUNCTION like_answer(answer_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if already liked
  IF EXISTS (
    SELECT 1 FROM answer_likes
    WHERE answer_likes.answer_id = like_answer.answer_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already liked this answer';
  END IF;

  -- Record the like
  INSERT INTO answer_likes (answer_id, user_id)
  VALUES (answer_id, auth.uid());

  -- Update likes count
  UPDATE answers
  SET likes_count = likes_count + 1
  WHERE id = answer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for answer rewards
DROP TRIGGER IF EXISTS reward_answer_trigger ON answers;
CREATE TRIGGER reward_answer_trigger
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION reward_answer_creation();