-- =============================================
-- FreeCloud Blog - CMS Setup (Posts & Categories)
-- Ejecutar en SQL Editor de Supabase
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[],
  featured_image TEXT,
  image_alt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Miguel Angel Rivera',
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

-- Posts Policies
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can read all posts" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update posts" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete posts" ON posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Initial Categories
INSERT INTO categories (name, slug, emoji, color) VALUES
  ('BIM Perú', 'bim-peru', '🏗️', '#3b82f6'),
  ('Revit', 'revit', '🖥️', '#6366f1'),
  ('Dynamo', 'dynamo', '⚡', '#ec4899'),
  ('Python', 'python', '🐍', '#10b981'),
  ('Robot Structural', 'robot-structural', '🔧', '#f59e0b'),
  ('Civil 3D', 'civil-3d', '🛣️', '#8b5cf6'),
  ('Excel/Plantillas', 'excel', '📊', '#14b8a6'),
  ('HP Prime', 'hp-prime', '🔢', '#f43f5e'),
  ('Análisis Estructural', 'analisis-estructural', '🏛️', '#64748b'),
  ('Normativa', 'normativa', '📋', '#84cc16')
ON CONFLICT (slug) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
