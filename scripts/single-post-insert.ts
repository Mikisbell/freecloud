/**
 * single-post-insert.ts
 * Inyecta UN SOLO artículo directamente en Supabase.
 * Usado por el Content Engine (content-engine/SKILL.md) para publicar un post
 * generado automáticamente sin pasar por archivos .md locales.
 *
 * Uso:
 *   npx tsx scripts/single-post-insert.ts
 *
 * El post se define en la constante `POST_TO_INSERT` al final de este archivo.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─────────────────────────────────────────────────────────────────────────────
// TIPO DEL POST
// ─────────────────────────────────────────────────────────────────────────────
interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_slug: string;   // Se mapea a category_id automáticamente
  status: 'published' | 'draft';
  author: string;
  tags: string[];
  featured_image?: string | null;
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  key_question?: string;
  key_answer?: string;
  /** Si no se provee, se asigna automáticamente entre 2 y 12 días atrás */
  published_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getRandomPastDate(minDays = 2, maxDays = 12): string {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
async function insertPost(post: PostInput) {
  console.log(`\n🚀 Content Engine — Inyectando: "${post.title}"`);
  console.log('─'.repeat(60));

  // 1. Mapear category_slug → category_id
  console.log('📡 Conectando a Supabase y mapeando categorías...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError || !categories) {
    console.error('❌ Error leyendo categorías:', catError);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories.forEach((c) => (catMap[c.slug] = c.id));

  const category_id = catMap[post.category_slug];
  if (!category_id) {
    console.warn(`⚠️  Categoría "${post.category_slug}" no encontrada.`);
    console.warn(`   Categorías disponibles: ${Object.keys(catMap).join(', ')}`);
    console.warn('   Usando la primera disponible como fallback.');
  }

  const finalCategoryId = category_id || Object.values(catMap)[0];
  const publishedAt = post.published_at ?? getRandomPastDate(2, 12);

  // 2. Armar el payload limpio
  const { category_slug, published_at: _pa, ...rest } = post;
  const payload = {
    ...rest,
    category_id: finalCategoryId,
    published_at: publishedAt,
    created_at: publishedAt,
    featured_image: post.featured_image ?? null,
  };

  // 3. Upsert (si el slug ya existe, actualiza; si no, inserta)
  console.log(`📦 Insertando post con slug: "${payload.slug}"`);
  const { data, error } = await supabase
    .from('posts')
    .upsert([payload], { onConflict: 'slug' });

  if (error) {
    console.error('❌ Error insertando el post:', error);
    process.exit(1);
  }

  console.log('─'.repeat(60));
  console.log('✅ Post inyectado exitosamente en Supabase.');
  console.log(`   Slug: ${payload.slug}`);
  console.log(`   Fecha publicación: ${publishedAt}`);
  console.log(`   Categoría: ${post.category_slug} (id: ${finalCategoryId})`);
  console.log('\n👉 Siguiente paso: Ejecuta "node scripts/indexnow-submit.mjs" para notificar a Bing/Yandex.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 📝 AQUÍ VA EL ARTÍCULO — El Content Engine reemplaza esto cada vez
// ─────────────────────────────────────────────────────────────────────────────
const POST_TO_INSERT: PostInput = {
  title: 'BEP (Plan de Ejecución BIM) con Ejemplo Real para Obras en Perú',
  slug: 'bep-plan-ejecucion-bim-ejemplo-peru',
  excerpt: 'Si tu proyecto BIM no tiene un BEP desde el primer día, estás destinado al fracaso. Descubre qué es el Plan de Ejecución BIM, por qué es obligatorio para 2026 y cómo estructurarlo con ejemplos prácticos.',
  meta_title: 'BEP: Plan de Ejecución BIM en Perú (Ejemplo Real 2026)',
  meta_description: 'Guía definitiva sobre el Plan de Ejecución BIM (BEP) en Perú. Estructura, Matriz de Responsabilidades y anexos para cumplir con la Ley 32069 y la ISO 19650.',
  key_question: '¿Por qué es obligatorio el BEP y cómo se estructura según la normativa peruana?',
  key_answer: 'El BEP aterriza las exigencias del cliente (EIR) en un plan técnico. En Perú, se divide en BEP Pre-contrato (propuesta) y Post-contrato (documento de gestión). Debe incluir indefectiblemente los objetivos BIM, los usos, mapas de procesos y la matriz de responsabilidades de modelado (LOD).',
  content: `<p>El 90% de los problemas en reuniones de coordinación BIM se resumen en una sola frase: <em>"Pero yo pensé que tú ibas a modelar eso"</em>. Cuando el arquitecto cree que el estructurista modelará las cimentaciones, y el estructurista cree que las masas conceptuales las pone arquitectura, terminamos con modelos vacíos y presupuestos erróneos.</p>

<p>La solución a este caos tiene tres letras: <strong>BEP (Plan de Ejecución BIM)</strong>. Con la entrada en vigencia de la <a href="/blog/que-es-bim-obligatorio-peru-2026">metodología BIM como requisito obligatorio para 2026 (Ley 32069)</a>, entregar un BEP sólido será tan importante como entregar los planos de obra.</p>

<h2>¿Qué es exactamente un BEP?</h2>

<p>El BEP (<em>BIM Execution Plan</em>) es el <strong>manual de reglas del juego</strong> para el desarrollo de un proyecto BIM. Es un documento vivo, redactado por el Proveedor Principal (<a href="/blog/bim-manager-que-hace-cuanto-gana-peru">BIM Manager</a> del consorcio ejecutor), que explica detalladamente <em>cómo</em> el equipo va a cumplir con los requerimientos de información que pidió el cliente.</p>

<p>Según la <strong>ISO 19650</strong>, que es el estándar rector adoptado por el Plan BIM Perú, existen dos momentos clave para el BEP:</p>

<ul>
  <li><strong>BEP Pre-Contrato:</strong> Es tu propuesta técnica diferencial. Demuestra que tu consorcio tiene la capacidad, el hardware y la estructura para afrontar el proyecto antes de ganar la licitación.</li>
  <li><strong>BEP Post-Contrato:</strong> Una vez ganada la obra, este documento se amplía, se firma y se convierte en el <strong>contrato técnico</strong> entre todas las especialidades.</li>
</ul>

<h2>Estructura Clave de un BEP (Alineado al Plan BIM Perú)</h2>

<p>Un buen Plan de Ejecución no es una plantilla descargada de internet de 100 páginas que nadie lee. Debe ser conciso y resolver problemas reales. Aquí la estructura esencial con ejemplos prácticos:</p>

<h3>1. Información del Proyecto y Objetivos BIM</h3>
<p>No hagas BIM solo por hacer BIM. Define <strong>para qué</strong> se usarán los modelos.</p>
<p><strong>❌ Mal redactado:</strong> <em>"El objetivo es hacer un modelo 3D del colegio."</em></p>
<p><strong>✅ Ejemplo Real:</strong> <em>"El objetivo principal es usar los Modelos de Información para la Detección de Interferencias (Clash Detection) en el falso cielo raso, reduciendo los RFI (Request For Information) en un 30% durante la etapa constructiva."</em></p>

<h3>2. Roles y Responsabilidades</h3>
<p>¿Quién hace qué? El BEP debe listar los nombres, correos y roles (BIM Manager, Coordinadores BIM por especialidad, Modeladores). Es vital designar al responsable del <strong>Entorno Común de Datos (CDE)</strong>, donde vivirá el proyecto.</p>

<h3>3. Matriz de Responsabilidades de Modelado (El Corazón del BEP)</h3>
<p>Este es el anexo más importante. Es una tabla de doble entrada que indica qué elemento se modela, quién es el responsable y a qué nivel de detalle según la fase. Aquí aplicamos el concepto de <a href="/blog/lod-100-500-bim-significado-revit-peru">LOD (Nivel de Desarrollo)</a>.</p>

<div class="overflow-x-auto my-6">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-200 text-gray-800">
        <th class="p-3 font-semibold">Elemento (OmniClass)</th>
        <th class="p-3 font-semibold">Fase 1 (Esquemático)</th>
        <th class="p-3 font-semibold">Fase 2 (Detallado)</th>
        <th class="p-3 font-semibold">Responsable</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-200">
        <td class="p-3">Zapatas Aisladas</td>
        <td class="p-3">LOD 200</td>
        <td class="p-3">LOD 350</td>
        <td class="p-3 font-medium text-blue-600">Ing. Estructural</td>
      </tr>
      <tr class="border-b border-gray-200 bg-gray-50/50">
        <td class="p-3">Bandejas Eléctricas</td>
        <td class="p-3">LOD 100</td>
        <td class="p-3">LOD 300</td>
        <td class="p-3 font-medium text-orange-600">Ing. Eléctrico</td>
      </tr>
    </tbody>
  </table>
</div>

<h3>4. Estrategia de Colaboración y CDE</h3>
<p>El Estado Peruano prohíbe el "Closed BIM". Por lo tanto, tu BEP debe especificar cómo se entregará la información bajo el paradigma <a href="/blog/open-bim-vs-closed-bim-ifc-formato">Open BIM (formatos abiertos)</a>.</p>
<p><strong>Ejemplo práctico:</strong> <em>"Los modelos nativos se desarrollarán en Revit 2024. Sin embargo, las entregas semanales de coordinación al CDE (BIM 360/Autodesk Construction Cloud) se realizarán obligatoriamente en formato IFC 2x3 o 4, y las incidencias se reportarán mediante formato BCF."</em></p>

<h3>5. Nomenclatura Estándar (Naming Convention)</h3>
<p>El desorden destruye los proyectos. El BEP establece el estándar de nombres para todos los archivos subidos al CDE. Basado en la ISO 19650, el nombre de un archivo cuenta una historia.</p>
<p><strong>Ejemplo de Nomenclatura:</strong> <code>PRJ01-STR-Z01-L02-M3D-0001</code></p>
<ul class="text-sm text-gray-600 mt-2">
  <li><em>PRJ01</em>: Código del Proyecto</li>
  <li><em>STR</em>: Disciplina (Estructuras)</li>
  <li><em>Z01</em>: Zona 1</li>
  <li><em>L02</em>: Nivel 2</li>
  <li><em>M3D</em>: Modelo 3D</li>
</ul>

<h2>¿Cómo Implementar un BEP en Proyectos Pequeños?</h2>

<p>Si eres un contratista pequeño, la palabra "CDE" o "ISO 19650" puede asustar. <strong>No te compliques al empezar.</strong></p>

<p>Si diseñas viviendas de 3 pisos, crea un "Mini-BEP" de 5 páginas. Define claramente las coordenadas de origen (el punto (0,0,0) intocable), en qué versión de software trabajarán para evitar problemas de compatibilidad (ej. "Todos usamos estricto Revit 2022"), y pon una fecha límite rígida para subir el modelo de arquitectura antes de que el estructurista empiece a colocar columnas.</p>

<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-700 bg-emerald-50 py-2 my-6">
  <strong>El Dato en Obra:</strong> Antes de redactar una sola letra de tu BEP, debes leer el EIR (Requerimientos de Intercambio de Información) que te da el cliente. El BEP es tu respuesta <strong>técnica</strong> a las necesidades <strong>empresariales</strong> del EIR.
</blockquote>

<h2>Conclusión</h2>

<p>Redactar un buen Plan de Ejecución BIM es el equivalente a asentar correctamente los cimientos de un edificio. A medida que nos acercamos al hito del 2026 en la inversión pública peruana, las entidades revisoras (como el PRONIED o MTC) no solo evaluarán tus modelos en Navisworks, sino la coherencia entre tu modelo y las reglas que prometiste cumplir en tu BEP. ¡Empieza a estandarizar hoy!</p>`,
  category_slug: 'bim-peru',
  status: 'published',
  author: 'Ing. Miguel Rivera',
  tags: ['BEP', 'Plan de Ejecución BIM', 'ISO 19650', 'Plan BIM Perú', 'LOD', 'EIR', 'BIM Manager'],
  reading_time: 8,
};

// Ejecutar
insertPost(POST_TO_INSERT);
