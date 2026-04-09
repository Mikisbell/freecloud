/**
 * fix-last-3-titles.ts
 * Fix the last 3 clickbait titles that didn't match in previous run
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🔧 Fixing last 3 clickbait titles\n');

  // Find posts with clickbait titles
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug')
    .eq('status', 'published');

  if (!posts) {
    console.error('❌ No posts found');
    return;
  }

  // Find the 3 problematic posts
  const fixes = [
    { keyword: 'Hardy Cross', newTitle: 'Método Hardy Cross para Análisis de Pórticos en HP Prime: Programación y Aplicación' },
    { keyword: 'Automatización de Procesos BIM con Python', newTitle: 'Automatización de Procesos BIM con Python: Guía Completa para Ingenieros Civiles' },
    { keyword: 'Automatización de Procesos en Revit con Dynamo', newTitle: 'Automatización de Procesos en Revit con Dynamo: Guía de Primeros Pasos para Ingenieros' },
  ];

  for (const fix of fixes) {
    const post = posts.find(p => p.title?.includes(fix.keyword));
    if (post) {
      console.log(`📌 "${post.title}"`);
      console.log(`   → "${fix.newTitle}"`);
      
      const { error } = await supabase
        .from('posts')
        .update({ title: fix.newTitle })
        .eq('id', post.id);

      if (error) {
        console.log(`   ❌ ${error.message}\n`);
      } else {
        console.log(`   ✅ Fixed\n`);
      }
    }
  }
}

main().catch(console.error);
