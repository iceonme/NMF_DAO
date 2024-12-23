/*
  # Add Discussion Replies Support

  1. Table Structure
    - Create discussion_replies table with proper foreign keys
    - Add indexes for performance
  
  2. Reply Count
    - Add reply_count column to discussions table
    - Create trigger for automatic count updates
*/

-- Create discussion_replies table if not exists
CREATE TABLE IF NOT EXISTS discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_discussion
    FOREIGN KEY (discussion_id) 
    REFERENCES discussions(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_author
    FOREIGN KEY (author_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id 
  ON discussion_replies(discussion_id);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_created_at 
  ON discussion_replies(created_at);

-- Enable RLS
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Discussion replies are viewable by everyone" ON discussion_replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON discussion_replies;

-- Create new policies
CREATE POLICY "Discussion replies are viewable by everyone"
  ON discussion_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON discussion_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Add reply_count to discussions if not exists
DO $$ 
BEGIN
  ALTER TABLE discussions ADD COLUMN reply_count integer DEFAULT 0;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussions
    SET reply_count = reply_count + 1
    WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussions
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_reply_change ON discussion_replies;
CREATE TRIGGER on_reply_change
  AFTER INSERT OR DELETE ON discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_reply_count();

-- Update existing reply counts
UPDATE discussions d
SET reply_count = (
  SELECT COUNT(*)
  FROM discussion_replies r
  WHERE r.discussion_id = d.id
);