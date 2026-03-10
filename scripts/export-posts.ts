/**
 * scripts/export-posts.ts
 *
 * Exports all legacy blog posts from Supabase to a local JSON file.
 * Used as input for the batch SEO refactoring script.
 *
 * Usage:
 *   npx tsx scripts/export-posts.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function exportPosts(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, meta_title, meta_description, featured_image, category_id')
    .neq('slug', 'automatizacion-bim-python'); // omit today's Nicho Nauta post

  if (error) {
    console.error('❌ Error fetching posts:', error.message);
    process.exit(1);
  }

  const outPath = path.join(process.cwd(), 'legacy_posts.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`✅ Exported ${data.length} posts to legacy_posts.json`);
}

exportPosts();
