import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

const envFile = readFileSync(path.resolve('.env.local'), 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const clean = line.trim();
  if (!clean || clean.startsWith('#')) continue;
  const eqIdx = clean.indexOf('=');
  if (eqIdx < 0) continue;
  const key = clean.substring(0, eqIdx).trim();
  const val = clean.substring(eqIdx + 1).trim().replace(/^"|"$/g, '');
  env[key] = val;
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const timeNow = new Date().toISOString();
  // Posts that match sitemap conditions
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, status, published_at')
    .eq('status', 'published')
    .lte('published_at', timeNow);

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  console.log(`--- SITEMAP AUDIT ---`);
  console.log(`Static pages in sitemap.ts: 9`);
  console.log(`Categories in DB: ${categories?.length || 0}`);
  console.log(`Published posts in DB (<= now): ${posts?.length || 0}`);
  console.log(`-----------------------`);
  console.log(`TOTAL EXPECTED: ${9 + (categories?.length || 0) + (posts?.length || 0)}`);
  
  // Also let's check if there are posts published in the future or drafts
  const { data: futurePosts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')
    .gt('published_at', timeNow);
    
  const { data: drafts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'draft');
    
  console.log(`\nHidden / Excluded:`);
  console.log(`Future published posts: ${futurePosts?.length || 0}`);
  console.log(`Drafts: ${drafts?.length || 0}`);
}
check();
