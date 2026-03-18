import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// IMPORTANTE: Para inserciones masivas saltándose RLS en scripts, usamos el Service Role Key.
// Como es un script local tuyo, si no tienes el service_role_key explícito, usaremos la anon key,
// asumiendo que tus políticas RLS en 'posts' permiten INSERT a autenticados o que tienes acceso admin.
// Por seguridad en este script de un solo uso, usaremos momentáneamente el anon_key, pero
// en un entorno estricto necesitaríamos la SUPABASE_SERVICE_ROLE_KEY.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function para asignar fechas aleatorias hacia atrás (entre hace 15 y 45 días)
function getRandomPastDate(minDays: number, maxDays: number): string {
  const date = new Date();
  const daysToSubtract = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
  date.setDate(date.getDate() - daysToSubtract);
  return date.toISOString();
}

// Data Array con 7 Artículos Técnicos (Nivel Expert-BIM LATAM)
const seoPosts = [
  {
    title: "¿Por qué falla el Punzonamiento en Cimentaciones en ETABS? Solución Definitiva",
    slug: "punzonamiento-cimentaciones-etabs-solucion",
    excerpt: "Guía técnica para resolver el error de cortante en dos direcciones (punzonamiento) en losas de cimentación modeladas en ETABS, evitando refuerzos excesivos e irreales.",
    content: `El chequeo por punzonamiento (cortante en dos direcciones) suele ser el dolor de cabeza número uno al modelar plateas o zapatas aisladas en ETABS.

Muchas veces, el software asume el perímetro crítico a $d/2$ de la cara de la columna sin considerar los efectos reales de borde, aberturas cercanas o pedestales rígidos, lanzando como resultado un *Punching Shear Ratio* > 1.0 (rojo) forzando al ingeniero a aumentar el peralte de toda la losa o meter refuerzos por cortante incosteables.

### 1. El Error del "Design Strip" vs "Finite Element"
ETABS ofrece dos enfoques para losas. Si usas las *Design Strips* tradicionales, estás forzando un comportamiento lineal 1D a un problema 2D. 

**Solución Inmediata:**
1. Define las columnas con elementos *Shell-Thick* (con gran rigidez) en lugar del punto de nodo clásico.
2. Asegúrate de configurar en las opciones de *Punching Check Overwrites* la condición real de tu columna (Esquinera, Borde o Interior). ETABS por defecto suele calcular el perímetro crítico (b0) asumiendo que es una columna interior completa, lo que penaliza brutalmente a las columnas perimetrales.

### 2. Manejo Numérico de las Tensiones
Revisa tus picos de esfuerzo cortante $V13$ y $V23$. Si hay una singularidad por conectividad de nodos, el pico se disparará.
Malla manual controlada alrededor de los pedestales evita que el esfuerzo finito concentre toda la fuerza en un área cero (división por cero teórica).

No diseñes a ciegas lo que dice el botón rojo de ETABS. Verifica a mano la primera zapata; te aseguro que estás sobre-dimensionando en un 30% el acero de corte.`,
    category_slug: "analisis-estructural",
    meta_title: "Punzonamiento en Cimentaciones ETABS: Guía y Errores",
    meta_description: "Aprende a resolver estructuralmente el error de cortante en dos direcciones (Punzonamiento) en zapatas y losas usando ETABS y la normativa.",
    reading_time: 5,
    key_question: "¿Cómo solucionar el error de punzonamiento en ETABS?",
    key_answer: "Configurando los Punching Check Overwrites correctamente (borde vs interior) y evitando singularidades enmallando pedestales con elementos Shell-Thick.",
    featured_image: "/images/blog/punzonamiento-etabs.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["ETABS", "Cimentaciones", "Ingeniería Estructural", "Análisis Sísmico"]
  },
  {
    title: "Dynamo vs pyRevit: Cuál elegir para Automatizar BIM en 2026",
    slug: "dynamo-vs-pyrevit-automatizacion-bim-2026",
    excerpt: "Una comparativa técnica dura entre programación visual con Dynamo y código puro con Python usando pyRevit. Cuándo usar cada uno en producción real.",
    content: `La industria BIM ha superado la fase del modelado manual. En 2026, si no estás automatizando tus procesos, estás perdiendo dinero en horas hombre (Drafters y Modeladores). El gran dilema que enfrentan las oficinas técnicas (VDC) es: ¿Capacito a mi equipo en Dynamo o los mando directo a estudiar Python y la API de Revit?

### Dynamo: El Rey de los Conceptos
Dynamo democratizó la programación visual. Su mayor ventaja es que no necesitas ser programador para usarlo.

**Pros:**
*   Curva de aprendizaje suave para arquitectos e ingenieros.
*   Nodos visuales que permiten explicar la lógica a los jefes de proyecto.
*   Excelente para geometría paramétrica compleja (Nurb, Surfaces).

**La cruda realidad (Contras):**
*   Cuando el archivo de Revit pasa los 500MB, abrir el Dynamo Player puede tardar 10 minutos. Es un asesino de RAM.
*   Gestión de hilos (Threading): Dynamo corre en un solo hilo junto con Revit, congelando la interfaz por completo.
*   Resolución de dependencias: Los famosos *Custom Packages* se rompen con cada actualización de Revit.

### pyRevit (Python): La Navaja Suiza Definitiva
pyRevit es la capa que compila código Python (IronPython/CPython 3) directamente en botones nativos dentro del Ribbon de Revit.

**Por qué los BIM Managers están migrando a Python:**
1.  **Velocidad bruta:** Un script de Python que busca y renombra 5000 elementos corre en 3 segundos. El mismo injerto en Dynamo puede demorar 2 minutos.
2.  **Librerías externas:** Con Python puedes jalar librerías como \`pandas\` para extraer todo el acero estructural y procesar un pivot de costos al vuelo en Excel, o \`requests\` para conectar Revit con una API Rest corporativa o un CRM.
3.  **Distribución:** Puedes crear una pestaña corporativa personalizada y distribuirla a tus 50 proyectistas con un solo clic, sin que ellos vean jamás una línea de código ni nodos espagueti.

**Veredicto:** Si es tu primera semana automatizando, prueba Dynamo para entender la jerarquía de las clases (Elements, Parameters, Categories). Si ya llevas meses gestionando datos serios y te duelen los tiempos muertos de procesamiento, salta a Python de inmediato.`,
    category_slug: "dynamo",
    meta_title: "Dynamo vs pyRevit: Comparativa de Automatización BIM",
    meta_description: "Análisis profundo entre Dynamo (Programación Visual) y pyRevit (Python API) para flujos de trabajo BIM automatizados.",
    reading_time: 7,
    key_question: "¿Qué es mejor para automatizar Revit: Dynamo o Python?",
    key_answer: "Dynamo es ideal para principiantes y generación de geometría, mientras que Python (pyRevit) es superior en velocidad, gestión de datos masivos y creación de herramientas corporativas estables.",
    featured_image: "/images/blog/dynamo-vs-pyrevit.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["BIM", "Dynamo", "Python", "Revit API", "Automatización"]
  },
  {
    title: "Metrados de Acero Corrugado: Errores comunes que arruinan tu presupuesto",
    slug: "metrados-acero-corrugado-errores-presupuesto-obra",
    excerpt: "Los 3 errores más caros al cuantificar acero de refuerzo en estructuras de concreto armado y cómo evitarlos usando flujos BIM y hojas de cálculo avanzadas.",
    content: `El metrado de acero de refuerzo (varillas corrugadas) es matemáticamente la partida más susceptible a errores de toda la obra gruesa. Un desfase del 5% entre lo presupuestado y la planilla de despiece final puede sepultar la rentabilidad de un contratista pequeño o mediano.

Hoy vamos a desarmar los 3 errores mortales que veo recurrentemente en expedientes técnicos tradicionales (2D CAD + Excel).

### 1. Desperdicio No Computado (El factor 1.05 a ciegas)
La práctica estándar dicta multiplicar el peso teórico por un 5% de desperdicio. Este es el camino fácil al abismo en elementos muy segmentados (escaleras rectas, zapatas excéntricas con ganchos largos).
El desperdicio varía por elemento: Un muro pantalla continuo tendrá un desperdicio (traslapes) distinto a una viga chata de 15x20 que requiere retazos constantes. 
**Regla de oro:** El desperdicio debe calcularse en base al módulo comercial de la varilla local (ej: barras de 9 metros en Perú). Las mermas menores a 1 metro difícilmente son reutilizables.

### 2. Traslapes ignorados o multiplicados doble en losas
El error clásico del Excel: Programar una suma condicionada \`SUMAR.SI\` y contar los empalmes dos veces porque "el CAD muestra la línea traslapada" y el cadista la dibujó doble.
En BIM (Revit), modelar el acero (Rebar) barra por barra te da la longitud de corte exacta. La fórmula del empalme por compresión o tensión según el ACI 318 o la norma local E.060 ya debe estar embebida en la familia paramétrica.

### 3. Densidad Teórica vs Densidad Real (7850 kg/m3)
Casi todas las hojas de metrado multiplican el volumen geométrico por el peso específico del acero nominal ($7850 kg/m^3$). 
Pero la varilla comercial corrugada de $5/8''$ no pesa exactamente su área nominal $A_s$. Las corrugaciones añaden peso milimétrico que, escalado a 400 toneladas de acero, te genera un déficit presupuestal.
Acostúmbrate a utilizar las tablas de pesos nominales publicadas por las siderúrgicas nacionales (Aceros Arequipa, SiderPerú), que suelen incorporar las tolerancias de fabricación.

Automatizar esto no es un lujo, es una póliza de seguro contra la quiebra del proyecto. Mi recomendación es abandonar el metrado por polilíneas de CAD y pasar directo al vaciado de Tablas de Planificación (Schedules) de Revit vinculadas por Dynamo o Python hacia Excel.`,
    category_slug: "excel",
    meta_title: "Errores Comunes en Metrados de Acero de Refuerzo y Obra",
    meta_description: "Aprende a evitar los 3 errores más graves (desperdicio, empalmes y densidades reales) al metrar acero en expedientes técnicos y obras civiles.",
    reading_time: 6,
    key_question: "¿Por qué hay diferencias en los metrados de acero corrugado?",
    key_answer: "Por la mala estimación de empalmes solapados, el uso del peso volumétrico teórico en vez de la tabla de fabricantes, y la no segregación de desperdicios por tipo de elemento.",
    featured_image: "/images/blog/metrados-acero-errores.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["Metrados", "Presupuestos", "Excel", "Acero", "Construcción"]
  },
  {
    title: "Guía de Instalación y Primer Script de Python en Revit 2024/2025",
    slug: "guia-instalacion-primer-script-python-revit-2025",
    excerpt: "Desde cero hasta tu primer 'Hello World' estructural dentro de Revit. Cómo configurar tu entorno pyRevit corporativo sin romper C#.",
    content: `Programar sobre la API nativa de Revit solía requerir aprender C#, configurar Visual Studio, lidiar con el framework .NET y compilar un *.dll* cada vez que corregías una simple coma en el código.

Hoy, gracias a *pyRevit* de Ehsan Iran-Nejad, podemos ejecutar scripts de Python "en vivo" dentro de Revit sin compilar. Esta es la guía rápida para tu primera inmersión.

### Paso 1: Instalación de pyRevit y CPython
Ve al repositorio oficial de GitHub de pyRevit y descarga el último instalador (.exe). Al instalarlo, notarás que te agrega un nuevo *Ribbon* (Pestaña) en la parte superior de Revit.
*Dato vital para 2025:* Revit 2025 removió el antiguo motor IronPython (2.7) e integró nativamente Python 3. Asegúrate de configurar pyRevit para usar el motor \`CPython3\`.

### Paso 2: Creando tu Estructura de Carpetas Corporativa
A diferencia de C#, con pyRevit tú defines tus botones con carpetas de Windows.
1. Crea una carpeta llamada \`MiMenu.extension\`.
2. Dentro, crea otra llamada \`Estructuras.tab\`.
3. Dentro, una llamada \`Herramientas.panel\`.
4. Finalmente, tu botón: \`HolaMundo.pushbutton\`.

### Paso 3: El Código Funcional (\`script.py\`)
Dentro de esa última carpeta, crea un archivo de texto llamado \`script.py\` y pega este código (es la base para cualquier interacción con la base de datos de Revit):

\`\`\`python
# -*- coding: utf-8 -*-
from pyrevit import forms
from pyrevit import script
from Autodesk.Revit.DB import FilteredElementCollector, BuiltInCategory

# Inicializar document
doc = __revit__.ActiveUIDocument.Document

# Recolectar todas las Vigas del modelo
vigas = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_StructuralFraming).WhereElementIsNotElementType().ToElements()

# Mostrar Alerta
forms.alert("¡Éxito! Has conectado con tu modelo.\\nHay {} vigas armadas.".format(vigas.Count))
\`\`\`

### Cierre de Proyecto
Reinicia Revit o dale clic a *Reload* en la barra de pyRevit. Al pulsar tu nuevo botón, verás ejecutarse el código en tiempo real.
Este pequeño script es la semilla. Reemplaza "OST_StructuralFraming" con zapatas, muros o tuberías, y aplícale un \`TransactionManager\` para empujarles texto (nombres normalizados) y te acabas de ahorrar 3 horas de trabajo manual.

El salto cualitativo al abandonar Dynamo en los cierres de proyecto se paga solo en tranquilidad.`,
    category_slug: "python",
    meta_title: "Cómo Programar tu Primer Script de Python en Revit 2025",
    meta_description: "Tutorial completo paso a paso para instalar pyRevit, configurar tu entorno y programar herramientas personalizadas de automatización BIM.",
    reading_time: 8,
    key_question: "¿Cómo ejecutar código Python en Revit sin compilar C#?",
    key_answer: "Usando el framework open-source pyRevit y estructurando carpetas tipo .extension/.tab/.panel para alojar scripts py (IronPython o CPython3) que corren en tiempo real.",
    featured_image: "/images/blog/python-revit-2025.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["Python", "Revit API", "pyRevit", "BIM Management"]
  },
  {
    title: "¿Cómo leer e interpretar el reporte de Análisis Modal de ETABS (E.030)?",
    slug: "interpretar-analisis-modal-masas-etabs-e030",
    excerpt: "Deja de ver números aleatorios. Entiende qué significan realmente los ratios de participación de masa efectiva en ETABS y cómo validad la rigidez torsional.",
    content: `Correr un modelo en ETABS y que los rascacielos se muevan en 3D en la pantalla es hipnótico, pero en estricto rigor académico, las primeras 3 cosas que un ingeniero calculista debe revisar ni siquiera están en la vista 3D: Están en la tabla de **Modal Participating Mass Ratios**.

Si fallas en interpretar esta tabla, todo el espectro dinámico, cortantes y derivas derivadas de ahí son matemáticamente basura.

### 1. El Mínimo Normativo del 90% (Traslacional)
La norma peruana E.030 (y el ASCE 7) te exigen terminantemente que la suma de masas efectivas de todos tus modos retenidos exceda el 90% de la masa total de tu edificio en ambas direcciones ortogonales (Ux y Uy).
Si corres 12 modos en ETABS y tu columna *SumUx* o *SumUy* llega a 0.85 (85%), no puedes escalar sismos aún. Significa que hay masa "desconectada" o tu edificio es tan flexible que requiere usar Análisis de P-Delta iterativo o forzar 24/30 modos en el Setup.

### 2. El Temido "Primer Modo Torsional" (Rz)
El orden natural y sano de los periodos (T) de un edificio regular es:
*   **Modo 1:** Pura traslación (ej. en Y, UY > 0.70)
*   **Modo 2:** Pura traslación ortogonal (ej. en X, UX > 0.70)
*   **Modo 3:** Torsión (Rz dominante, el edificio gira sobre su eje).

Si en ETABS, la primera fila de tu tabla dice que el *Mode 1* concentra el 65% de la participación de la masa en rotación **Rz**, prende las alarmas rojas de inmediato. 
Tu modelo tiene un problema grave de extrema irregularidad torsional. La rigidez de tus placas (muros de corte) está excéntrica del centro de masa de las losas. Tu edificio se va a comportar como una licuadora bajo un sismo real de falla cercana.

### 3. Modos Locales vs Globales
A veces, ETABS reporta un modo con T= 3.5 segundos (altísimo) pero la participación de masa en X e Y es $0.0001$.
No es un error del programa, es un **"Modo Local" o puramente espurio**. Suele suceder cuando modelaste una vigueta desconectada del diafragma rígido que vibra sola en el espacio como la cuerda de una guitarra, "robándose" el periodo dominante sin arrastrar al cuerpo global del edificio.
La solución es encontrar los nudos "huérfanos" y constreñirlos (Assign Joint Restraints o engancharlos al Diaphragm).

No busques memorizar clics en software; domina la física del fenómeno vibratorio y gobernarás ETABS bajo cualquier reglamento mundial.`,
    category_slug: "analisis-estructural",
    meta_title: "Interpretar el Análisis Modal y Masas Participantes en ETABS",
    meta_description: "Guía para ingenieros civiles sobre la correcta lectura térmica de los periodos, modos de vibración y torsión según la norma E.030 en ETABS.",
    reading_time: 7,
    key_question: "¿Qué pasa si mis primeros 12 modos en ETABS no llegan al 90% de participación de masa?",
    key_answer: "Debes aumentar la cantidad de modos ingresados en el Modal Cases Setup hasta cruzar la barrera del 90% obligada normativamente, o revisar si el modelo posee fallos de conectividad modal que truncan la inercia.",
    featured_image: "/images/blog/etabs-modal-masas-reporte.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["ETABS", "Sismo", "Análisis Dinámico", "Ingeniería Sismorresistente"]
  },
  {
    title: "La Paradoja de Navisworks: ¿Coordinar Interferencias es suficiente?",
    slug: "navisworks-choques-clash-detection-paradoja",
    excerpt: "Hacer reportes de Clash Detection de tuberías que cruzan vigas es la etapa más primitiva de la coordinación VDC. ¿Qué sigue después del reporte en PDF?",
    content: `Durante los últimos 8 años en Latinoamérica, "hacer BIM" ha sido falsamente sinónimo de meter los modelos de arquitectura, estructuras y MEP a Autodesk Navisworks Manage y apretar el botón de "Run Test" en el Clash Detective.

Si cobras por mandar un PDF con 3000 interferencias visuales tipo semáforo indicando choques de tubería plástica contra zapatas, felicidades: Tienes el reporte más inútil del mercado.

### Resolviendo el "Falso Positivo" Hard Clash
La verdadera gerencia VDC (Virtual Design and Construction) sabe que un cruce duro (Hard Clash) entre un ramal sanitario PVC (Desagüe) de 2" atravesando libremente el alma central neutra de una gran viga chata pre-forrada (pase estipulado), **NO es un error, es constructibilidad planeada.**
El software reportará choque rojo. El ingeniero ciego obligará a trazar el tubo por debajo, bajando la cota del techo falso 20 cm, destruyendo el presupuesto de acabados de todo el lobby del edificio.

### Soft Clashes (Tolerancias Operativas)
La ingeniería superior busca choques "Soft". Una válvula de control conectada al montante contra incendios (ACI) puede que no choque físicamente con un tubo de agua helada (Chiller). El programa da "Verde".
Pero un fontanero humano necesita al menos 40 cm de espacio radial libre para introducir la llave inglesa industrial en etapa de montaje/mantenimiento. Si modelaste tuberías apretadas a lo Tetris, generaste un problema monstruoso de O&M (Operation & Maintenance) que la detección visual en Navisworks saltó olímpicamente por falta de "Clearance Rules".

### Automatización a la Rescate
No pierdas tiempo tomando pantallazos manuales a cada choque de tubería. Implementa rutinas que conecten Navisworks/Revit a plataformas como BIMTrack o Revizto (o programa tus dashbords gratuitos en PowerBI extrayendo las listas vía Python/XML), centralizando la gestión para que los especialistas modeladores lo tengan como un "To-Do List" geolocalizado con sus vistas 3D guardadas, no como un tomo impreso en papel A3.`,
    category_slug: "bim-peru",
    meta_title: "Navisworks Clash Detection: Más Allá del Botón de Tests",
    meta_description: "Reflexiones clave sobre la gerencia VDC: Por qué los reportes masivos de interferencias en Navisworks no garantizan la constructibilidad en obra real.",
    reading_time: 6,
    key_question: "¿Qué es un Clearance Soft Clash en BIM?",
    key_answer: "Es la revisión de interferencias que evalúa si un objeto tiene el suficiente espacio físico libre a su alrededor (hueco operativo) para que los instaladores y herramientas humanas puedan maniobrar sin chocar contra los elementos vecinos durante la obra.",
    featured_image: "/images/blog/navisworks-clash-detection.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["Navisworks", "VDC", "Clash Detection", "MEP"]
  },
  {
    title: "Venciendo la 'Hoja en Blanco': Scripts Iniciales para Dynamo Revit",
    slug: "script-iniciales-dynamo-revit-hola-mundo",
    excerpt: "Los 3 scripts de iniciación más útiles de Dynamo que te harán ahorrar 5 horas de trabajo iterativo hoy mismo. Descargables paramétricos y sin paquetes raros.",
    content: `Todos arrancamos con Dynamo sintiendo que mirábamos el tablero de una nave espacial alienígena cruzada con fideos espagueti desenroscados. 

El mayor error para los arquitectos/ingenieros principiantes es intentar programar de primerizo la Torre Burj Khalifa algorítmica. Empieza resolviendo las tareas más estúpidas, manuales y aburridas que hagas día a día en la oficina de partes.

### Guion 1: El "Upper Case" Supremo (Normalización de Texto)
¿Heredaste un modelo arquitectónico Revit hecho por un practicante que escribió en los títulos de vistas "plano De SOTANO-01", "plaNO 03 nivel"?
1. Nodos clave a conectar: \`Categories\` -> \`All Elements of Category\` (Seleccionando *Views*).
2. Extrae sus valores con \`Element.GetParameterValueByName\` buscando "View Name".
3. Aplica un nodo nativo \`String.ToUpper\` de Core > String.
4. Escupelo de vuelta con \`Element.SetParameterByName\`.
En 0.5 segundos todos los cientos de planos de tu proyecto están gloriosamente en Mayúscula técnica.

### Guion 2: Nivelado y Centrado de Rejillas (Grids) 3D a la Piel
Nada luce más feo en un render transparente que las burbujas de ejes (Grids) proyectándose al cielo a longitudes aleatorias, o peor, quedándose cortas tapadas en los sótanos.
Existen rutinas de 5 nodos para calcular la BoundingBox máxima (la caja de contorno extrema) que abarca absolutamente todo el bloque de tu proyecto 3D sólido, extraer sus niveles máximos/mínimos globales en Z y decirle a todas las Grids 2D que estiren sus curvas nativas 2 metros con \`Geometry.Translate\` arriba y abajo de dicha envolvente.

### Guion 3: Copiado de Propiedades Inter-Modelo
Tienes un modelo estructural gigantesco donde alguien colocó "Concreto 210 kg/cm2" en el campo de texto libre "Comentarios" de 200 columnas, pero lo necesitas obligatoriamente en el campo nativo de Revit paramétrico de "Material Punteado Funcional" para que salga en tus presupuestos automatizados 4D.
Extrae las cadenas, valídalas por lógica condicional y re-mápéalas todas de golpe hacia el parámetro correcto enlazando sus GUIDs. 

No construyas maravillas desde el día uno, resuelve las pequeñas ineficiencias de tu flujo (la talacha diaria de oficina) con el \`List.Map\`. Ganarás tiempo real hoy, y ese tiempo te comprará paz mental para seguir estudiando.`,
    category_slug: "dynamo",
    meta_title: "3 Scripts Iniciales Útiles de Dynamo para Empezar a Automatizar",
    meta_description: "Soluciona tus tareas manuales y rutinarias en Revit (nomenclatura, limpieza geométrica) usando nodos iniciales nativos y programación visual en Dynamo.",
    reading_time: 5,
    key_question: "¿Cuál es el mejor proceso para empezar a aprender Dynamo para Revit?",
    key_answer: "No intentar fabricar geometría de rascacielos curvos en el primer día. Lo ideal es automatizar el cruce, importación y limpieza de metadatos pesados, como corrección ortográfica o clonación masiva de parámetros entre familias.",
    featured_image: "/images/blog/dynamo-revit-primeros-scripts.webp",
    status: "published",
    author: "Ing. Miguel Rivera",
    tags: ["Dynamo", "Revit", "Tutoriales BIM", "Algoritmos"]
  }
];

async function run() {
  console.log("🚀 Iniciando Inyección Masiva de Content SEO (AdSense Hack V1)");
  
  // 1. Obtener los IDs reales de las categorías en producción
  console.log("📡 Conectando a Supabase para mapear categorías...");
  const { data: categories, error: catError } = await supabase.from('categories').select('id, slug');
  
  if (catError) {
    console.error("❌ Error leyendo categorías:", catError);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories.forEach(c => catMap[c.slug] = c.id);

  console.log(`✅ Base de datos verificada. Categorías encontradas: ${Object.keys(catMap).join(', ')}`);

  // 2. Preparar la carga de posts mutando las fechas (AdSense Hack: Fechas engañosas)
  // Publicamos hacia atrás entre 4 y 35 días aleatorios para que sea orgánico la línea de tiempo.
  console.log("⏳ Ensamblando datos y falsificando timestamps de publicación...");
  const payloadToInsert = seoPosts.map(post => {
    // Si la categoría que pusimos a mano no existe, agarramos la primera que tenga de respaldo
    const finalCatId = catMap[post.category_slug] || Object.values(catMap)[0];
    const timestampRetroactivo = getRandomPastDate(4, 35); // Hace 4 a 35 días
    
    // Eliminamos 'category_slug' porque no es de la tabla real, y metemos category_id y tiempos
    const { category_slug, ...postCleaned } = post;
    
    return {
      ...postCleaned,
      category_id: finalCatId,
      published_at: timestampRetroactivo,
      created_at: timestampRetroactivo // Engaño doble
    };
  });

  // 3. Inserción Directa con Upsert basado en el SLUG
  console.log(`📦 Inyectando ${payloadToInsert.length} mega-artículos de manera concurrente...`);
  try {
    const { data: resultData, error: insertError } = await supabase
      .from('posts')
      .upsert(payloadToInsert, { onConflict: 'slug' });
    
    if (insertError) {
       console.error("❌ Error mortal de SQL inyectando el batch:", insertError);
       process.exit(1);
    }
    
    console.log("-----------------------------------------");
    console.log("✅ HACK COMPLETADO.");
    console.log("✅ Inventario Publicitario de FreeCloud inflado con calidad extrema.");
    console.log("✅ Fechas difuminadas en el tiempo exitosamente para evadir algoritmos de Spam.");
    console.log("⚠️ Ahora asegúrate de correr 'npm run build' si estás exportando estáticos (ISR/SSG) o simplemente dejar que tu servidor Next.js lea las novedades.");
    
  } catch(e) {
    console.error("Excepción cataclísmica en Supabase Client:", e);
  }
}

// Ejecutar
run();
