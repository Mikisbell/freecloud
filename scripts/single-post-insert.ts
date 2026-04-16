/**
 * single-post-insert.ts
 * Inyecta UN SOLO artículo directamente en Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_slug: string;
  status: 'published' | 'draft';
  author: string;
  tags: string[];
  featured_image?: string | null;
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  key_question?: string;
  key_answer?: string;
  published_at?: string;
}

function getRandomPastDate(minDays = 2, maxDays = 12): string {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

async function insertPost(post: PostInput) {
  console.log(`\n🚀 Content Engine — Inyectando: "${post.title}"`);
  console.log('─'.repeat(60));

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
  }

  const finalCategoryId = category_id || Object.values(catMap)[0];
  const publishedAt = post.published_at ?? getRandomPastDate(2, 12);

  const { category_slug, published_at: _pa, ...rest } = post;
  const payload = {
    ...rest,
    category_id: finalCategoryId,
    published_at: publishedAt,
    featured_image: post.featured_image ?? null,
  };

  const { error } = await supabase
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
}

const POST_TO_INSERT: PostInput = {
  title: 'Modelamiento de Vigas en Revit Estructural: El Workflow que Ahorra 4 Horas por Piso',
  slug: 'revit-modelamiento-vigas-copiar-supervisar-niveles',
  excerpt: 'El error más común al modelar vigas en Revit es hacerlo piso por piso. Aquí el workflow real: copiar entre niveles, supervisar desde arquitectura y verificar el modelo analítico antes de ETABS.',
  meta_title: 'Vigas en Revit: Copiar entre Niveles + Supervisar (Guía 2026)',
  meta_description: 'Modelamiento de vigas en Revit Estructuras: copiar entre niveles, supervisar desde arquitectura, modelo analítico y verificación previa a ETABS. Flujo real para ingenieros peruanos.',
  content: `<p>Un ingeniero modela las vigas del Piso 1. Termina con 36 vigas dibujadas. Se va al Piso 2. Dibuja las mismas 36 vigas otra vez. Llega al Piso 5, son las 11 de la noche, y se da cuenta que una sección estaba mal desde el Piso 1. Tiene que corregir 5 veces el mismo error.</p>

<p>Esta es la situación más común de los primeros meses de Revit Estructural. Y la solución no es "dibujar más rápido". Es aprender a usar <strong>Copiar al portapapeles con niveles seleccionados</strong>, el comando que convierte 2 horas de trabajo en 30 segundos.</p>

<h2>El Error de Modelar Piso por Piso</h2>

<p>En Perú, la mayoría de edificios residenciales de 5 a 10 pisos tienen una planta típica repetida. La losa del Piso 2 es igual a la del Piso 3, 4 y 5. Solo cambian cargas o secciones en los últimos niveles si hay reducción. Modelar cada piso desde cero es ignorar toda la lógica paramétrica que Revit trae.</p>

<p>Este problema se nota más cuando llega el cambio. El arquitecto modifica el eje D 20 cm. Si modelaste piso por piso, tienes que entrar a cada nivel y corregir. Si usaste el workflow correcto, corriges una vez y Revit propaga el cambio a todos los pisos vinculados.</p>

<h2>Paso 1: Supervisar Antes de Modelar</h2>

<p>Antes de dibujar la primera viga, tu modelo estructural debe tener vinculado el modelo arquitectónico. Este es el primer principio del <a href="/blog/que-es-bim-obligatorio-peru-2026">flujo BIM que la Ley 32069 exige para proyectos públicos en Perú</a>.</p>

<p>El comando <strong>Copiar/Supervisar</strong> (pestaña Colaborar → Copiar/Supervisar → Seleccionar vínculo) te deja importar desde el archivo arquitectónico:</p>

<ul>
  <li><strong>Niveles</strong> — las alturas de cada piso. Si el arquitecto cambia la altura del Piso 3, te llega alerta automática.</li>
  <li><strong>Rejillas</strong> — los ejes A, B, C... 1, 2, 3... Base de todo el modelo.</li>
  <li><strong>Pilares</strong> — como referencia. Luego los reemplazas por columnas estructurales.</li>
  <li><strong>Muros</strong> — útil para coordinar muros de corte con muros arquitectónicos.</li>
  <li><strong>Suelos</strong> — referencia de losas arquitectónicas.</li>
</ul>

<p>Lo que NO debes hacer: copiar y pegar. Copiar/Supervisar mantiene el vínculo vivo. Copiar/Pegar te deja elementos muertos que nunca más se actualizan.</p>

<h2>Paso 2: Configurar Visibilidad Antes de Trabajar</h2>

<p>Cuando vinculas el modelo arquitectónico, Revit carga toda la información. La pantalla se satura. El comando <strong>VG</strong> (o VV) abre la ventana de Visibilidad/Gráficos y te deja controlar exactamente qué ves.</p>

<p>Mi recomendación para modelar vigas sin distracciones:</p>

<ul>
  <li>Oculta muros arquitectónicos, acabados, mobiliario del vínculo arquitectónico.</li>
  <li>Deja visibles solo los ejes, niveles y columnas arquitectónicas como referencia.</li>
  <li>Oculta el modelo analítico por ahora. Lo activas solo cuando vas a exportar a ETABS.</li>
</ul>

<p>Los atajos que vas a usar todos los días:</p>

<ul>
  <li><strong>HH</strong> — oculta el elemento seleccionado solo en la vista actual.</li>
  <li><strong>HA</strong> — oculta el elemento seleccionado permanentemente en la vista.</li>
  <li><strong>Bombilla inferior</strong> — vuelve a mostrar todo lo oculto.</li>
</ul>

<h2>Paso 3: Modelar las Vigas del Piso Típico</h2>

<p>Aquí viene el punto: no modelas todos los pisos. Modelas UNO — el piso típico. Después lo replicas.</p>

<h3>Antes de dibujar: define la sección</h3>

<p>En el panel de propiedades, selecciona el tipo de viga. Si no existe la sección que necesitas (ej: 30x60 cm), tienes dos opciones:</p>

<ul>
  <li><strong>Cargar familia</strong> — la librería de Autodesk trae vigas de concreto parametrizadas. Las cargas, asignas tus dimensiones y listo.</li>
  <li><strong>Editar tipo</strong> — duplicas un tipo existente, le pones otras dimensiones, y tienes una sección nueva para este proyecto.</li>
</ul>

<p>Para proyectos en Perú, las secciones más comunes son 25x50, 30x60, 30x70 en concreto f'c = 210 kg/cm². Si modelas varias veces el mismo tipo de edificio, creas tu propia librería de familias y la reutilizas en cada proyecto.</p>

<h3>Cómo dibujar las vigas</h3>

<ol>
  <li>Selecciona la vista de planta del nivel base (generalmente Piso 1 o Piso 2 si hay sótano).</li>
  <li>Pestaña <strong>Estructura</strong> → <strong>Viga</strong>.</li>
  <li>En el panel de propiedades, elige la sección correcta.</li>
  <li>Dibuja de eje a eje — siempre de columna a columna.</li>
  <li>Revit genera automáticamente el modelo analítico de la viga con líneas de colores.</li>
</ol>

<h2>El Modelo Analítico: Qué Significan los Colores</h2>

<p>Cuando dibujas una viga, Revit superpone una línea analítica con colores:</p>

<ul>
  <li><strong>Verde</strong> — extremo inicial de la viga.</li>
  <li><strong>Naranja</strong> — centro de la viga.</li>
  <li><strong>Rojo</strong> — extremo final.</li>
</ul>

<p>Esto no es estético — es el dato real que se exporta a ETABS. Los nodos (extremos verdes y rojos) deben coincidir con los nodos de las columnas. Si una viga "flota" sin conexión, ETABS la va a detectar como elemento suelto y el análisis falla.</p>

<blockquote>
  <strong>Ojo en obra:</strong> Antes de exportar a ETABS, activa temporalmente el modelo analítico (VG → Modelo analítico → mostrar) y recorre cada piso visualmente. Busca vigas que no conecten con columnas. Ese error es el causante del 70% de modelos que "no corren" en ETABS. Lo detectas en 5 minutos en Revit, o pierdes 3 horas debuggeando en ETABS.
</blockquote>

<h2>Paso 4: Copiar las Vigas a Todos los Niveles</h2>

<p>Aquí es donde el workflow se vuelve eficiente. Terminaste las 36 vigas del piso típico. Vas a replicarlas en los pisos 2, 3, 4 y 5 en 10 segundos.</p>

<ol>
  <li>Ve a una <strong>vista de alzado o 3D</strong>.</li>
  <li>Selecciona todas las vigas del nivel base. Puedes usar filtro: clic derecho en una viga → Seleccionar todas las instancias → En toda la vista.</li>
  <li><strong>Ctrl+C</strong> para copiar al portapapeles.</li>
  <li>Modificar → <strong>Pegar → Alineado con niveles seleccionados</strong>.</li>
  <li>En el cuadro de diálogo, marcá los niveles destino: Piso 2, Piso 3, Piso 4, Piso 5.</li>
  <li><strong>Aceptar</strong>.</li>
</ol>

<p>Revit copia las 36 vigas con la misma sección y posición relativa en cada nivel seleccionado. Trabajo de 4 pisos hecho en un paso.</p>

<h2>¿Y Si el Piso 5 Tiene Diferente Distribución?</h2>

<p>En Perú muchos edificios tienen la azotea con menos vigas, o un piso técnico con distribución distinta. No hay problema: copias las vigas al Piso 5 igual, y luego eliminas las que no aplican en esa vista. Sigue siendo más rápido que modelar desde cero.</p>

<p>Para proyectos con dos zonas estructurales muy diferentes (ej: base con columnas de 60x60 y últimos pisos con columnas de 40x40), mi recomendación es: modela cada zona como un "piso típico" diferente. Copias de Piso 1 a Piso 3. Modelas Piso 4. Copias de Piso 4 a Piso 6.</p>

<h2>Orden Recomendado para Modelar un Edificio</h2>

<p>Para edificios de concreto armado residenciales en Perú, el orden que uso es:</p>

<ol>
  <li><strong>Niveles y rejillas</strong> — supervisados del vínculo arquitectónico.</li>
  <li><strong>Columnas</strong> — de cimentación al último nivel. Usa <a href="/blog/predimensionamiento-columnas-vigas-e060-practico">predimensionamiento según E.060</a> para definir secciones iniciales.</li>
  <li><strong>Vigas del piso típico</strong> — luego copias a los demás pisos.</li>
  <li><strong>Losas</strong> — después de vigas para que los bordes calcen con los ejes de las vigas.</li>
  <li><strong>Muros de corte</strong> — si la estructura los incluye.</li>
  <li><strong>Cimentaciones</strong> — zapatas, vigas de cimentación o losa de cimentación, según el tipo de suelo.</li>
</ol>

<p>Este orden garantiza que los elementos se conectan bien entre sí y el modelo analítico no tiene huecos al exportar.</p>

<h2>Verificación Final Antes de ETABS</h2>

<p>Antes de tocar el botón de exportar, corre esta checklist en Revit:</p>

<ul>
  <li>Todas las vigas conectan con columnas (sin extremos sueltos).</li>
  <li>Los niveles del modelo estructural coinciden con el arquitectónico supervisado.</li>
  <li>Las secciones asignadas corresponden al predimensionamiento de tu memoria de cálculo.</li>
  <li>El modelo analítico está activo y sin advertencias en la barra inferior.</li>
  <li>Los materiales están bien definidos (concreto f'c = 210 kg/cm², acero fy = 4,200 kg/cm²).</li>
</ul>

<p>Si pasas los 5 checks, el modelo está listo para exportar. Si falla uno, corrige primero en Revit — arreglar errores en ETABS después es 10 veces más caro en tiempo. Los que ya han trabajado en un par de obras saben a qué me refiero.</p>`,
  category_slug: 'bim-peru',
  status: 'published',
  author: 'Ing. Miguel Rivera',
  tags: ['revit', 'bim', 'modelamiento-estructural', 'vigas', 'etabs', 'workflow'],
  reading_time: 8,
};

insertPost(POST_TO_INSERT).catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
