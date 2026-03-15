import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

// Lee el .env.local para obtener las keys completas
const envFile = readFileSync(path.resolve('.env.local'), 'utf-8');
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

// IDs de categorías (obtenidos del script anterior)
const CATS = {
  'bim-peru':             '4942c0a4-5a77-436a-baf0-ef0645ddbe35',
  'revit':                '903dd7d2-ee64-48dd-af79-faf61a03dee9',
  'analisis-estructural': 'cd5cc6a8-7ea4-4027-980f-64145e61a97d',
  'civil-3d':             'd9a2bfb1-88d5-4660-b1e0-9c0eb9e908d2',
  'normativa':            '2795323e-d17d-4672-8510-441dc9109091',
  'python':               'a6f12f36-4cff-468b-b912-855f62a65e00',
};

const now = new Date();
function daysAgo(d) {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const POSTS = [
  // ──────────────────────────────────────────────────────────────
  // POST 1: Revit vs AutoCAD ¿Cuál aprender primero?
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Revit vs AutoCAD: ¿Cuál Aprender Primero en 2025?',
    slug: 'revit-vs-autocad-cual-aprender-primero-2025',
    category_id: CATS['revit'],
    status: 'published',
    featured: false,
    published_at: daysAgo(12),
    tags: ['Revit', 'AutoCAD', 'BIM', 'Software', 'Carrera'],
    meta_title: 'Revit vs AutoCAD: ¿Cuál Aprender Primero? Guía 2025',
    meta_description: 'Compara Revit y AutoCAD para ingenieros civiles: diferencias, sueldos, mercado laboral peruano y la ruta de aprendizaje óptima para 2025.',
    excerpt: 'La pregunta que todo ingeniero civil se hace al empezar con herramientas digitales. Te doy la respuesta directa basada en el mercado peruano actual.',
    reading_time: 9,
    content: `<h2>La pregunta que todo ingeniero civil se hace</h2>
<p>Si llevas algo de tiempo en el mundo de la ingeniería civil digital, seguramente alguien te ha preguntado —o te has preguntado tú mismo— si debes aprender <strong>Revit</strong> o <strong>AutoCAD</strong> primero. Y la respuesta corta es: <strong>depende de dónde quieres llegar</strong>.</p>
<p>Pero como sé que esa respuesta no te ayuda mucho, vamos con la respuesta larga y práctica basada en el mercado laboral peruano actual.</p>

<h2>¿Qué es AutoCAD y para qué sirve realmente?</h2>
<p>AutoCAD es el software CAD (Computer-Aided Design) por excelencia. Se usa principalmente para dibujo técnico en 2D, aunque tiene capacidades 3D básicas. En ingeniería civil, lo verás en:</p>
<ul>
  <li>Planos de planta, cortes y elevaciones en proyectos de edificación</li>
  <li>Diseño de redes de agua y alcantarillado</li>
  <li>Planos de replanteo y topografía</li>
  <li>Detalles constructivos de armaduras y conexiones</li>
</ul>
<p>Su gran ventaja es la <strong>curva de aprendizaje corta</strong>. En 2-3 meses puedes manejar lo esencial para trabajar en obra o gabinete. Por eso sigue siendo el software más pedido en ofertas de trabajo de nivel junior en Perú.</p>

<h2>¿Qué es Revit y en qué se diferencia?</h2>
<p>Revit es un software BIM (Building Information Modeling) desarrollado por Autodesk. A diferencia de AutoCAD, no trabajas con líneas: trabajas con <strong>elementos paramétricos con información real</strong>. Una viga en Revit no es solo una línea: es un objeto que sabe su material, su longitud, su peso y cómo se conecta con las demás vigas.</p>
<p>Esto tiene consecuencias importantes:</p>
<ul>
  <li>Si cambias una sección en planta, los cortes y elevaciones se actualizan solos</li>
  <li>Puedes extraer metrados automáticamente desde el modelo</li>
  <li>Múltiples especialistas (arquitecto, estructural, MEP) trabajan en el mismo modelo de forma colaborativa</li>
  <li>Se puede usar para análisis estructural integrándolo con ETABS o Robot Structural</li>
</ul>

<h2>Diferencias clave: AutoCAD vs Revit</h2>
<table>
  <thead>
    <tr><th>Característica</th><th>AutoCAD</th><th>Revit</th></tr>
  </thead>
  <tbody>
    <tr><td>Tipo de software</td><td>CAD 2D/3D</td><td>BIM 3D paramétrico</td></tr>
    <tr><td>Curva de aprendizaje</td><td>Baja</td><td>Media-Alta</td></tr>
    <tr><td>Mercado laboral junior (Perú)</td><td>Alto</td><td>Creciente rápido</td></tr>
    <tr><td>Sueldo promedio</td><td>S/. 2,000 - 4,000</td><td>S/. 3,500 - 7,000+</td></tr>
    <tr><td>Colaboración multidisciplinaria</td><td>Limitada</td><td>Nativa (modelo federado)</td></tr>
    <tr><td>Metrados automáticos</td><td>No</td><td>Sí, nativo</td></tr>
    <tr><td>Obligatorio por Ley 32069 (Perú)</td><td>No</td><td>Sí (como herramienta BIM)</td></tr>
  </tbody>
</table>

<h2>El mercado peruano en 2025: ¿qué piden las empresas?</h2>
<p>He revisado más de 50 ofertas de trabajo en LinkedIn, Bumeran y Computrabajo para ingenieros civiles en Perú durante los últimos meses. Esto es lo que vi:</p>
<ul>
  <li><strong>Proyectos de edificación privada (junior):</strong> 80% piden AutoCAD, 30% Revit</li>
  <li><strong>Consultoras BIM / Oficinas técnicas:</strong> 90% piden Revit obligatoriamente</li>
  <li><strong>Empresas constructoras con proyectos públicos:</strong> creciente demanda de Revit por la Ley 32069</li>
  <li><strong>Proyectos de infraestructura vial:</strong> Civil 3D primero, Revit secundario</li>
</ul>
<p>La conclusión es clara: <strong>AutoCAD sigue siendo relevante, pero Revit es el futuro inmediato</strong>, especialmente con la obligatoriedad BIM desde agosto de 2026.</p>

<h2>Mi recomendación: la ruta de aprendizaje óptima</h2>
<p>Si eres estudiante o recién egresado:</p>
<ol>
  <li><strong>Mes 1-2:</strong> Aprende AutoCAD básico. Comandos esenciales, capas, bloques, impresión. Esto te asegura empleabilidad inmediata y confianza en el dibujo técnico.</li>
  <li><strong>Mes 3-6:</strong> Empieza con Revit Architecture o Revit Structure (según tu especialidad). Familiarte con la lógica BIM es el salto más importante de tu carrera.</li>
  <li><strong>Mes 7+:</strong> Combínalos. Usa AutoCAD para detalles específicos y Revit como entorno principal de proyecto.</li>
</ol>
<p>Si ya tienes experiencia con AutoCAD y quieres subir de nivel, ve directamente a Revit. No necesitas "completar" AutoCAD antes de hacer el salto.</p>

<h2>La Ley 32069 cambia el juego</h2>
<p>Con la <strong>Ley N° 32069</strong>, el uso de BIM se vuelve obligatorio para proyectos de inversión pública desde agosto de 2026. Esto significa que en menos de 12 meses, toda empresa que quiera acceder a licitaciones del Estado peruano necesitará profesionales que manejen herramientas BIM como Revit.</p>
<p>Si aún no tienes Revit en tu currículum, ahora es el momento de aprenderlo. La demanda va a crecer y los que ya lo manejen tendrán ventaja.</p>

<h2>Conclusión</h2>
<p>No hay una respuesta universal. Pero si tuviera que elegir hoy, con el mercado peruano actual:</p>
<ul>
  <li>¿Quieres trabajo rápido en obra o pequeñas constructoras? → <strong>AutoCAD primero</strong></li>
  <li>¿Apuntas a consultoras BIM, proyectos públicos grandes o quieres un sueldo más alto? → <strong>Revit desde el principio</strong></li>
  <li>¿Tienes tiempo y motivación? → <strong>Aprende los dos</strong>, son complementarios</li>
</ul>
<p>En FreeCloud seguimos publicando tutoriales prácticos de ambas herramientas. Si quieres empezar con Revit estructural, revisa nuestra guía <a href="/blog/revit-estructuras-ingenieros-autocad">Domina Revit Estructural en 5 Pasos Desde AutoCAD</a>.</p>`,
    key_question: '¿Debo aprender Revit o AutoCAD primero como ingeniero civil?',
    key_answer: 'Para empleabilidad inmediata, AutoCAD. Para mayor sueldo y futuro laboral en proyectos BIM y licitaciones públicas peruanas (Ley 32069), Revit. Lo ideal es aprender ambos, empezando por AutoCAD los primeros 2 meses y luego suman Revit.',
    image_alt: 'Comparación entre Revit y AutoCAD para ingenieros civiles peruanos: interfaces, diferencias y cuál aprender primero en 2025',
  },

  // ──────────────────────────────────────────────────────────────
  // POST 2: Guía Dynamo para principiantes
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Dynamo para Principiantes: Tu Primera Automatización en Revit',
    slug: 'dynamo-principiantes-primera-automatizacion-revit-guia',
    category_id: CATS['bim-peru'],
    status: 'published',
    featured: false,
    published_at: daysAgo(9),
    tags: ['Dynamo', 'Revit', 'BIM', 'Automatización', 'Programación Visual'],
    meta_title: 'Dynamo para Principiantes: Guía Completa en Español',
    meta_description: 'Aprende Dynamo desde cero con ejemplos prácticos para Revit. Automatiza numeración de elementos, extracción de datos y más sin saber programar.',
    excerpt: 'Dynamo te permite automatizar Revit sin escribir código. En esta guía aprenderás los conceptos base y crearás tu primera rutina real en menos de 30 minutos.',
    reading_time: 11,
    content: `<h2>¿Qué es Dynamo y por qué lo necesitas?</h2>
<p>Si usas Revit y todavía haces cosas manualmente que podrían automatizarse, <strong>Dynamo</strong> es la herramienta que cambiará tu flujo de trabajo para siempre.</p>
<p>Dynamo es un entorno de programación visual integrado en Revit (y también disponible como aplicación independiente). En lugar de escribir código, conectas nodos con cables para crear lógica de automatización. Piénsalo como un diagrama de flujo que Revit entiende y ejecuta.</p>

<h2>¿Para qué se usa Dynamo en proyectos BIM reales?</h2>
<p>Las aplicaciones más comunes que he visto en proyectos reales en Perú:</p>
<ul>
  <li><strong>Numeración automática de elementos:</strong> pilares, vigas, losas, puertas, ventanas</li>
  <li><strong>Generación de parámetros personalizados</strong> en masa (marca del proyecto, responsable, fecha)</li>
  <li><strong>Extracción de datos a Excel</strong> para metrados, presupuestos o verificaciones</li>
  <li><strong>Colocación automatizada de elementos repetitivos</strong> (luminarias en grilla, tuberías en niveles)</li>
  <li><strong>Verificación de clashes</strong> y generación de reportes</li>
  <li>Creación de geometría paramétrica compleja</li>
</ul>

<h2>Conceptos base que debes conocer</h2>
<p>Antes de abrir Dynamo, entiende estos términos:</p>
<ul>
  <li><strong>Nodo (Node):</strong> Es el bloque básico de Dynamo. Cada nodo hace una tarea específica: obtener elementos de Revit, hacer un cálculo, cambiar un parámetro, etc.</li>
  <li><strong>Wire (Cable):</strong> Conecta la salida de un nodo con la entrada de otro. Así fluye la información.</li>
  <li><strong>Lista:</strong> Dynamo trabaja con listas de datos. Si tienes 50 pilares, Dynamo los procesa como una lista de 50 elementos.</li>
  <li><strong>Watch node:</strong> Nodo especial para ver qué datos hay en un cable. Tu mejor amigo para depurar.</li>
</ul>

<h2>Tu primera automatización: numerar pilares por nivel</h2>
<p>Este es uno de los ejercicios más útiles para empezar. Vamos a numerar automáticamente todos los pilares del modelo Revit, asignándoles un código del tipo <strong>P-01, P-02, P-03...</strong> por nivel.</p>

<h3>Paso 1: Abre Dynamo desde Revit</h3>
<p>En Revit, ve a la pestaña <strong>Administrar</strong> → <strong>Visual Programming</strong> → <strong>Dynamo</strong>. Si no ves esta opción, instala Dynamo Player desde el sitio oficial de Autodesk.</p>

<h3>Paso 2: Obtén todos los pilares del modelo</h3>
<p>Añade el nodo <strong>All Elements of Category</strong> y conéctalo a un nodo <strong>Categories</strong> configurado en "Structural Columns" (Pilares estructurales). Esto devuelve una lista con todos los pilares del modelo.</p>

<h3>Paso 3: Crea los números de marca</h3>
<p>Usa el nodo <strong>List.Count</strong> para saber cuántos pilares hay. Luego usa <strong>List.Create</strong> y <strong>String.Concat</strong> para generar cadenas de texto como "P-01", "P-02", etc., con el nodo <strong>Code Block</strong>:</p>
<pre><code>"P-" + String.PadLeft(String(i+1), 2, "0");</code></pre>

<h3>Paso 4: Escribe el parámetro en Revit</h3>
<p>Conecta los elementos y los valores al nodo <strong>Element.SetParameterByName</strong>. Configura el nombre del parámetro como <strong>"Mark"</strong> (Marca). Ejecuta el script y observa cómo Revit actualiza las marcas de todos los pilares instantáneamente.</p>

<h2>Errores comunes al empezar con Dynamo</h2>
<p>Para que no pierdas tiempo en lo que yo ya perdí:</p>
<ul>
  <li><strong>"Nodo en rojo / error":</strong> 90% de las veces es un problema de tipos de datos. Un nodo espera un número y le estás pasando texto.</li>
  <li><strong>"Lista vacía":</strong> Verifica que los elementos que buscas existen en la vista activa o usa el filtro de categoría correcto.</li>
  <li><strong>"El script funciona pero no hace nada en Revit":</strong> Asegúrate de que el modo de ejecución sea "Automática" o haz clic en "Ejecutar".</li>
  <li><strong>Trabajar con subelementos de familias:</strong> algunos parámetros están en el tipo, no en la instancia. Usa <strong>Element.ElementType</strong> primero.</li>
</ul>

<h2>Recursos para seguir aprendiendo</h2>
<p>Una vez que domines lo básico, estas son las mejores fuentes:</p>
<ul>
  <li><strong>Dynamo Primer</strong> (dynamoprimer.com): documentación oficial con ejemplos</li>
  <li><strong>Dynamo BIM Forum</strong>: la comunidad más activa para resolver dudas</li>
  <li>El canal de YouTube de <em>The Revit Kid</em> tiene tutoriales en inglés muy claros</li>
</ul>
<p>Y si quieres ver cómo se combina Dynamo con Python para automatizaciones más avanzadas, revisa nuestra guía de <a href="/blog/revit-api-python-pyrevit-programacion-bim">Programación BIM con pyRevit</a>.</p>

<h2>Conclusión</h2>
<p>Dynamo es la puerta de entrada a la automatización BIM sin necesidad de saber programar código. Con los conceptos básicos que vimos hoy, ya puedes crear tu primera automatización real y empezar a ahorrar horas en tareas repetitivas.</p>
<p>El siguiente paso es practicar: abre Dynamo, repite el ejercicio de numeración que vimos, y luego intenta adaptar la lógica a otro parámetro que uses en tus proyectos.</p>`,
    key_question: '¿Cómo funciona Dynamo en Revit para principiantes?',
    key_answer: 'Dynamo es un entorno de programación visual que se integra con Revit. Permite automatizar tareas repetitivas como numeración de elementos, extracción de datos y colocación de objetos, sin necesidad de escribir código. Se trabaja conectando nodos con cables para crear flujos lógicos.',
    image_alt: 'Interfaz de Dynamo en Revit mostrando nodos conectados para automatizar la numeración de pilares estructurales en un proyecto BIM',
  },

  // ──────────────────────────────────────────────────────────────
  // POST 3: Civil 3D para carreteras — guía completa
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Civil 3D para Carreteras: Guía Completa Paso a Paso',
    slug: 'civil-3d-carreteras-guia-completa-paso-a-paso',
    category_id: CATS['civil-3d'],
    status: 'published',
    featured: false,
    published_at: daysAgo(6),
    tags: ['Civil 3D', 'Carreteras', 'Diseño Vial', 'Autodesk', 'Topografía'],
    meta_title: 'Civil 3D para Carreteras: Guía Completa 2025',
    meta_description: 'Aprende a diseñar carreteras en Civil 3D desde cero: superficies, alineamientos, perfiles, secciones transversales y generación de volúmenes.',
    excerpt: 'Civil 3D es el estándar para diseño vial en Perú. Esta guía te llevará desde la importación de topografía hasta la generación de volumetrías, con pasos claros y prácticos.',
    reading_time: 13,
    content: `<h2>¿Por qué Civil 3D domina el diseño vial peruano?</h2>
<p>Si trabajas en infraestructura vial en Perú —carreteras, trochas, proyectos de rehabilitación— es casi seguro que Civil 3D de Autodesk es el software que tienes o que te van a pedir. No es casualidad: es la herramienta que mejor integra topografía, diseño geométrico y cálculo de volúmenes en un solo entorno.</p>
<p>En esta guía voy a enseñarte el flujo completo de diseño de una carretera en Civil 3D, desde cero hasta la generación de volúmenes. Es la guía que me hubiera gustado tener cuando empecé.</p>

<h2>El flujo de trabajo en Civil 3D: visión general</h2>
<p>Antes de entrar en detalle, entiende el flujo completo:</p>
<ol>
  <li><strong>Superficie:</strong> importas los puntos topográficos y creas el modelo digital del terreno (TIN)</li>
  <li><strong>Alineamiento:</strong> trazas el eje de la carretera en planta (planta)</li>
  <li><strong>Perfil de terreno:</strong> extraes el perfil longitudinal del terreno desde la superficie</li>
  <li><strong>Perfil de diseño:</strong> diseñas la rasante (subida, bajada, curvas verticales)</li>
  <li><strong>Ensamblaje:</strong> defines la sección transversal típica (ancho de calzada, bermas, taludes)</li>
  <li><strong>Corredor:</strong> Civil 3D procesa todo lo anterior y genera el modelo 3D de la vía</li>
  <li><strong>Secciones transversales y volúmenes:</strong> calculas movimiento de tierras</li>
</ol>

<h2>Paso 1: Importar la topografía y crear la superficie</h2>
<p>La mayoría de proyectos en Perú trabajan con datos provenientes de levantamiento topográfico en formato CSV o TXT (Punto, Norte, Este, Cota, Descripción) o archivos LandXML del IGN.</p>
<p>En Civil 3D: <strong>Toolspace → Prospector → Surfaces → Create Surface</strong>. Elige "TIN Surface" y ponle un nombre descriptivo (ej: "Terreno Natural").</p>
<p>Luego importa los puntos: <strong>Definition → Point Files</strong> y selecciona el CSV. Civil 3D crea el TIN automáticamente. Verifica visualmente que no haya triángulos "extraños" en los bordes del levantamiento, que son un síntoma de puntos mal importados.</p>

<h2>Paso 2: Crear el alineamiento horizontal</h2>
<p>El alineamiento es el eje de tu carretera visto desde arriba. En Civil 3D se trabaja con tangentes (rectas) y curvas horizontales que respetan los parámetros del Manual de Carreteras del MTC.</p>
<p>Ve a <strong>Home → Create Design → Alignment → Create Alignment from Objects</strong> (si ya dibujas la polilínea en AutoCAD) o <strong>Alignment Creation Tools</strong> para dibujar directamente.</p>
<p>Puntos clave para carreteras en Perú:</p>
<ul>
  <li>Radio mínimo de curva según velocidad de diseño (Ver Tabla 302.01 del Manual MTC)</li>
  <li>Peralte máximo: 8% en carreteras de dos carriles según DG-2018</li>
  <li>Longitud mínima de tangente entre curvas: consultar la tabla correspondiente</li>
</ul>

<h2>Paso 3: Perfil de terreno y rasante</h2>
<p>Una vez tienes el alineamiento, extrae el perfil del terreno: <strong>clic derecho sobre el alineamiento → Sample Lines → Create Profile from Surface</strong>.</p>
<p>Luego crea la vista de perfil (Profile View) y dibuja la rasante. Aquí diseñas las pendientes y las curvas verticales (cóncavas y convexas) respetando límites del Manual MTC:</p>
<ul>
  <li>Pendiente máxima en zona montañosa: 10% (carreteras de segunda clase)</li>
  <li>Longitud mínima de curva vertical: la que garantice distancia de visibilidad de parada</li>
</ul>

<h2>Paso 4: Crear el ensamblaje (sección tipo)</h2>
<p>El ensamblaje define cómo se ve la sección transversal de tu carretera: calzada, bermas, cunetas, taludes de corte y relleno. Usa los subassemblies del catálogo de Civil 3D:</p>
<ul>
  <li><strong>LaneOutsideSuper:</strong> carril con peralte variable</li>
  <li><strong>BasicShoulder:</strong> berma lateral</li>
  <li><strong>BasicSideSlopeCutDitch:</strong> talud de corte con cuneta triangular</li>
  <li><strong>BasicSideSlope:</strong> talud de relleno</li>
</ul>

<h2>Paso 5: El corredor y las secciones</h2>
<p>El corredor es donde Civil 3D hace su magia: combina alineamiento + rasante + ensamblaje y genera el modelo 3D completo. <strong>Home → Create Design → Corridor</strong>.</p>
<p>Una vez el corredor está creado, genera las secciones transversales (<strong>Sample Lines</strong>) y el reporte de volúmenes (<strong>Compute Materials</strong>). Este reporte te da directamente el movimiento de tierras: corte, relleno y balance de masas.</p>

<h2>Errores frecuentes que dan dolores de cabeza</h2>
<ul>
  <li><strong>Corredor con huecos:</strong> ocurre cuando hay inconsistencias de alineamiento-rasante. Revisa que los perfiles de diseño cubran toda la longitud del alineamiento.</li>
  <li><strong>Volúmenes incorrectos:</strong> verifica que el intervalo de Sample Lines sea el adecuado (cada 20m en zonas curvas, cada 50m en tangentes).</li>
  <li><strong>Superficie del corredor diferente al terreno:</strong> asegúrate de usar el mismo sistema de coordenadas en toda la data topográfica.</li>
</ul>

<h2>Recursos complementarios</h2>
<p>El Manual de Diseño Geométrico de Carreteras DG-2018 del MTC es tu referencia obligatoria para cualquier proyecto vial en Perú. Está disponible gratuitamente en el sitio del MTC.</p>
<p>Si también usas Revit en tus proyectos, te recomiendo ver cómo se puede integrar Civil 3D con la metodología BIM en nuestra guía sobre <a href="/blog/que-es-bim-obligatorio-peru-2026">por qué BIM es obligatorio en el Perú desde 2026</a>.</p>

<h2>Conclusión</h2>
<p>Civil 3D tiene una curva de aprendizaje empinada al principio, pero una vez que entiendes el flujo Superficie → Alineamiento → Perfil → Corredor → Volúmenes, el proceso se vuelve muy lógico y eficiente.</p>
<p>El siguiente paso es practicar con un proyecto real: importa tu topografía, traza un alineamiento simple y llega hasta la generación del corredor. El primer corredor que construyas te enseñará más que cualquier curso.</p>`,
    key_question: '¿Cómo se diseña una carretera en Civil 3D paso a paso?',
    key_answer: 'El proceso en Civil 3D sigue 7 pasos: 1) Importar topografía y crear superficie TIN, 2) Crear alineamiento horizontal, 3) Extraer perfil de terreno, 4) Diseñar la rasante, 5) Crear el ensamblaje con la sección tipo, 6) Generar el corredor 3D, y 7) Calcular secciones transversales y volúmenes de movimiento de tierras.',
    image_alt: 'Diseño de carretera en Civil 3D mostrando el corredor vial 3D con la superficie del terreno, alineamiento horizontal, perfil y secciones transversales en Perú',
  },

  // ──────────────────────────────────────────────────────────────
  // POST 4: Análisis sísmico con ETABS — paso a paso
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Análisis Sísmico en ETABS: Guía Práctica con la Norma E.030',
    slug: 'etabs-analisis-sismico-norma-e030-guia-practica',
    category_id: CATS['analisis-estructural'],
    status: 'published',
    featured: false,
    published_at: daysAgo(3),
    tags: ['ETABS', 'Análisis Sísmico', 'E.030', 'Estructuras', 'Diseño Sísmico'],
    meta_title: 'ETABS: Análisis Sísmico con Norma E.030 Paso a Paso',
    meta_description: 'Configura correctamente el análisis sísmico en ETABS siguiendo la Norma E.030 de Perú: parámetros sísmicos, espectro de diseño, masa sísmica y verificación de derivas.',
    excerpt: 'La Norma E.030 es la piedra angular del diseño sísmico en Perú. En esta guía aprenderás a configurar ETABS correctamente para cumplir con todos sus requisitos.',
    reading_time: 12,
    content: `<h2>¿Por qué ETABS es el estándar para análisis sísmico en Perú?</h2>
<p>Perú es uno de los países con mayor actividad sísmica del mundo. El Cinturón de Fuego del Pacífico cruza nuestra costa, y cada año registramos cientos de sismos. Por eso, el análisis sísmico correcto no es opcional: es una obligación ética y legal para cualquier ingeniero civil estructural.</p>
<p>ETABS (Extended Three Dimensional Analysis of Building Systems) es el software de referencia para este trabajo. Su integración nativa con las normativas internacionales y su capacidad de modelado tridimensional lo hacen ideal para estructuras de concreto armado, acero y mixtas en Perú.</p>

<h2>Los parámetros sísmicos de la Norma E.030</h2>
<p>Antes de abrir ETABS, necesitas definir los parámetros sísmicos de tu proyecto según la RNE E.030:</p>
<ul>
  <li><strong>Zona sísmica (Z):</strong> Perú tiene 4 zonas. Lima está en Z4 (Z = 0.45g). Verifica tu ubicación en el mapa de la norma.</li>
  <li><strong>Factor de uso (U):</strong> depende de la categoría de la edificación (A1=1.5, A2=1.3, B=1.0, C=1.0)</li>
  <li><strong>Factor de suelo (S) y periodos Tp, TL:</strong> según el tipo de suelo del perfil geotécnico (S0, S1, S2, S3)</li>
  <li><strong>Factor de reducción sísmica (R):</strong> según el sistema estructural (Muros de concreto: R=6, Pórticos: R=8, Dual: R=7)</li>
  <li><strong>Factor de amplificación sísmica (C):</strong> función del periodo fundamental de la estructura</li>
</ul>

<h2>Paso 1: Definir el espectro de diseño en ETABS</h2>
<p>En ETABS ve a <strong>Define → Response Spectrum Functions → Add New Spectrum</strong>. Selecciona "User Defined" e ingresa los puntos del espectro Sa(T) según la fórmula de la E.030:</p>
<ul>
  <li>T &lt; Tp: C = 2.5</li>
  <li>Tp ≤ T ≤ TL: C = 2.5 × (Tp/T)</li>
  <li>T &gt; TL: C = 2.5 × (Tp × TL/T²)</li>
</ul>
<p>La ordenada espectral es: <strong>Sa = Z × U × C × S / R</strong></p>
<p>Genera al menos 30-40 puntos del espectro para cubrir el rango T = 0 a 4 segundos. Puedes automatizar esto en Excel o usando nuestra <a href="/blog/norma-e030-fuerza-cortante-basal-calculo">calculadora de Cortante Basal E.030</a>.</p>

<h2>Paso 2: Configurar la masa sísmica</h2>
<p>La masa que participa en el análisis sísmico no es solo el peso propio. Según la E.030, debes incluir:</p>
<ul>
  <li>100% de la carga muerta (CM)</li>
  <li>25% de la carga viva (CV) para uso general</li>
  <li>50% de la carga viva en almacenes</li>
  <li>100% de la carga de agua en depósitos</li>
</ul>
<p>En ETABS: <strong>Define → Mass Source → Add New Mass Source</strong>. Crea una fuente de masa con los factores correctos para cada caso de carga.</p>

<h2>Paso 3: Análisis modal espectral</h2>
<p>El análisis dinámico modal es el método preferido de la E.030. Configúralo en <strong>Define → Load Cases → Add New Load Case → Response Spectrum</strong>.</p>
<p>Puntos críticos:</p>
<ul>
  <li><strong>Número de modos:</strong> suficientes para capturar el 90% de la masa participante. Empieza con 15-20 modos para edificios hasta 10 pisos.</li>
  <li><strong>Dirección X e Y:</strong> analiza ambas direcciones por separado con el mismo espectro</li>
  <li><strong>Combinación modal:</strong> usa CQC (Complete Quadratic Combination) para estructuras con modos acoplados</li>
  <li><strong>Excentricidad accidental:</strong> la E.030 requiere ±0.05b adicional al análisis</li>
</ul>

<h2>Paso 4: Verificación de derivas (distorsión de entrepiso)</h2>
<p>Este es el chequeo más crítico de la E.030. Los límites máximos son:</p>
<table>
  <thead>
    <tr><th>Material</th><th>Deriva máxima (Δ/H)</th></tr>
  </thead>
  <tbody>
    <tr><td>Concreto armado</td><td>0.007</td></tr>
    <tr><td>Acero</td><td>0.010</td></tr>
    <tr><td>Albañilería</td><td>0.005</td></tr>
    <tr><td>Madera</td><td>0.010</td></tr>
  </tbody>
</table>
<p>La deriva que debes verificar es la <strong>inelástica</strong>: multiplica la deriva elástica de ETABS por 0.75×R (para análisis modal). Si las derivas superan el límite, necesitas rigidizar la estructura (muros, más secciones, contraventeos).</p>

<h2>Paso 5: Verificación de la fuerza cortante mínima</h2>
<p>La E.030 exige que la cortante dinámica no sea menor al 80% de la cortante estática equivalente (para estructuras regulares) o al 90% (para irregulares). Si es menor, amplifica todas las fuerzas sísmicas por el factor de escala correspondiente.</p>
<p>En ETABS esto se configura en el Scale Factor del caso de respuesta espectral.</p>

<h2>Errores comunes en el análisis sísmico con ETABS</h2>
<ul>
  <li><strong>Masa sísmica incorrecta:</strong> el error más frecuente. Olvidar incluir el 25% de CV o usar la masa equivocada en la dirección Z.</li>
  <li><strong>Espectro mal escalado:</strong> verificar siempre que el espectro esté en las unidades correctas (g o m/s²).</li>
  <li><strong>Modos insuficientes:</strong> si la masa participante acumulada es menor al 90%, el análisis es incompleto.</li>
  <li><strong>No verificar la cortante mínima:</strong> ETABS no te avisa automáticamente si la cortante dinámica es menor al mínimo normativo.</li>
</ul>

<h2>Conclusión</h2>
<p>Un análisis sísmico correcto en ETABS siguiendo la E.030 requiere atención a los parámetros sísmicos, una masa sísmica bien definida, el número correcto de modos y la verificación de derivas y cortante mínima.</p>
<p>Si quieres aprender a calcular la cortante basal manualmente para validar tus resultados de ETABS, revisa nuestra guía de <a href="/blog/norma-e030-fuerza-cortante-basal-calculo">Cortante Basal E.030 en 10 Minutos</a>.</p>`,
    key_question: '¿Cómo configurar el análisis sísmico en ETABS según la Norma E.030 de Perú?',
    key_answer: 'Para el análisis sísmico en ETABS con la E.030 peruana debes: 1) Definir el espectro de diseño con parámetros Z, U, S, C, R, 2) Configurar la masa sísmica (100%CM + 25%CV), 3) Realizar análisis modal espectral con CQC y excentricidad accidental, 4) Verificar derivas inelásticas (máx. 0.007 en concreto), y 5) Verificar cortante mínima dinámica (≥80% de la estática).',
    image_alt: 'Modelo estructural en ETABS de un edificio de concreto armado con el diagrama de análisis sísmico modal y verificación de derivas según la Norma E.030 del Reglamento Nacional de Edificaciones del Perú',
  },

  // ──────────────────────────────────────────────────────────────
  // POST 5: Python para ingenieros civiles — libs útiles
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Las 5 Librerías de Python que Todo Ingeniero Civil Debe Conocer',
    slug: 'python-librerias-esenciales-ingenieros-civiles',
    category_id: CATS['python'],
    status: 'published',
    featured: false,
    published_at: daysAgo(1),
    tags: ['Python', 'Ingeniería Civil', 'Automatización', 'NumPy', 'Pandas'],
    meta_title: '5 Librerías Python Esenciales para Ingenieros Civiles',
    meta_description: 'Descubre las librerías de Python más útiles para ingeniería civil: NumPy, Pandas, Matplotlib, SciPy y OpenPyXL para automatizar cálculos y reportes.',
    excerpt: 'Python tiene miles de librerías, pero solo necesitas dominar 5 para automatizar el 80% de tu trabajo en ingeniería civil. Te las presento con ejemplos reales.',
    reading_time: 10,
    content: `<h2>¿Por qué Python se está convirtiendo en herramienta estándar en ingeniería civil?</h2>
<p>Hace cinco años, hablar de Python en una oficina de ingeniería civil en Perú generaba miradas de extrañeza. Hoy, cada vez más proyectos de infraestructura, consultoras BIM y empresas constructoras buscan ingenieros civiles que sepan al menos las bases de programación.</p>
<p>Y tiene sentido: Python permite automatizar el procesamiento de datos topográficos, generar reportes en segundos, hacer análisis estadísticos de ensayos de suelo y conectarse con software como Revit, ETABS o Civil 3D mediante sus APIs.</p>
<p>Pero con miles de librerías disponibles, ¿por dónde empezar? Aquí van las 5 que realmente usarás en tu día a día.</p>

<h2>1. NumPy: la base de todo cálculo numérico</h2>
<p><strong>NumPy</strong> (Numerical Python) es la librería fundamental para operaciones matemáticas en Python. Trabaja con arreglos multidimensionales y operaciones vectorizadas que son muchísimo más rápidas que los bucles tradicionales.</p>
<p>En ingeniería civil la usarás para:</p>
<ul>
  <li>Operaciones con matrices de rigidez y masa en análisis matricial de estructuras</li>
  <li>Interpolación de datos topográficos o de ensayos de laboratorio</li>
  <li>Cálculo vectorial (momentos, fuerzas, reacciones)</li>
</ul>
<pre><code>import numpy as np

# Ejemplo: Cálculo de inercia de sección compuesta
b, h = 0.30, 0.60  # m
A = b * h
I = (b * h**3) / 12
print(f"Área: {A:.4f} m² | Inercia: {I:.6f} m⁴")</code></pre>

<h2>2. Pandas: dominio total de datos tabulares</h2>
<p><strong>Pandas</strong> es tu reemplazo a Excel para análisis de datos. Lee, procesa y exporta archivos CSV, Excel y bases de datos con pocas líneas de código.</p>
<p>Aplicaciones prácticas:</p>
<ul>
  <li>Procesamiento de datos de estación total (coordenadas, cotas, ángulos)</li>
  <li>Análisis estadístico de ensayos de resistencia de concreto</li>
  <li>Generación automática de cuadros de metrados desde modelos BIM exportados a CSV</li>
  <li>Control de calidad de compactación (registro de densidades por punto)</li>
</ul>
<pre><code>import pandas as pd

# Leer ensayos de resistencia de concreto
df = pd.read_excel("resistencias.xlsx")
df["f'c (MPa)"] = df["Carga (kN)"] / (3.14159 * (0.075**2))
print(df.describe())  # Estadísticas: media, desvío, mínimo, máximo
print(f"Resistencia promedio: {df[\"f'c (MPa)\"].mean():.1f} MPa")</code></pre>

<h2>3. Matplotlib: visualiza tus datos de forma profesional</h2>
<p><strong>Matplotlib</strong> es la librería estándar de graficación en Python. Con ella puedes crear gráficas de alta calidad para incluir en informes técnicos.</p>
<p>En ingeniería civil sirve para:</p>
<ul>
  <li>Graficar perfiles longitudinales de carreteras</li>
  <li>Curvas granulométricas de suelos</li>
  <li>Diagramas de momento flector y fuerza cortante en vigas</li>
  <li>Curvas de compactación (Proctor)</li>
  <li>Espectros sísmicos de respuesta</li>
</ul>
<pre><code>import matplotlib.pyplot as plt
import numpy as np

# Diagrama de momento flector en viga simplemente apoyada
L = 6.0  # m
w = 15.0  # kN/m
x = np.linspace(0, L, 100)
M = (w * x / 2) * (L - x)

plt.plot(x, M, 'b-', linewidth=2)
plt.fill_between(x, M, alpha=0.3)
plt.xlabel("Posición (m)")
plt.ylabel("Momento flector (kN·m)")
plt.title("Diagrama de Momento Flector")
plt.grid(True, alpha=0.3)
plt.savefig("DMF.png", dpi=150, bbox_inches='tight')</code></pre>

<h2>4. SciPy: análisis científico avanzado</h2>
<p><strong>SciPy</strong> extiende las capacidades de NumPy con algoritmos científicos avanzados. Para ingeniería civil, destaca en:</p>
<ul>
  <li><strong>scipy.linalg:</strong> resolución de sistemas de ecuaciones lineales (análisis matricial)</li>
  <li><strong>scipy.optimize:</strong> optimización de diseño (minimizar costo sujeto a restricciones de resistencia)</li>
  <li><strong>scipy.interpolate:</strong> interpolación de curvas granulométricas, perfiles de terreno</li>
  <li><strong>scipy.stats:</strong> pruebas estadísticas para control de calidad de materiales</li>
</ul>
<p>Un ejemplo clásico: resolver el sistema de ecuaciones de un pórtico plano simple con scipy.linalg.solve() en lugar de hacerlo a mano.</p>

<h2>5. OpenPyXL: automatiza reportes en Excel</h2>
<p><strong>OpenPyXL</strong> permite leer y escribir archivos Excel (.xlsx) desde Python. La combinación OpenPyXL + Pandas es imbatible para generar reportes automáticos.</p>
<p>Casos de uso reales:</p>
<ul>
  <li>Generar automáticamente el <strong>cuadro de metrados</strong> con fórmulas y formatos</li>
  <li>Llenar plantillas de <strong>control de calidad</strong> con datos de campo</li>
  <li>Crear reportes de <strong>ensayos de laboratorio</strong> con gráficas integradas</li>
  <li>Automatizar la generación de <strong>valorización de obra</strong> mensual</li>
</ul>
<pre><code>from openpyxl import load_workbook

wb = load_workbook("plantilla_metrados.xlsx")
ws = wb.active

# Escritura de metrados calculados
ws['D5'] = 24.50  # m³ de excavación masiva
ws['D6'] = 8.25   # m³ de concreto f'c=210
ws['D7'] = 1850   # kg de acero fy=4200

wb.save("metrados_completados.xlsx")
print("✅ Metrados generados correctamente")</code></pre>

<h2>¿Por dónde empezar?</h2>
<p>Si recién empiezas con Python en ingeniería civil, mi recomendación es:</p>
<ol>
  <li>Empieza con <strong>Pandas</strong>: abre un Excel de datos reales de tu trabajo y empieza a procesarlo con Pandas. La motivación inmediata te hará avanzar rápido.</li>
  <li>Agrega <strong>Matplotlib</strong> para visualizar lo que procesas.</li>
  <li>Aprende <strong>NumPy</strong> cuando necesites hacer cálculos numéricos más serios.</li>
  <li><strong>SciPy</strong> y <strong>OpenPyXL</strong> los irás incorporando según los necesites.</li>
</ol>
<p>Si ya conoces las bases de Python y quieres aplicarlo directamente a BIM, revisa nuestra guía de <a href="/blog/automatizacion-bim-python">Automatización BIM con Python</a>.</p>

<h2>Conclusión</h2>
<p>No necesitas ser programador experto para aprovechar Python en ingeniería civil. Con estas 5 librerías puedes automatizar el procesamiento de datos, generar reportes profesionales y hacer cálculos que antes tomaban horas en Excel.</p>
<p>El mejor momento para empezar fue ayer. El segundo mejor momento es ahora.</p>`,
    key_question: '¿Cuáles son las librerías de Python más útiles para ingenieros civiles?',
    key_answer: 'Las 5 librerías esenciales de Python para ingeniería civil son: NumPy (cálculo numérico y matrices), Pandas (procesamiento de datos tabulares), Matplotlib (gráficas técnicas profesionales), SciPy (análisis científico y optimización) y OpenPyXL (automatización de reportes en Excel).',
    image_alt: 'Código Python ejecutándose en un entorno de ingeniería civil mostrando análisis de datos estructurales con NumPy y Pandas, automatizando cálculos de metrados y resistencia de materiales',
  },
];

console.log(`\nIniciando inserción de ${POSTS.length} posts...`);

for (const post of POSTS) {
  const { data, error } = await supabase.from('posts').insert([post]).select('id, slug').single();
  if (error) {
    console.error(`❌ Error en "${post.slug}":`, error.message);
  } else {
    console.log(`✅ Creado: ${data.slug} (${data.id})`);
  }
}

console.log('\n✅ Proceso completado.');
