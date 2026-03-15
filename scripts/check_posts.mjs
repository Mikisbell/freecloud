import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

// Lee el .env.local para obtener las keys completas
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

const { data: cats } = await supabase.from('categories').select('id, name, slug').order('name');
console.log('\n=== CATEGORÍAS ===');
cats?.forEach(c => console.log(`  ${c.slug} (${c.id}): ${c.name}`));

const { data: posts, count } = await supabase
  .from('posts')
  .select('id, title, slug, status, published_at', { count: 'exact' })
  .order('created_at', { ascending: false });

console.log(`\n=== POSTS (${count} total) ===`);
posts?.forEach(p => console.log(`  [${p.status}] ${p.slug}: ${p.title.substring(0, 60)}`));
