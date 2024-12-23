/*
  # Voting System Schema

  1. Tables
    - votes: Stores vote information and metadata
    - vote_options: Stores options for each vote
    - vote_records: Tracks user votes
  
  2. Changes
    - Add proper foreign key relationships
    - Enable RLS on all tables
    - Add policies for data access
    - Add functions for vote management
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS vote_records CASCADE;
DROP TABLE IF EXISTS vote_options CASCADE;
DROP TABLE IF EXISTS votes CASCADE;

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  total_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0),
  CONSTRAINT description_not_empty CHECK (char_length(description) > 0)
);

-- Create vote options table
CREATE TABLE vote_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id uuid REFERENCES votes(id) ON DELETE CASCADE,
  content text NOT NULL,
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Create vote records table
CREATE TABLE vote_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id uuid REFERENCES votes(id) ON DELETE CASCADE,
  option_id uuid REFERENCES vote_options(id) ON DELETE CASCADE,
  voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(vote_id, voter_id)
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for votes
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- RLS policies for vote options
CREATE POLICY "Vote options are viewable by everyone"
  ON vote_options FOR SELECT
  USING (true);

CREATE POLICY "Vote options can be created with votes"
  ON vote_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM votes
      WHERE id = vote_id
      AND creator_id = auth.uid()
    )
  );

-- RLS policies for vote records
CREATE POLICY "Vote records are viewable by everyone"
  ON vote_records FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can cast votes"
  ON vote_records FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

-- Function to create a vote with options
CREATE OR REPLACE FUNCTION create_vote(
  question_id UUID,
  title TEXT,
  description TEXT,
  end_time TIMESTAMPTZ,
  options TEXT[]
)
RETURNS UUID AS $$
DECLARE
  new_vote_id UUID;
BEGIN
  -- Insert the vote
  INSERT INTO votes (
    question_id,
    creator_id,
    title,
    description,
    end_time
  ) VALUES (
    question_id,
    auth.uid(),
    title,
    description,
    end_time
  ) RETURNING id INTO new_vote_id;

  -- Insert options
  INSERT INTO vote_options (vote_id, content)
  SELECT new_vote_id, unnest(options);

  RETURN new_vote_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cast a vote
CREATE OR REPLACE FUNCTION cast_vote(option_id UUID)
RETURNS void AS $$
DECLARE
  vote_record RECORD;
BEGIN
  -- Get vote info
  SELECT v.* INTO vote_record
  FROM vote_options o
  JOIN votes v ON o.vote_id = v.id
  WHERE o.id = option_id;

  -- Check if vote exists
  IF vote_record IS NULL THEN
    RAISE EXCEPTION 'Vote option not found';
  END IF;

  -- Check if vote is still active
  IF vote_record.status != 'active' THEN
    RAISE EXCEPTION 'This vote is no longer active';
  END IF;

  -- Check if already voted
  IF EXISTS (
    SELECT 1 FROM vote_records
    WHERE vote_id = vote_record.id
    AND voter_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already voted in this vote';
  END IF;

  -- Record the vote
  INSERT INTO vote_records (vote_id, option_id, voter_id)
  VALUES (vote_record.id, option_id, auth.uid());

  -- Update vote counts
  UPDATE vote_options
  SET vote_count = vote_count + 1
  WHERE id = option_id;

  UPDATE votes
  SET total_votes = total_votes + 1
  WHERE id = vote_record.id;

  -- Check if vote should be completed
  IF vote_record.end_time <= now() THEN
    UPDATE votes
    SET status = 'completed'
    WHERE id = vote_record.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically complete expired votes
CREATE OR REPLACE FUNCTION complete_expired_votes()
RETURNS void AS $$
BEGIN
  UPDATE votes
  SET status = 'completed'
  WHERE status = 'active'
  AND end_time <= now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to complete expired votes
CREATE OR REPLACE FUNCTION check_vote_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time <= now() THEN
    NEW.status = 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vote_expiry_trigger
  BEFORE INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION check_vote_expiry();