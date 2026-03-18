/**
 * fix-images.mjs
 * Reemplaza directamente las imágenes incorrectas de LOD y BEP con URLs de Pexels más apropiadas.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FIXES = [
  {
    slug: 'lod-100-500-bim-significado-revit-peru',
    // Architect with blueprints and technical drawings on table - appropriate for BIM LOD levels
    imageUrl: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'bep-plan-ejecucion-bim-ejemplo-peru',
    // Team of engineers/architects working together on plans around a table
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
];

async function main() {
  console.log('\n🔧 Corrigiendo imágenes incorrectas...\n');

  for (const fix of FIXES) {
    const { error } = await supabase
      .from('posts')
      .update({ featured_image: fix.imageUrl })
      .eq('slug', fix.slug);

    if (error) {
      console.error(`❌ Error en ${fix.slug}:`, error.message);
    } else {
      console.log(`✅ Actualizado: ${fix.slug}`);
      console.log(`   → ${fix.imageUrl}\n`);
    }
  }

  console.log('✨ Listo!');
}

main().catch(console.error);
