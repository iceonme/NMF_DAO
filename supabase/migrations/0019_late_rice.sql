/*
  # Add discussion and reply rewards
  
  1. Changes
    - Add triggers for discussion and reply rewards
  
  2. Security
    - Functions run with SECURITY DEFINER
*/

-- Function to reward discussion creation
CREATE OR REPLACE FUNCTION reward_discussion_creation()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 5; -- 5 MARS per discussion
BEGIN
  -- Award MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reward reply creation
CREATE OR REPLACE FUNCTION reward_reply_creation()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 5; -- 5 MARS per reply
BEGIN
  -- Award MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS reward_discussion_trigger ON discussions;
CREATE TRIGGER reward_discussion_trigger
  AFTER INSERT ON discussions
  FOR EACH ROW
  EXECUTE FUNCTION reward_discussion_creation();

DROP TRIGGER IF EXISTS reward_reply_trigger ON discussion_replies;
CREATE TRIGGER reward_reply_trigger
  AFTER INSERT ON discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION reward_reply_creation();