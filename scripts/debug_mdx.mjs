import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envFile = readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
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
  const { data: posts } = await supabase.from('posts').select('slug, content').eq('slug', 'python-librerias-esenciales-ingenieros-civiles');
  const content = posts[0].content;
  console.log("Tiene llaves { ?", content.includes('{'));
  console.log("Tiene llaves } ?", content.includes('}'));
  
  if (content.includes('{')) {
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('{') || line.includes('}')) {
        console.log(`L${i+1}: ${line}`);
      }
    });
  }
}
check();
