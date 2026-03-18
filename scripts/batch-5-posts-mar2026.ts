/**
 * batch-5-posts-mar2026.ts
 * Inserta 5 artículos técnicos — Content Engine — 17 Mar 2026
 * npx tsx scripts/batch-5-posts-mar2026.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales. Requerido: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getRandomPastDate(minDays: number, maxDays: number): string {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const posts = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ZAPATA AISLADA E.050 + E.060
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Cálculo de Zapata Aislada: E.050 + E.060 Paso a Paso',
    slug: 'calculo-zapata-aislada-e050-e060-paso-a-paso',
    excerpt: 'El 70% de los errores en cimentaciones vienen de ignorar la capacidad portante real del suelo. Guía práctica para diseñar zapatas aisladas combinando la norma E.050 y E.060 con ejemplos reales.',
    meta_title: 'Cálculo de Zapata Aislada E.050 + E.060 (Paso a Paso 2026)',
    meta_description: 'Diseña zapatas aisladas correctamente con la norma peruana E.050 (suelos) y E.060 (concreto). Incluye fórmulas, tabla de presiones y errores comunes a evitar.',
    key_question: '¿Cómo se calcula una zapata aislada según las normas peruanas E.050 y E.060?',
    key_answer: 'Se obtiene la capacidad portante del EMS (E.050), se dimensiona la zapata para que la presión de contacto no supere el admisible, y luego se diseña el acero de flexión y chequea el punzonamiento y cortante según E.060 ACI 318.',
    category_slug: 'normativa',
    tags: ['Zapata Aislada', 'E.050', 'E.060', 'Cimentaciones', 'Norma Peruana', 'Concreto Armado'],
    author: 'Ing. Miguel Rivera',
    reading_time: 9,
    status: 'published' as const,
    content: `<p>El expediente técnico llega a obra. El residente abre las láminas de cimentación y pregunta: <em>"¿Por qué la zapata del eje C-3 mide 2.20 x 2.20 m y la del B-2 solo 1.60 x 1.60 m si cargan prácticamente lo mismo?"</em> El calculista no está. Nadie tiene la memoria de cálculo impresa. Y la obra espera.</p>

<p>Ese problema tiene nombre: diseño de zapatas sin documentar el proceso. Esta guía te enseña a calcular una zapata aislada de principio a fin, con la norma E.050 para el suelo y la E.060 para el concreto, de manera que cualquier residente de obra pueda entender y verificar tus números.</p>

<h2>Paso 1 — Extraer la Capacidad Portante del EMS (E.050)</h2>

<p>Antes de dibujar una sola línea, necesitas el Estudio de Mecánica de Suelos (EMS). La norma E.050 es clara: el EMS es obligatorio para toda edificación. Sin él, estás diseñando en el aire.</p>

<p>Del EMS extraes la <strong>capacidad portante admisible (qa)</strong>, expresada en toneladas por metro cuadrado (t/m²) o kiloPascales (kPa). Los valores típicos en suelos de Lima y ciudades costeras peruanas oscilan entre 0.8 y 3.0 kg/cm².</p>

<p><strong>¡Ojo con esto:</strong> el EMS te da la capacidad portante a una profundidad de desplante (Df) específica. Si tu zapata va a Df = 1.20 m pero el EMS calculó la capacidad a 1.50 m, necesitas ajustar con la fórmula de Meyerhof o aplicar el factor de corrección por profundidad que te dé el geotecnista.</p>

<p>En Huancayo, Arequipa y ciudades de sierra, los suelos granulares compactos pueden ofrecer qa = 3.0 a 4.5 kg/cm², mientras que en zonas costeras con rellenos no controlados puedes encontrar qa = 0.5 kg/cm². No uses valores "de referencia" de Internet. Exige el EMS.</p>

<h2>Paso 2 — Predimensionamiento de la Planta</h2>

<p>La lógica es simple: el área de la zapata debe ser tal que la presión que ejerce sobre el suelo no supere la capacidad portante admisible.</p>

<pre><code>Area_requerida = P_servicio / qa

Donde:
P_servicio = Carga de servicio de la columna (ton)
qa         = Capacidad portante admisible (t/m²)
</code></pre>

<p>Para una columna con carga de servicio de 85 toneladas y un suelo con qa = 2.0 kg/cm² (= 20 t/m²):</p>

<pre><code>Area = 85 t / 20 t/m² = 4.25 m²
Lado = √4.25 ≈ 2.06 m → usar 2.10 x 2.10 m
</code></pre>

<p>Aquí viene el primer error clásico: confundir cargas de servicio con cargas últimas. La verificación de presión sobre el suelo se hace con cargas de <strong>servicio</strong> (sin factores de amplificación). El diseño del acero usa cargas <strong>últimas</strong> (con factores 1.4D + 1.7L según ACI 318, o 1.2D + 1.6L en versiones más recientes adoptadas en Perú).</p>

<p>Si usas cargas últimas para dimensionar el área de la zapata, sobredimensionarás. Si las usas para diseñar el acero con cargas de servicio, subdimiensionarás el refuerzo. La norma <a href="/blog/norma-e030-fuerza-cortante-basal-calculo">E.030 también exige revisar la estabilidad al volteo</a> bajo las combinaciones sísmicas, por lo que tendrás que revisar además la excentricidad de la resultante.</p>

<h2>Paso 3 — Verificar Presiones Reales (Con Momentos y Cortantes)</h2>

<p>Una columna no solo transmite carga axial. También transmite momento flector y, en edificios con muros de corte o irregularidades en planta, cortante basal. Ignorar esto es el segundo error mortal.</p>

<p>La presión real bajo la zapata se calcula como:</p>

<pre><code>σ = P/A ± M·c/I

Donde:
P = carga axial de servicio
A = área de la zapata (B x L)
M = momento de servicio en la base de columna
c = distancia al centroide (B/2 o L/2)
I = momento de inercia de la sección de la zapata (B·L³/12)
</code></pre>

<p>La presión máxima (σ_max) no debe superar qa. La presión mínima (σ_min) no debe ser negativa — si lo es, la zapata se despega del suelo y el modelo lineal ya no es válido. En ese caso necesitas redimensionar o cambiar a zapata excéntrica con viga de amarre.</p>

<blockquote>
<strong>⚠️ Ojo en obra:</strong> En edificios con sótano o en zonas de alta sismicidad como Lima, Ica o Arequipa, los momentos sísmicos en la base de columna pueden ser 3 a 5 veces mayores que los momentos por gravedad. Si calculas la zapata solo con carga vertical y un "momento de 2 toneladas-metro de regalo", te va a quedar chica bajo sismo. Pide siempre la envolvente completa de combinaciones de carga a tu calculista antes de dimensionar.
</blockquote>

<h2>Paso 4 — Diseño del Peralte (Control de Punzonamiento)</h2>

<p>El peralte (h) de la zapata se define principalmente por el chequeo de <strong>punzonamiento</strong> (cortante en dos direcciones). La sección crítica se ubica a una distancia d/2 de la cara de la columna, formando un perímetro b₀.</p>

<pre><code>Vu_punz = Pu - σu · (c1 + d)(c2 + d)

Donde:
Pu   = carga última total
σu   = presión última uniforme
c1,c2 = dimensiones de la columna
d    = peralte efectivo de la zapata
</code></pre>

<p>La resistencia de diseño al punzonamiento según E.060 / ACI 318 para concreto f'c = 210 kg/cm²:</p>

<pre><code>φVc = φ · 0.53√f'c · b₀ · d   (columna interior, β ≤ 2)

φ = 0.85 (factor de reducción ACI)
</code></pre>

<p>En la práctica, para zapatas de vivienda de 2 a 6 pisos en Perú, el peralte oscila entre 40 y 70 cm. Peraltes menores a 35 cm casi siempre fallan punzonamiento o dan relaciones h/d muy desfavorables.</p>

<p>Tienes que verificar también el <strong>cortante unidireccional</strong> (cortante por viga), cuya sección crítica está a distancia d de la cara de la columna. Si este cortante supera la capacidad del concreto, necesitas estribos — lo cual es inusual en zapatas estándar pero puede ocurrir en zapatas muy planas o con cargas altas concentradas.</p>

<h2>Paso 5 — Diseño del Acero de Flexión (E.060)</h2>

<p>La zapata trabaja en flexión como una losa en voladizo desde la cara de la columna. El momento de diseño se calcula en la cara de la columna:</p>

<pre><code>Mu = σu · (L_voladizo)² / 2 · B

L_voladizo = (B - c1) / 2
</code></pre>

<p>Con Mu se obtiene el área de acero requerida usando las ecuaciones de diseño a flexión del ACI 318 con f'c = 210 kg/cm² y fy = 4200 kg/cm² (acero de Aceros Arequipa o SiderPerú).</p>

<p>Siempre verifica que el acero calculado sea mayor que el <strong>acero mínimo</strong>:</p>

<pre><code>As_min = 0.0018 · B · h   (para T ≥ 16°C, acero corrugado fy=4200)
</code></pre>

<p>El espaciamiento máximo de barras en zapatas es el menor entre 3h y 45 cm. En la práctica, usar barras de 5/8" cada 20 cm en ambas direcciones es una configuración muy común para zapatas de vivienda de 4 a 6 pisos.</p>

<p>Para entender cómo modelar correctamente la cimentación en software estructural y evitar singularidades numéricas, revisa la guía de <a href="/blog/punzonamiento-cimentaciones-etabs-solucion">punzonamiento en cimentaciones en ETABS</a> donde detallo los errores más frecuentes de configuración.</p>

<h2>¿Y si el Suelo es Malo? Opciones Reales</h2>

<p>Si qa < 0.8 kg/cm² y la zapata te sale de dimensiones absurdas (digamos, 4.0 x 4.0 m para una sola columna), tienes tres alternativas reales:</p>

<ol>
  <li><strong>Zapata combinada</strong> — une dos columnas en una sola zapata. Reduce el área total y distribuye mejor las cargas.</li>
  <li><strong>Platea de cimentación</strong> — conecta todas las columnas. Se justifica cuando las zapatas individuales cubren más del 50% del área en planta.</li>
  <li><strong>Mejoramiento de suelo</strong> — relleno controlado, compactación o uso de pilotes. El geotecnista debe pronunciarse.</li>
</ol>

<p>No improvises en cimentación. Es la partida que no se ve después de la obra, pero es la que define si el edificio sobrevive un sismo o si se hunde 5 cm en 10 años. El costo de una falla de cimentación en Perú — entre juicios, reforzamientos y pérdida de reputación — es siempre mayor que hacer el EMS desde el inicio.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ETABS MUROS PANTALLA RIGIDEZ LATERAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'ETABS: Muros Pantalla para Control de Rigidez Lateral (E.030)',
    slug: 'etabs-muros-pantalla-rigidez-lateral',
    excerpt: 'Los muros de corte son el esqueleto sismorresistente de un edificio. Aprende a modelarlos correctamente en ETABS, verificar irregularidad torsional y cumplir la E.030 sin sobredimensionar.',
    meta_title: 'Muros Pantalla en ETABS: Control de Rigidez Lateral según E.030',
    meta_description: 'Guía técnica para modelar muros de corte en ETABS, verificar la rigidez lateral, controlar irregularidad torsional y cumplir la norma E.030 en edificios peruanos.',
    key_question: '¿Cómo se modelan y verifican los muros de corte en ETABS según la norma E.030?',
    key_answer: 'Se modelan como elementos Shell-Thin o Shell-Layered, se asigna un diafragma rígido por piso, y se verifica que el índice de rigidez torsional (RMR) sea menor a 1.3 en cada dirección de análisis según la E.030.',
    category_slug: 'analisis-estructural',
    tags: ['ETABS', 'Muros de Corte', 'E.030', 'Rigidez Lateral', 'Sismo', 'Irregularidad Torsional'],
    author: 'Ing. Miguel Rivera',
    reading_time: 8,
    status: 'published' as const,
    content: `<p>El modelo de ETABS ya está corriendo. Las derivas por sismo en X están bien — 5.2 por mil, dentro del límite de 7 por mil que exige la E.030. Pero en Y las derivas llegan a 9.8 por mil. El edificio falla. Y lo peor: el calculista ya había colocado dos muros en esa dirección. ¿Qué salió mal?</p>

<p>Casi siempre el problema no es la cantidad de muros, sino su <strong>ubicación relativa al centro de masa</strong>. Un muro en la periferia del edificio controla la deriva global, pero si no hay contrapartida en el lado opuesto, introduce una excentricidad que convierte cada sismo traslacional en un sismo con torsión. Y la torsión mata edificios.</p>

<h2>Cómo Modelar Muros en ETABS (Lo Que Nadie Te Dice)</h2>

<p>ETABS ofrece varias formas de modelar muros. La más común es el elemento <strong>Shell-Thin</strong> (delgado), adecuado para muros de concreto armado estándar donde la distribución de esfuerzos en el espesor no es crítica. Para muros de sótano con empuje lateral de tierra o muros muy gruesos (> 40 cm), usa <strong>Shell-Layered/Nonlinear</strong>, que permite definir capas de acero explícitas.</p>

<p>El flujo de modelado correcto es:</p>
<ol>
  <li>Define el espesor real del muro (no uses 20 cm por costumbre — revisa el predimensionamiento con h/25 a h/20 del entrepiso).</li>
  <li>Asigna el material concreto con f'c correcto. En Perú, f'c = 210 kg/cm² para viviendas y f'c = 280 kg/cm² para edificios de más de 10 pisos o con alta demanda sísmica.</li>
  <li>Mallado automático: activa el meshing de los paneles shell por piso. ETABS lo hace automáticamente si defines los niveles correctamente, pero verifica que cada panel quede subdividido en al menos 4 elementos por altura de entrepiso.</li>
  <li>Pier Labels: asigna etiquetas de pier a cada muro para obtener las fuerzas de corte y momentos por elemento individual en el Design Summary.</li>
</ol>

<h2>Diafragma Rígido: Cuándo Aplicarlo y Cuándo No</h2>

<p>El diafragma rígido es la simplificación que le dice a ETABS: "todos los nodos de este piso se mueven juntos como un cuerpo rígido". Es válido para losas macizas o aligeradas convencionales sin aberturas significativas.</p>

<p>El error clásico: asignar diafragma rígido en pisos con aberturas de más del 50% del área de losa (estacionamientos abiertos, pisos con doble altura, edificios con forma de L o U muy pronunciada). En esos casos, la losa no distribuye las fuerzas uniformemente y el modelo sobreestima la rigidez lateral real.</p>

<p>La <a href="/blog/interpretar-analisis-modal-masas-etabs-e030">revisión de los modos de vibración y masas participantes</a> es el primer diagnóstico que debes hacer después de asignar los diafragmas. Si el primer modo tiene alta participación torsional (Rz > 40%), el sistema de muros tiene un problema de distribución en planta, no de cantidad.</p>

<h2>Verificación de Irregularidad Torsional (E.030 Art. 3.6)</h2>

<p>La norma E.030 define irregularidad torsional cuando el cociente entre la deriva máxima y la deriva promedio de un piso supera 1.3 (Tipo 1) o 1.5 (Tipo 2 — extrema). Este cociente se llama <strong>Ratio Máximo de Deriva Relativa (RMDR)</strong> o simplemente índice torsional.</p>

<pre><code>RMDR = Δ_max / Δ_prom

Δ_max  = máxima deriva en un extremo del piso
Δ_prom = promedio de derivas en los dos extremos opuestos
</code></pre>

<p>En ETABS, verifica esto en: <em>Display > Show Tables > Analysis > Story Response > Story Drifts</em>. Extrae las derivas por piso en X e Y para las combinaciones sísmicas. Si RMDR > 1.3, tienes irregularidad y debes:</p>
<ul>
  <li>Aumentar el factor de irregularidad Φt en el cálculo de la cortante basal.</li>
  <li>Buscar reposicionar los muros para equilibrar la rigidez torsional.</li>
</ul>

<blockquote>
<strong>⚠️ Ojo en obra:</strong> En Perú, muchos proyectos residenciales de 6 a 12 pisos en Lima tienen irregularidad torsional no declarada en el expediente. El calculista revisa las derivas pero no siempre calcula el RMDR piso por piso. Durante una supervisión de obra, si notas que los muros están todos en uno de los lados del edificio (típico en departamentos con fachada libre de vidrio), pide que te muestren el chequeo de irregularidad torsional. Si no existe, el expediente está incompleto.
</blockquote>

<h2>Estrategia de Colocación de Muros</h2>

<p>No existe una fórmula mágica para ubicar los muros. Pero hay principios que funcionan:</p>

<ol>
  <li><strong>Simetría respecto al centro de masa:</strong> dos muros en lados opuestos de la planta son más efectivos que cuatro muros en el mismo lado.</li>
  <li><strong>Muros en L o T:</strong> un muro en L trabaja en las dos direcciones con la misma sección. Reduce la cantidad de elementos y concentra la rigidez de forma eficiente.</li>
  <li><strong>Longitud mínima efectiva:</strong> un muro de 1.0 m de longitud contribuye poco a la rigidez lateral. La experiencia indica que muros de menos de 1.5 m en edificios de más de 8 pisos actúan más como columnas que como muros de corte.</li>
  <li><strong>Discontinuidad vertical:</strong> si el muro no llega hasta la cimentación, ETABS redistribuirá las cargas en los elementos inferiores y puede aparecer una concentración de esfuerzos peligrosa en el nivel donde el muro termina.</li>
</ol>

<h2>Diseño del Acero de Muros (Brevemente)</h2>

<p>Una vez que el modelo pasa todas las verificaciones de deriva e irregularidad, el diseño del acero de los muros se hace con las fuerzas de corte (Vu) y momentos flectores (Mu) extraídos de los Pier Forces en ETABS.</p>

<p>El <strong>acero horizontal</strong> resiste el cortante. El <strong>acero vertical</strong> resiste el momento flector. En zonas de alta ductilidad (zonas sísmicas 3 y 4 del Perú), la E.060 exige elementos de borde (boundary elements) cuando la deformación de compresión en el extremo del muro supera 0.003.</p>

<p>Para el detalle completo del diseño por flexo-compresión de muros y la generación del diagrama de interacción, el flujo de <a href="/blog/etabs-analisis-sismico-norma-e030-guia-practica">análisis sísmico completo en ETABS con la E.030</a> te da el proceso paso a paso con los parámetros específicos para cada zona sísmica del país.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PYREVIT INSTALAR PRIMEROS SCRIPTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'PyRevit: Cómo Instalar y Crear tus Primeros Scripts en Revit',
    slug: 'pyrevit-instalar-primeros-scripts-revit',
    excerpt: 'Instala pyRevit en 10 minutos y escribe tu primer script funcional sin tocar C#. La guía más directa para ingenieros que quieren automatizar Revit con Python desde cero.',
    meta_title: 'PyRevit: Instalar y Primer Script en Revit (Guía 2026)',
    meta_description: 'Aprende a instalar pyRevit, configurar tu extensión corporativa y escribir tu primer script Python en Revit. Guía práctica para ingenieros BIM sin experiencia en programación.',
    key_question: '¿Cómo se instala pyRevit y se crea el primer script en Revit?',
    key_answer: 'Se descarga el instalador desde el repositorio oficial de pyRevit, se configura la ruta de extensión en las opciones, y se crea una carpeta con la estructura .extension/.tab/.panel/.pushbutton que contiene el archivo script.py con el código Python.',
    category_slug: 'python',
    tags: ['pyRevit', 'Python', 'Revit API', 'Automatización BIM', 'Scripts', 'BIM Manager'],
    author: 'Ing. Miguel Rivera',
    reading_time: 7,
    status: 'published' as const,
    content: `<p>Llevas tres horas renombrando 400 vistas de un proyecto en Revit. Una por una. Haciendo clic derecho, Rename, borrando el nombre anterior, escribiendo el nuevo nombre, Enter. Tres horas de la vida de un ingeniero que factura su tiempo. Eso tiene solución en exactamente 15 líneas de Python.</p>

<p>pyRevit es la herramienta que convierte ese tiempo perdido en un botón. Un clic. Listo. Y lo mejor: no necesitas saber C# ni configurar Visual Studio ni compilar ningún .dll. Solo Python y una estructura de carpetas.</p>

<h2>Instalación de pyRevit (10 minutos, sin sorpresas)</h2>

<p>Ve al repositorio oficial de pyRevit en GitHub (github.com/pyrevitlabs/pyRevit) y descarga el instalador .exe de la última versión estable. Al ejecutarlo, el instalador agrega automáticamente una pestaña "pyRevit" al Ribbon de Revit.</p>

<p>Hay un detalle crítico para 2025/2026: <strong>Revit 2025 y 2026 ya no incluyen IronPython 2.7</strong>. Si tienes Revit 2024 o anterior, tienes ambos motores disponibles. Si usas Revit 2025+, asegúrate de que pyRevit esté configurado para usar <strong>CPython 3.x</strong>. Puedes verificarlo en: <em>pyRevit tab → pyRevit Settings → CPython Engine</em>.</p>

<p>La diferencia práctica: con CPython 3, puedes usar librerías modernas como <code>pandas</code>, <code>requests</code> o <code>openpyxl</code> directamente desde tus scripts de Revit. Con IronPython 2.7 (el viejo motor), estás limitado a las librerías del framework .NET y Python 2.</p>

<h2>Estructura de Carpetas — El Corazón de pyRevit</h2>

<p>pyRevit usa una estructura de carpetas como menú. No hay archivos de configuración XML ni registros en el sistema. Solo carpetas con nombres específicos:</p>

<pre><code>MiEmpresa.extension/
├── Estructuras.tab/
│   ├── Herramientas.panel/
│   │   ├── RenombrarVistas.pushbutton/
│   │   │   ├── script.py
│   │   │   └── icon.png  (opcional, 16x16 px)
│   │   └── ExportarSchedules.pushbutton/
│   │       └── script.py
│   └── Modelos.panel/
│       └── ...
└── BIM.tab/
    └── ...
</code></pre>

<p>Cada sufijo tiene un significado:</p>
<ul>
  <li><code>.extension</code> — define el paquete completo</li>
  <li><code>.tab</code> — pestaña en el Ribbon de Revit</li>
  <li><code>.panel</code> — grupo de botones dentro de la pestaña</li>
  <li><code>.pushbutton</code> — botón simple que ejecuta un script</li>
  <li><code>.pulldown</code> — botón desplegable con sub-opciones</li>
  <li><code>.stack</code> — apila 2-3 botones verticalmente</li>
</ul>

<p>Para registrar tu extensión en pyRevit: <em>pyRevit tab → pyRevit Settings → Custom Extension Folders → Add Folder</em>. Apunta a la carpeta que contiene tu <code>.extension</code>. Luego haz Reload y tu pestaña aparecerá en Revit.</p>

<h2>Tu Primer Script Real — Renombrar Vistas en Masa</h2>

<p>Aquí el script que te ahorra tres horas. Añade prefijo "EST-" a todas las vistas estructurales del modelo:</p>

<pre><code># -*- coding: utf-8 -*-
from pyrevit import revit, DB, forms

doc = revit.doc

# Recopilar todas las vistas (excepto templates)
views = DB.FilteredElementCollector(doc)\
    .OfClass(DB.View)\
    .WhereElementIsNotElementType()\
    .ToElements()

views_to_rename = [v for v in views if not v.IsTemplate]

# Confirmar con el usuario
if not forms.alert(
    "Se renombrarán {} vistas con prefijo 'EST-'. ¿Continuar?".format(len(views_to_rename)),
    ok=True, cancel=True
):
    import sys; sys.exit()

# Transacción (obligatoria para modificar el modelo)
with revit.Transaction("Renombrar vistas estructurales"):
    for view in views_to_rename:
        nombre_actual = view.Name
        if not nombre_actual.startswith("EST-"):
            try:
                view.Name = "EST-" + nombre_actual
            except Exception as e:
                print("No se pudo renombrar '{}': {}".format(nombre_actual, e))

forms.alert("¡Listo! Vistas renombradas.", ok=True)
</code></pre>

<p>Puntos clave de este script:</p>
<ul>
  <li><code>revit.Transaction</code> — todo cambio al modelo de Revit debe estar dentro de una transacción. Si algo falla, Revit revierte automáticamente los cambios.</li>
  <li><code>forms.alert</code> — es el sistema de diálogos nativo de pyRevit. No necesitas importar tkinter ni wx.</li>
  <li>El <code>try/except</code> — algunas vistas tienen nombres protegidos por Revit (vistas de hoja activa, vistas de sistema). Sin el manejo de excepciones, el script fallaría en la primera vista conflictiva.</li>
</ul>

<blockquote>
<strong>⚠️ Ojo en obra:</strong> Antes de correr cualquier script de renombre o modificación masiva en un modelo compartido (workshared), <strong>sincroniza y haz un backup</strong>. pyRevit no tiene botón de deshacer para operaciones dentro de una transacción comprometida. Si el script rename sobreescribe 500 vistas con nombres incorrectos, revertir manualmente es una pesadilla. Prueba siempre en un modelo de prueba antes de ejecutar en producción.
</blockquote>

<h2>Distribución Corporativa — El Verdadero Poder</h2>

<p>Lo que convierte pyRevit en una herramienta corporativa es que puedes alojar tu extensión en una <strong>ruta de red compartida</strong> (servidor de la empresa o SharePoint). Cada proyectista apunta su pyRevit a esa ruta. Cuando actualizas un script en el servidor, todos los usuarios lo tienen disponible al hacer Reload — sin instalar nada, sin enviar archivos por email.</p>

<p>Para empresas con 10 a 50 modeladores en Revit, esto es el equivalente de tener un repositorio de herramientas centralizado. El BIM Manager agrega el botón, lo prueba, lo sube al servidor, y al día siguiente toda la oficina lo tiene.</p>

<p>Si te interesa comparar cuándo conviene usar pyRevit versus Dynamo para automatizar tareas, la guía de <a href="/blog/dynamo-vs-pyrevit-automatizacion-bim-2026">Dynamo vs pyRevit en 2026</a> detalla los casos de uso reales de cada herramienta con benchmarks de velocidad.</p>

<p>Y si quieres ver un ejemplo más avanzado — extraer todos los elementos estructurales y exportarlos a Excel con sus parámetros — revisa el post de <a href="/blog/guia-instalacion-primer-script-python-revit-2025">scripts Python para Revit 2025</a> donde construimos ese flujo completo con pandas.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. EXCEL METRADO ACERO VIGAS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Excel: Cálculo Automático de Metrado de Acero en Vigas',
    slug: 'excel-metrado-acero-calculo-automatico-vigas',
    excerpt: 'Deja de sumar varillas a mano. Aprende a construir una hoja Excel que calcula automáticamente el peso de acero en vigas, incluyendo empalmes, ganchos y desperdicios reales.',
    meta_title: 'Excel: Metrado de Acero en Vigas Automático (con Fórmulas)',
    meta_description: 'Construye un Excel para metrar acero de vigas de concreto armado automáticamente. Incluye empalmes por traslape, ganchos, peso por varilla y desperdicios según módulo comercial peruano.',
    key_question: '¿Cómo se calcula el metrado de acero de vigas en Excel automáticamente?',
    key_answer: 'Se crea una tabla con las varillas por viga (diámetro, cantidad, longitud neta), se suman los empalmes por traslape según E.060, se añaden los ganchos estándar y se multiplica por el peso unitario de la varilla según tablas de Aceros Arequipa o SiderPerú.',
    category_slug: 'excel',
    tags: ['Excel', 'Metrados', 'Acero', 'Vigas', 'E.060', 'Presupuesto de Obra'],
    author: 'Ing. Miguel Rivera',
    reading_time: 7,
    status: 'published' as const,
    content: `<p>El residente entrega el metrado de acero de las vigas del quinto piso. Son 3,240 kg. El almacenero dice que ya se consumieron 3,890 kg y todavía faltan 6 vigas. La diferencia — 650 kg — sale del bolsillo del contratista. Y el error estaba en la hoja de Excel: alguien no contabilizó los empalmes por traslape.</p>

<p>El metrado de acero en vigas es la partida más fácil de equivocar en un presupuesto porque tiene muchas variables pequeñas que se acumulan. Este post te muestra cómo construir un Excel que las capture todas automáticamente.</p>

<h2>La Estructura Básica de la Hoja</h2>

<p>Una hoja de metrado de acero funcional necesita estas columnas mínimas:</p>

<pre><code>| Elemento | Piso | Eje | Tipo varilla | Ø (pulg) | N° | L_neta (m) | Empalme (m) | L_total (m) | Kg/ml | Peso (kg) |
</code></pre>

<p>Donde:</p>
<ul>
  <li><strong>L_neta</strong> — longitud de la varilla sin empalmes, medida en el plano de fierro</li>
  <li><strong>Empalme</strong> — longitud adicional por traslape (calculada automáticamente según el diámetro)</li>
  <li><strong>L_total</strong> = L_neta + Empalme</li>
  <li><strong>Kg/ml</strong> — peso unitario por metro lineal según tabla de fabricante</li>
</ul>

<h2>Tabla de Pesos Unitarios (No Inventes Este Número)</h2>

<p>Este es el error número uno: usar el peso teórico calculado por el área nominal de la varilla. Las varillas corrugadas reales pesan más que el teórico porque las corrugaciones añaden material. Usa siempre la tabla oficial de Aceros Arequipa o SiderPerú:</p>

<pre><code>| Diámetro | Nominal  | Peso real (Aceros Arequipa) |
|----------|----------|----------------------------|
| 3/8"     | 9.52 mm  | 0.560 kg/m                 |
| 1/2"     | 12.7 mm  | 0.994 kg/m                 |
| 5/8"     | 15.9 mm  | 1.552 kg/m                 |
| 3/4"     | 19.1 mm  | 2.235 kg/m                 |
| 1"       | 25.4 mm  | 3.973 kg/m                 |
</code></pre>

<p>En Excel, crea una hoja auxiliar llamada "Tabla_Pesos" con estos valores y usa <code>BUSCARV</code> o <code>XLOOKUP</code> para traer el peso automáticamente según el diámetro ingresado en la hoja principal.</p>

<h2>Calcular los Empalmes por Traslape (Lo Que Siempre se Olvida)</h2>

<p>La norma E.060 define la longitud de empalme mínima por traslape en función del diámetro (db) y la clase de empalme. Para acero en tracción con barras en una sola capa (el caso más común en vigas de edificios):</p>

<pre><code>Clase A: Ld · 1.0  (si el área provista ≥ 2 × área requerida)
Clase B: Ld · 1.3  (todos los demás casos)

Ld (longitud de desarrollo) ≈ 40·db para f'c=210, fy=4200
</code></pre>

<p>Para simplificar en Excel, puedes usar esta tabla de empalmes mínimos prácticos para vigas de edificio con f'c = 210 kg/cm² y fy = 4200 kg/cm²:</p>

<pre><code>| Diámetro | Empalme Clase B (m) |
|----------|---------------------|
| 3/8"     | 0.50 m              |
| 1/2"     | 0.65 m              |
| 5/8"     | 0.80 m              |
| 3/4"     | 1.00 m              |
| 1"       | 1.30 m              |
</code></pre>

<p>En tu hoja Excel, la columna "Empalme" debe calcularse automáticamente multiplicando el número de empalmes de esa varilla por la longitud de traslape correspondiente al diámetro. Muchos metradistas ponen empalme = 0 porque "la viga no tiene empalme en plano". Error: los empalmes están en los planos de fierrería, no siempre visibles en los planos de encofrado.</p>

<blockquote>
<strong>⚠️ Ojo en obra:</strong> En vigas continuas de más de 8 metros, la varilla comercial de 9 metros (estándar en Perú) no alcanza. Obligatoriamente hay un empalme. El fierrero lo hace por práctica aunque no esté en el plano. Si tu metrado no contempla ese traslape, te van a faltar kilos en almacén. Siempre pregunta al fierrero jefe cuántos empalmes hace por viga antes de cerrar el presupuesto.
</blockquote>

<h2>Los Ganchos Estándar — Otro Olvidado</h2>

<p>Las barras longitudinales en los extremos de la viga tienen ganchos estándar de 90° o 180° según el detalle. Cada gancho agrega longitud a la varilla:</p>

<pre><code>Gancho 90° = 12·db + extensión de 4·db
Gancho 180° = 4·db + extensión de 4·db

Para 5/8" (db = 1.59 cm):
  Gancho 90° ≈ 12 × 1.59 + 4 × 1.59 ≈ 25.4 cm ≈ 0.25 m por extremo
</code></pre>

<p>Agrega una columna "Ganchos" en tu hoja con la longitud adicional por extremos. Para vigas con gancho en ambos extremos, multiplica por 2.</p>

<h2>El Desperdicio Real</h2>

<p>El factor de desperdicio no es un número fijo. Depende del módulo comercial de la varilla y de la longitud promedio de las varillas del elemento.</p>

<p>Si tus vigas tienen varillas de 4.50 m de longitud neta y el módulo comercial es 9 m, el retazo es de 4.50 m (50% de desperdicio potencial si no se reutiliza). Para evitar ese desperdicio, el fierrero las corta a 4.50 m y el retazo de 4.50 m se usa en otra viga. Pero si la siguiente viga necesita 5.0 m, ya no alcanza y el retazo es scrap.</p>

<p>La forma correcta de calcular el desperdicio real es con un <strong>optimizador de corte</strong>. Hay add-ins de Excel para esto o puedes programarlo en VBA/Python. Para proyectos medianos y grandes, la diferencia entre el 5% estándar y el desperdicio real puede ser del 2-3% del total de acero — en proyectos de 500 toneladas, eso son 10-15 toneladas.</p>

<p>Para automatizar completamente este proceso extrayendo las longitudes directamente de Revit sin transcripción manual, el flujo de <a href="/blog/metrados-acero-corrugado-errores-presupuesto-obra">errores comunes en metrados de acero corrugado</a> explica cómo conectar las Schedules de Revit con tu hoja Excel.</p>

<p>Y si quieres la plantilla lista para usar, la <a href="/recursos">tienda de recursos de FreeCloud</a> tiene la Plantilla Excel de Metrados lista con todas estas fórmulas integradas, incluyendo el optimizador básico de corte para módulos de 9 y 12 metros.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. NAVISWORKS CLASH DETECTION TUTORIAL COMPLETO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Navisworks Manage: Clash Detection Completo (MEP vs Estructura)',
    slug: 'navisworks-clash-detection-tutorial-completo',
    excerpt: 'La detección de interferencias en Navisworks va mucho más allá de apretar "Run Test". Aprende a configurar las reglas de choque correctas, eliminar falsos positivos y gestionar el reporte de incidencias como un VDC Manager real.',
    meta_title: 'Navisworks Clash Detection: Tutorial Completo MEP vs Estructura',
    meta_description: 'Guía completa de Clash Detection en Navisworks Manage: configurar reglas Hard y Clearance, filtrar falsos positivos, exportar reportes BCF y gestionar incidencias MEP con el equipo de obra.',
    key_question: '¿Cómo se configura correctamente el Clash Detection en Navisworks para proyectos MEP?',
    key_answer: 'Se definen pruebas separadas por par de disciplinas (estructura vs MEP, MEP vs arquitectura), se configuran reglas Hard Clash para colisiones físicas y Clearance Clash para espacios operativos mínimos, y se exportan las incidencias en formato BCF para gestión en plataformas colaborativas.',
    category_slug: 'bim-peru',
    tags: ['Navisworks', 'Clash Detection', 'MEP', 'VDC', 'BIM Coordinación', 'BCF'],
    author: 'Ing. Miguel Rivera',
    reading_time: 8,
    status: 'published' as const,
    content: `<p>Son las 11 de la mañana. La reunión de coordinación lleva 90 minutos. El VDC Manager abre Navisworks y proyecta el reporte: <em>3,847 interferencias</em>. El ingeniero MEP resopla. El estructurista cruza los brazos. El cliente pregunta si el proyecto puede seguir. Y el VDC Manager no sabe por dónde empezar porque el 80% de esas interferencias son falsos positivos que él mismo configuró mal.</p>

<p>Ese escenario —que cualquier coordinador BIM con más de un año en la industria peruana ha vivido— tiene solución antes de correr el primer test. La clave está en la configuración, no en el software.</p>

<h2>La Diferencia Entre Hard Clash y Clearance Clash</h2>

<p>Navisworks ofrece cuatro tipos de prueba de interferencia. Los dos que realmente importan en coordinación MEP-Estructura son:</p>

<ul>
  <li><strong>Hard Clash:</strong> dos objetos se solapan físicamente en el espacio. Un tubo de 8" de diámetro atraviesa el alma de una viga. Eso es un Hard Clash. Es el choque más evidente y el más fácil de detectar.</li>
  <li><strong>Clearance Clash:</strong> dos objetos no se tocan, pero hay menos espacio entre ellos del mínimo requerido para operación y mantenimiento. Una válvula de control junto a una columna con 15 cm de separación cuando el estándar de mantenimiento pide 45 cm. Eso es un Clearance Clash invisible para el Hard Clash.</li>
</ul>

<p>El error más común es correr solo Hard Clash y pensar que el modelo está coordinado. Los Clearance Clashes son los que generan los RFIs (Request For Information) más caros en obra, porque se descubren cuando el instalador ya llegó al sitio y no puede girar la llave.</p>

<h2>Configuración de Pruebas por Par de Disciplinas</h2>

<p>No hagas una sola prueba "todo contra todo". Eso genera la avalancha de interferencias inútiles que vimos en el ejemplo inicial. La práctica correcta es crear una prueba por cada par de disciplinas que necesitas coordinar:</p>

<ol>
  <li><strong>Estructura vs MEP Sanitario</strong> — vigas, losas y columnas contra tuberías de agua, desagüe y contra incendios.</li>
  <li><strong>Estructura vs MEP Mecánico</strong> — estructura contra ductos HVAC, fan coils, chillers.</li>
  <li><strong>Estructura vs MEP Eléctrico</strong> — estructura contra bandejas eléctricas, tuberías conduit.</li>
  <li><strong>Sanitario vs Mecánico</strong> — los sistemas MEP entre sí, especialmente en techos de sótano y pasillos técnicos.</li>
  <li><strong>Arquitectura vs MEP</strong> — falsos cielos, tabiques livianos vs equipos y tuberías.</li>
</ol>

<p>En Navisworks, cada prueba tiene su propia configuración de Selection A (disciplina 1) y Selection B (disciplina 2). Usa los Sets de selección o los modelos NWC importados como criterio de selección para mantener las pruebas limpias.</p>

<h2>Cómo Eliminar Falsos Positivos (El 80% del Trabajo Real)</h2>

<p>Un Hard Clash reportado entre el acero de refuerzo y el encofrado de una viga es un falso positivo — son elementos del mismo sistema que se superponen por diseño. Un choque entre el modelo estructural y la cimentación modelada en el mismo archivo es otro falso positivo.</p>

<p>Las herramientas para filtrar:</p>

<ol>
  <li><strong>Reglas de Clash:</strong> en la configuración de cada prueba, activa las reglas para ignorar choques entre objetos del mismo archivo, elementos del mismo grupo, o elementos con el mismo valor en un parámetro específico (ej: mismo "System Type" en elementos MEP).</li>
  <li><strong>Status de Interferencia:</strong> una vez corrida la prueba, clasifica manualmente los falsos positivos como "Aprobado" o "No en revisión". Navisworks los recuerda en la siguiente ejecución.</li>
  <li><strong>Tolerancia de Distancia:</strong> para Hard Clash, configura una tolerancia de -0.02 m (2 cm). Esto ignora los choques donde los objetos apenas se tocan por redondeo numérico en el modelado.</li>
</ol>

<blockquote>
<strong>⚠️ Ojo en obra:</strong> En Perú, la mayoría de proyectos MEP se modelan por subcontratistas distintos con coordinadas de origen diferentes. Antes de correr cualquier Clash Test, verifica que todos los modelos NWC estén en el <strong>mismo sistema de coordenadas</strong>. Si el modelo de arquitectura tiene su origen en el punto (0,0,0) y el modelo MEP tiene el suyo a 500,000 m al norte (un error de coordenadas geográficas sin geolocalizar), Navisworks reportará miles de interferencias entre todos los elementos porque los modelos no están alineados. Esto lo descubrirás en 5 segundos si activas la vista 3D de todos los modelos antes de correr el primer test.
</blockquote>

<h2>Gestión de Incidencias con BCF</h2>

<p>El flujo moderno de coordinación BIM no usa el reporte PDF de Navisworks como documento de trabajo. Usa el formato <strong>BCF (BIM Collaboration Format)</strong>, un estándar abierto que almacena cada interferencia con su vista 3D guardada, su estado, el responsable asignado y los comentarios del equipo.</p>

<p>Desde Navisworks puedes exportar las interferencias como BCF y abrirlas en:</p>
<ul>
  <li><strong>BIMTrack</strong> — plataforma colaborativa en la nube, con dashboard de estado por disciplina</li>
  <li><strong>Revizto</strong> — viewer 3D + gestión de issues en tiempo real, popular en proyectos grandes de Lima</li>
  <li><strong>Solibri</strong> — para revisar normas y reglas BIM adicionales</li>
  <li>Directamente en Revit con el plugin BCF Manager — el modelador ve la vista del choque y lo corrige sin salir de Revit</li>
</ul>

<p>El estándar de trabajo es: cada interferencia tiene un responsable, una fecha de resolución y un estado (Abierto / En revisión / Resuelto / Aprobado). Sin eso, el reporte de Navisworks es solo una foto bonita para el cliente.</p>

<h2>Qué Hacer Con las Interferencias Que No Se Pueden Resolver</h2>

<p>No todos los choques tienen solución arquitectónica. A veces el tubo principal de 12" tiene que cruzar por donde está la viga porque no hay otra ruta. En esos casos, la solución no es BIM — es ingeniería: viga con pase preformado, tubo en manga, o rediseño de la viga con aligeramiento del alma.</p>

<p>Estas decisiones deben quedar documentadas en el BCF con la solución aprobada por el calculista estructural y el especialista MEP. Sin esa firma digital en el issue, la obra puede rechazar el trabajo del instalador porque "no aparece en los planos".</p>

<p>Para entender el flujo completo de coordinación Open BIM y cómo los formatos IFC se integran con Navisworks para proyectos con normativa peruana, revisa el post de <a href="/blog/open-bim-vs-closed-bim-ifc-formato">Open BIM vs Closed BIM</a> donde explicamos qué formatos acepta cada plataforma y cuáles son compatibles con los requerimientos del Plan BIM Perú.</p>

<p>Y si quieres ver los errores conceptuales más frecuentes en coordinación VDC peruana — incluyendo el caso del reporte con 3,000 interferencias inútiles — el post de <a href="/blog/navisworks-choques-clash-detection-paradoja">la paradoja de Navisworks</a> te da el contexto completo de por qué el Clash Detection mal configurado hace más daño que bien.</p>`,
  },
];

async function run() {
  console.log('\n🚀 Content Engine — Batch 5 posts (17 Mar 2026)\n');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError || !categories) {
    console.error('❌ Error leyendo categorías:', catError);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories.forEach((c) => (catMap[c.slug] = c.id));

  console.log(`✅ Categorías: ${Object.keys(catMap).join(', ')}\n`);
  console.log('─'.repeat(60));

  for (const post of posts) {
    const categoryId = catMap[post.category_slug];
    if (!categoryId) {
      console.warn(`⚠️  Categoría "${post.category_slug}" no encontrada — usando fallback`);
    }

    const { category_slug, ...rest } = post;
    const publishedAt = getRandomPastDate(3, 14);

    const payload = {
      ...rest,
      category_id: categoryId || Object.values(catMap)[0],
      published_at: publishedAt,
      featured_image: null,
    };

    const { error } = await supabase
      .from('posts')
      .upsert([payload], { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error insertando "${post.slug}":`, error.message);
    } else {
      console.log(`✅ Publicado: ${post.slug}`);
      console.log(`   "${post.title}"`);
      console.log(`   Fecha: ${publishedAt.substring(0, 10)} | Cat: ${post.category_slug} | ${post.reading_time} min\n`);
    }
  }

  console.log('─'.repeat(60));
  console.log('🎉 Batch completo. 5 artículos inyectados en Supabase.');
  console.log('👉 Siguiente: npx tsx scripts/generate-featured-images.ts');
}

run().catch((e) => {
  console.error('Fatal:', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
