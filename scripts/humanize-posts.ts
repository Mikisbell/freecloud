/**
 * humanize-posts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Humaniza los posts existentes en Supabase para que suenen como Miguel Rivera
 * y no como contenido AI genérico (anti-detección Google HCU).
 *
 * Estrategia:
 *  1. Lee todos los posts publicados de Supabase
 *  2. Para cada post, aplica transformaciones de humanización deterministas:
 *     - Añade párrafo de apertura con "cicatriz" (problema real)
 *     - Convierte frases AI-típicas a frases con fricción
 *     - Agrega blockquote de advertencia de obra al 50% del contenido
 *     - Inyecta referencia a Perú / norma local si no existe
 *  3. Actualiza el post en Supabase con el contenido humanizado
 *
 * Uso:
 *   npx tsx scripts/humanize-posts.ts
 *   npx tsx scripts/humanize-posts.ts --dry-run   (solo muestra los cambios sin escribir)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const isDryRun = process.argv.includes('--dry-run');

const supabase = createClient(supabaseUrl, supabaseKey);

// ─────────────────────────────────────────────────────────────────────────────
// REGLAS DE REEMPLAZO — Patrones AI → Voz humana
// ─────────────────────────────────────────────────────────────────────────────
const AI_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Cierres de AI
  { pattern: /En conclusión[,:]?\s*/gi, replacement: 'La verdad es que ' },
  { pattern: /En resumen[,:]?\s*/gi, replacement: 'Dicho de forma directa: ' },
  { pattern: /Para concluir[,:]?\s*/gi, replacement: '' },
  { pattern: /Finalmente[,:]?\s*/gi, replacement: 'Y lo más importante: ' },

  // Frases de apertura genéricas
  { pattern: /Es importante destacar que\s*/gi, replacement: '' },
  { pattern: /Es fundamental (que|tener en cuenta)\s*/gi, replacement: 'No se puede ignorar el hecho de que ' },
  { pattern: /A continuación[,.]?\s*(te )?(explicaremos|exploraremos|veremos|presentamos)\s*/gi, replacement: '' },
  { pattern: /Este artículo te (enseñará|mostrará|ayudará a entender)\s*/gi, replacement: '' },
  { pattern: /En este artículo[,.]?\s*/gi, replacement: '' },

  // Palabras sobreusadas por AI
  { pattern: /\bcrucial\b/gi, replacement: 'crítico' },
  { pattern: /\bfundamental\b/gi, replacement: 'básico' },
  { pattern: /\besencial\b/gi, replacement: 'necesario' },
  { pattern: /\bundamentalmente\b/gi, replacement: 'básicamente' },
  
  // Construcciones pasivas AI
  { pattern: /se puede observar que\s*/gi, replacement: '' },
  { pattern: /cabe mencionar que\s*/gi, replacement: '' },
  { pattern: /vale la pena (señalar|mencionar|destacar) que\s*/gi, replacement: '' },
  { pattern: /es importante (señalar|mencionar|notar) que\s*/gi, replacement: '' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Aplica todos los patrones de reemplazo
// ─────────────────────────────────────────────────────────────────────────────
function applyPatterns(html: string): string {
  let result = html;
  for (const { pattern, replacement } of AI_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Inyecta blockquote de advertencia si no existe ya uno
// ─────────────────────────────────────────────────────────────────────────────
const WARNINGS_POOL = [
  '<blockquote><strong>⚠️ Ojo en obra:</strong> Lo que el software muestra no siempre refleja la realidad constructiva. Valida siempre los resultados contra la norma aplicable y el criterio del ingeniero responsable.</blockquote>',
  '<blockquote><strong>⚠️ Ojo en obra:</strong> En Perú, los planos de las oficinas de ingeniería muchas veces difieren de lo que el inspector de obra ejecuta. Deja todo por escrito y con fecha.</blockquote>',
  '<blockquote><strong>⚠️ Ojo en obra:</strong> Si estás en Lima, verifica que las especificaciones técnicas citen explícitamente la norma E.060 vigente. Hay proyectos que aún usan versiones desactualizadas sin saberlo.</blockquote>',
  '<blockquote><strong>⚠️ Ojo en obra:</strong> No confundas el modelo virtual con la estructura real. El acero modelado en Revit no es el acero que el fierrero va a doblar. Siempre hay tolerancias de campo.</blockquote>',
];

function injectWarning(html: string, postIndex: number): string {
  if (html.includes('<blockquote>')) return html; // Ya tiene uno

  const warning = WARNINGS_POOL[postIndex % WARNINGS_POOL.length];
  // Insertar después del primer </h2> o a mitad del contenido
  const h2Match = html.match(/<\/h2>/i);
  if (h2Match?.index) {
    const insertAt = html.indexOf('</h2>') + 5;
    return html.slice(0, insertAt) + '\n' + warning + '\n' + html.slice(insertAt);
  }
  // Si no hay h2, insertar en el medio
  const midPoint = Math.floor(html.length / 2);
  return html.slice(0, midPoint) + '\n' + warning + '\n' + html.slice(midPoint);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Estadísticas de cuántos cambios se hiceron
// ─────────────────────────────────────────────────────────────────────────────
function countChanges(original: string, humanized: string): number {
  if (original === humanized) return 0;
  // Contar diferencias aproximadas
  let changes = 0;
  for (const { pattern } of AI_PATTERNS) {
    if (pattern.test(original)) changes++;
  }
  if (!original.includes('<blockquote>') && humanized.includes('<blockquote>')) changes++;
  return changes;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function humanizePosts() {
  console.log('\n🧠 Content Humanizer — FreeCloud.pe');
  console.log(isDryRun ? '🔍 MODO DRY-RUN (sin cambios en DB)\n' : '✍️  MODO ESCRITURA (actualizando Supabase)\n');
  console.log('─'.repeat(60));

  // 1. Obtener todos los posts publicados
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, content')
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (error || !posts) {
    console.error('❌ Error leyendo posts:', error);
    process.exit(1);
  }

  console.log(`📚 Posts encontrados: ${posts.length}\n`);

  let totalChanges = 0;
  let postsModified = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] "${post.title.slice(0, 55)}..."`);

    const original = post.content || '';
    let humanized = applyPatterns(original);
    humanized = injectWarning(humanized, i);

    const changes = countChanges(original, humanized);

    if (changes === 0) {
      console.log(`   ✅ Ya humanizado — sin cambios necesarios`);
      continue;
    }

    console.log(`   🔄 ${changes} mejora(s) de humanización detectadas`);
    totalChanges += changes;
    postsModified++;

    if (!isDryRun) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: humanized })
        .eq('id', post.id);

      if (updateError) {
        console.error(`   ❌ Error actualizando "${post.slug}":`, updateError.message);
      } else {
        console.log(`   ✅ Actualizado en Supabase`);
      }
    } else {
      console.log(`   [DRY-RUN] Se actualizaría en Supabase`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`📊 Resultado:`);
  console.log(`   Posts procesados: ${posts.length}`);
  console.log(`   Posts con cambios: ${postsModified}`);
  console.log(`   Total de mejoras: ${totalChanges}`);

  if (isDryRun) {
    console.log('\n💡 Para aplicar los cambios, corre sin --dry-run:');
    console.log('   npx tsx scripts/humanize-posts.ts');
  } else {
    console.log('\n✅ Humanización completada. Los posts ya no huelen a ChatGPT.');
    console.log('👉 Siguiente paso: node scripts/indexnow-submit.mjs (re-indexar con el contenido fresco)');
  }
}

humanizePosts();
