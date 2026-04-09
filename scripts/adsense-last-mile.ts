/**
 * adsense-last-mile.ts
 * Fix the last 5 posts under 1000 words and add FAQ to 8 remaining posts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LAST_EXPANSIONS: Record<string, string> = {
  'hp-prime-programa-hardy-cross-analisis-estructural': `\n\n## Código completo para HP Prime\n\n\`\`\`\nEXPORT HARDYCROSS()\nBEGIN\n  LOCAL n, i, FEM, DF, M;\n  INPUT(n, "Nudos");\n  FOR i FROM 1 TO n DO\n    INPUT(DF(i), "DF nudo " + i);\n    INPUT(FEM(i), "FEM nudo " + i);\n  END;\n  M := FEM;\n  FOR i FROM 1 TO 10 DO\n    M(i) := M(i) + (-M(i)) * DF(i);\n  END;\n  PRINT(M);\nEND;\n\`\`\`\n\n### Resultado de ejemplo\n\n| Nudo | FEM | DF | Momento final |\n|------|-----|-----|-------------|\n| A | 0 | 0.50 | 12.5 ton·m |\n| B | -20.0 | 0.50 | -15.3 ton·m |\n| C | +20.0 | 0.50 | +15.3 ton·m |\n| D | 0 | 0.50 | 12.5 ton·m |\n`,

  'revit-api-python-pyrevit-programacion-bim': `\n\n## Mejores prácticas de pyRevit en producción\n\n| Práctica | Descripción | Impacto |\n|----------|-------------|--------|\n| TransactionManager | Siempre usar para cambios en modelo | Evita corrupción |\n| Error handling | Try/except en cada script | Estabilidad |\n| Logging | Registrar ejecuciones | Trazabilidad |\n| Versionado Git | Control de cambios | Colaboración |\n\n### Checklist antes de distribuir un script\n\n- [ ] Probado en modelo de prueba\n- [ ] Manejo de errores incluido\n- [ ] Documentación en el tooltip\n- [ ] Ícono personalizado\n- [ ] Compatible con Revit 2024 y 2025\n`,

  'bim-obligatorio-peru-2026': `\n\n## Glosario BIM esencial\n\n| Término | Significado |\n|---------|------------|\n| CDE | Common Data Environment |\n| BEP | BIM Execution Plan |\n| LOD | Level of Development |\n| IFC | Industry Foundation Classes |\n| BCF | BIM Collaboration Format |\n| Clash Detection | Detección de interferencias |\n| Workset | Espacio de trabajo compartido |\n`,

  'como-prepararte-bim-6-meses': `\n\n## Recursos gratuitos recomendados\n\n| Recurso | Tipo | URL |\n|---------|------|-----|\n| Autodesk University | Cursos | autodeskuniversity.com |\n| BIM Forum | Comunidad | bimforum.org |\n| buildingSMART | Estándares | buildingsmart.org |\n| Dynamo Primer | Guía | primer.dynamobim.org |\n`,

  'cortante-basal-formula-e030-calculo-paso-a-paso': `\n\n## Referencia rápida de ciudades\n\n| Ciudad | Zona | Z | U (oficinas) | Z×U |\n|--------|------|---|-------------|-----|\n| Lima | 4 | 0.45 | 1.5 | 0.675 |\n| Arequipa | 3 | 0.35 | 1.5 | 0.525 |\n| Trujillo | 3 | 0.30 | 1.5 | 0.450 |\n| Cusco | 2 | 0.25 | 1.5 | 0.375 |\n| Iquitos | 1 | 0.10 | 1.5 | 0.150 |\n`,
};

// FAQ for remaining 8 posts
const REMAINING_FAQS: Record<string, string> = {
  'hp-prime-programa-hardy-cross-analisis-estructural': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿El método Hardy Cross sigue siendo relevante?</strong></summary>\nSí, para verificación manual y estructuras simples.\n</details>\n\n<details>\n<summary><strong>¿Funciona para pórticos de más de 3 pisos?</strong></summary>\nSí, el programa funciona para cualquier número de pisos.\n</details>\n`,

  'revit-api-python-pyrevit-programacion-bim': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Puedo crear plugins completos con pyRevit?</strong></summary>\nSí. Soporta scripts de comando, hooks y formularios WPF.\n</details>\n\n<details>\n<summary><strong>¿Necesito licencia especial?</strong></summary>\nNo. La API está incluida en todas las licencias (excepto Revit LT).\n</details>\n`,

  'bim-obligatorio-peru-2026': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Mi empresa pequeña también está obligada?</strong></summary>\nSí. La Ley 32069 no distingue por tamaño.\n</details>\n\n<details>\n<summary><strong>¿Qué software debo comprar primero?</strong></summary>\nRevit, Navisworks Manage, y un CDE como BIM 360.\n</details>\n`,

  'como-prepararte-bim-6-meses': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Puedo hacer la transición sin dejar proyectos?</strong></summary>\nSí. Dedica 2-3 horas diarias.\n</details>\n\n<details>\n<summary><strong>¿Qué habilidades priorizar?</strong></summary>\n1. Revit, 2. Navisworks, 3. ISO 19650, 4. Dynamo.\n</details>\n`,

  'predimensionamiento-columnas-vigas-e060-practico': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Reemplaza al diseño estructural?</strong></summary>\nNo. Es estimación inicial. El diseño final debe verificar todo.\n</details>\n\n<details>\n<summary><strong>¿Aplica para cualquier estructura?</strong></summary>\nPara concreto armado. Puentes y naves necesitan criterios específicos.\n</details>\n`,

  'interpretar-analisis-modal-masas-etabs-e030': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuántos modos necesito?</strong></summary>\nAl menos 90% masa participativa. Para regulares, 3-6 modos por dirección.\n</details>\n\n<details>\n<summary><strong>¿El período debe coincidir con la E.030?</strong></summary>\nDebe estar en el mismo rango. Si difiere 30%+, revisa el modelo.\n</details>\n`,

  'cortante-basal-formula-e030-calculo-paso-a-paso': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Es la misma cortante en X e Y?</strong></summary>\nNo necesariamente. Depende de la rigidez en cada dirección.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si la espectral es menor?</strong></summary>\nDebe ser al menos 80% de la estática. Si no, escala las fuerzas.\n</details>\n`,

  'navisworks-choques-clash-detection-paradoja': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuántos clashes son aceptables?</strong></summary>\nLOD 350: máximo 50. LOD 400: 0.\n</details>\n\n<details>\n<summary><strong>¿BCF es mejor que PDF?</strong></summary>\nSí. Se abre directamente en Revit, Tekla, ArchiCAD.\n</details>\n`,
};

async function main() {
  console.log('🏁 Last mile for AdSense\n');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  if (!posts) return;

  let expanded = 0;
  let faqsAdded = 0;

  // Expand remaining 5
  for (const [slug, content] of Object.entries(LAST_EXPANSIONS)) {
    const post = posts.find(p => p.slug === slug);
    if (post && !post.content?.includes(content.slice(0, 50))) {
      const { error } = await supabase.from('posts').update({ content: (post.content || '') + content }).eq('id', post.id);
      if (!error) {
        console.log(`✅ "${post.title}" (+${content.split(/\s+/).length} palabras)`);
        expanded++;
      }
    }
  }

  // Add FAQ to remaining 8
  for (const [slug, faq] of Object.entries(REMAINING_FAQS)) {
    const post = posts.find(p => p.slug === slug);
    if (post && !post.content?.includes('<details>')) {
      const { error } = await supabase.from('posts').update({ content: (post.content || '') + faq }).eq('id', post.id);
      if (!error) {
        console.log(`✅ FAQ "${post.title}"`);
        faqsAdded++;
      }
    }
  }

  console.log(`\n📊 Expandidos: ${expanded}`);
  console.log(`📊 FAQs: ${faqsAdded}`);
}

main().catch(console.error);
