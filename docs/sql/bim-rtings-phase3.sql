-- BIM-RTINGS Phase 3: Enhanced SEO Reviews Schema
-- Este script expande la funcionalidad core de comparativas.

-- 1. Crear tabla de reviews
CREATE TABLE IF NOT EXISTS public.software_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  software_id uuid REFERENCES public.software(id) ON DELETE CASCADE,
  overall_score numeric(3,1) CHECK (overall_score >= 0 AND overall_score <= 10),
  verdict text,
  pros jsonb DEFAULT '[]'::jsonb,
  cons jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(software_id) -- Asegura relación 1:1
);

-- 2. Habilitar RLS
ALTER TABLE public.software_reviews ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS (Public Read)
CREATE POLICY "Reviews son visibles publicamente"
  ON public.software_reviews
  FOR SELECT
  USING (true);

-- 4. Seed Data Hiperrealista (solo para Revit y Archicad)

-- Obtenemos los IDs y procedemos a la inserción dinámica
DO $$
DECLARE
  revit_id uuid;
  archicad_id uuid;
BEGIN
  -- Obtener IDs reales
  SELECT id INTO revit_id FROM public.software WHERE slug = 'autodesk-revit';
  SELECT id INTO archicad_id FROM public.software WHERE slug = 'archicad';

  -- Insertar Revit si existe
  IF revit_id IS NOT NULL THEN
    INSERT INTO public.software_reviews (software_id, overall_score, verdict, pros, cons)
    VALUES (
      revit_id, 
      8.7, 
      'Autodesk Revit es el estándar absoluto de la industria corporativa y macro-proyectos. Su integración profunda con normativas BIM transnacionales y su ecosistema cerrado lo hacen irremplazable, aunque exige a cambio una curva de aprendizaje vertical y consumo agresivo de recursos gráficos en PC.',
      '["Estándar de facto en la industria AEC corporativa", "Integración perfecta con Navisworks y ecosistema BIM 360", "El mejor motor de MEP y visualización analítica", "Mercado masivo de plantillas, plugins y perfiles"]'::jsonb,
      '["Curva de aprendizaje empinada y frustrante inicial", "Pésimo rendimiento en modelos gigantes (monohilo histórico)", "Suscripción perpetua no disponible, altamente costoso", "Flujo de trabajo de diseño conceptual pobre frente a Archicad"]'::jsonb
    ) ON CONFLICT (software_id) DO NOTHING;
  END IF;

  -- Insertar Archicad si existe
  IF archicad_id IS NOT NULL THEN
    INSERT INTO public.software_reviews (software_id, overall_score, verdict, pros, cons)
    VALUES (
      archicad_id, 
      8.9, 
      'Graphisoft Archicad es la joya de la corona para los arquitectos puros que buscan diseño conceptual fluido y performance en Mac. Al ser pionero del BIM pionero, su aproximación es mucho más intuitiva e indulgente que Revit, penalizándolo ligeramente en proyectos MEP hiper-monstruosos de ecosistema cerrado Autodesk.',
      '["Flujo de trabajo increíblemente amigable para Arquitectos", "Rendimiento soberbio en Mac (Apple Silicon nativo) y Windows", "Herramientas de diseño conceptual nativas integradas", "Teamwork es la solución de colaboración más estable"]'::jsonb,
      '["Cuota de mercado inferior corporativamente contra Revit", "Integración M.E.P. es buena, pero no supera a Revit MEP", "Librerías paramétricas GDL requieren código complejo para crear", "Ciertas barreras al buscar sub-contratistas puramente Archicad"]'::jsonb
    ) ON CONFLICT (software_id) DO NOTHING;
  END IF;

END $$;
