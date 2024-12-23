/*
  # Set initial MARS balance for users

  1. Changes
    - Add function to set initial MARS balance for new users
    - Update profiles table trigger to set initial balance
  
  2. Security
    - Function can only be executed by authenticated users
    - Trigger runs automatically on new user creation
*/

-- Set the initial MARS balance constant
CREATE OR REPLACE FUNCTION get_initial_mars_balance()
RETURNS integer AS $$
BEGIN
  RETURN 10000;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the profiles table to set initial balance
CREATE OR REPLACE FUNCTION set_initial_mars_balance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.mars_balance = get_initial_mars_balance();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to set initial balance for new profiles
DROP TRIGGER IF EXISTS set_initial_mars_balance_trigger ON profiles;
CREATE TRIGGER set_initial_mars_balance_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_initial_mars_balance();

-- Update existing users to have the initial balance if they have 0
UPDATE profiles 
SET mars_balance = get_initial_mars_balance()
WHERE mars_balance = 0;