/**
 * fix-last-2-humanized.ts
 * Fix the 2 posts that weren't matched by slug
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const FIXES = [
  {
    keywords: ['hardy', 'prime', 'ahorra'],
    opening: `Mi profesor de estructuras en la UNSCH decía: "El que no sabe hacer un Hardy Cross a mano, no entiende análisis estructural." Y tenía razón. Pero el que sabe hacerlo a mano Y tiene un programa que lo hace en 30 segundos, tiene una ventaja.\n\nEse programa lo hice en la HP Prime y lo uso para verificar resultados de ETABS antes de firmar cualquier plano.\n\nAquí te muestro cómo hacerlo tú también.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿El método Hardy Cross sigue siendo relevante?</strong></summary>\nSí, para verificación manual y estructuras simples.\n</details>\n\n<details>\n<summary><strong>¿Funciona para más de 3 pisos?</strong></summary>\nSí, para cualquier número. El límite es el tiempo de cálculo.\n</details>\n`
  },
  {
    keywords: ['implemente', 'bim', 'proyecto', 'también'],
    opening: `Cuando empecé a implementar BIM en mi equipo, pensé que el mayor desafío sería el software. Estaba equivocado. El mayor desafío fueron las personas.\n\nEl ingeniero más antiguo me dijo: "Yo llevo 20 años en AutoCAD y nunca me fue mal." No estaba siendo terco — estaba siendo humano. Cambiar algo que funciona da miedo.\n\nLo que funcionó no fue convencerlo con datos sino con resultados. Le mostré un clash detection de 2 minutos que encontró 12 interferencias. A la semana siguiente, me pidió que le enseñara Revit.\n\nAquí te cuento el proceso completo.\n\n`,
    faq: `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuánto toma implementar BIM?</strong></summary>\n3-6 meses para un equipo de 5 personas.\n</details>\n\n<details>\n<summary><strong>¿Necesito un BIM Manager dedicado?</strong></summary>\nPara equipos pequeños, puede ser 50% del tiempo. Para equipos grandes, dedicado.\n</details>\n`
  }
];

async function main() {
  console.log('🎭 Humanizando los últimos 2 posts\n');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  if (!posts) return;

  let fixed = 0;

  for (const fix of FIXES) {
    // Find post by keywords in slug
    const post = posts.find(p =>
      fix.keywords.every(kw => p.slug?.toLowerCase().includes(kw.toLowerCase()))
    );

    if (!post) {
      console.log(`⚠️  No encontrado con keywords: ${fix.keywords.join(', ')}`);
      continue;
    }

    if (post.content?.includes(fix.opening.slice(0, 50))) {
      console.log(`⏭️  Ya humanizado: "${post.title}"`);
      continue;
    }

    const newContent = fix.opening + (post.content || '') + fix.faq;

    const { error } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', post.id);

    if (error) {
      console.log(`❌ "${post.title}": ${error.message}`);
    } else {
      console.log(`✅ "${post.title}"`);
      fixed++;
    }
  }

  console.log(`\n📊 Fixeados: ${fixed}`);
}

main().catch(console.error);
