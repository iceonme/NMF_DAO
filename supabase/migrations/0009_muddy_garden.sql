-- Update the reward amount for questions
CREATE OR REPLACE FUNCTION reward_question_mars()
RETURNS TRIGGER AS $$
DECLARE
  reward_amount INTEGER := 10; -- 修改为10 MARS奖励
BEGIN
  -- Update author's MARS balance
  UPDATE profiles
  SET mars_balance = mars_balance + reward_amount
  WHERE id = NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;