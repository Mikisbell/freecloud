-- ============================================================
-- BIM-RTINGS Programmatic SEO Schema
-- FreeCloud.pe - Supabase PostgreSQL
-- Estrategia: Modelo Relacional EAV para Software BIM comparativo
-- ============================================================

-- 1. TABLA PRINCIPAL: software
CREATE TABLE IF NOT EXISTS software (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url    TEXT,
    -- Categorías válidas: 'BIM Modeling', 'Structural', 'Rendering', 'MEP', 'Coordination', 'Other'
    category    TEXT NOT NULL DEFAULT 'Other',
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. TABLA DE MÉTRICAS/ATRIBUTOS: software_metrics (Modelo EAV)
CREATE TABLE IF NOT EXISTS software_metrics (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    software_id    UUID NOT NULL REFERENCES software(id) ON DELETE CASCADE,
    -- Clave del atributo, ej: 'learning_curve', 'price_tier', 'ifc_support', 'os_windows'
    metric_key     TEXT NOT NULL,
    -- Solo uno de los tres value_* debe ser NOT NULL
    value_numeric  NUMERIC(5, 2),    -- Score de 0.00 a 10.00 
    value_string   TEXT,              -- Texto libre
    value_boolean  BOOLEAN,           -- Booleano simple (sí/no)
    created_at     TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (software_id, metric_key)
);

-- 3. ÍNDICES para performance en comparativas
CREATE INDEX IF NOT EXISTS idx_software_slug ON software(slug);
CREATE INDEX IF NOT EXISTS idx_software_category ON software(category);
CREATE INDEX IF NOT EXISTS idx_software_metrics_software_id ON software_metrics(software_id);
CREATE INDEX IF NOT EXISTS idx_software_metrics_key ON software_metrics(metric_key);

-- 4. AUTO-UPDATE updated_at en software
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_software_updated_at
    BEFORE UPDATE ON software
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS) — Solo lectura pública
ALTER TABLE software ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_metrics ENABLE ROW LEVEL SECURITY;

-- Política: cualquier usuario anónimo puede SELECT, nadie puede INSERT/UPDATE/DELETE vía API pública
CREATE POLICY "Public read access for software"
    ON software FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read access for software_metrics"
    ON software_metrics FOR SELECT
    USING (true);

-- ============================================================
-- DATOS DE EJEMPLO (Seed data para arrancar el contenido)
-- ============================================================
INSERT INTO software (name, slug, description, logo_url, category) VALUES
('Autodesk Revit', 'autodesk-revit', 'La herramienta BIM líder del mercado para arquitectura, estructura e instalaciones MEP.', NULL, 'BIM Modeling'),
('Archicad', 'archicad', 'Solución BIM de Graphisoft con flujo de trabajo abierto y excelente rendimiento en Mac.', NULL, 'BIM Modeling'),
('ETABS', 'etabs', 'Software de análisis y diseño estructural de edificios, líder en ingeniería sísmica.', NULL, 'Structural'),
('Civil 3D', 'civil-3d', 'La plataforma estándar de Autodesk para infraestructura y obras civiles.', NULL, 'BIM Modeling'),
('Twinmotion', 'twinmotion', 'Herramienta de visualización arquitectónica en tiempo real basada en Unreal Engine.', NULL, 'Rendering'),
('Enscape', 'enscape', 'Plugin de renderizado en tiempo real integrado directamente con Revit, Archicad y SketchUp.', NULL, 'Rendering'),
('Navisworks', 'navisworks', 'Plataforma de coordinación y clash detection BIM de Autodesk.', NULL, 'Coordination')
ON CONFLICT (slug) DO NOTHING;
