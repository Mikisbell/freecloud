-- =============================================
-- FreeCloud Blog - Supabase Setup
-- Ejecutar en SQL Editor de Supabase
-- =============================================

-- Subscribers (newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'blog',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (for newsletter signup)
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: only authenticated users can read
CREATE POLICY "Auth users can read subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Downloads tracking
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track downloads" ON downloads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth users can read downloads" ON downloads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Simple page views analytics
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth users can read views" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at DESC);

-- Contacts (contact form messages)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth users can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_product ON downloads(product_slug);
CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);

-- View: subscriber count by source
CREATE OR REPLACE VIEW subscriber_stats AS
SELECT
  source,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7_days,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as last_30_days
FROM subscribers
GROUP BY source;

-- View: popular pages
CREATE OR REPLACE VIEW popular_pages AS
SELECT
  path,
  COUNT(*) as views,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as views_7d
FROM page_views
GROUP BY path
ORDER BY views DESC;

-- View: download stats
CREATE OR REPLACE VIEW download_stats AS
SELECT
  product_slug,
  COUNT(*) as total_downloads,
  COUNT(DISTINCT email) as unique_downloaders
FROM downloads
GROUP BY product_slug
ORDER BY total_downloads DESC;
