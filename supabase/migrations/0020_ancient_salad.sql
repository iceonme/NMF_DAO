/*
  # Research Discussions Setup
  
  1. New Tables
    - research_discussions
      - id (uuid, primary key)
      - proposal_id (uuid, references research_proposals)
      - author_id (uuid, references profiles)
      - content (text)
      - created_at (timestamp)
  
  2. Functions
    - fund_research_proposal: Function to handle funding research proposals
*/

-- Create research discussions table
CREATE TABLE IF NOT EXISTS research_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES research_proposals(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Enable RLS
ALTER TABLE research_discussions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Research discussions are viewable by everyone"
  ON research_discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON research_discussions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Function to fund research proposals
CREATE OR REPLACE FUNCTION fund_research_proposal(
  proposal_id UUID,
  amount INTEGER
)
RETURNS void AS $$
DECLARE
  current_balance INTEGER;
  proposal_record RECORD;
BEGIN
  -- Check user's balance
  SELECT mars_balance INTO current_balance
  FROM profiles
  WHERE id = auth.uid()
  FOR UPDATE;

  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient MARS balance';
  END IF;

  -- Get proposal details
  SELECT * INTO proposal_record
  FROM research_proposals
  WHERE id = proposal_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Research proposal not found';
  END IF;

  IF proposal_record.status != 'pending' THEN
    RAISE EXCEPTION 'Research proposal is not accepting funding';
  END IF;

  -- Update proposal funding
  UPDATE research_proposals
  SET 
    current_funding = current_funding + amount,
    status = CASE 
      WHEN current_funding + amount >= required_funding THEN 'active'
      ELSE status
    END
  WHERE id = proposal_id;

  -- Deduct MARS from funder
  UPDATE profiles
  SET mars_balance = mars_balance - amount
  WHERE id = auth.uid();

  -- Add MARS to researcher
  UPDATE profiles
  SET mars_balance = mars_balance + amount
  WHERE id = proposal_record.researcher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;