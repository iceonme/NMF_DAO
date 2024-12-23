/*
  # Add answer system

  1. New Tables
    - `answers` - Stores question answers
    - `answer_likes` - Tracks answer likes
    - `answer_comments` - Stores comments on answers

  2. Functions
    - `like_answer` - Handles answer liking logic
    - `reward_answer_creation` - Rewards users for creating answers
    - `reward_comment_creation` - Rewards users for commenting

  3. Triggers
    - Auto-update likes count
    - Auto-update comments count
    - Auto-reward users
*/

-- Create answers table
CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
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
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Create answer comments table
CREATE TABLE answer_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id uuid REFERENCES answers(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Function to like an answer
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

-- Function to reward comment creation
CREATE OR REPLACE FUNCTION reward_comment_creation()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 5; -- 5 MARS per comment
BEGIN
  -- Award MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_answer_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE answers
    SET comments_count = comments_count + 1
    WHERE id = NEW.answer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE answers
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.answer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER reward_answer_trigger
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION reward_answer_creation();

CREATE TRIGGER reward_comment_trigger
  AFTER INSERT ON answer_comments
  FOR EACH ROW
  EXECUTE FUNCTION reward_comment_creation();

CREATE TRIGGER update_comments_count_trigger
  AFTER INSERT OR DELETE ON answer_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_answer_comments_count();