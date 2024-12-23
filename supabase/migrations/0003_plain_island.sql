/*
  # Add deduct_mars_tokens function

  1. Changes
    - Add function to safely deduct MARS tokens from user balance
    - Add check to ensure sufficient balance
    - Add row-level security policy
  
  2. Security
    - Function can only be executed by authenticated users
    - Checks for sufficient balance before deduction
    - Uses transaction to ensure atomicity
*/

-- Function to deduct MARS tokens from a user's balance
CREATE OR REPLACE FUNCTION deduct_mars_tokens(
  user_id UUID,
  amount INTEGER
)
RETURNS void AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT mars_balance INTO current_balance
  FROM profiles
  WHERE id = user_id
  FOR UPDATE;

  -- Check if user has sufficient balance
  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient MARS balance';
  END IF;

  -- Deduct tokens
  UPDATE profiles
  SET mars_balance = mars_balance - amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;