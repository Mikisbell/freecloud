/**
 * cleanup-test-data-and-authors.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Limpieza rápida para AdSense:
 *  1. Elimina categoría "Prueba E2E" y posts asociados
 *  2. Estandariza autor a "Ing. Miguel Angel Rivera" en todos los posts
 * 
 * Uso:
 *   npx tsx scripts/cleanup-test-data-and-authors.ts        (ejecuta cambios)
 *   npx tsx scripts/cleanup-test-data-and-authors.ts --dry-run  (solo muestra)
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
const AUTHOR_STANDARD = 'Ing. Miguel Angel Rivera';

async function main() {
  console.log('🧹 Limpieza de datos de test y estandarización de autor');
  console.log(dryRun ? '⚠️  MODO DRY-RUN — No se aplicarán cambios\n' : '⚡ MODO EJECUCIÓN — Se aplicarán cambios\n');

  // ── PASO 1: Eliminar categoría "Prueba E2E" ──
  console.log('═══════════════════════════════════════════════');
  console.log('🧪 PASO 1: Eliminar categoría "Prueba E2E"');
  console.log('═══════════════════════════════════════════════\n');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error('❌ Error fetching categories:', catError.message);
    return;
  }

  const testCategory = categories?.find(c =>
    c.name?.toLowerCase().includes('prueba') ||
    c.slug?.toLowerCase().includes('prueba') ||
    c.name?.toLowerCase().includes('test') ||
    c.slug?.toLowerCase().includes('e2e')
  );

  if (testCategory) {
    console.log(`📌 Categoría encontrada: "${testCategory.name}" (ID: ${testCategory.id})`);

    // Find posts in this category
    const { data: testPosts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('category_id', testCategory.id);

    if (postsError) {
      console.error('❌ Error fetching posts:', postsError.message);
      return;
    }

    if (testPosts && testPosts.length > 0) {
      console.log(`\n📝 ${testPosts.length} posts en esta categoría:`);
      testPosts.forEach(p => console.log(`   • "${p.title}" (${p.slug})`));

      if (!dryRun) {
        console.log('\n🗑️  Eliminando posts...');
        const { error: deletePostsError } = await supabase
          .from('posts')
          .delete()
          .eq('category_id', testCategory.id);

        if (deletePostsError) {
          console.error('❌ Error deleting posts:', deletePostsError.message);
          return;
        }
        console.log(`✅ ${testPosts.length} posts eliminados`);
      } else {
        console.log('\n⚠️  [DRY-RUN] Se eliminarían estos posts');
      }
    }

    // Delete the category
    if (!dryRun) {
      console.log('\n🗑️  Eliminando categoría...');
      const { error: deleteCatError } = await supabase
        .from('categories')
        .delete()
        .eq('id', testCategory.id);

      if (deleteCatError) {
        console.error('❌ Error deleting category:', deleteCatError.message);
        return;
      }
      console.log('✅ Categoría "Prueba E2E" eliminada');
    } else {
      console.log('\n⚠️  [DRY-RUN] Se eliminaría la categoría');
    }
  } else {
    console.log('✅ No se encontró categoría de test. Limpio.');
  }

  console.log('');

  // ── PASO 2: Estandarizar autor ──
  console.log('═══════════════════════════════════════════════');
  console.log('✍️  PASO 2: Estandarizar autor');
  console.log('═══════════════════════════════════════════════\n');

  const { data: allPosts, error: postsError } = await supabase
    .from('posts')
    .select('id, title, author');

  if (postsError) {
    console.error('❌ Error fetching posts:', postsError.message);
    return;
  }

  if (!allPosts || allPosts.length === 0) {
    console.log('✅ No hay posts.');
    return;
  }

  // Count current author variations
  const authorCounts: Record<string, { count: number; posts: typeof allPosts }> = {};
  allPosts.forEach(p => {
    const author = p.author || '(sin autor)';
    if (!authorCounts[author]) authorCounts[author] = { count: 0, posts: [] };
    authorCounts[author].count++;
    authorCounts[author].posts.push(p);
  });

  console.log('Variantes actuales de autor:');
  Object.entries(authorCounts).forEach(([author, data]) => {
    const isStandard = author === AUTHOR_STANDARD;
    const icon = isStandard ? '✅' : '🔄';
    console.log(`  ${icon} "${author}" (${data.count} posts)`);
  });

  console.log(`\n📝 Estandarizando a: "${AUTHOR_STANDARD}"`);

  // Update all posts that don't match
  const postsToUpdate = allPosts.filter(p => p.author !== AUTHOR_STANDARD);

  if (postsToUpdate.length === 0) {
    console.log('✅ Todos los posts ya tienen el autor correcto.');
    return;
  }

  console.log(`\n🔄 ${postsToUpdate.length} posts necesitan actualización:`);
  postsToUpdate.forEach(p => {
    console.log(`   • "${p.title}" — de "${p.author || '(vacío)'}" → "${AUTHOR_STANDARD}"`);
  });

  if (!dryRun) {
    console.log('\n⚡ Actualizando en Supabase...');
    const { error: updateError } = await supabase
      .from('posts')
      .update({ author: AUTHOR_STANDARD })
      .neq('author', AUTHOR_STANDARD);

    if (updateError) {
      console.error('❌ Error updating authors:', updateError.message);
      return;
    }
    console.log(`✅ ${postsToUpdate.length} autores actualizados a "${AUTHOR_STANDARD}"`);
  } else {
    console.log('\n⚠️  [DRY-RUN] Se actualizarían estos autores');
  }

  console.log('\n✅ Limpieza completada.');
  if (dryRun) {
    console.log('💡 Ejecuta sin --dry-run para aplicar los cambios reales');
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
