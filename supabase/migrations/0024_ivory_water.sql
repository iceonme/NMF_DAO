-- Drop existing like_answer function
DROP FUNCTION IF EXISTS like_answer;

-- Create improved like_answer function with toggle behavior
CREATE OR REPLACE FUNCTION like_answer(answer_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if already liked
  IF EXISTS (
    SELECT 1 FROM answer_likes
    WHERE answer_likes.answer_id = like_answer.answer_id
    AND user_id = auth.uid()
  ) THEN
    -- Unlike: Remove the like and decrease count
    DELETE FROM answer_likes
    WHERE answer_likes.answer_id = like_answer.answer_id
    AND user_id = auth.uid();

    UPDATE answers
    SET likes_count = likes_count - 1
    WHERE id = answer_id;
  ELSE
    -- Like: Add the like and increase count
    INSERT INTO answer_likes (answer_id, user_id)
    VALUES (answer_id, auth.uid());

    UPDATE answers
    SET likes_count = likes_count + 1
    WHERE id = answer_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;