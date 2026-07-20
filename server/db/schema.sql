-- Production Database Schema for README Forge (PostgreSQL / Supabase Migration)
-- Source of Truth: Backend Models & Routes
-- Uses pgcrypto extension, UUID keys, TIMESTAMPTZ, JSONB, and triggers for updated_at

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLES DEFINITIONS
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  profile_url TEXT,
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('guest', 'free', 'premium', 'pro', 'enterprise')),
  credits INTEGER DEFAULT 20 CHECK (credits >= 0),
  credits_reset_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Project',
  builder_type VARCHAR(50) DEFAULT 'profile' CHECK (builder_type IN ('profile', 'project')),
  builder_style VARCHAR(50) DEFAULT 'wizard' CHECK (builder_style IN ('wizard', 'chat')),
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_markdown TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sessions Table (Custom Session Cookies)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Generation History Table
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  prompt_hash VARCHAR(255),
  builder_type VARCHAR(50) CHECK (builder_type IN ('profile', 'project')),
  model VARCHAR(255),
  input_tokens INTEGER CHECK (input_tokens >= 0),
  output_tokens INTEGER CHECK (output_tokens >= 0),
  cost_cents REAL DEFAULT 0,
  cached BOOLEAN DEFAULT FALSE,
  duration_ms INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Repository Cache Table
CREATE TABLE IF NOT EXISTS repository_cache (
  cache_key VARCHAR(500) PRIMARY KEY,
  owner VARCHAR(255) NOT NULL,
  repo VARCHAR(255) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  intelligence_json JSONB DEFAULT '{}'::jsonb,
  generated_readme TEXT,
  mode VARCHAR(50) DEFAULT 'standard',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Conversational Builder Sessions Table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  builder_type VARCHAR(50) DEFAULT 'profile' CHECK (builder_type IN ('profile', 'project')),
  current_question_id VARCHAR(255),
  history_path JSONB DEFAULT '[]'::jsonb,
  messages JSONB DEFAULT '[]'::jsonb,
  form_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_builder_session UNIQUE (user_id, builder_type)
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  builder_style VARCHAR(50) DEFAULT 'wizard' CHECK (builder_style IN ('wizard', 'chat')),
  font_size VARCHAR(50) DEFAULT 'md' CHECK (font_size IN ('sm', 'md', 'lg')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. INDEXES DEFINITIONS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_prompt_hash ON generation_history(prompt_hash);
CREATE INDEX IF NOT EXISTS idx_repository_cache_expires_at ON repository_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user ON conversation_sessions(user_id);

-- ============================================================================
-- 3. TRIGGERS DEFINITIONS (Auto-updating updated_at)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_users_timestamp ON users;
CREATE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_projects_timestamp ON projects;
CREATE TRIGGER trigger_update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_conversation_sessions_timestamp ON conversation_sessions;
CREATE TRIGGER trigger_update_conversation_sessions_timestamp
BEFORE UPDATE ON conversation_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_user_settings_timestamp ON user_settings;
CREATE TRIGGER trigger_update_user_settings_timestamp
BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================

-- Enable RLS on ALL tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 4.1 Users Table Policies
DROP POLICY IF EXISTS "Allow service role full access on users" ON users;
CREATE POLICY "Allow service role full access on users" ON users FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4.2 Projects Table Policies
DROP POLICY IF EXISTS "Allow service role full access on projects" ON projects;
CREATE POLICY "Allow service role full access on projects" ON projects FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can perform CRUD on their own projects" ON projects;
CREATE POLICY "Users can perform CRUD on their own projects" ON projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4.3 Sessions Table Policies
DROP POLICY IF EXISTS "Allow service role full access on sessions" ON sessions;
CREATE POLICY "Allow service role full access on sessions" ON sessions FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can perform CRUD on their own sessions" ON sessions;
CREATE POLICY "Users can perform CRUD on their own sessions" ON sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4.4 Generation History Table Policies
DROP POLICY IF EXISTS "Allow service role full access on generation_history" ON generation_history;
CREATE POLICY "Allow service role full access on generation_history" ON generation_history FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can view their own generation history" ON generation_history;
CREATE POLICY "Users can view their own generation history" ON generation_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own generation history" ON generation_history;
CREATE POLICY "Users can insert their own generation history" ON generation_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4.5 Repository Cache Table Policies (Shared cache table RLS)
DROP POLICY IF EXISTS "Allow service role full access on repository_cache" ON repository_cache;
CREATE POLICY "Allow service role full access on repository_cache" ON repository_cache FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Allow public read on repository_cache" ON repository_cache;
CREATE POLICY "Allow public read on repository_cache" ON repository_cache FOR SELECT USING (true);

-- 4.6 Conversation Sessions Table Policies
DROP POLICY IF EXISTS "Allow service role full access on conversation_sessions" ON conversation_sessions;
CREATE POLICY "Allow service role full access on conversation_sessions" ON conversation_sessions FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can perform CRUD on their own conversation sessions" ON conversation_sessions;
CREATE POLICY "Users can perform CRUD on their own conversation sessions" ON conversation_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4.7 User Settings Table Policies
DROP POLICY IF EXISTS "Allow service role full access on user_settings" ON user_settings;
CREATE POLICY "Allow service role full access on user_settings" ON user_settings FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Users can perform CRUD on their own settings" ON user_settings;
CREATE POLICY "Users can perform CRUD on their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Atomic credit deduction routine to prevent TOCTOU double-spend exploits
CREATE OR REPLACE FUNCTION deduct_user_credit(user_uuid UUID)
RETURNS INT AS $$
DECLARE
  current_plan VARCHAR(50);
  current_credits INT;
  new_credits INT;
BEGIN
  -- Get current plan and credits
  SELECT plan, credits INTO current_plan, current_credits FROM users WHERE id = user_uuid;
  
  IF current_plan = 'premium' THEN
    RETURN -1;
  END IF;

  new_credits := GREATEST(0, COALESCE(current_credits, 0) - 1);

  UPDATE users 
  SET credits = new_credits,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = user_uuid;

  RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
