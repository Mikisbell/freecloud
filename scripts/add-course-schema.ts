/**
 * add-course-schema.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Agrega schema markup de Course a posts que son tutoriales paso a paso.
 * Esto le dice a Google que el contenido tiene valor educativo.
 * 
 * Uso: npx tsx scripts/add-course-schema.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Posts que son tutoriales paso a paso → candidatos para Course schema
const COURSE_POSTS = [
  {
    slug: 'calculo-zapata-aislada-e050-e060-paso-a-paso',
    courseName: 'Diseño de Zapatas Aisladas según E.050 y E.060',
    description: 'Aprende a diseñar cimentaciones superficiales paso a paso con las normas peruanas E.050 y E.060. Incluye ejemplo numérico completo con datos reales.',
    provider: 'FreeCloud.pe - Miguel Angel Rivera',
  },
  {
    slug: 'cortante-basal-formula-e030-calculo-paso-a-paso',
    courseName: 'Cálculo de Cortante Basal según Norma E.030',
    description: 'Aprende a calcular la cortante basal de un edificio paso a paso usando la fórmula ZUCS/R de la norma peruana E.030.',
    provider: 'FreeCloud.pe - Miguel Angel Rivera',
  },
  {
    slug: 'dynamo-principiantes-primera-automatizacion-revit-guia',
    courseName: 'Dynamo para Principiantes: Tu Primera Automatización en Revit',
    description: 'Guía completa para aprender Dynamo desde cero. Crea tu primer script de automatización en Revit en menos de 1 hora.',
    provider: 'FreeCloud.pe - Miguel Angel Rivera',
  },
  {
    slug: 'pyrevit-instalar-primeros-scripts-revit',
    courseName: 'PyRevit: Instalar y Crear tus Primeros Scripts en Revit',
    description: 'Aprende a instalar pyRevit y escribir tus primeros scripts de Python para automatizar tareas en Revit.',
    provider: 'FreeCloud.pe - Miguel Angel Rivera',
  },
  {
    slug: 'etabs-analisis-sismico-norma-e030-guia-practica',
    courseName: 'Análisis Sísmico en ETABS con la Norma E.030',
    description: 'Configura y ejecuta un análisis sísmico completo en ETABS siguiendo los requisitos de la norma peruana E.030.',
    provider: 'FreeCloud.pe - Miguel Angel Rivera',
  },
];

async function main() {
  console.log('🎓 Agregando Course Schema a posts tutoriales\n');

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';

  for (const course of COURSE_POSTS) {
    const { data: post } = await supabase
      .from('posts')
      .select('content')
      .eq('slug', course.slug)
      .single();

    if (!post) {
      console.log(`⚠️  No encontrado: "${course.slug}"`);
      continue;
    }

    // Check if already has course schema
    if (post.content?.includes('@type": "Course"') || post.content?.includes("'@type': 'Course'")) {
      console.log(`⏭️  Ya tiene Course schema: "${course.courseName}"`);
      continue;
    }

    // Build course schema HTML comment
    const courseSchema = `\n\n<!-- SCHEMA-COURSE: ${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.courseName,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: course.provider,
        sameAs: SITE_URL,
      },
      educationalLevel: 'Intermediate',
      inLanguage: 'es',
      url: `${SITE_URL}/blog/${course.slug}`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PEN',
        availability: 'https://schema.org/InStock',
      },
    })} -->\n`;

    const newContent = (post.content || '') + courseSchema;

    const { error } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('slug', course.slug);

    if (error) {
      console.log(`❌ "${course.courseName}": ${error.message}`);
    } else {
      console.log(`✅ "${course.courseName}"`);
    }
  }

  console.log('\n✅ Course schema agregado a posts tutoriales');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
