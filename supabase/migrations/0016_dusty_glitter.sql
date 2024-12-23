/*
  # 添加讨论回复功能

  1. 新建表
    - discussion_replies：存储讨论回复
      - id: UUID 主键
      - discussion_id: 关联的讨论 ID
      - author_id: 回复作者 ID
      - content: 回复内容
      - created_at: 创建时间

  2. 安全设置
    - 启用行级安全
    - 添加查看和创建的安全策略

  3. 触发器
    - 更新讨论的回复计数
*/

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Enable RLS
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Discussion replies are viewable by everyone"
  ON discussion_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON discussion_replies FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM discussions
      WHERE id = discussion_id
    )
  );

-- Function to update reply count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment reply count
    UPDATE discussions
    SET reply_count = reply_count + 1
    WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement reply count
    UPDATE discussions
    SET reply_count = reply_count - 1
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating reply count
DROP TRIGGER IF EXISTS update_discussion_reply_count_trigger ON discussion_replies;
CREATE TRIGGER update_discussion_reply_count_trigger
  AFTER INSERT OR DELETE ON discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_reply_count();

-- Add reply_count column to discussions if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'reply_count'
  ) THEN
    ALTER TABLE discussions ADD COLUMN reply_count integer DEFAULT 0;
  END IF;
END $$;