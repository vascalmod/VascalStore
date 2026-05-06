-- Key Sessions Table
CREATE TABLE IF NOT EXISTS key_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,
  session_token TEXT REFERENCES key_sessions(session_token),
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- Usage Logs Table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT REFERENCES licenses(api_key),
  endpoint TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_key_sessions_token ON key_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_licenses_api_key ON licenses(api_key);
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key ON usage_logs(api_key);
