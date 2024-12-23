/*
  # Add sample questions about Mars colony governance

  1. Changes
    - Insert sample questions about Mars colony governance and policies
    - Each question represents key policy and governance challenges
    - Questions are tagged with appropriate status
*/

-- Insert sample questions
INSERT INTO questions (title, content, author_id, status, discussion_count, researcher_count, vote_count)
SELECT
  title,
  content,
  (SELECT id FROM profiles LIMIT 1), -- Use an existing profile as author
  status,
  discussion_count,
  researcher_count,
  vote_count
FROM (VALUES
  (
    '火星殖民者身份界定',
    '第三方到达火星后,火星殖民者的身份将如何界定？是以政治经济术语(美国、中国、俄罗斯联邦等)来识别,还是以地球种族来识别？或者我们是否应该建立一个全新的火星身份认同体系？',
    'pending',
    15,
    8,
    45
  ),
  (
    '火星资源分配机制',
    '谁将从火星的自然资源中受益？是支付到达火星成本的投资方,还是应该让全人类共同受益？我们需要建立一个公平合理的资源分配机制。',
    'researching',
    32,
    12,
    78
  ),
  (
    '火星治理模式探讨',
    '火星的"所有权"是否应该仿照南极条约模式？如何确保火星资源作为全人类共同财产得到合理利用？需要建立怎样的治理机构来执行相关条约？',
    'voting',
    25,
    10,
    92
  ),
  (
    '私营机构角色定位',
    '私人团体、公司在火星上将扮演什么角色？这些私人实体是作为所有者还是承包商运营？如何平衡商业利益与公共利益？',
    'pending',
    18,
    6,
    34
  ),
  (
    '火星司法体系构建',
    '考虑到生存环境改造的高成本,当火星殖民者犯罪时,应该采取怎样的惩罚措施？是在火星监禁还是流放回地球？如何建立有效的司法体系？',
    'claimed',
    28,
    15,
    67
  ),
  (
    '火星新生代政策',
    '在火星抚养新一代的成本很高。如何制定相关政策？是否应该限制生育？如何保障教育等基本权利？',
    'researching',
    42,
    20,
    156
  ),
  (
    '火星-地球关系框架',
    '地球人与火星殖民地的关系将如何定义？从火星获取商品和资源需要什么法律文件？如何建立互惠互利的关系框架？',
    'pending',
    35,
    16,
    89
  ),
  (
    '火星警务体系设计',
    '谁将提供火星的警察系统、人员和设备？对于不涉及国际条约的地方违法行为需要什么类型的法院系统？如何确保执法公正？',
    'claimed',
    22,
    8,
    45
  )
) AS v(title, content, status, discussion_count, researcher_count, vote_count)
WHERE NOT EXISTS (
  SELECT 1 FROM questions WHERE title = v.title
);