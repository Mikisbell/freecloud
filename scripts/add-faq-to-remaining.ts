/**
 * add-faq-to-remaining.ts
 * Add FAQ sections to the 17 posts that still don't have them
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const FAQS: Record<string, string> = {
  'modelamiento-bim-estructural-revit-etabs-guia': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿El modelo de Revit reemplaza al de ETABS?</strong></summary>\nNo. Revit es para documentación y coordinación. ETABS es para análisis y diseño. Ambos son complementarios.\n</details>\n\n<details>\n<summary><strong>¿Cómo transfiero el modelo de Revit a ETABS?</strong></summary>\nA través del plugin CSiXRevit o del formato IFC. CSiXRevit preserva mejor las propiedades estructurales.\n</details>\n`,

  'modelamiento-vigas-revit-copiar-supervisar-niveles': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Las vigas se copian con sus refuerzos?</strong></summary>\nSi usas "Copy with Paste Aligned", las vigas se copian con sus propiedades. Los refuerzos de rebar requieren extensión adicional.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si el arquitecto cambia la altura de un piso?</strong></summary>\nLas vigas se ajustan automáticamente si están constraintadas a los niveles. Verifica después de cada cambio.\n</details>\n`,

  'excel-metrado-acero-calculo-automatico-vigas': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Puedo importar datos de Revit a Excel automáticamente?</strong></summary>\nSí. View > Schedules > Export to Excel. Los datos llegan limpios a tu plantilla.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma hacer metrados manualmente?</strong></summary>\nPara edificación de 3 pisos: 2-3 días manual, 2-4 horas automatizado.\n</details>\n`,

  'etabs-analisis-sismico-norma-e030-guia-practica': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿ETABS genera el espectro de la E.030 automáticamente?</strong></summary>\nNo. Debes definir la función de espectro manualmente con los valores de Z, U, C, S, R de la norma.\n</details>\n\n<details>\n<summary><strong>¿Necesito análisis time-history para edificaciones regulares?</strong></summary>\nNo. El análisis espectral es suficiente. El time-history es para estructuras especiales o irregulares.\n</details>\n`,

  'revit-vs-autocad-cual-aprender-primero-2025': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿AutoCAD desaparecerá?</strong></summary>\nNo. AutoCAD sigue siendo útil para detalles 2D, planos de taller, y proyectos pequeños. Pero BIM es el futuro para proyectos grandes.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma aprender Revit?</strong></summary>\nLo básico: 1-2 meses. Nivel intermedio: 3-6 meses. Dominar la plataforma: 1-2 años.\n</details>\n`,

  'dynamo-principiantes-primera-automatizacion-revit-guia': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Dynamo puede dañar mi modelo de Revit?</strong></summary>\nNo. Dynamo solo modifica el modelo si ejecutas nodos de escritura. Los nodos de lectura son seguros.\n</details>\n\n<details>\n<summary><strong>¿Necesito saber programación para Dynamo?</strong></summary>\nNo. Dynamo es programación visual. Conectar nodos es como armar un diagrama de flujo.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma aprender Dynamo?</strong></summary>\nLo básico: 2-4 semanas. Nivel intermedio: 2-3 meses.\n</details>\n`,

  'python-librerias-esenciales-ingenieros-civiles': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Necesito instalar Anaconda o puedo usar Python puro?</strong></summary>\nAnaconda es recomendado porque incluye las librerías científicas preinstaladas.\n</details>\n\n<details>\n<summary><strong>¿Python puede reemplazar a Excel para cálculos estructurales?</strong></summary>\nPuede complementarlo. Python es mejor para cálculos repetitivos y procesamiento de datos.\n</details>\n`,

  'pyrevit-instalar-primeros-scripts-revit': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿pyRevit funciona en Revit 2025?</strong></summary>\nSí, pyRevit es compatible con Revit 2024 y 2025.\n</details>\n\n<details>\n<summary><strong>¿Puedo distribuir mis scripts a otros usuarios?</strong></summary>\nSí. Coloca tus scripts en la carpeta de extensiones de pyRevit y compártela por red o Git.\n</details>\n`,

  'civil-3d-carreteras-guia-completa-paso-a-paso': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Civil 3D cumple con el Manual de Diseño Geométrico del MTC?</strong></summary>\nCivil 3D es una herramienta. El cumplimiento depende de cómo configures los parámetros de diseño.\n</details>\n\n<details>\n<summary><strong>¿Puedo importar datos topográficos de drone?</strong></summary>\nSí. Importa la nube de puntos como archivo .LAS y crea la superficie en Civil 3D.\n</details>\n`,

  'bep-plan-ejecucion-bim-ejemplo-peru': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuántas páginas debe tener un BEP?</strong></summary>\nPara edificación de 3 pisos: 10-15 páginas. Para proyectos grandes: 30-50+ páginas.\n</details>\n\n<details>\n<summary><strong>¿Quién elabora el BEP?</strong></summary>\nEl Coordinador BIM con aportes de cada líder de disciplina.\n</details>\n`,

  'cortante-basal-formula-e030-calculo-paso-a-paso': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿La cortante basal es la misma en X e Y?</strong></summary>\nNo necesariamente. Si la estructura tiene diferente rigidez en cada dirección, la cortante basal será diferente.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si la cortante espectral es menor que la estática?</strong></summary>\nLa norma E.030 exige que sea al menos el 80% de la estática. Si es menor, debes escalar las fuerzas.\n</details>\n`,

  'lod-100-500-bim-significado-revit-peru': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Qué nivel de LOD me piden para una licitación?</strong></summary>\nPara ingeniería de detalle: LOD 350. Para construcción: LOD 400. Para as-built: LOD 500.\n</details>\n\n<details>\n<summary><strong>¿LOD es lo mismo que LOI?</strong></summary>\nNo. LOD se refiere a la geometría. LOI se refiere a los datos no gráficos.\n</details>\n`,

  'open-bim-vs-closed-bim-ifc-formato': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿El formato IFC pierde información al exportar?</strong></summary>\nPuede perder información de parámetros propietarios. Los elementos geométricos se mantienen bien.\n</details>\n\n<details>\n<summary><strong>¿Qué software soporta IFC en Perú?</strong></summary>\nRevit, ArchiCAD, Tekla Structures, Allplan, y muchos más.\n</details>\n`,

  'bim-nivel-1-2-3-diferencias-certificacion': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Qué nivel BIM me exigen para licitaciones en 2026?</strong></summary>\nPara 2026, se espera BIM Nivel 2 como mínimo.\n</details>\n\n<details>\n<summary><strong>¿Cómo certifico mi empresa en BIM?</strong></summary>\nNo existe certificación oficial de "empresa BIM" en Perú. buildingSMART ofrece certificaciones individuales.\n</details>\n`,

  'bim-manager-que-hace-cuanto-gana-peru': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuánto gana un BIM Manager en Perú?</strong></summary>\nEntre S/ 8,000 y S/ 15,000 mensuales. En multinacionales puede superar los S/ 18,000.\n</details>\n\n<details>\n<summary><strong>¿Puede un ingeniero civil convertirse en BIM Manager?</strong></summary>\nSí. Es el perfil más demandado: ingeniero civil con dominio de Revit, Navisworks, e ISO 19650.\n</details>\n`,

  'navisworks-clash-detection-tutorial-completo': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuántos tests de clash debo crear?</strong></summary>\nMínimo 3: Estructura vs MEP, Arquitectura vs MEP, MEP vs MEP.\n</details>\n\n<details>\n<summary><strong>¿Cómo exporto los clashes a Revit?</strong></summary>\nExporta como BCF. Abre el BCF en Revit y cada clash se posiciona en la vista correcta.\n</details>\n`,

  'interpretar-analisis-modal-masas-etabs-e030': `\n\n## Preguntas frecuentes\n\n<details>\n<summary><strong>¿Cuántos modos necesito como mínimo?</strong></summary>\nLa norma E.030 exige al menos 90% de masa participativa. Para edificios regulares, 3-6 modos por dirección.\n</details>\n\n<details>\n<summary><strong>¿El período fundamental debe coincidir con la fórmula de la E.030?</strong></summary>\nNo exactamente, pero debe estar en el mismo rango. Si difiere más del 30%, revisa tu modelo.\n</details>\n`,
};

async function main() {
  console.log('📝 Adding FAQ to remaining 17 posts\n');

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, content')
    .eq('status', 'published');

  if (!posts) return;

  let added = 0;

  for (const [slug, faqSection] of Object.entries(FAQS)) {
    const post = posts.find(p => p.slug === slug);
    if (post && !post.content?.includes('<details>')) {
      const { error } = await supabase
        .from('posts')
        .update({ content: (post.content || '') + faqSection })
        .eq('id', post.id);

      if (error) {
        console.log(`❌ "${post.title}": ${error.message}`);
      } else {
        console.log(`✅ "${post.title}"`);
        added++;
      }
    }
  }

  console.log(`\n📊 FAQ added to ${added} posts`);
}

main().catch(console.error);
