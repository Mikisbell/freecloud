/**
 * add-internal-links.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Agrega internal links contextuales a TODOS los posts.
 * Cada post recibe 3-5 links a posts relacionados dentro del contenido.
 * 
 * Estrategia:
 *  - Posts de BIM → linkan a Revit, Normativa, BEP
 *  - Posts de ETABS → linkan a E.030, Sismo, Robot
 *  - Posts de Python → linkan a Dynamo, Revit API, Excel
 *  - Posts de Civil 3D → linkan a BIM, topografía
 *  - Todos → linkan al menos 1 post de otra categoría (cross-pollination)
 * 
 * Uso: npx tsx scripts/add-internal-links.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Link maps: category → { anchor text: slug }
const LINK_MAPS: Record<string, { text: string; slug: string }[]> = {
  bim: [
    { text: 'Ley 32069', slug: 'bim-obligatorio-peru-2026' },
    { text: 'Plan de Ejecución BIM', slug: 'bep-plan-ejecucion-bim-ejemplo-peru' },
    { text: 'niveles BIM', slug: 'bim-nivel-1-2-3-diferencias-certificacion' },
    { text: 'BIM Manager', slug: 'bim-manager-que-hace-cuanto-gana-peru' },
  ],
  revit: [
    { text: 'Revit vs AutoCAD', slug: 'revit-vs-autocad-cual-aprender-primero-2025' },
    { text: 'automatizar con Dynamo', slug: 'dynamo-principiantes-primera-automatizacion-revit-guia' },
    { text: 'scripts con pyRevit', slug: 'pyrevit-instalar-primeros-scripts-revit' },
    { text: 'niveles LOD', slug: 'lod-100-500-bim-significado-revit-peru' },
  ],
  etabs: [
    { text: 'Norma E.030', slug: 'cortante-basal-formula-e030-calculo-paso-a-paso' },
    { text: 'análisis modal', slug: 'interpretar-analisis-modal-masas-etabs-e030' },
    { text: 'ETABS vs Robot', slug: 'robot-structural-vs-etabs-cual-usar-estructuras' },
    { text: 'diafragmas', slug: 'etabs-diafragma-rigido-semiflexible-cuando-usar' },
  ],
  python: [
    { text: 'librerías esenciales', slug: 'python-librerias-esenciales-ingenieros-civiles' },
    { text: 'automatizar Revit con Python', slug: 'revit-api-python-pyrevit-programacion-bim' },
    { text: 'Dynamo vs pyRevit', slug: 'dynamo-vs-pyrevit-automatizacion-bim-2026' },
  ],
  'civil-3d': [
    { text: 'corredores viales', slug: 'civil-3d-crear-primer-corredor-vial-carreteras' },
    { text: 'BIM en infraestructura', slug: 'bim-nivel-1-2-3-diferencias-certificacion' },
  ],
  excel: [
    { text: 'metrados de acero', slug: 'excel-metrado-acero-calculo-automatico-vigas' },
    { text: 'errores comunes en metrados', slug: 'metrados-acero-corrugado-errores-presupuesto-obra' },
  ],
  navisworks: [
    { text: 'clash detection tutorial', slug: 'navisworks-clash-detection-tutorial-completo' },
    { text: 'paradoja de Navisworks', slug: 'navisworks-choques-clash-detection-paradoja' },
    { text: 'BEP BIM', slug: 'bep-plan-ejecucion-bim-ejemplo-peru' },
  ],
  normativa: [
    { text: 'cortante basal E.030', slug: 'cortante-basal-formula-e030-calculo-paso-a-paso' },
    { text: 'factor ZUCS/R', slug: 'zucs-formula-zona-sismica-e030-peru' },
    { text: 'diseño de zapatas', slug: 'calculo-zapata-aislada-e050-e060-paso-a-paso' },
  ],
  dynamo: [
    { text: 'Dynamo para principiantes', slug: 'dynamo-principiantes-primera-automatizacion-revit-guia' },
    { text: 'scripts iniciales', slug: 'script-iniciales-dynamo-revit-hola-mundo' },
    { text: 'Dynamo vs pyRevit', slug: 'dynamo-vs-pyrevit-automatizacion-bim-2026' },
  ],
  'hp-prime': [
    { text: 'Hardy Cross en HP Prime', slug: 'hp-prime-programa-hardy-cross-analisis-estructural' },
    { text: 'predimensionamiento', slug: 'predimensionamiento-columnas-vigas-e060-practico' },
  ],
};

function getCategoryKey(slug: string, title: string): string {
  const t = title.toLowerCase();
  const s = slug.toLowerCase();
  
  if (s.includes('bim') || s.includes('lod') || s.includes('manager') || s.includes('bepeb') || s.includes('nivel-1-2-3') || s.includes('implement') || t.includes('open bim') || t.includes('closed bim')) return 'bim';
  if (s.includes('revit') && !s.includes('pyrevit') && !s.includes('dynamo')) return 'revit';
  if (s.includes('etabs') || s.includes('sismo') || s.includes('sismic') || s.includes('modal') || s.includes('diafragma') || s.includes('punzonamiento') || s.includes('muro-pantalla') || s.includes('cortante') || s.includes('zucs') || s.includes('zapata') || s.includes('predimensiona')) return 'etabs';
  if (s.includes('python') || t.includes('python')) return 'python';
  if (s.includes('civil-3d') || s.includes('corredor-vial')) return 'civil-3d';
  if (s.includes('excel') || s.includes('metrado')) return 'excel';
  if (s.includes('navisworks') || s.includes('clash')) return 'navisworks';
  if (s.includes('dynamo')) return 'dynamo';
  if (s.includes('hp-prime') || s.includes('hardy-cross')) return 'hp-prime';
  if (s.includes('norma') || s.includes('e030') || s.includes('e060') || s.includes('e050') || s.includes('cortante') || s.includes('zucs')) return 'normativa';
  if (s.includes('robot') || s.includes('sap2000')) return 'etabs';
  
  return 'bim'; // fallback
}

async function main() {
  console.log('🔗 Agregando internal links a todos los posts\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, content, category_id, categories!inner(slug)')
    .eq('status', 'published');

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const catSlug = (post as any).categories?.slug || '';
    const catKey = getCategoryKey(post.slug, post.title);
    const links = LINK_MAPS[catKey] || LINK_MAPS['bim'];
    
    // Filter out links to self
    const validLinks = links.filter(l => l.slug !== post.slug);
    
    // Pick 3-4 random links
    const numLinks = Math.min(3 + Math.floor(Math.random() * 2), validLinks.length);
    const shuffled = validLinks.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numLinks);

    // Check if post already has internal links
    const existingLinks = (post.content || '').match(/\/blog\/[a-zA-Z0-9-]+/g) || [];
    if (existingLinks.length >= 3) {
      skipped++;
      continue;
    }

    // Build the internal links block
    const linkItems = selected.map(l => 
      `  <li><a href="/blog/${l.slug}">${l.text}</a></li>`
    ).join('\n');

    const linksBlock = `\n\n<div class="bg-surface-50 rounded-xl p-5 border border-surface-100 my-8">\n  <p class="text-sm font-semibold text-surface-700 mb-3">📚 Artículos relacionados que te pueden interesar:</p>\n  <ul class="space-y-1.5 text-sm">\n${linkItems}\n  </ul>\n</div>\n`;

    // Insert before the first FAQ section or at the end
    let newContent = post.content || '';
    const faqIndex = newContent.indexOf('<details>');
    if (faqIndex > 0) {
      newContent = newContent.slice(0, faqIndex) + linksBlock + newContent.slice(faqIndex);
    } else {
      newContent += linksBlock;
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', post.id);

    if (updateError) {
      console.log(`❌ "${post.title}": ${updateError.message}`);
    } else {
      console.log(`✅ "${post.title}" — ${numLinks} links añadidos`);
      updated++;
    }
  }

  console.log(`\n📊 Actualizados: ${updated}`);
  console.log(`📊 Saltados (ya tenían links): ${skipped}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
