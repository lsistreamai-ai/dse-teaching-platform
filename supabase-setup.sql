-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/zywgdjbuttwyingoldgb/sql)

-- Create dse_users table
CREATE TABLE IF NOT EXISTS dse_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'teacher',
  subjects TEXT DEFAULT '[]',
  school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE dse_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now - tighten later)
CREATE POLICY "Allow all for dse_users" ON dse_users
  FOR ALL USING (true) WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS dse_users_email_idx ON dse_users(email);
