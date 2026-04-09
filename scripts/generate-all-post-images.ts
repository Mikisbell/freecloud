/**
 * generate-all-post-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Genera imágenes relevantes para TODOS los posts usando Qwen Image (DashScope).
 * 
 * Proceso:
 *  1. Lee todos los posts de Supabase
 *  2. Genera prompt optimizado por tema del post
 *  3. Llama a DashScope async API (qwen-image)
 *  4. Poll hasta que la imagen esté lista
 *  5. Descarga la imagen
 *  6. Sube a Supabase Storage (bucket: blog-images)
 *  7. Actualiza el post con la nueva featured_image
 * 
 * Uso: npx tsx scripts/generate-all-post-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
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

// ── Prompt templates by category ──
const PROMPTS: Record<string, string[]> = {
  bim: [
    'Professional BIM coordination meeting room with large screens showing Revit 3D building models, MEP clash detection visualization, modern engineering office in Peru, photorealistic architectural photography style, clean composition, no text',
    'BIM model of a modern office building on computer screen with Revit interface visible, architectural and structural elements highlighted in different colors, professional engineering workspace, photorealistic, no text',
  ],
  'analisis-estructural': [
    'Structural engineering analysis software interface showing colorful finite element mesh of a multi-story building, stress distribution heatmap, seismic analysis results on screen, professional engineering office, photorealistic, no text',
    'Engineer reviewing structural analysis results on dual monitors showing ETABS building model with colorful displacement contours, earthquake-resistant design visualization, modern office, photorealistic, no text',
  ],
  normativa: [
    'Peruvian seismic design code E.030 document on engineering desk alongside structural calculation sheets, reinforced concrete beam details, calculator, professional engineering workspace with Lima city view, photorealistic, no text',
    'Engineering standards documentation with structural calculation formulas highlighted, reinforced concrete design notes, technical drawings spread on desk, warm natural lighting, professional photography, no text',
  ],
  python: [
    'Python code editor with engineering calculation scripts on screen, Jupyter notebook with structural analysis graphs and charts, modern developer workspace with engineering references, photorealistic, no text',
    'Computer screen showing Python automation scripts for Revit API, colorful syntax highlighting, engineering data visualization graphs in background, modern workspace, photorealistic, no text',
  ],
  revit: [
    'Autodesk Revit interface showing detailed 3D structural model of a multi-story building with columns, beams, and foundations highlighted, professional BIM workstation, photorealistic architectural visualization, no text',
    'Revit structural modeling workspace with detailed rebar placement in concrete beams, parametric family editor visible, professional engineering software interface, photorealistic, no text',
  ],
  etabs: [
    'ETABS software interface showing colorful 3D building structural model with earthquake response analysis results, displacement and stress contours visible, professional structural engineering workstation, photorealistic, no text',
    'Structural engineer reviewing ETABS modal analysis results on screen showing colorful building vibration modes, seismic design parameters visible, modern office environment, photorealistic, no text',
  ],
  dynamo: [
    'Dynamo visual programming interface with colorful connected nodes creating automated Revit workflows, visual scripting for BIM automation, modern engineering workspace, photorealistic, no text',
    'Computer screen showing Dynamo graph with interconnected nodes for structural element placement automation in Revit, visual programming for engineering, clean modern workspace, photorealistic, no text',
  ],
  excel: [
    'Professional Excel spreadsheet with structural engineering calculations, steel rebar quantity takeoff tables with colorful conditional formatting, engineering formulas visible, clean desk with calculator, photorealistic, no text',
    'Engineering quantity takeoff Excel workbook with concrete volume calculations, steel weight summaries, colorful data validation and charts, professional spreadsheet layout, photorealistic, no text',
  ],
  'civil-3d': [
    'Autodesk Civil 3D interface showing highway corridor design with 3D terrain model, road alignment with curves and elevation profiles, topographic surface visible, professional civil engineering workstation, photorealistic, no text',
    'Civil engineering road design project on screen showing Civil 3D cross sections, earthwork volume calculations, terrain surface model with proposed highway alignment, modern workspace, photorealistic, no text',
  ],
  navisworks: [
    'Autodesk Navisworks interface showing 3D building model with clash detection results, structural steel beams highlighted in red where they conflict with MEP ducts, BIM coordination visualization, photorealistic, no text',
    'Navisworks clash detection report on screen showing 3D building model with color-coded interference points between structural and MEP systems, modern engineering office, photorealistic, no text',
  ],
  'robot-structural': [
    'Autodesk Robot Structural Analysis interface showing colorful finite element model of building frame, stress and displacement results visible, structural engineering software workstation, photorealistic, no text',
  ],
  sap2000: [
    'SAP2000 structural analysis software interface showing 3D bridge or building frame model with colorful analysis results, engineering workstation with structural design documentation, photorealistic, no text',
  ],
  'hp-prime': [
    'HP Prime graphing calculator on engineering desk displaying structural analysis calculation results, alongside structural engineering textbook and hand-drawn frame analysis sketches, warm desk lighting, photorealistic, no text',
  ],
};

function getPromptForPost(title: string, category: string): string {
  const catKey = Object.keys(PROMPTS).find(k => 
    category?.toLowerCase().includes(k) || 
    title?.toLowerCase().includes(k)
  );

  if (catKey && PROMPTS[catKey]) {
    const prompts = PROMPTS[catKey];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  // Default engineering prompt
  return 'Professional civil engineering workspace in Peru with structural design documents, building models on computer screen, modern office with natural lighting, photorealistic architectural photography style, clean composition, no text or watermarks';
}

async function generateImage(prompt: string): Promise<string | null> {
  try {
    // Start async task
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
    if (!taskId) {
      console.log(`   ❌ No task_id in response`);
      return null;
    }

    console.log(`   ⏳ Task: ${taskId}`);

    // Poll for result
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 5000));

      const pollRes = await fetch(POLL_URL + taskId, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const status = pollData.output?.task_status;

      if (status === 'SUCCEEDED') {
        const url = pollData.output?.results?.[0]?.url;
        if (url) {
          console.log(`   ✅ Image ready: ${url.slice(0, 80)}...`);
          return url;
        }
        console.log(`   ❌ No URL in result`);
        return null;
      }

      if (status === 'FAILED') {
        console.log(`   ❌ Task failed: ${JSON.stringify(pollData.output).slice(0, 200)}`);
        return null;
      }

      if (i % 6 === 0) {
        console.log(`   ⏱️  Still ${status}... (${i * 5}s)`);
      }
    }

    console.log(`   ❌ Timeout waiting for image`);
    return null;
  } catch (e: any) {
    console.log(`   ❌ Error: ${e.message}`);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

async function uploadToSupabase(buffer: Buffer, filename: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`featured/${filename}`, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.log(`   ❌ Upload error: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (e: any) {
    console.log(`   ❌ Upload error: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('🎨 Generando imágenes para TODOS los posts con Qwen Image\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, category_id, featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  // Fetch categories to map category_id to slug
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const categoryMap: Record<string, string> = {};
  categories?.forEach(c => { categoryMap[c.id] = c.slug; });

  console.log(`📊 ${posts.length} posts a procesar\n`);

  let generated = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const categoryName = categoryMap[post.category_id] || '';
    const prompt = getPromptForPost(post.title, categoryName);

    console.log(`[${i + 1}/${posts.length}] "${post.title}"`);
    console.log(`   Categoría: ${categoryName || 'general'}`);
    console.log(`   Prompt: ${prompt.slice(0, 80)}...`);

    // Generate image
    const imageUrl = await generateImage(prompt);
    if (!imageUrl) {
      failed++;
      console.log('');
      continue;
    }

    // Download
    console.log('   📥 Downloading...');
    const buffer = await downloadImage(imageUrl);
    if (!buffer) {
      failed++;
      console.log('');
      continue;
    }

    // Upload to Supabase
    const filename = `${post.slug}.png`;
    console.log(`   📤 Uploading to Supabase Storage...`);
    const publicUrl = await uploadToSupabase(buffer, filename);
    if (!publicUrl) {
      failed++;
      console.log('');
      continue;
    }

    // Update post
    console.log(`   💾 Updating post featured_image...`);
    const { error: updateError } = await supabase
      .from('posts')
      .update({ featured_image: publicUrl })
      .eq('id', post.id);

    if (updateError) {
      console.log(`   ❌ Update error: ${updateError.message}`);
      failed++;
    } else {
      console.log(`   ✅ ${publicUrl}`);
      generated++;
    }
    console.log('');
  }

  console.log(`\n📊 Resumen final:`);
  console.log(`   ✅ Generadas y subidas: ${generated}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`   ⏭️  Saltadas: ${skipped}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
