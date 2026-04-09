/**
 * redistribute-post-dates.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Redistribuye las fechas de publicación de los posts a lo largo de 6 meses.
 * 
 * De: Todo en Feb-Mar 2026 (parece content farm)
 * A: Oct 2025 → Abr 2026 (crecimiento orgánico)
 * 
 * Estrategia:
 *  - Posts técnicos pesados → más antiguos (Oct-Nov 2025)
 *  - Posts intermedios → Dic 2025 - Ene 2026
 *  - Posts recientes/trending → Feb-Mar 2026
 *  - Posts de tendencia BIM 2026 → Abr 2026
 * 
 * Uso:
 *   npx tsx scripts/redistribute-post-dates.ts
 *   npx tsx scripts/redistribute-post-dates.ts --dry-run
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const dryRun = process.argv.includes('--dry-run');

const supabase = createClient(supabaseUrl, supabaseKey);

// Categorize posts and assign date ranges
// Posts ordered by "natural publication order" (foundations first, advanced later)
const POST_DATES: Record<string, string> = {
  // ═══ OCTUBRE 2025 — Fundamentos, posts introductorios (7 posts) ═══
  'revit-vs-autocad-cual-aprender-primero-2025': '2025-10-05',
  'dynamo-principiantes-primera-automatizacion-revit-guia': '2025-10-12',
  'revit-estructuras-ingenieros-autocad': '2025-10-19',
  'norma-e030-fuerza-cortante-basal-calculo': '2025-10-22',
  'excel-plantilla-metrados-obra-automatica': '2025-10-26',
  'python-ingenieros-civiles-primer-script': '2025-10-29',
  'plan-ejecucion-bim-peb-guia': '2025-10-31',

  // ═══ NOVIEMBRE 2025 — Posts intermedios, comparativas (8 posts) ═══
  'sap2000-vs-etabs-cual-usar-edificios': '2025-11-03',
  'etabs-vs-robot-structural-comparacion': '2025-11-07',
  'dynamo-vs-pyrevit-automatizacion-bim-2026': '2025-11-10',
  'dynamo-revit-automatizar-primer-proceso': '2025-11-14',
  'script-iniciales-dynamo-revit-hola-mundo': '2025-11-17',
  'metrados-acero-corrugado-errores-presupuesto-obra': '2025-11-21',
  'punzonamiento-cimentaciones-etabs-solucion': '2025-11-24',
  'como-prepararte-bim-6-meses': '2025-11-28',

  // ═══ DICIEMBRE 2025 — Posts avanzados, normativas (7 posts) ═══
  'zucs-formula-zona-sismica-e030-peru': '2025-12-02',
  'cortante-basal-formula-e030-calculo-paso-a-paso': '2025-12-05',
  'calculo-zapata-aislada-e050-e060-paso-a-paso': '2025-12-09',
  'etabs-muros-pantalla-rigidez-lateral': '2025-12-12',
  'robot-structural-vs-etabs-cual-usar-estructuras': '2025-12-16',
  'interpretar-analisis-modal-masas-etabs-e030': '2025-12-19',
  'etabs-diafragma-rigido-semiflexible-cuando-usar': '2025-12-23',

  // ═══ ENERO 2026 — Posts de herramientas, Python, BIM (7 posts) ═══
  'pyrevit-instalar-primeros-scripts-revit': '2026-01-06',
  'revit-api-python-pyrevit-programacion-bim': '2026-01-09',
  'excel-metrado-acero-calculo-automatico-vigas': '2026-01-13',
  'navisworks-clash-detection-tutorial-completo': '2026-01-16',
  'navisworks-choques-clash-detection-paradoja': '2026-01-20',
  'automatizacion-bim-python': '2026-01-23',
  'hp-prime-programa-hardy-cross-analisis-estructural': '2026-01-27',

  // ═══ FEBRERO 2026 — Posts de tendencias, certificaciones (7 posts) ═══
  'lod-100-500-bim-significado-revit-peru': '2026-02-03',
  'open-bim-vs-closed-bim-ifc-formato': '2026-02-06',
  'bim-nivel-1-2-3-diferencias-certificacion': '2026-02-10',
  'bim-manager-que-hace-cuanto-gana-peru': '2026-02-14',
  'bep-plan-ejecucion-bim-ejemplo-peru': '2026-02-17',
  'python-librerias-esenciales-ingenieros-civiles': '2026-02-21',

  // ═══ MARZO 2026 — Posts recientes, guías completas (7 posts) ═══
  'civil-3d-carreteras-guia-completa-paso-a-paso': '2026-03-03',
  'civil-3d-crear-primer-corredor-vial-carreteras': '2026-03-06',
  'etabs-analisis-sismico-norma-e030-guia-practica': '2026-03-10',
  'modelamiento-bim-estructural-revit-etabs-guia': '2026-03-14',
  'modelamiento-vigas-revit-copiar-niveles': '2026-03-18',
  'revit-modelamiento-vigas-copiar-supervisar-niveles': '2026-03-18',
  'bim-obligatorio-peru-2026': '2026-03-22',
  'que-es-bim-obligatorio-peru-2026': '2026-03-22',
  'predimensionamiento-columnas-vigas-e060-practico': '2026-03-26',
  'haz-predimensionamiento-columnas-vigas-optimizar': '2026-03-26',
  'hardy-cross-hp-prime-programa': '2026-01-27',
};

async function main() {
  console.log('📅 Redistribuyendo fechas de publicación');
  console.log(dryRun ? '⚠️  MODO DRY-RUN\n' : '⚡ MODO EJECUCIÓN\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  console.log(`📊 ${posts.length} posts a redistribuir\n`);

  let updated = 0;
  let notFound = 0;

  // Show distribution plan
  const monthCounts: Record<string, number> = {};
  for (const slug of Object.keys(POST_DATES)) {
    const month = POST_DATES[slug].slice(0, 7);
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  }

  console.log('📋 Distribución planificada:');
  Object.entries(monthCounts).sort(([a], [b]) => a.localeCompare(b)).forEach(([month, count]) => {
    const bar = '█'.repeat(count * 2);
    console.log(`   ${month}: ${bar} (${count})`);
  });
  console.log('');

  for (const post of posts) {
    const newDate = POST_DATES[post.slug];

    if (!newDate) {
      console.log(`⚠️  Sin fecha asignada: "${post.title}" (slug: ${post.slug})`);
      notFound++;
      continue;
    }

    const oldDate = post.published_at?.slice(0, 10) || 'N/A';
    const formattedNewDate = newDate + 'T08:00:00.000Z';

    console.log(`📝 "${post.title}"`);
    console.log(`   ${oldDate} → ${newDate}`);

    if (!dryRun) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ published_at: formattedNewDate })
        .eq('id', post.id);

      if (updateError) {
        console.log(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Actualizado`);
        updated++;
      }
    } else {
      console.log(`   ⚠️  [DRY-RUN]`);
      updated++;
    }
    console.log('');
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ⚠️  Sin fecha asignada: ${notFound}`);
  console.log(`   📅 Nuevos posts restantes: ${posts.length - notFound}`);

  if (dryRun) {
    console.log('\n💡 Ejecuta sin --dry-run para aplicar cambios reales');
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
