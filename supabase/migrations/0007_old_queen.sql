/*
  # Fix discussions RLS policies

  1. Changes
    - Update RLS policies for discussions table
    - Add proper join conditions for author information
    - Ensure authenticated users can create discussions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Discussions are viewable by everyone" ON discussions;
DROP POLICY IF EXISTS "Authenticated users can insert discussions" ON discussions;

-- Create new policies
CREATE POLICY "Discussions are viewable by everyone"
ON discussions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create discussions"
ON discussions FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = author_id AND
  EXISTS (
    SELECT 1 FROM questions
    WHERE id = question_id
  )
);

-- Update discussions table to ensure proper joins
ALTER TABLE discussions
DROP CONSTRAINT IF EXISTS discussions_author_id_fkey,
ADD CONSTRAINT discussions_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES profiles(id)
  ON DELETE CASCADE;