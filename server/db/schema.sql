-- Database Schema for README Forge
-- Supports GitHub OAuth, User Dashboard, Saved Projects, Secure Session Management, and Generation History Analytics

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  github_id TEXT UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  profile_url TEXT,
  plan TEXT DEFAULT 'free', -- 'guest', 'free', 'pro', 'enterprise'
  credits INTEGER DEFAULT 20,
  credits_reset_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  builder_type TEXT DEFAULT 'profile', -- 'profile' or 'project'
  builder_style TEXT DEFAULT 'wizard', -- 'wizard' or 'chat'
  input_data TEXT NOT NULL, -- JSON stringified inputs
  generated_markdown TEXT,
  is_favorite INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generation_history (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  prompt_hash TEXT,
  builder_type TEXT, -- 'profile' or 'project'
  model TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_cents REAL DEFAULT 0,
  cached INTEGER DEFAULT 0,
  duration_ms INTEGER,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_prompt_hash ON generation_history(prompt_hash);
