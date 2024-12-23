/*
  # Add question rewards system
  
  1. Functions
    - Add function to reward MARS tokens for asking questions
    
  2. Changes
    - Update profiles table trigger to handle rewards
    
  3. Security
    - Function is security definer to ensure proper access control
*/

-- Create function to reward MARS tokens for questions
CREATE OR REPLACE FUNCTION reward_question_mars()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 500; -- 每个问题奖励 500 MARS
BEGIN
  -- Update author's MARS balance
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically reward MARS tokens when a question is created
DROP TRIGGER IF EXISTS reward_question_mars_trigger ON questions;
CREATE TRIGGER reward_question_mars_trigger
  AFTER INSERT ON questions
  FOR EACH ROW
  EXECUTE FUNCTION reward_question_mars();