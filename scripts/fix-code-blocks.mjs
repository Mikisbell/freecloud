/**
 * fix-code-blocks.mjs
 * MDX no tolera líneas en blanco dentro de <pre><code>...</code></pre>.
 * Este script las elimina en los 5 posts del batch del 17 Mar 2026.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SLUGS = [
  'calculo-zapata-aislada-e050-e060-paso-a-paso',
  'etabs-muros-pantalla-rigidez-lateral',
  'pyrevit-instalar-primeros-scripts-revit',
  'excel-metrado-acero-calculo-automatico-vigas',
  'navisworks-clash-detection-tutorial-completo',
];

/**
 * Convierte bloques <pre><code>...</code></pre> a triple backtick markdown.
 * MDX no puede parsear <pre><code> multi-línea como HTML — los trata como JSX
 * y falla al encontrar saltos de línea dentro del tag <code>.
 */
function fixCodeBlocks(html) {
  return html.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (_, inner) => {
      // Limpiar entidades HTML básicas y trim
      const clean = inner
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      return `\`\`\`\n${clean}\n\`\`\``;
    }
  );
}

async function main() {
  console.log('\n🔧 Corrigiendo bloques <pre><code> en 5 posts...\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, content')
    .in('slug', SLUGS);

  if (error || !posts) {
    console.error('❌ Error leyendo posts:', error?.message);
    process.exit(1);
  }

  for (const post of posts) {
    const fixed = fixCodeBlocks(post.content || '');

    if (fixed === post.content) {
      console.log(`⏭  Sin cambios: ${post.slug}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update({ content: fixed })
      .eq('id', post.id);

    if (updateError) {
      console.error(`❌ Error en ${post.slug}:`, updateError.message);
    } else {
      console.log(`✅ Corregido: ${post.slug}`);
    }
  }

  console.log('\n✨ Listo. Verifica el build ahora.');
}

main().catch(console.error);
