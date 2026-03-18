/**
 * scripts/generate-featured-images.ts
 *
 * Downloads high-quality stock photos from Pexels CDN for each blog post
 * and uploads them to Supabase Storage (bucket: blog-images).
 * Then updates the featured_image column in the posts table.
 *
 * Usage: npx tsx scripts/generate-featured-images.ts
 *
 * Pexels photos are free for commercial use (no attribution required by API TOS).
 * Direct CDN URLs are used — no API key needed for direct downloads.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────

const BUCKET = 'blog-images';

// Verified Pexels CDN URLs — curated for each blog post topic.
// Format: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop
const POST_IMAGES: Array<{ slug: string; imageUrl: string }> = [
  {
    slug: 'plan-ejecucion-bim-peb-guia',
    // Architects reviewing blueprints / BIM planning
    imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'python-ingenieros-civiles-primer-script',
    // Engineer coding at laptop
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'norma-e030-fuerza-cortante-basal-calculo',
    // Earthquake / structural / Andean seismic
    imageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'como-prepararte-bim-6-meses',
    // Person studying / online learning technology
    imageUrl: 'https://images.pexels.com/photos/4144101/pexels-photo-4144101.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'dynamo-revit-automatizar-primer-proceso',
    // 3D parametric model / abstract architectural geometry
    imageUrl: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'revit-api-python-pyrevit-programacion-bim',
    // Developer/coder with multiple screens showing code
    imageUrl: 'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'predimensionamiento-columnas-vigas-e060-practico',
    // Concrete columns under construction building
    imageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'civil-3d-crear-primer-corredor-vial-carreteras',
    // Road / highway infrastructure aerial view
    imageUrl: 'https://images.pexels.com/photos/315939/pexels-photo-315939.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'excel-plantilla-metrados-obra-automatica',
    // Spreadsheet / Excel data analysis on laptop
    imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'hardy-cross-hp-prime-programa',
    // Engineer with scientific calculator / mathematics
    imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'bim-obligatorio-peru-2026',
    // Modern building with digital overlay / smart city
    imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'que-es-bim-obligatorio-peru-2026',
    // Architect with tablet showing 3D building model
    imageUrl: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'revit-estructuras-ingenieros-autocad',
    // Engineering CAD drawings / structural plans
    imageUrl: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'etabs-vs-robot-structural-comparacion',
    // Structural engineering software analysis / finite element
    imageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  // ── Nuevos artículos BIM (Content Engine — Marzo 2026) ──────────────────────
  {
    slug: 'bim-manager-que-hace-cuanto-gana-peru',
    // Professional BIM Manager with tablet on construction site
    imageUrl: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'bim-nivel-1-2-3-diferencias-certificacion',
    // Engineers in meeting examining building plans and models
    imageUrl: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'open-bim-vs-closed-bim-ifc-formato',
    // Digital data flow / network connectivity over building
    imageUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'lod-100-500-bim-significado-revit-peru',
    // Architect reviewing 3D BIM model blueprints on desk
    imageUrl: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
  {
    slug: 'bep-plan-ejecucion-bim-ejemplo-peru',
    // Engineers and architects reviewing construction project plans on table
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
  },
];

interface PostRecord {
  id: string;
  slug: string;
  featured_image: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; FreeCloudBot/1.0; +https://freecloud.pe)',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while downloading: ${url}`);
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unexpected content-type "${contentType}" for: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength < 5000) {
    throw new Error(`Downloaded file too small (${arrayBuffer.byteLength} bytes) — likely an error page`);
  }

  return Buffer.from(arrayBuffer);
}

async function uploadToSupabase(
  supabase: SupabaseClient,
  slug: string,
  imageBuffer: Buffer,
): Promise<string> {
  const filename = `posts/${slug}.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, imageBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return urlData.publicUrl;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  // Fetch current state of posts
  const { data: posts, error: fetchError } = await supabase
    .from('posts')
    .select('id, slug, featured_image');

  if (fetchError || !posts) {
    console.error('❌ Could not fetch posts:', fetchError?.message);
    process.exit(1);
  }

  const postMap = new Map<string, PostRecord>(
    (posts as PostRecord[]).map((p) => [p.slug, { id: p.id, slug: p.slug, featured_image: p.featured_image }]),
  );

  console.log(`\n🖼️  Generating featured images for ${POST_IMAGES.length} posts...\n`);

  const results: { slug: string; success: boolean; url?: string; error?: string }[] = [];

  for (let i = 0; i < POST_IMAGES.length; i++) {
    const entry = POST_IMAGES[i];
    const post = postMap.get(entry.slug);

    if (!post) {
      console.log(`[${i + 1}/${POST_IMAGES.length}] ⚠️  Not in DB: ${entry.slug}`);
      continue;
    }

    // Only skip if it's already a Supabase Storage URL
    if (post.featured_image?.includes('supabase')) {
      console.log(`[${i + 1}/${POST_IMAGES.length}] ✅ Already uploaded: ${entry.slug}`);
      results.push({ slug: entry.slug, success: true, url: post.featured_image });
      continue;
    }

    console.log(`[${i + 1}/${POST_IMAGES.length}] 🎨 Processing: ${entry.slug}`);

    try {
      // 1. Download image
      console.log(`   📥 Downloading image...`);
      const imageBuffer = await downloadImage(entry.imageUrl);
      console.log(`   📦 Got ${Math.round(imageBuffer.length / 1024)}KB`);

      // 2. Upload to Supabase Storage
      console.log(`   ☁️  Uploading to Supabase...`);
      const publicUrl = await uploadToSupabase(supabase, entry.slug, imageBuffer);

      // 3. Update the DB
      const { error: updateError } = await supabase
        .from('posts')
        .update({ featured_image: publicUrl })
        .eq('id', post.id);

      if (updateError) {
        throw new Error(`DB update error: ${updateError.message}`);
      }

      console.log(`   ✅ Done! → ${publicUrl}\n`);
      results.push({ slug: entry.slug, success: true, url: publicUrl });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Failed: ${errMsg}\n`);
      results.push({ slug: entry.slug, success: false, error: errMsg });
    }

    // 1.5s delay per request to be respectful to CDN
    if (i < POST_IMAGES.length - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    }
  }

  // Summary
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  console.log('─'.repeat(60));
  console.log(`📊 Complete! ✅ ${successCount}/${POST_IMAGES.length} | ❌ ${failCount}`);

  if (failCount > 0) {
    console.log('\n⚠️  Failed:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.slug}: ${r.error}`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
