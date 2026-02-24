-- =============================================
-- FreeCloud CMS - Phase 1: Database & API (SEO + Leads)
-- Ejecutar en SQL Editor de Supabase
-- =============================================

-- 1. Tabla "categories"
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Categories
INSERT INTO categories (name, slug, emoji, color) VALUES
  ('BIM Perú', 'bim-peru', '🏗️', '#E67E22'),
  ('Revit', 'revit', '🖥️', '#2E75B6'),
  ('Dynamo', 'dynamo', '⚡', '#8E44AD'),
  ('Python', 'python', '🐍', '#27AE60'),
  ('Robot Structural', 'robot-structural', '🔧', '#C0392B'),
  ('Civil 3D', 'civil-3d', '🛣️', '#2C3E50'),
  ('Excel/Plantillas', 'excel', '📊', '#1ABC9C'),
  ('HP Prime', 'hp-prime', '🔢', '#F39C12'),
  ('Análisis Estructural', 'analisis-estructural', '🏛️', '#34495E'),
  ('Normativa', 'normativa', '📋', '#D35400')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color;

-- 2. Tabla "posts"
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
  key_question TEXT,
  key_answer TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Miguel Angel Rivera',
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Alter table in case it already exists to add new columns safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='key_question') THEN
        ALTER TABLE posts ADD COLUMN key_question TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='key_answer') THEN
        ALTER TABLE posts ADD COLUMN key_answer TEXT;
    END IF;
END $$;

-- 3. Tabla "leads"
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  interest TEXT,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla "contacts"
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- posts
DROP POLICY IF EXISTS "Anyone can read published posts" ON posts;
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin can read all posts" ON posts;
CREATE POLICY "Admin can read all posts" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can insert posts" ON posts;
CREATE POLICY "Admin can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update posts" ON posts;
CREATE POLICY "Admin can update posts" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete posts" ON posts;
CREATE POLICY "Admin can delete posts" ON posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- categories
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories" ON categories
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- leads
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage leads" ON leads;
CREATE POLICY "Admin can manage leads" ON leads
  USING (auth.role() = 'authenticated');

-- contacts
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage contacts" ON contacts;
CREATE POLICY "Admin can manage contacts" ON contacts
  USING (auth.role() = 'authenticated');

-- 7. Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_interest ON leads(interest);

-- =============================================
-- 8. Storage RLS Policies (Bucket: blog-images)
-- =============================================
-- Para que el administrador autenticado pueda subir imágenes al bucket "blog-images" desde el panel

-- Permitir a cualquiera ver las imágenes
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING ( bucket_id = 'blog-images' );

-- Permitir solo a usuarios autenticados subir (Insertar)
CREATE POLICY "Admin can upload images" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK ( bucket_id = 'blog-images' );

-- Permitir solo a usuarios autenticados actualizar (Reemplazar)
CREATE POLICY "Admin can update images" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING ( bucket_id = 'blog-images' );

-- Permitir solo a usuarios autenticados eliminar
CREATE POLICY "Admin can delete images" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING ( bucket_id = 'blog-images' );
