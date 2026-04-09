/**
 * find-remaining-slugs.ts
 * Find posts that weren't humanized yet
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug')
    .eq('status', 'published');

  if (!posts) return;

  // Posts already humanized
  const humanized = [
    'revit-api-python-pyrevit-programacion-bim',
    'bim-obligatorio-peru-2026',
    'como-prepararte-bim-6-meses',
    'predimensionamiento-columnas-vigas-e060-practico',
    'interpretar-analisis-modal-masas-etabs-e030',
    'dynamo-revit-automatizar-primer-proceso',
    'script-iniciales-dynamo-revit-hola-mundo',
    'python-ingenieros-civiles-primer-script',
    'cortante-basal-formula-e030-calculo-paso-a-paso',
    'navisworks-choques-clash-detection-paradoja',
    'revit-vs-autocad-cual-aprender-primero-2025',
    'automatizacion-bim-python',
    'dynamo-vs-pyrevit-automatizacion-bim-2026',
    'que-es-bim-obligatorio-peru-2026',
    'modelamiento-bim-estructural-revit-etabs-guia',
    'revit-modelamiento-vigas-copiar-supervisar-niveles',
    'etabs-muros-pantalla-rigidez-lateral',
    'calculo-zapata-aislada-e050-e060-paso-a-paso',
    'python-librerias-esenciales-ingenieros-civiles',
    'navisworks-clash-detection-tutorial-completo',
    'open-bim-vs-closed-bim-ifc-formato',
    'etabs-analisis-sismico-norma-e030-guia-practica',
    'lod-100-500-bim-significado-revit-peru',
    'bim-nivel-1-2-3-diferencias-certificacion',
    'bim-manager-que-hace-cuanto-gana-peru',
    'bep-plan-ejecucion-bim-ejemplo-peru',
    'pyrevit-instalar-primeros-scripts-revit',
    'excel-metrado-acero-calculo-automatico-vigas',
    'civil-3d-carreteras-guia-completa-paso-a-paso',
    'dynamo-principiantes-primera-automatizacion-revit-guia',
    'robot-structural-vs-etabs-cual-usar-estructuras',
    'sap2000-vs-etabs-cual-usar-edificios',
    'zucs-formula-zona-sismica-e030-peru',
    'etabs-diafragma-rigido-semiflexible-cuando-usar',
    'punzonamiento-cimentaciones-etabs-solucion',
    'hp-prime-programa-hardy-cross-analisis-estructural',
    'excel-plantilla-metrados-obra-automatica',
    'plan-ejecucion-bim-peb-guia',
    'revit-estructuras-ingenieros-autocad',
  ];

  console.log('Posts NOT yet humanized:\n');

  for (const post of posts) {
    if (!humanized.includes(post.slug)) {
      console.log(`  ${post.slug}`);
      console.log(`  → "${post.title}"\n`);
    }
  }
}

main().catch(console.error);
