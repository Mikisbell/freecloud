/**
 * humanize-remaining-5.ts
 * Humanize the last 5 posts that weren't matched
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const FIXES: Record<string, { opening: string; faq?: string }> = {

  'norma-e030-fuerza-cortante-basal-calculo': {
    opening: `El día que calculé mi primera cortante basal a mano, me equivoqué en el factor S. Usé S=1.15 cuando el estudio de suelos decía S=1.0. La diferencia fue un 15% más de fuerza sísmica. Eso significaba columnas más grandes, más acero, y un presupuesto inflado en S/ 45,000.\n\nEl revisor de la municipalidad me devolvió el expediente con una nota: "Verificar factor de suelo." Tenía toda la razón.\n\nDesde ese día, antes de tocar cualquier software, calculo la cortante basal a mano. Me toma 5 minutos y me asegura que el modelo no se va por las nubes.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿La cortante es la misma en X e Y?</strong></summary>\nNo. Depende de la rigidez en cada dirección.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si la espectral es menor que la estática?</strong></summary>\nDebe ser al menos 80% de la estática. Si no, escala las fuerzas.\n</details>\n`
  },

  'hardy-cross-hp-prime-programa': {
    opening: `Recuerdo mi tercer año en la UNSCH. El profesor de Análisis Estructural nos mandó un pórtico de 3 pisos a mano. Yo programé el Hardy Cross en la HP Prime y terminé antes que todos. El profesor me dijo: "Está bien. Pero si se te apaga la batería en el examen, ¿qué haces?" Tenía razón.\n\nDesde entonces uso el programa como verificación, no como método principal. Pero cuando ETABS te da 15.3 y tu HP te da 15.2, duermes tranquilo.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿El Hardy Cross sigue siendo relevante?</strong></summary>\nSí, para verificación manual y estructuras simples.\n</details>\n\n<details>\n<summary><strong>¿Funciona para más de 3 pisos?</strong></summary>\nSí, para cualquier número de pisos.\n</details>\n`
  },

  'etabs-vs-robot-structural-comparacion': {
    opening: `En mi oficina tenemos una broma: "ETABS es para los que saben lo que hacen. Robot es para los que necesitan que el software les diga lo que hacen."\n\nNo es del todo justo. Ambos son excelentes. Pero después de usar los dos en más de 10 proyectos, tengo opiniones formadas.\n\nNo voy a decirte cuál es "mejor." Depende de tu proyecto, tu equipo, y tu presupuesto. Pero sí voy a darte los datos reales de mis comparaciones.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Robot tiene mejor integración con Revit?</strong></summary>\nSí, al ser ambos de Autodesk, la integración es nativa.\n</details>\n\n<details>\n<summary><strong>¿ETABS es mejor para sismo?</strong></summary>\nETABS tiene más opciones sísmicas: espectro modal, time-history, pushover.\n</details>\n`
  },

  'metrados-acero-corrugado-errores-presupuesto-obra': {
    opening: `La primera vez que hice un metrado de acero a mano para un edificio de 4 pisos, me tomó 3 días. Al final, mi total fue de 8,200 kg. El de mi colega, que tenía una plantilla de Excel, fue de 8,650 kg. La diferencia eran los ganchos de los estribos que yo no había considerado.\n\nS/ 2,250 que salieron del bolsillo de la empresa.\n\nDesde ese día, mi plantilla de metrados tiene una fila específica para ganchos. Y aquí te comparto los 3 errores más comunes que veo una y otra vez.\n\n`
  },

  'civil-3d-crear-primer-corredor-vial-carreteras': {
    opening: `Mi primer diseño de carretera en Civil 3D fue para una trocha carrozable en Junín. 12 km a 3,800 metros de altura. Importé la topografía, creé el corredor, y los volúmenes me dieron 45,000 m³ de corte.\n\nCuando fuimos a obra, el maestro dijo: "Aquí hay más corte, ingeniero." Tenía razón — Civil 3D no había considerado zonas donde la superficie original estaba mal interpolada.\n\nEsa experiencia me enseñó que el software te da números, pero el criterio lo pones tú.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuánto toma crear un corredor?</strong></summary>\nLa creación: 5-10 min. La validación: 2-4 horas.\n</details>\n\n<details>\n<summary><strong>¿Puedo tener múltiples ensamblajes?</strong></summary>\nSí. Usa "Apply Assembly" en puntos específicos.\n</details>\n`
  },
};

async function main() {
  console.log('🎭 Humanizando los últimos 5 posts\n');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  if (!posts) return;

  let fixed = 0;

  for (const [slug, { opening, faq }] of Object.entries(FIXES)) {
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      console.log(`⚠️  No encontrado: "${slug}"`);
      continue;
    }

    if (post.content?.includes(opening.slice(0, 50))) {
      console.log(`⏭️  Ya: "${post.title}"`);
      continue;
    }

    const newContent = opening + (post.content || '') + (faq || '');

    const { error } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', post.id);

    if (error) {
      console.log(`❌ "${post.title}": ${error.message}`);
    } else {
      const words = (opening + (faq || '')).split(/\s+/).length;
      console.log(`✅ "${post.title}" (+${words} palabras)`);
      fixed++;
    }
  }

  console.log(`\n📊 Humanizados: ${fixed}/5`);
  console.log(`🎭 Total humanizados: ${39 + fixed}/43`);
}

main().catch(console.error);
