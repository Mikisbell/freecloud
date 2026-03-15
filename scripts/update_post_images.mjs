import { createClient } from '@supabase/supabase-js';
import { readFileSync, copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Copiar imágenes
const brainDir = 'C:\\Users\\Mateo\\.gemini\\antigravity\\brain\\f82f6db6-14be-45d4-ad4c-40d836a56cdb';
const publicBlogDir = path.join(rootDir, 'public', 'images', 'blog');

const images = [
  {
    src: "revit_vs_autocad_1773597637779.png",
    dest: "revit-vs-autocad-2025-feature.png",
    slug: "revit-vs-autocad-cual-aprender-primero-2025"
  },
  {
    src: "dynamo_revit_guide_1773597869630.png",
    dest: "dynamo-principiantes-guia-feature.png",
    slug: "dynamo-principiantes-primera-automatizacion-revit-guia"
  },
  {
    src: "civil3d_roads_1773597885271.png",
    dest: "civil-3d-carreteras-feature.png",
    slug: "civil-3d-carreteras-guia-completa-paso-a-paso"
  },
  {
    src: "etabs_sismo_e030_1773597968391.png",
    dest: "etabs-analisis-sismico-e030-feature.png",
    slug: "etabs-analisis-sismico-norma-e030-guia-practica"
  },
  {
    src: "python_civil_libs_1773597986341.png",
    dest: "python-librerias-civiles-feature.png",
    slug: "python-librerias-esenciales-ingenieros-civiles"
  }
];

for (const img of images) {
  try {
    copyFileSync(
      path.join(brainDir, img.src),
      path.join(publicBlogDir, img.dest)
    );
    console.log(`✅ Copiada: ${img.dest}`);
  } catch (err) {
    console.error(`❌ Error copiando ${img.src}:`, err.message);
  }
}

// 2. Actualizar Supabase
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

async function updateDb() {
  console.log('\\nActualizando portadas en la base de datos...');
  for (const img of images) {
    const coverUrl = `/images/blog/${img.dest}`;
    const { error } = await supabase
      .from('posts')
      .update({ featured_image: coverUrl })
      .eq('slug', img.slug);
      
    if (error) {
      console.error(`❌ Error actualizando post ${img.slug}:`, error.message);
    } else {
      console.log(`✅ Actualizado post: ${img.slug} con ${coverUrl}`);
    }
  }
  console.log('¡Proceso completado!');
}

updateDb();
