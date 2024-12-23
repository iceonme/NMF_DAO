/*
  # Add sample Q&A data

  1. Sample Data
    - Add sample answers
    - Add sample comments
    - Add sample likes
  
  2. Updates
    - Update answer counts
    - Update comment counts
*/

-- Insert sample answers
INSERT INTO answers (question_id, author_id, content, likes_count, comments_count, is_accepted)
SELECT 
  q.id as question_id,
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1) as author_id,
  a.content,
  a.likes_count,
  a.comments_count,
  a.is_accepted
FROM questions q
CROSS JOIN (VALUES
  (
    '建议采用分布式自治系统，每个火星基地都有一定程度的自治权，同时通过DAO机制实现跨基地协作。这样可以在保持效率的同时，确保决策的去中心化。',
    45,
    12,
    true
  ),
  (
    '火星资源应该采用代币化管理，通过智能合约确保分配的透明和公平。每个贡献者根据贡献度获得相应的资源使用权。',
    32,
    8,
    false
  ),
  (
    '可以借鉴地球上的联邦制模式，但需要根据火星环境做出调整。建议设立火星议会作为最高决策机构，各基地派代表参与。',
    28,
    6,
    false
  )
) AS a(content, likes_count, comments_count, is_accepted)
WHERE NOT EXISTS (
  SELECT 1 FROM answers WHERE content = a.content
);

-- Insert sample comments
INSERT INTO answer_comments (answer_id, author_id, content)
SELECT 
  a.id as answer_id,
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1) as author_id,
  c.content
FROM answers a
CROSS JOIN (VALUES
  ('这个想法很有创意，但需要考虑通信延迟的问题'),
  ('同意，去中心化确实是必要的'),
  ('如何保证各基地之间的利益平衡？'),
  ('代币化管理值得尝试，但要防止投机'),
  ('智能合约的可靠性和安全性需要特别关注'),
  ('议会制度不错，但火星环境下的选举机制需要重新设计')
) AS c(content)
WHERE NOT EXISTS (
  SELECT 1 FROM answer_comments WHERE content = c.content
);

-- Insert sample likes
INSERT INTO answer_likes (answer_id, user_id)
SELECT 
  a.id,
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
FROM answers a
WHERE NOT EXISTS (
  SELECT 1 FROM answer_likes 
  WHERE answer_id = a.id 
  AND user_id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
);

-- Update answer counts
UPDATE answers a
SET 
  likes_count = (
    SELECT COUNT(*) 
    FROM answer_likes 
    WHERE answer_id = a.id
  ),
  comments_count = (
    SELECT COUNT(*) 
    FROM answer_comments 
    WHERE answer_id = a.id
  );