/*
  # Mars Colony DAO Initial Schema

  1. New Tables
    - `profiles` - 用户信息表
      - `id` (uuid, primary key) - 用户ID
      - `username` (text) - 用户名
      - `mars_balance` (integer) - MARS代币余额
      - `created_at` (timestamp) - 创建时间
    
    - `questions` - 问题表
      - `id` (uuid, primary key) - 问题ID
      - `title` (text) - 问题标题
      - `content` (text) - 问题内容
      - `author_id` (uuid) - 提问者ID
      - `is_quality` (boolean) - 是否为优质问题
      - `discussion_count` (integer) - 讨论数量
      - `researcher_count` (integer) - 研究者数量
      - `vote_count` (integer) - 投票数量
      - `created_at` (timestamp) - 创建时间

    - `discussions` - 讨论表
      - `id` (uuid, primary key) - 讨论ID
      - `question_id` (uuid) - 问题ID
      - `author_id` (uuid) - 作者ID
      - `content` (text) - 讨论内容
      - `created_at` (timestamp) - 创建时间

    - `research_proposals` - 研究计划表
      - `id` (uuid, primary key) - 研究计划ID
      - `question_id` (uuid) - 问题ID
      - `researcher_id` (uuid) - 研究者ID
      - `title` (text) - 研究计划标题
      - `description` (text) - 研究计划描述
      - `required_funding` (integer) - 所需资金
      - `current_funding` (integer) - 当前资金
      - `status` (text) - 状态(pending/active/completed)
      - `created_at` (timestamp) - 创建时间

    - `research_results` - 研究成果表
      - `id` (uuid, primary key) - 研究成果ID
      - `proposal_id` (uuid) - 研究计划ID
      - `content` (text) - 研究成果内容
      - `likes_count` (integer) - 点赞数
      - `shares_count` (integer) - 转发数
      - `created_at` (timestamp) - 创建时间

    - `votes` - 投票表
      - `id` (uuid, primary key) - 投票ID
      - `result_id` (uuid) - 研究成果ID
      - `title` (text) - 投票标题
      - `description` (text) - 投票描述
      - `end_time` (timestamp) - 结束时间
      - `status` (text) - 状态(active/completed)
      - `created_at` (timestamp) - 创建时间

  2. Security
    - 启用所有表的 RLS
    - 添加适当的访问策略
*/

-- Profiles table
CREATE TABLE profiles (
    id uuid PRIMARY KEY DEFAULT auth.uid(),
    username text UNIQUE NOT NULL,
    mars_balance integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Questions table
CREATE TABLE questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid REFERENCES profiles(id) NOT NULL,
    is_quality boolean DEFAULT false,
    discussion_count integer DEFAULT 0,
    researcher_count integer DEFAULT 0,
    vote_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone"
    ON questions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert questions"
    ON questions FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Discussions table
CREATE TABLE discussions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid REFERENCES questions(id) NOT NULL,
    author_id uuid REFERENCES profiles(id) NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discussions are viewable by everyone"
    ON discussions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert discussions"
    ON discussions FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Research proposals table
CREATE TABLE research_proposals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid REFERENCES questions(id) NOT NULL,
    researcher_id uuid REFERENCES profiles(id) NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    required_funding integer NOT NULL,
    current_funding integer DEFAULT 0,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE research_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research proposals are viewable by everyone"
    ON research_proposals FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create research proposals"
    ON research_proposals FOR INSERT
    WITH CHECK (auth.uid() = researcher_id);

-- Research results table
CREATE TABLE research_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id uuid REFERENCES research_proposals(id) NOT NULL,
    content text NOT NULL,
    likes_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE research_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research results are viewable by everyone"
    ON research_results FOR SELECT
    USING (true);

CREATE POLICY "Researchers can insert their results"
    ON research_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM research_proposals
            WHERE id = proposal_id
            AND researcher_id = auth.uid()
        )
    );

-- Votes table
CREATE TABLE votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id uuid REFERENCES research_results(id) NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    end_time timestamptz NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
    ON votes FOR SELECT
    USING (true);

CREATE POLICY "Researchers can create votes"
    ON votes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM research_results r
            JOIN research_proposals p ON r.proposal_id = p.id
            WHERE r.id = result_id
            AND p.researcher_id = auth.uid()
        )
    );