/**
 * fix-author-bep.mjs
 * Corrige el campo author del post BEP que fue insertado con 'Ing. Mateo' por error.
 * Uso: node scripts/fix-author-bep.mjs
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FIXES = [
  { slug: 'bep-plan-ejecucion-bim-ejemplo-peru', author: 'Ing. Miguel Rivera' },
];

async function main() {
  console.log('\n🔧 Corrigiendo author incorrecto...\n');

  for (const fix of FIXES) {
    const { error } = await supabase
      .from('posts')
      .update({ author: fix.author })
      .eq('slug', fix.slug);

    if (error) {
      console.error(`❌ Error en ${fix.slug}:`, error.message);
    } else {
      console.log(`✅ Corregido: ${fix.slug} → author: "${fix.author}"`);
    }
  }

  console.log('\n✨ Listo!');
}

main().catch(console.error);
