/**
 * single-post-insert.ts
 * Inyecta UN SOLO artículo directamente en Supabase.
 * Usado por el Content Engine (content-engine/SKILL.md) para publicar un post
 * generado automáticamente sin pasar por archivos .md locales.
 *
 * Uso:
 *   npx tsx scripts/single-post-insert.ts
 *
 * El post se define en la constante `POST_TO_INSERT` al final de este archivo.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─────────────────────────────────────────────────────────────────────────────
// TIPO DEL POST
// ─────────────────────────────────────────────────────────────────────────────
interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_slug: string;   // Se mapea a category_id automáticamente
  status: 'published' | 'draft';
  author: string;
  tags: string[];
  featured_image?: string | null;
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  key_question?: string;
  key_answer?: string;
  /** Si no se provee, se asigna automáticamente entre 2 y 12 días atrás */
  published_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getRandomPastDate(minDays = 2, maxDays = 12): string {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
async function insertPost(post: PostInput) {
  console.log(`\n🚀 Content Engine — Inyectando: "${post.title}"`);
  console.log('─'.repeat(60));

  // 1. Mapear category_slug → category_id
  console.log('📡 Conectando a Supabase y mapeando categorías...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError || !categories) {
    console.error('❌ Error leyendo categorías:', catError);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories.forEach((c) => (catMap[c.slug] = c.id));

  const category_id = catMap[post.category_slug];
  if (!category_id) {
    console.warn(`⚠️  Categoría "${post.category_slug}" no encontrada.`);
    console.warn(`   Categorías disponibles: ${Object.keys(catMap).join(', ')}`);
    console.warn('   Usando la primera disponible como fallback.');
  }

  const finalCategoryId = category_id || Object.values(catMap)[0];
  const publishedAt = post.published_at ?? getRandomPastDate(2, 12);

  // 2. Armar el payload limpio
  const { category_slug, published_at: _pa, ...rest } = post;
  const payload = {
    ...rest,
    category_id: finalCategoryId,
    published_at: publishedAt,
    created_at: publishedAt,
    featured_image: post.featured_image ?? null,
  };

  // 3. Upsert (si el slug ya existe, actualiza; si no, inserta)
  console.log(`📦 Insertando post con slug: "${payload.slug}"`);
  const { data, error } = await supabase
    .from('posts')
    .upsert([payload], { onConflict: 'slug' });

  if (error) {
    console.error('❌ Error insertando el post:', error);
    process.exit(1);
  }

  console.log('─'.repeat(60));
  console.log('✅ Post inyectado exitosamente en Supabase.');
  console.log(`   Slug: ${payload.slug}`);
  console.log(`   Fecha publicación: ${publishedAt}`);
  console.log(`   Categoría: ${post.category_slug} (id: ${finalCategoryId})`);
  console.log('\n👉 Siguiente paso: Ejecuta "node scripts/indexnow-submit.mjs" para notificar a Bing/Yandex.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 📝 AQUÍ VA EL ARTÍCULO — El Content Engine reemplaza esto cada vez
// ─────────────────────────────────────────────────────────────────────────────
const POST_TO_INSERT: PostInput = {
  title: 'PLACEHOLDER — Reemplaza este objeto con el artículo generado',
  slug: 'placeholder-content-engine-replace-me',
  excerpt: 'Este es un post de ejemplo. El Content Engine reemplaza este objeto con el artículo real.',
  content: '<p>Contenido del artículo en HTML limpio.</p>',
  category_slug: 'bim',
  status: 'draft',
  author: 'Ing. Miguel Rivera',
  tags: ['ejemplo'],
  reading_time: 1,
  meta_title: 'PLACEHOLDER',
  meta_description: 'Reemplazar este objeto.',
};

// Ejecutar
insertPost(POST_TO_INSERT);
