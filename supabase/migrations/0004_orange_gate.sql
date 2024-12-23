/*
  # Add question status column

  1. Changes
    - Add status column to questions table with default value 'pending'
    - Update existing questions to have 'pending' status
    - Add status to database types

  2. Security
    - No changes to RLS policies needed
*/

-- Add status column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS status text 
DEFAULT 'pending' 
CHECK (status IN ('pending', 'claimed', 'researching', 'voting', 'closed'));

-- Update existing questions to have pending status
UPDATE questions 
SET status = 'pending' 
WHERE status IS NULL;