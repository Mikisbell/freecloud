/**
 * Genera las 6 imágenes de productos para /recursos
 * Ejecutar: npx tsx scripts/generate-product-images.ts
 *
 * Requiere: OPENROUTER_API_KEY en .env
 */

import { generateImage } from '../lib/qwen-image';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'recursos');

interface ProductImageJob {
  filename: string;
  prompt: string;
  style: 'photorealistic' | 'architectural' | '3d-render' | 'illustration' | 'technical';
}

const JOBS: ProductImageJob[] = [
  {
    filename: 'sismica_cover.png',
    prompt: `A modern engineering spreadsheet workbook open on a sleek laptop screen, displaying colorful seismic analysis calculations with earthquake response spectrum curves (acceleration vs period graph), lateral force distribution bar charts across building floors, and structural design parameters. The spreadsheet uses professional color coding: blue headers, green formulas, red alert cells. Soft desk lighting, shallow depth of field, corporate engineering office background blurred, cyan and navy accent colors matching the FreeCloud brand palette. Shot on Canon EOS R5, 50mm lens, f/2.8, photorealistic product photography style.`,
    style: 'photorealistic',
  },
  {
    filename: 'metrados_cover.png',
    prompt: `Overhead flat-lay photograph of a construction site desk with an open engineering notebook showing detailed quantity takeoff tables (concrete volumes in cubic meters, steel rebar weight calculations, formwork surface areas). A rolled blueprint of a structural foundation plan sits beside it with a yellow measuring tape, a mechanical pencil, and a construction hard hat in the background. Warm natural lighting from a window, clean composition with rule of thirds, muted earth tones with pops of engineering green and safety yellow. Professional product photography for an engineering software company, shallow depth of field, shot on 85mm lens.`,
    style: 'photorealistic',
  },
  {
    filename: 'hp_prime_cover.png',
    prompt: `Close-up hero shot of an HP Prime graphing calculator on a dark brushed aluminum desk surface, screen displaying a colorful structural frame analysis with bending moment diagrams (red and blue curves on a white grid), shear force values, and nodal displacement results. The calculator casts a soft reflection on the polished surface. Dramatic studio lighting with a cool blue rim light from behind, warm key light from the front left. Dark moody background with subtle engineering grid pattern. Tech product photography style, razor sharp focus on the screen, 100mm macro lens aesthetic.`,
    style: 'photorealistic',
  },
  {
    filename: 'python_revit_cover.png',
    prompt: `Split-screen composition: on the left, a modern code editor (VS Code dark theme) showing clean Python code with Revit API imports (pyrevit, Autodesk.Revit.DB), syntax highlighting in vibrant greens, blues, and yellows. On the right, an Autodesk Revit 3D viewport displaying a multi-story building BIM model with structural framing highlighted in orange, the result of the script execution. A subtle glowing arrow connects the code to the 3D model. Dark background with subtle particle effects suggesting data flow. Modern SaaS product marketing image style, gradient accent colors of Python blue and Revit red, clean and premium feel.`,
    style: '3d-render',
  },
  {
    filename: 'familias_revit_cover.png',
    prompt: `Exploded axonometric view of a reinforced concrete structural system showing individual BIM parametric families: isolated footing foundations, rectangular columns with rebar detail, primary and secondary beams, and a one-way slab — all hovering in their assembly positions against a clean white background. Each element has subtle drop shadows and is rendered in a modern architectural visualization style with soft material shading (concrete gray, steel blue highlights). Thin annotation lines connect to each component with labels in a clean sans-serif font. The overall composition feels like a premium Autodesk Revit product showcase, with a subtle gradient from white to light gray, professional engineering illustration meets Apple product photography.`,
    style: '3d-render',
  },
  {
    filename: 'peb_bim_cover.png',
    prompt: `A premium leather-bound document portfolio folder on a modern glass executive desk, partially open to reveal a professionally formatted BIM Execution Plan (BEP) document with ISO 19650 header, project information exchange requirements table, and a colorful BIM maturity level roadmap diagram. Beside it: a Montblanc pen, a small Peruvian flag pin, and a tablet showing a 3D BIM coordination model. Soft morning office light streaming through floor-to-ceiling windows with a blurred Lima city skyline in the background. Corporate consulting deliverable photography, premium business aesthetic, shot on medium format camera with soft bokeh, color palette of navy blue, gold, and white.`,
    style: 'photorealistic',
  },
];

async function main() {
  console.log('🎨 Generando imágenes de productos con Qwen Image (DashScope)...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (let i = 0; i < JOBS.length; i++) {
    const job = JOBS[i];
    console.log(`[${i + 1}/${JOBS.length}] Generando: ${job.filename}`);
    console.log(`      Estilo: ${job.style}`);
    console.log(`      Prompt: ${job.prompt.slice(0, 80)}...`);

    const result = await generateImage({
      prompt: job.prompt,
      style: job.style,
      size: '1024*1024',
      n: 2, // Generate 2 options per product
    });

    if (!result.success) {
      console.error(`      ❌ Error: ${result.error}\n`);
      continue;
    }

    console.log(`      ✅ ${result.urls.length} imagen(es) generada(s)`);

    // Download and save each image
    for (let j = 0; j < result.urls.length; j++) {
      const url = result.urls[j];

      // Handle both URL and base64 data URLs
      let imageBuffer: Buffer;

      if (url.startsWith('data:image')) {
        // Base64 data URL
        const base64Data = url.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        // Regular URL - fetch it
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`      ⚠️  No se pudo descargar la imagen ${j + 1}`);
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }

      const suffix = j === 0 ? '' : `_v${j + 1}`;
      const outputPath = path.join(OUTPUT_DIR, job.filename.replace('.png', `${suffix}.png`));

      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`      💾 Guardado: ${outputPath}`);
    }

    console.log('');
  }

  console.log('✅ Proceso completado.');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('   1. Revisa las imágenes generadas en public/recursos/');
  console.log('   2. Elige la mejor versión de cada producto (renombrar a nombre base si es v2)');
  console.log('   3. Haz commit y push para deployar a Vercel');
  console.log('   4. Re-solicita la revisión de AdSense');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
