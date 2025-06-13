-- NeonDB Waitlist Table Setup
-- Run this in your Neon database console or using a SQL client

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100) DEFAULT 'landing_page',
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  love TEXT NOT NULL,
  want TEXT,
  changes TEXT,
  pricing VARCHAR(50),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  recommendation INTEGER CHECK (recommendation >= 1 AND recommendation <= 10),
  source VARCHAR(100) DEFAULT 'feedback_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source);

CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_source ON feedback(source);

-- Add email validation constraint
ALTER TABLE waitlist 
ADD CONSTRAINT IF NOT EXISTS valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE feedback 
ADD CONSTRAINT IF NOT EXISTS valid_feedback_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_waitlist_updated_at ON waitlist;
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Optional: Insert some test data
-- INSERT INTO waitlist (email, source) VALUES 
-- ('test@example.com', 'landing_page'),
-- ('user@domain.com', 'social_media')
-- ON CONFLICT (email) DO NOTHING; 