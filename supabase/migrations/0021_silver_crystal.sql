/*
  # Update Reward System and Research Functions
  
  1. Changes
    - Update question reward amounts
    - Add promotion reward function
  
  2. Security
    - Enable RLS for all operations
    - Secure reward distribution
*/

-- Update question reward function
CREATE OR REPLACE FUNCTION reward_question_mars()
RETURNS TRIGGER AS $$
DECLARE
  initial_reward INTEGER := 10; -- Initial reward for asking
BEGIN
  -- Award initial MARS tokens
  UPDATE profiles
  SET mars_balance = mars_balance + initial_reward
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reward question promotion
CREATE OR REPLACE FUNCTION reward_question_promotion()
RETURNS TRIGGER AS $$
DECLARE
  promotion_reward INTEGER := 1000; -- Reward for becoming active
BEGIN
  IF NEW.is_pending = false AND OLD.is_pending = true THEN
    -- Award promotion reward
    UPDATE profiles
    SET mars_balance = mars_balance + promotion_reward
    WHERE id = NEW.author_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for promotion reward
DROP TRIGGER IF EXISTS reward_question_promotion_trigger ON questions;
CREATE TRIGGER reward_question_promotion_trigger
  AFTER UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION reward_question_promotion();