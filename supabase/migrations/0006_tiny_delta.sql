/*
  # Add sample related data for questions

  1. New Data
    - Sample discussions for each question
    - Sample research proposals
    - Sample research results
    - Sample votes
  
  2. Changes
    - Insert related data with meaningful connections to questions
    - Each data point provides valuable context and progression
*/

-- Insert sample discussions
INSERT INTO discussions (question_id, author_id, content)
SELECT 
  q.id,
  (SELECT id FROM profiles LIMIT 1),
  d.content
FROM questions q
CROSS JOIN (VALUES
  ('从历史经验来看，新的身份认同往往是多元文化融合的结果。建议建立一个包容性的火星公民身份体系，同时保留地球文化多样性。'),
  ('可以借鉴国际空间站的管理经验，建立多方参与的联合治理机制。'),
  ('应该设立专门的火星资源管理委员会，确保资源开发收益的公平分配。'),
  ('建议采用代币经济模式，通过智能合约确保资源分配的透明度和公平性。'),
  ('私营企业可以作为特许经营者参与火星开发，但需要接受严格的监管和公共利益考量。')
) AS d(content)
WHERE NOT EXISTS (
  SELECT 1 FROM discussions WHERE question_id = q.id AND content = d.content
);

-- Insert sample research proposals
INSERT INTO research_proposals (question_id, researcher_id, title, description, required_funding, current_funding, status)
SELECT
  q.id,
  (SELECT id FROM profiles LIMIT 1),
  rp.title,
  rp.description,
  rp.required_funding,
  rp.current_funding,
  rp.status
FROM questions q
CROSS JOIN (VALUES
  (
    '火星身份认同体系研究',
    '通过跨文化研究和社会心理学分析，探索适合火星殖民地的身份认同体系。',
    5000,
    3200,
    'active'
  ),
  (
    '火星资源分配模型设计',
    '基于博弈论和经济学原理，设计公平高效的资源分配机制。',
    8000,
    4500,
    'active'
  ),
  (
    '火星治理框架制定',
    '研究地球上现有的国际治理模式，提出适合火星环境的治理方案。',
    6000,
    2800,
    'pending'
  )
) AS rp(title, description, required_funding, current_funding, status)
WHERE NOT EXISTS (
  SELECT 1 FROM research_proposals WHERE question_id = q.id AND title = rp.title
);

-- Insert sample research results
INSERT INTO research_results (proposal_id, content, likes_count, shares_count)
SELECT
  rp.id,
  r.content,
  r.likes_count,
  r.shares_count
FROM research_proposals rp
CROSS JOIN (VALUES
  (
    '初步研究表明，建立"火星公民"这一新的身份认同，可以有效减少原有地球文化差异带来的冲突。建议采用积分制管理公民权益。',
    156,
    45
  ),
  (
    '基于区块链技术的资源分配系统设计方案已完成，可以实现资源使用的实时追踪和公平分配。',
    89,
    32
  )
) AS r(content, likes_count, shares_count)
WHERE rp.status = 'active'
AND NOT EXISTS (
  SELECT 1 FROM research_results WHERE proposal_id = rp.id AND content = r.content
);

-- Insert sample votes
INSERT INTO votes (result_id, title, description, end_time, status)
SELECT
  rr.id,
  v.title,
  v.description,
  v.end_time,
  v.status
FROM research_results rr
CROSS JOIN (VALUES
  (
    '火星公民身份认同方案投票',
    '就火星公民身份认同体系的具体实施方案进行投票',
    NOW() + INTERVAL '7 days',
    'active'
  ),
  (
    '资源分配系统方案投票',
    '针对基于区块链的资源分配系统实施方案进行投票',
    NOW() + INTERVAL '5 days',
    'active'
  )
) AS v(title, description, end_time, status)
WHERE NOT EXISTS (
  SELECT 1 FROM votes WHERE result_id = rr.id AND title = v.title
);

-- Create vote options table if not exists
CREATE TABLE IF NOT EXISTS vote_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id uuid REFERENCES votes(id) NOT NULL,
  content text NOT NULL,
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on vote options
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for vote options
CREATE POLICY "Vote options are viewable by everyone"
  ON vote_options FOR SELECT
  USING (true);

-- Insert sample vote options
INSERT INTO vote_options (vote_id, content, vote_count)
SELECT
  v.id,
  vo.content,
  vo.vote_count
FROM votes v
CROSS JOIN (VALUES
  ('采用积分制管理公民权益', 156),
  ('维持原有国籍体系', 89),
  ('建立混合身份体系', 134),
  ('完全新建火星身份体系', 78)
) AS vo(content, vote_count)
WHERE NOT EXISTS (
  SELECT 1 FROM vote_options WHERE vote_id = v.id AND content = vo.content
);