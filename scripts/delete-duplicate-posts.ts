/**
 * delete-duplicate-posts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Elimina posts duplicados o de muy baja calidad que dañan la aprobación de AdSense.
 * 
 * Posts a eliminar:
 *  1. "guia-instalacion-primer-script-python-revit-2025" (352 palabras) — duplicado de pyrevit-instalar-primeros-scripts-revit (814 palabras)
 * 
 * Uso:
 *   npx tsx scripts/delete-duplicate-posts.ts        (ejecuta)
 *   npx tsx scripts/delete-duplicate-posts.ts --dry-run  (solo muestra)
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

// Posts to delete with reasoning
const POSTS_TO_DELETE = [
  {
    slug: 'guia-instalacion-primer-script-python-revit-2025',
    reason: 'Duplicado de pyrevit-instalar-primeros-scripts-revit (352 vs 814 palabras)',
  },
];

async function main() {
  console.log('🗑️  Eliminando posts duplicados/de baja calidad');
  console.log(dryRun ? '⚠️  MODO DRY-RUN\n' : '⚡ MODO EJECUCIÓN\n');

  for (const { slug, reason } of POSTS_TO_DELETE) {
    console.log(`📌 Buscando: "${slug}"`);
    console.log(`   Razón: ${reason}`);

    const { data: post, error } = await supabase
      .from('posts')
      .select('id, title, slug, content')
      .eq('slug', slug)
      .single();

    if (error || !post) {
      console.log(`   ❌ No encontrado (ya eliminado o slug incorrecto)\n`);
      continue;
    }

    console.log(`   📝 Título: "${post.title}"`);
    console.log(`   📊 ID: ${post.id}`);

    if (!dryRun) {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (deleteError) {
        console.log(`   ❌ Error: ${deleteError.message}\n`);
      } else {
        console.log(`   ✅ Eliminado\n`);
      }
    } else {
      console.log(`   ⚠️  [DRY-RUN] Se eliminaría\n`);
    }
  }

  // Count remaining posts
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  console.log(`\n📊 Posts publicados restantes: ${count}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
