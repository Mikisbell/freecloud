/**
 * generate-images-for-new-posts.ts
 * Generates and assigns images for the 3 new paper-based posts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const apiKey = process.env.DASHSCOPE_API_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DASHSCOPE_ASYNC_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const POLL_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/tasks/';

const POSTS = [
  {
    slug: 'muros-corte-edificios-altos-ciencia-aplicacion-peru-e030',
    prompt: 'Structural engineering analysis of reinforced concrete high-rise building with shear walls, colorful finite element stress visualization, ETABS software interface showing seismic drift analysis, Lima Peru skyline in background, photorealistic, professional engineering style, no text',
  },
  {
    slug: 'por-que-falla-bim-peru-segun-investigacion-cientifica',
    prompt: 'Construction site in Peru with engineers reviewing BIM models on tablet and laptop, Revit 3D building model visible on screen, modern construction with crane, Andes mountains in background, photorealistic architectural photography, no text',
  },
  {
    slug: 'diseno-optimo-zapatas-aisladas-paper-2024-realidad-peruana-e050-e060',
    prompt: 'Reinforced concrete isolated footing foundation under construction, rebar cage visible, excavation in Peruvian soil, engineering blueprints and calculator on ground, warm natural lighting, professional construction photography, no text',
  },
];

async function generateImage(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(DASHSCOPE_ASYNC_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'qwen-image',
        input: { prompt },
        parameters: { size: '1024*1024', n: 1 },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log(`   ❌ API error: ${res.status} - ${text.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const taskId = data.output?.task_id;
    if (!taskId) return null;

    console.log(`   ⏳ Task: ${taskId.slice(0, 12)}...`);

    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const pollRes = await fetch(POLL_URL + taskId, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const status = pollData.output?.task_status;

      if (status === 'SUCCEEDED') {
        return pollData.output?.results?.[0]?.url || null;
      }
      if (status === 'FAILED') return null;
      if (i % 6 === 0) console.log(`   ⏱️  Still ${status}... (${i * 5}s)`);
    }
    return null;
  } catch (e: any) {
    console.log(`   ❌ ${e.message}`);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { return null; }
}

async function uploadToSupabase(buffer: Buffer, filename: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`featured/${filename}`, buffer, { contentType: 'image/png', upsert: true });

    if (error) { console.log(`   ❌ Upload: ${error.message}`); return null; }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (e: any) {
    console.log(`   ❌ ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('🎨 Generating images for 3 new paper-based posts\n');

  for (const post of POSTS) {
    console.log(`📌 "${post.slug}"`);

    const url = await generateImage(post.prompt);
    if (!url) { console.log('   ❌ Failed to generate\n'); continue; }

    console.log(`   ✅ Generated, downloading...`);
    const buffer = await downloadImage(url);
    if (!buffer) { console.log('   ❌ Failed to download\n'); continue; }

    const publicUrl = await uploadToSupabase(buffer, `${post.slug}.png`);
    if (!publicUrl) { console.log('   ❌ Failed to upload\n'); continue; }

    // Assign to post
    const { error } = await supabase
      .from('posts')
      .update({ featured_image: publicUrl })
      .eq('slug', post.slug);

    if (error) {
      console.log(`   ❌ DB error: ${error.message}\n`);
    } else {
      console.log(`   ✅ Image assigned: ${publicUrl}\n`);
    }
  }

  console.log('✅ Done');
}

main().catch(console.error);
