-- ============================================================
-- BIM-RTINGS "God-Tier" Programmatic SEO Schema
-- FreeCloud.pe - Supabase PostgreSQL
-- Estrategia: Motor Algorítmico M x N, NLG, y Test Benches Versionados
-- ============================================================

-- ============================================================
-- 1. ESTRUCTURA DDL (LAS 6 TABLAS MAESTRAS)
-- ============================================================

-- 1.1 Líneas de Producto (Ontología Base para SEO)
CREATE TABLE IF NOT EXISTS bim_product_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- ej: 'revit' -> URL base para canonical /herramientas/revit
  name TEXT NOT NULL,        -- ej: 'Autodesk Revit'
  brand TEXT NOT NULL,       -- ej: 'Autodesk'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Versiones Específicas (Lo que realmente se testea)
CREATE TABLE IF NOT EXISTS bim_software_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID REFERENCES bim_product_lines(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL, -- ej: 'revit-2024' -> URL específica
  name TEXT NOT NULL,        -- ej: 'Revit 2024'
  release_year INTEGER NOT NULL,
  is_latest BOOLEAN DEFAULT false, -- Ayuda a redirigir /revit -> /revit-2024
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Test Benches (Metodología Científica Inmutable)
CREATE TABLE IF NOT EXISTS test_bench_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_code TEXT UNIQUE NOT NULL, -- ej: 'v1.0'
  name TEXT NOT NULL,                -- ej: 'Metodología BIM FreeCloud 2024'
  description TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Categorías (Para agrupar en la UI)
CREATE TABLE IF NOT EXISTS test_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

-- 1.5 Definición de Tests (El Algoritmo de Scoring y NLG)
CREATE TABLE IF NOT EXISTS test_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES test_categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,         -- ej: 'ifc-export-time-500mb'
  name TEXT NOT NULL,                -- ej: 'Tiempo de Exportación IFC (500MB)'
  value_type TEXT NOT NULL,          -- Enum conceptual: 'numeric', 'boolean', 'enum'
  unit TEXT,                         -- ej: 'segundos', 'MB', ''
  
  -- FÓRMULA JS (Evaluada en servidor). Assume variables: 'val'
  -- Ej: return Math.max(0, 10 - (val / 10)); // Menos tiempo es mejor puntaje
  scoring_formula TEXT NOT NULL,
  
  -- PLANTILLA DE LENGUAJE NATURAL (NLG)
  -- Variables disp: {product.name}, {val}, {unit}, {bench.version}, {adjective_high}, {adjective_low}
  nlg_template TEXT, 
  
  -- Peso relativo del test DENTRO de su categoría (sum = 1.0 ideal)
  relative_weight NUMERIC(4,2) DEFAULT 1.0, 
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.6 Resultados del Laboratorio (La Data Cruda M x N)
CREATE TABLE IF NOT EXISTS software_test_logs (
  release_id UUID REFERENCES bim_software_releases(id) ON DELETE CASCADE,
  test_id UUID REFERENCES test_definitions(id) ON DELETE CASCADE,
  bench_version_id UUID REFERENCES test_bench_versions(id) ON DELETE CASCADE,
  
  -- DATOS CRUDOS INMUTABLES
  raw_numeric_value NUMERIC(10,2),   -- Si value_type = 'numeric'
  raw_text_value TEXT,               -- Si value_type = 'boolean' ('true'/'false') o 'enum'
  
  -- Contexto humano adicional para el Acordeón SEO
  tester_notes TEXT,
  
  tested_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (release_id, test_id, bench_version_id)
);

-- ============================================================
-- 2. POLÍTICAS DE SEGURIDAD (RLS) - PUBLIC LECTURA
-- (Idempotente: funciona en primera ejecución y en re-ejecuciones)
-- ============================================================
ALTER TABLE bim_product_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE bim_software_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_bench_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_test_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read bim_product_lines" ON bim_product_lines;
DROP POLICY IF EXISTS "Public read bim_software_releases" ON bim_software_releases;
DROP POLICY IF EXISTS "Public read test_bench_versions" ON test_bench_versions;
DROP POLICY IF EXISTS "Public read test_categories" ON test_categories;
DROP POLICY IF EXISTS "Public read test_definitions" ON test_definitions;
DROP POLICY IF EXISTS "Public read software_test_logs" ON software_test_logs;

CREATE POLICY "Public read bim_product_lines" ON bim_product_lines FOR SELECT USING (true);
CREATE POLICY "Public read bim_software_releases" ON bim_software_releases FOR SELECT USING (true);
CREATE POLICY "Public read test_bench_versions" ON test_bench_versions FOR SELECT USING (true);
CREATE POLICY "Public read test_categories" ON test_categories FOR SELECT USING (true);
CREATE POLICY "Public read test_definitions" ON test_definitions FOR SELECT USING (true);
CREATE POLICY "Public read software_test_logs" ON software_test_logs FOR SELECT USING (true);

-- ============================================================
-- 3. SEED DATA / UPSERT IDEMPOTENTE
-- (Seguro para ejecutar N veces sin errores 23505)
-- ============================================================

-- 3.1 Test Bench
INSERT INTO test_bench_versions (id, version_code, name, description) 
VALUES ('11111111-1111-1111-1111-111111111111', 'v1.0', 'Metodología BIM 2024.1', 'Primera versión enfocada en rendimiento estricto y estándares OpenBIM.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3.2 Líneas de Producto
-- IMPORTANTE: slugs deben coincidir con la URL /comparar/{slugA}-vs-{slugB}
INSERT INTO bim_product_lines (id, slug, name, brand) VALUES 
('22222222-2222-2222-2222-222222222221', 'autodesk-revit', 'Autodesk Revit', 'Autodesk'),
('22222222-2222-2222-2222-222222222222', 'archicad', 'Archicad', 'Graphisoft')
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name;

-- 3.3 Versiones de Software
INSERT INTO bim_software_releases (id, product_line_id, slug, name, release_year, is_latest) VALUES
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'revit-2024', 'Revit 2024', 2023, true),
('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', 'archicad-27', 'Archicad 27', 2023, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, is_latest = EXCLUDED.is_latest;

-- 3.4 Categorías
INSERT INTO test_categories (id, slug, name, position) VALUES
('44444444-4444-4444-4444-444444444441', 'interoperabilidad', 'Interoperabilidad & OpenBIM', 1),
('44444444-4444-4444-4444-444444444442', 'rendimiento', 'Rendimiento y Optimización', 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, position = EXCLUDED.position;

-- 3.5 Definiciones de Tests (fórmulas algorítmicas + plantillas NLG)
INSERT INTO test_definitions (id, category_id, slug, name, value_type, unit, scoring_formula, nlg_template, position) VALUES
(
  '55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 
  'ifc-export-time', 'Tiempo de Exportación (100MB IFC)', 'numeric', 'segundos',
  'return Math.max(0, Math.min(10, 10 - (val / 12)));',
  'En nuestras iteraciones bajo el Test Bench {bench}, {software} registró un tiempo de {val} {unit} para exportar el modelo base. Esto resulta en una calificación algorítmica de {score}/10, catalogado como {adjective}.',
  1
),
(
  '55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444441',
  'native-ifc4-certification', 'Certificación BuildingSMART IFC4', 'boolean', '',
  'return val === "true" ? 10.0 : 2.0;',
  'Respecto a los estándares abiertos, {software} {val_text} con la certificación nativa oficial para IFC4, obteniendo un puntaje técnico de {score}/10 en este aspecto crucial para mandatos gubernamentales.',
  2
),
(
  '55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444442',
  'ram-usage-idle', 'Consumo RAM en Reposo (Modelo 50MB)', 'numeric', 'GB',
  'return Math.max(0, Math.min(10, 10 - ((val - 1) * 2.5)));',
  'El uso de memoria es un factor determinante en VDI. {software} consume {val} {unit} en estado de reposo, indicando un nivel de optimización {adjective} ({score}/10).',
  1
)
ON CONFLICT (id) DO UPDATE SET 
  scoring_formula = EXCLUDED.scoring_formula,
  nlg_template = EXCLUDED.nlg_template,
  name = EXCLUDED.name;

-- 3.6 Resultados del Laboratorio — REVIT 2024
INSERT INTO software_test_logs (release_id, test_id, bench_version_id, raw_numeric_value, raw_text_value, tester_notes) VALUES
('33333333-3333-3333-3333-333333333331', '55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 48.5, NULL, 'Revit utiliza un solo hilo (single-thread) para el proceso IFC, creando cuellos de botella severos.'),
('33333333-3333-3333-3333-333333333331', '55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', NULL, 'true', 'Certificado oficial buildingSMART RV2.0.'),
('33333333-3333-3333-3333-333333333331', '55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', 3.2, NULL, 'El proceso CefSharp integrado engorda la huella base.')
ON CONFLICT (release_id, test_id, bench_version_id) DO UPDATE SET
  raw_numeric_value = EXCLUDED.raw_numeric_value,
  raw_text_value = EXCLUDED.raw_text_value;

-- 3.7 Resultados del Laboratorio — ARCHICAD 27
INSERT INTO software_test_logs (release_id, test_id, bench_version_id, raw_numeric_value, raw_text_value, tester_notes) VALUES
('33333333-3333-3333-3333-333333333332', '55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 14.2, NULL, 'Motor multi-hilo nativo de Graphisoft aplasta la exportación en Ryzen y M2/M3.'),
('33333333-3333-3333-3333-333333333332', '55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', NULL, 'true', 'Graphisoft fue pionero en OpenBIM.'),
('33333333-3333-3333-3333-333333333332', '55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', 1.8, NULL, 'Gestión de RAM predictiva muy superior en reposo.')
ON CONFLICT (release_id, test_id, bench_version_id) DO UPDATE SET
  raw_numeric_value = EXCLUDED.raw_numeric_value,
  raw_text_value = EXCLUDED.raw_text_value;

