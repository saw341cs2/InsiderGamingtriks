-- Table for storing daily gaming news
CREATE TABLE IF NOT EXISTS daily_news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  url TEXT NOT NULL UNIQUE,
  image TEXT,
  source TEXT,
  publish_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_news_publish_date ON daily_news(publish_date);

-- Enable Row Level Security
ALTER TABLE daily_news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read daily_news" ON daily_news
  FOR SELECT USING (true);

-- Allow service role to insert
CREATE POLICY "Service role can insert daily_news" ON daily_news
  FOR INSERT WITH CHECK (true);

-- Function to get today's news
CREATE OR REPLACE FUNCTION get_today_news()
RETURNS SETOF daily_news AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM daily_news
  WHERE publish_date = CURRENT_DATE
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_cron extension (Supabase Pro required)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily news publication at 7h00 Paris time (6h UTC)
-- This requires Supabase Pro or external cron service
-- SELECT cron.schedule(
--   'publish-daily-news',
--   '0 6 * * *',  -- Run at 6h UTC = 7h Paris (winter)
--   $$SELECT net.http_request(
--     url:='https://your-project.supabase.co/functions/v1/publish-daily-news',
--     method:='POST'
--   );$$
-- );
