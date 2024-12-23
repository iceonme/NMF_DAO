/*
  # Fix Research Proposals RLS Policies

  1. Changes
    - Update RLS policies for research proposals
    - Add proper authorization checks
    - Ensure researcher_id is set correctly
*/

-- Update RLS policies for research proposals
DROP POLICY IF EXISTS "Research proposals are viewable by everyone" ON research_proposals;
DROP POLICY IF EXISTS "Authenticated users can create research proposals" ON research_proposals;

-- Allow everyone to view research proposals
CREATE POLICY "Research proposals are viewable by everyone"
  ON research_proposals FOR SELECT
  USING (true);

-- Allow authenticated users to create research proposals
CREATE POLICY "Authenticated users can create research proposals"
  ON research_proposals FOR INSERT
  WITH CHECK (
    auth.uid() = researcher_id AND
    EXISTS (
      SELECT 1 FROM questions
      WHERE id = question_id
    )
  );

-- Function to create research proposal
CREATE OR REPLACE FUNCTION create_research_proposal(
  question_id UUID,
  title TEXT,
  description TEXT,
  required_funding INTEGER
)
RETURNS UUID AS $$
DECLARE
  new_proposal_id UUID;
BEGIN
  -- Insert the proposal
  INSERT INTO research_proposals (
    question_id,
    researcher_id,
    title,
    description,
    required_funding,
    current_funding,
    status
  ) VALUES (
    question_id,
    auth.uid(),
    title,
    description,
    required_funding,
    0,
    'pending'
  ) RETURNING id INTO new_proposal_id;

  RETURN new_proposal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;