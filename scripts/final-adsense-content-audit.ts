/**
 * final-adsense-content-audit.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Auditoría final post-expansión para identificar qué falta mejorar.
 * 
 * Uso: npx tsx scripts/final-adsense-content-audit.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function countWords(text: string): number {
  return text.replace(/[#*`_\[\](){}]/g, '').split(/\s+/).filter(Boolean).length;
}

async function main() {
  console.log('🔍 Auditoría final de contenido para AdSense\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  console.log(`📊 ${posts.length} posts publicados\n`);

  // 1. Posts still under 1000 words
  console.log('═══════════════════════════════════════════════');
  console.log('📏 POSTS AÚN BAJO 1000 PALABRAS');
  console.log('═══════════════════════════════════════════════\n');

  const thinPosts = posts
    .map(p => ({ ...p, wordCount: countWords(p.content || '') }))
    .filter(p => p.wordCount < 1000)
    .sort((a, b) => a.wordCount - b.wordCount);

  thinPosts.forEach(p => {
    const deficit = 1000 - p.wordCount;
    console.log(`   • "${p.title}"`);
    console.log(`     ${p.wordCount} palabras (necesita +${deficit}) | ${p.published_at?.slice(0, 10)}\n`);
  });

  // 2. Posts with clickbait titles
  console.log('═══════════════════════════════════════════════');
  console.log('📝 TÍTULOS TIPO CLICKBAIT (primera persona sin contexto)');
  console.log('═══════════════════════════════════════════════\n');

  const clickbaitPatterns = [
    /^Implementé/i,
    /^Creé/i,
    /^Programé/i,
    /^Hice/i,
    /^Usé/i,
    /^Preparé/i,
    /^Domina/i,
    /^Calcule/i,
    /^Automatiza/i,
  ];

  const clickbaitPosts = posts.filter(p =>
    clickbaitPatterns.some(pat => pat.test(p.title || ''))
  );

  clickbaitPosts.forEach(p => {
    console.log(`   • "${p.title}"`);
    console.log(`     Sugerencia: título descriptivo profesional\n`);
  });

  // 3. Posts without FAQ section
  console.log('═══════════════════════════════════════════════');
  console.log('❓ POSTS SIN SECCIÓN DE PREGUNTAS FRECUENTES');
  console.log('═══════════════════════════════════════════════\n');

  const noFAQ = posts.filter(p => !p.content?.includes('<details>'));
  console.log(`   ${noFAQ.length} posts sin FAQ (bueno para SEO/AEO)\n`);

  // 4. Posts without tables
  console.log('═══════════════════════════════════════════════');
  console.log('📊 POSTS SIN TABLAS DE DATOS');
  console.log('═══════════════════════════════════════════════\n');

  const noTables = posts.filter(p => !p.content?.includes('|'));
  console.log(`   ${noTables.length} posts sin tablas\n`);

  // 5. Summary
  console.log('═══════════════════════════════════════════════');
  console.log('📊 RESUMEN');
  console.log('═══════════════════════════════════════════════\n');

  const wordCounts = posts.map(p => countWords(p.content || ''));
  const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  const minWords = Math.min(...wordCounts);
  const maxWords = Math.max(...wordCounts);
  const over1000 = wordCounts.filter(w => w >= 1000).length;
  const over800 = wordCounts.filter(w => w >= 800).length;

  console.log(`   Promedio de palabras: ${avgWords}`);
  console.log(`   Mínimo: ${minWords} | Máximo: ${maxWords}`);
  console.log(`   Posts con 1000+ palabras: ${over1000}/${posts.length}`);
  console.log(`   Posts con 800+ palabras: ${over800}/${posts.length}`);
  console.log(`   Posts con FAQ: ${posts.length - noFAQ.length}/${posts.length}`);
  console.log(`   Posts con tablas: ${posts.length - noTables.length}/${posts.length}`);
  console.log(`   Títulos clickbait: ${clickbaitPosts.length}/${posts.length}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
