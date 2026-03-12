CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'global',
  name text NOT NULL DEFAULT 'FreeCloud.pe',
  url text NOT NULL DEFAULT 'https://freecloud.pe',
  description text NOT NULL DEFAULT 'Blog técnico y recursos BIM/Ingeniería Civil',
  author text NOT NULL DEFAULT 'Mateo Isbell',
  author_title text NOT NULL DEFAULT 'BIM Manager & Developer',
  email text NOT NULL DEFAULT 'admin@freecloud.pe',
  social_youtube text,
  social_linkedin text,
  social_github text,
  social_facebook text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Opcional: aseguramos un solo record global
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_single_row_idx ON site_settings (id) WHERE id = 'global';

INSERT INTO site_settings (
  id, name, url, description, author, author_title, email, 
  social_youtube, social_linkedin, social_github
) VALUES (
  'global', 
  'FreeCloud.pe', 
  'https://freecloud.pe', 
  'Blog técnico y plataforma de recursos BIM/Ingeniería Civil para Perú y LATAM', 
  'Mateo Isbell', 
  'BIM Manager & Developer', 
  'admin@freecloud.pe', 
  'https://youtube.com/@mikisbell', 
  'https://linkedin.com/in/mikisbell', 
  'https://github.com/mikisbell'
) ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin Write Settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS products (
  slug text PRIMARY KEY,
  tag text NOT NULL,
  tag_color text NOT NULL,
  tag_bg text NOT NULL,
  title text NOT NULL,
  price text NOT NULL,
  price_display text NOT NULL,
  description text NOT NULL,
  href text NOT NULL,
  is_gumroad boolean NOT NULL DEFAULT true,
  cover_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Write Products" ON products FOR ALL USING (auth.role() = 'authenticated');
