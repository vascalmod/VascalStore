-- Migration: Drop FK constraint from licenses if referencing key_sessions
ALTER TABLE IF EXISTS licenses DROP CONSTRAINT IF EXISTS licenses_session_token_fkey;

-- Trigger Tokens Table
CREATE TABLE IF NOT EXISTS trigger_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash TEXT
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  ip_hash TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trigger_tokens_token ON trigger_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
