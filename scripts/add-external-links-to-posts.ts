/**
 * add-external-links-to-posts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Agrega 2-3 links externos de autoridad a cada post publicado.
 * Google/AdSense valoran mucho los links a fuentes oficiales.
 * 
 * Links por categoría:
 *  - E.030 (sismo) → PDF oficial norma E.030
 *  - E.050/E.060 (concreto/acero) → PDF oficial normas
 *  - Revit/BIM → Autodesk docs, ISO 19650
 *  - ETABS/Robot → CSI Computers, Autodesk
 *  - Python → Python.org, pyRevit docs
 *  - Civil 3D → Autodesk docs, MTC
 *  - Dynamo → DynamoBIM.org, Autodesk
 *  - Navisworks → Autodesk docs
 *  - BIM Ley 32069 → Ley oficial, MTC
 *  - HP Prime → HP calculator docs
 *  - Excel → Microsoft docs
 * 
 * Uso:
 *   npx tsx scripts/add-external-links-to-posts.ts
 *   npx tsx scripts/add-external-links-to-posts.ts --dry-run
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

// ── External link database by topic ──
const EXTERNAL_LINKS: Record<string, { label: string; url: string }[]> = {
  e030: [
    { label: 'Norma E.030 Diseño Sismorresistente (PDF oficial)', url: 'https://www.gob.pe/institucion/vivienda/norma/324606-reglamento-nacional-de-edificaciones' },
    { label: 'Reglamento Nacional de Edificaciones', url: 'https://www.gob.pe/institucion/vivienda' },
    { label: 'Manual de Diseño Sismorresistente - MTC', url: 'https://www.gob.pe/institucion/mtc' },
  ],
  e050: [
    { label: 'Norma E.050 Suelos y Cimentaciones (PDF oficial)', url: 'https://www.gob.pe/institucion/vivienda/norma/324606-reglamento-nacional-de-edificaciones' },
    { label: 'Reglamento Nacional de Edificaciones', url: 'https://www.gob.pe/institucion/vivienda' },
  ],
  e060: [
    { label: 'Norma E.060 Concreto Armado (PDF oficial)', url: 'https://www.gob.pe/institucion/vivienda/norma/324606-reglamento-nacional-de-edificaciones' },
    { label: 'Reglamento Nacional de Edificaciones', url: 'https://www.gob.pe/institucion/vivienda' },
  ],
  revit: [
    { label: 'Documentación oficial de Autodesk Revit', url: 'https://help.autodesk.com/view/RVT/2025/ENU/' },
    { label: 'Autodesk Knowledge Network', url: 'https://knowledge.autodesk.com/support/revit-products' },
  ],
  bim: [
    { label: 'ISO 19650 — Gestión de información BIM', url: 'https://www.iso.org/standard/74722.html' },
    { label: 'BuildingSMART International — Estándares OpenBIM', url: 'https://www.buildingsmart.org/' },
    { label: 'Ley 32069 — Contrataciones del Estado (BIM obligatorio)', url: 'https://www.gob.pe/institucion/osce' },
  ],
  etabs: [
    { label: 'CSI ETABS — Documentación oficial', url: 'https://docs.csiamerica.com/manuals/etabs/' },
    { label: 'Computers and Structures, Inc.', url: 'https://www.csiamerica.com/' },
  ],
  robot: [
    { label: 'Autodesk Robot Structural Analysis — Docs', url: 'https://help.autodesk.com/view/RSAPRO/2025/ENU/' },
    { label: 'Autodesk Knowledge Network — Robot', url: 'https://knowledge.autodesk.com/support/robot-structural-analysis' },
  ],
  sap2000: [
    { label: 'CSI SAP2000 — Documentación oficial', url: 'https://docs.csiamerica.com/manuals/sap2000/' },
    { label: 'Computers and Structures, Inc.', url: 'https://www.csiamerica.com/' },
  ],
  python: [
    { label: 'Python.org — Documentación oficial', url: 'https://docs.python.org/3/' },
    { label: 'pyRevit — Documentación oficial', url: 'https://pyrevitlabs.notion.site/pyRevit' },
    { label: 'IronPython — Python para .NET', url: 'https://ironpython.net/' },
  ],
  dynamo: [
    { label: 'DynamoBIM.org — Comunidad oficial', url: 'https://dynamobim.org/' },
    { label: 'Dynamo Primer — Guía oficial', url: 'https://primer.dynamobim.org/' },
    { label: 'Autodesk Dynamo — Documentación', url: 'https://help.autodesk.com/view/DYNPS/2025/ENU/' },
  ],
  navisworks: [
    { label: 'Autodesk Navisworks — Documentación oficial', url: 'https://help.autodesk.com/view/NW/2025/ENU/' },
    { label: 'Autodesk Knowledge Network — Navisworks', url: 'https://knowledge.autodesk.com/support/navisworks-products' },
  ],
  civil3d: [
    { label: 'Autodesk Civil 3D — Documentación oficial', url: 'https://help.autodesk.com/view/CIV3D/2025/ENU/' },
    { label: 'Manual de Diseño Geométrico — MTC Perú', url: 'https://www.gob.pe/institucion/mtc' },
    { label: 'Autodesk Knowledge Network — Civil 3D', url: 'https://knowledge.autodesk.com/support/civil-3d' },
  ],
  excel: [
    { label: 'Microsoft Excel — Documentación oficial', url: 'https://support.microsoft.com/excel' },
    { label: 'Microsoft 365 — Fórmulas y funciones', url: 'https://support.microsoft.com/excel/functions' },
  ],
  hp_prime: [
    { label: 'HP Prime — Manual oficial del usuario', url: 'https://support.hp.com/us-en/product/hp-prime-graphing-calculator/8413661/manuals' },
    { label: 'HP Calculator — Software y drivers', url: 'https://support.hp.com/us-en/product/hp-prime-graphing-calculator/8413661/software' },
  ],
  ley32069: [
    { label: 'Ley 32069 — Ley de Contrataciones del Estado', url: 'https://busquedas.elperuano.pe/normaslegales/ley-de-contrataciones-y-adquisiciones-del-estado-ley-n-320-ley-n-32069-2250439-1/' },
    { label: 'OSCE — Organismo Supervisor de las Contrataciones del Estado', url: 'https://www.gob.pe/osce' },
  ],
};

// Topic mapping per post slug
const POST_LINKS: Record<string, string[]> = {
  // E.030 / Seismic
  'norma-e030-fuerza-cortante-basal-calculo': ['e030', 'bim'],
  'cortante-basal-formula-e030-calculo-paso-a-paso': ['e030', 'e050'],
  'zucs-formula-zona-sismica-e030-peru': ['e030', 'bim'],
  'etabs-analisis-sismico-norma-e030-guia-practica': ['e030', 'etabs'],

  // E.050 / E.060 / Foundations
  'calculo-zapata-aislada-e050-e060-paso-a-paso': ['e050', 'e060', 'etabs'],
  'punzonamiento-cimentaciones-etabs-solucion': ['e060', 'e050', 'etabs'],
  'predimensionamiento-columnas-vigas-e060-practico': ['e060', 'e050'],
  'haz-predimensionamiento-columnas-vigas-optimizar': ['e060', 'e050'],

  // Revit
  'revit-estructuras-ingenieros-autocad': ['revit', 'bim'],
  'revit-vs-autocad-cual-aprender-primero-2025': ['revit', 'bim'],
  'modelamiento-vigas-revit-copiar-supervisar-niveles': ['revit', 'bim'],
  'revit-modelamiento-vigas-copiar-supervisar-niveles': ['revit', 'bim'],
  'pyrevit-instalar-primeros-scripts-revit': ['revit', 'python'],
  'revit-api-python-pyrevit-programacion-bim': ['revit', 'python'],

  // ETABS
  'etabs-muros-pantalla-rigidez-lateral': ['etabs', 'e030'],
  'interpretar-analisis-modal-masas-etabs-e030': ['etabs', 'e030'],
  'etabs-diafragma-rigido-semiflexible-cuando-usar': ['etabs', 'e030'],
  'sap2000-vs-etabs-cual-usar-edificios': ['etabs', 'sap2000'],
  'robot-structural-vs-etabs-cual-usar-estructuras': ['etabs', 'robot'],
  'etabs-vs-robot-structural-comparacion': ['etabs', 'robot'],
  'usé-etabs-y-robot-structural-comparativa-real': ['etabs', 'robot'],

  // BIM general
  'bim-nivel-1-2-3-diferencias-certificacion': ['bim', 'ley32069'],
  'open-bim-vs-closed-bim-ifc-formato': ['bim', 'revit'],
  'lod-100-500-bim-significado-revit-peru': ['bim', 'revit'],
  'bim-manager-que-hace-cuanto-gana-peru': ['bim', 'ley32069'],
  'bep-plan-ejecucion-bim-ejemplo-peru': ['bim', 'ley32069'],
  'plan-ejecucion-bim-peb-guia': ['bim', 'ley32069'],
  'como-prepararte-bim-6-meses': ['bim', 'revit'],
  'que-es-bim-obligatorio-peru-2026': ['bim', 'ley32069'],
  'bim-obligatorio-peru-2026': ['bim', 'ley32069'],
  'implemente-bim-obligatorio-peru-asi-lo-logre': ['bim', 'ley32069'],
  'implemente-bim-en-mi-proyecto-tu-tambien-puedes': ['bim', 'revit'],
  'modelamiento-bim-estructural-revit-etabs-guia': ['bim', 'revit', 'etabs'],
  'automatizacion-bim-python': ['bim', 'python'],

  // Python
  'python-ingenieros-civiles-primer-script': ['python', 'revit'],
  'creé-mi-primer-script-en-python-en-30-minutos': ['python'],
  'python-librerias-esenciales-ingenieros-civiles': ['python', 'excel'],

  // Dynamo
  'dynamo-principiantes-primera-automatizacion-revit-guia': ['dynamo', 'revit'],
  'dynamo-revit-automatizar-primer-proceso': ['dynamo', 'revit'],
  'script-iniciales-dynamo-revit-hola-mundo': ['dynamo', 'revit'],
  'venciendo-hoja-en-blanco-scripts-dynamo-revit': ['dynamo', 'revit'],
  'dynamo-vs-pyrevit-automatizacion-bim-2026': ['dynamo', 'python'],
  'automatiza-tu-primer-proceso-en-revit-con-dynamo': ['dynamo', 'revit'],

  // Navisworks
  'navisworks-clash-detection-tutorial-completo': ['navisworks', 'bim'],
  'navisworks-choques-clash-detection-paradoja': ['navisworks', 'bim'],

  // Civil 3D
  'civil-3d-carreteras-guia-completa-paso-a-paso': ['civil3d', 'bim'],
  'civil-3d-crear-primer-corredor-vial-carreteras': ['civil3d'],

  // Excel
  'excel-metrado-acero-calculo-automatico-vigas': ['excel', 'e060'],
  'excel-plantilla-metrados-obra-automatica': ['excel'],
  'metrados-acero-corrugado-errores-presupuesto-obra': ['excel', 'e060'],
  'automatiza-metrados-de-obra-en-excel-en-10-min': ['excel'],

  // HP Prime
  'hp-prime-programa-hardy-cross-analisis-estructural': ['hp_prime'],
  'programé-hardy-cross-en-hp-prime-y-ahorra-tiempo': ['hp_prime'],
  'hardy-cross-hp-prime-programa': ['hp_prime'],
};

/**
 * Check if content already has a specific external URL
 */
function contentHasLink(content: string, url: string): boolean {
  return content.includes(url);
}

/**
 * Build HTML link block to inject at end of content
 */
function buildLinkSection(links: { label: string; url: string }[]): string {
  const linksHtml = links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer nofollow">${l.label}</a></li>`).join('\n');

  return `\n\n---\n\n### 📚 Fuentes y Referencias\n\n<ul>\n${linksHtml}\n</ul>`;
}

async function main() {
  console.log('🔗 Agregando links externos a posts publicados');
  console.log(dryRun ? '⚠️  MODO DRY-RUN\n' : '⚡ MODO EJECUCIÓN\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, content')
    .eq('status', 'published');

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  console.log(`📊 ${posts.length} posts a procesar\n`);

  let updated = 0;
  let skipped = 0;
  let noLinksConfigured = 0;

  for (const post of posts) {
    const topics = POST_LINKS[post.slug];

    if (!topics || topics.length === 0) {
      console.log(`⚠️  Sin links configurados: "${post.title}"`);
      noLinksConfigured++;
      continue;
    }

    // Collect unique external links for this post
    const allLinks: { label: string; url: string }[] = [];
    for (const topic of topics) {
      const links = EXTERNAL_LINKS[topic];
      if (links) {
        for (const link of links) {
          if (!allLinks.find(l => l.url === link.url) && !contentHasLink(post.content || '', link.url)) {
            allLinks.push(link);
          }
        }
      }
    }

    // Take only first 3 links
    const selectedLinks = allLinks.slice(0, 3);

    if (selectedLinks.length === 0) {
      console.log(`⏭️  Sin links nuevos para: "${post.title}"`);
      skipped++;
      continue;
    }

    console.log(`📝 "${post.title}"`);
    console.log(`   + ${selectedLinks.length} links: ${selectedLinks.map(l => l.label).join(' | ')}`);

    if (!dryRun) {
      const linkSection = buildLinkSection(selectedLinks);
      const newContent = (post.content || '') + linkSection;

      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: newContent })
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
  console.log(`   ⏭️  Sin links nuevos: ${skipped}`);
  console.log(`   ⚠️  Sin configuración: ${noLinksConfigured}`);

  if (dryRun) {
    console.log('\n💡 Ejecuta sin --dry-run para aplicar cambios reales');
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
