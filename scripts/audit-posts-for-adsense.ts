/**
 * audit-posts-for-adsense.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Diagnóstico completo de posts para aprobación de AdSense.
 * 
 * Detecta:
 *  1. Posts duplicados (mismo tema, slugs diferentes)
 *  2. Posts delgados (< 1000 palabras)
 *  3. Posts con patrones AI detectables
 *  4. Posts sin featured_image
 *  5. Posts sin links externos
 *  6. Categoría "Prueba E2E" o datos de test
 *  7. Inconsistencias de autor
 *  8. Distribución de fechas
 * 
 * Uso:
 *   npx tsx scripts/audit-posts-for-adsense.ts
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Helpers ──
function countWords(text: string): number {
  return text.replace(/[#*`_\[\](){}]/g, '').split(/\s+/).filter(Boolean).length;
}

function hasExternalLinks(content: string): boolean {
  return /https?:\/\/(?!freecloud\.pe)/.test(content);
}

function hasAiPatterns(content: string): string[] {
  const patterns: { name: string; regex: RegExp }[] = [
    { name: '"En conclusión"', regex: /En conclusión/gi },
    { name: '"En resumen"', regex: /En resumen/gi },
    { name: '"Es importante destacar"', regex: /Es importante destacar/gi },
    { name: '"A continuación exploraremos"', regex: /A continuación.*exploraremos/gi },
    { name: '"Este artículo"', regex: /Este artícul/gi },
    { name: '"Sumérgete"', regex: /Sumérgete|Sumérj/gi },
    { name: '"Descubre"', regex: /Descubre cómo|Descubre por qué/gi },
    { name: '"Sin más preámbulos"', regex: /Sin más preámbulos/gi },
    { name: '"En este artículo"', regex: /En este artícul/gi },
    { name: '"Para concluir"', regex: /Para concluir/gi },
  ];

  return patterns
    .filter(p => p.regex.test(content))
    .map(p => p.name);
}

function wordCountToReadTime(words: number): number {
  return Math.max(1, Math.ceil(words / 200));
}

// ── Main ──
async function main() {
  console.log('🔍 Auditando posts para AdSense...\n');

  // Get all published posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Error fetching posts:', error?.message);
    process.exit(1);
  }

  console.log(`📊 Total de posts publicados: ${posts.length}\n`);

  // ── 1. Posts duplicados por tema ──
  console.log('═══════════════════════════════════════════════');
  console.log('📋 1. ANÁLISIS DE DUPLICADOS POR TEMA');
  console.log('═══════════════════════════════════════════════\n');

  const topicGroups: Record<string, typeof posts> = {};
  const topicKeywords: Record<string, RegExp> = {
    'pyRevit Instalar': /pyrevit.*instal|instal.*pyrevit|primer.*script.*python.*revit|guia.*instalacion.*script.*python/i,
    'Cortante Basal': /cortante.*basal|fuerza.*cortante.*basal/i,
    'ETABS vs Robot': /etabs.*vs.*robot|robot.*vs.*etabs|robot.*structural.*etabs/i,
    'Dynamo Principiante': /dynamo.*principiant|dynamo.*primer|dynamo.*automatiz/i,
    'Dynamo vs pyRevit': /dynamo.*vs.*pyrevit|pyrevit.*vs.*dynamo/i,
    'Navisworks Clash': /navisworks.*clash|navisworks.*interferencia|navisworks.*choque/i,
    'Metrados Acero': /metrado.*acero|acero.*corrugado|metrado.*errores/i,
    'Civil 3D Carretera': /civil.*3d.*carreter|corredor.*vial|corredor.*civil/i,
    'Punzonamiento': /punzonamiento|punching.*shear/i,
    'BIM Obligatorio': /bim.*obligatorio|ley.*32069|bim.*peru.*2026/i,
    'BIM Implementación': /implement.*bim|transicion.*bim|prepararte.*bim/i,
    'Zapata/Cimentación': /zapata.*aislada|cimentacion.*aislada|diseno.*cimentacion/i,
    'Muros Pantalla': /muro.*pantalla|muro.*contencion.*etabs/i,
    'Análisis Sísmico ETABS': /analisis.*sismico.*etabs|etabs.*analisis.*sismico/i,
    'Revit vs AutoCAD': /revit.*vs.*autocad|autocad.*vs.*revit/i,
    'BEP Plan BIM': /plan.*ejecucion.*bim|bep.*plan|plan.*ejecucion.*bim/i,
    'LOD BIM': /lod.*100|lod.*200|lod.*300|lod.*500|lod.*bim/i,
    'Open BIM': /open.*bim.*closed|ifc.*bim|formato.*ifc/i,
    'Python Librerías': /libreria.*python|python.*ingenier|python.*librerias/i,
    'BIM Manager': /bim.*manager|cuanto.*gana.*bim/i,
    'Hardy Cross HP': /hardy.*cross|hp.*prime.*hardy|programa.*hardy/i,
    'Predimensionamiento': /predimensiona|columna.*viga.*optimiz/i,
    'Diaphragm Rígido': /diafragma.*rigido|diafragma.*semiflexib/i,
    'SAP2000 vs ETABS': /sap2000.*vs.*etabs|etabs.*vs.*sap2000/i,
    'Factor ZUCS/R': /zucs|factor.*r.*e030|formula.*zucs/i,
    'Modal ETABS': /modal.*etabs|reporte.*analisis.*modal/i,
  };

  for (const post of posts) {
    const fullText = `${post.title} ${post.content || ''}`;
    for (const [topic, regex] of Object.entries(topicKeywords)) {
      if (regex.test(fullText)) {
        if (!topicGroups[topic]) topicGroups[topic] = [];
        topicGroups[topic].push(post);
      }
    }
  }

  let duplicateCount = 0;
  for (const [topic, group] of Object.entries(topicGroups)) {
    if (group.length > 1) {
      duplicateCount++;
      console.log(`📌 ${topic} (${group.length} posts):`);
      group.forEach(p => {
        const wc = countWords(p.content || '');
        console.log(`   • "${p.title}"`);
        console.log(`     Slug: ${p.slug} | Palabras: ${wc} | Lectura: ${p.reading_time || wordCountToReadTime(wc)} min | Fecha: ${p.published_at?.slice(0, 10)}`);
      });
      console.log('');
    }
  }

  if (duplicateCount === 0) {
    console.log('✅ No se detectaron duplicados por tema.\n');
  }

  // ── 2. Posts delgados (< 1000 palabras) ──
  console.log('═══════════════════════════════════════════════');
  console.log('📏 2. POSTS DELGADOS (< 1000 palabras)');
  console.log('═══════════════════════════════════════════════\n');

  const thinPosts = posts.filter(p => {
    const wc = countWords(p.content || '');
    return wc < 1000;
  }).sort((a, b) => countWords(a.content || '') - countWords(b.content || ''));

  if (thinPosts.length === 0) {
    console.log('✅ Todos los posts tienen 1000+ palabras.\n');
  } else {
    console.log(`⚠️  ${thinPosts.length} posts con menos de 1000 palabras:\n`);
    thinPosts.forEach(p => {
      const wc = countWords(p.content || '');
      console.log(`   • "${p.title}"`);
      console.log(`     Palabras: ${wc} (necesita +${1000 - wc} palabras) | Lectura: ${p.reading_time || wordCountToReadTime(wc)} min`);
    });
    console.log('');
  }

  // ── 3. Posts con patrones AI ──
  console.log('═══════════════════════════════════════════════');
  console.log('🤖 3. POSTS CON PATRONES AI DETECTABLES');
  console.log('═══════════════════════════════════════════════\n');

  const aiPosts = posts.map(p => ({
    post: p,
    patterns: hasAiPatterns(p.content || ''),
  })).filter(x => x.patterns.length > 0);

  if (aiPosts.length === 0) {
    console.log('✅ No se detectaron patrones AI típicos.\n');
  } else {
    console.log(`⚠️  ${aiPosts.length} posts con patrones AI:\n`);
    aiPosts.forEach(({ post: p, patterns }) => {
      console.log(`   • "${p.title}"`);
      console.log(`     Patrones: ${patterns.join(', ')}`);
    });
    console.log('');
  }

  // ── 4. Posts sin featured_image ──
  console.log('═══════════════════════════════════════════════');
  console.log('🖼️  4. POSTS SIN FEATURED IMAGE');
  console.log('═══════════════════════════════════════════════\n');

  const noImagePosts = posts.filter(p => !p.featured_image);
  if (noImagePosts.length === 0) {
    console.log('✅ Todos los posts tienen featured_image.\n');
  } else {
    console.log(`⚠️  ${noImagePosts.length} posts sin featured_image:\n`);
    noImagePosts.slice(0, 20).forEach(p => {
      console.log(`   • "${p.title}"`);
    });
    if (noImagePosts.length > 20) {
      console.log(`   ... y ${noImagePosts.length - 20} más`);
    }
    console.log('');
  }

  // ── 5. Posts sin links externos ──
  console.log('═══════════════════════════════════════════════');
  console.log('🔗 5. POSTS SIN LINKS EXTERNOS');
  console.log('═══════════════════════════════════════════════\n');

  const noExternalLinks = posts.filter(p => !hasExternalLinks(p.content || ''));
  if (noExternalLinks.length === 0) {
    console.log('✅ Todos los posts tienen links externos.\n');
  } else {
    console.log(`⚠️  ${noExternalLinks.length} posts sin links externos (necesitan 2-3 por post):\n`);
    noExternalLinks.slice(0, 15).forEach(p => {
      console.log(`   • "${p.title}"`);
    });
    if (noExternalLinks.length > 15) {
      console.log(`   ... y ${noExternalLinks.length - 15} más`);
    }
    console.log('');
  }

  // ── 6. Categoría "Prueba E2E" o test data ──
  console.log('═══════════════════════════════════════════════');
  console.log('🧪 6. DATOS DE TEST / CATEGORÍA "PRUEBA E2E"');
  console.log('═══════════════════════════════════════════════\n');

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const testCategory = categories?.find(c =>
    c.name?.toLowerCase().includes('prueba') ||
    c.slug?.toLowerCase().includes('prueba') ||
    c.name?.toLowerCase().includes('test') ||
    c.slug?.toLowerCase().includes('e2e')
  );

  if (testCategory) {
    console.log(`❌ Categoría de test encontrada:`);
    console.log(`   • "${testCategory.name}" (slug: ${testCategory.slug})`);

    const testPosts = posts.filter(p => p.category_id === testCategory.id);
    if (testPosts.length > 0) {
      console.log(`\n   Posts en esta categoría (${testPosts.length}):`);
      testPosts.forEach(p => console.log(`   • "${p.title}"`));
    }
    console.log('');
  } else {
    console.log('✅ No se encontraron categorías de test.\n');
  }

  // ── 7. Inconsistencias de autor ──
  console.log('═══════════════════════════════════════════════');
  console.log('✍️  7. INCONSISTENCIAS DE AUTOR');
  console.log('═══════════════════════════════════════════════\n');

  const authors = [...new Set(posts.map(p => p.author).filter(Boolean))];
  if (authors.length > 1) {
    console.log(`⚠️  ${authors.length} variantes de autor encontradas:`);
    authors.forEach(a => {
      const count = posts.filter(p => p.author === a).length;
      console.log(`   • "${a}" (${count} posts)`);
    });
    console.log('');
  } else {
    console.log(`✅ Autor consistente: "${authors[0]}"\n`);
  }

  // ── 8. Distribución de fechas ──
  console.log('═══════════════════════════════════════════════');
  console.log('📅 8. DISTRIBUCIÓN DE FECHAS DE PUBLICACIÓN');
  console.log('═══════════════════════════════════════════════\n');

  const dates = posts.map(p => p.published_at?.slice(0, 7)).filter(Boolean) as string[];
  const monthCounts: Record<string, number> = {};
  dates.forEach(d => { monthCounts[d] = (monthCounts[d] || 0) + 1; });

  const sortedMonths = Object.entries(monthCounts).sort(([a], [b]) => a.localeCompare(b));

  console.log('Publicaciones por mes:');
  sortedMonths.forEach(([month, count]) => {
    const bar = '█'.repeat(Math.min(count, 40));
    console.log(`   ${month}: ${bar} (${count})`);
  });

  if (sortedMonths.length <= 2) {
    console.log('\n⚠️  ALERTA: Todo el contenido publicado en un período muy corto.');
    console.log('   Recomendación: Esparcir publicaciones a lo largo de 6-12 meses.');
  } else if (sortedMonths.length <= 4) {
    console.log('\n⚠️  Período de publicación algo corto. Idealmente 6+ meses.');
  } else {
    console.log('\n✅ Distribución de fechas razonable.');
  }
  console.log('');

  // ── RESUMEN FINAL ──
  console.log('═══════════════════════════════════════════════');
  console.log('📊 RESUMEN FINAL DE ADSENSE READINESS');
  console.log('═══════════════════════════════════════════════\n');

  const issues: { severity: '🔴' | '🟡' | '🟢'; issue: string; count?: number }[] = [];

  if (duplicateCount > 0) issues.push({ severity: '🔴', issue: 'Posts duplicados por tema', count: duplicateCount });
  if (thinPosts.length > 0) issues.push({ severity: '🟡', issue: 'Posts delgados (< 1000 palabras)', count: thinPosts.length });
  if (aiPosts.length > 0) issues.push({ severity: '🟡', issue: 'Posts con patrones AI', count: aiPosts.length });
  if (noImagePosts.length > 0) issues.push({ severity: '🟡', issue: 'Posts sin featured image', count: noImagePosts.length });
  if (noExternalLinks.length > 0) issues.push({ severity: '🟡', issue: 'Posts sin links externos', count: noExternalLinks.length });
  if (testCategory) issues.push({ severity: '🔴', issue: 'Categoría de test encontrada' });
  if (authors.length > 1) issues.push({ severity: '🟡', issue: 'Inconsistencia de autor', count: authors.length });
  if (sortedMonths.length <= 2) issues.push({ severity: '🟡', issue: 'Todo contenido en período muy corto', count: sortedMonths.length });

  issues.forEach(({ severity, issue, count }) => {
    console.log(`${severity} ${issue}${count !== undefined ? ` (${count})` : ''}`);
  });

  console.log(`\n✅ Posts buenos: ${posts.length - thinPosts.length} de ${posts.length}`);
  console.log(`📝 Promedio de palabras: ${Math.round(posts.reduce((sum, p) => sum + countWords(p.content || ''), 0) / posts.length)}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
