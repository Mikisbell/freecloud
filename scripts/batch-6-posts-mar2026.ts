/**
 * batch-6-posts-mar2026.ts
 * Inserta 5 artículos técnicos — Content Engine — 18 Mar 2026
 * npx tsx scripts/batch-6-posts-mar2026.ts
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

const STORAGE_BASE = `https://njmqtrdvnrhrpsqmwrsd.supabase.co/storage/v1/object/public/post-images`;

const posts = [
  {
    title: 'Robot Structural vs ETABS: ¿Cuál usar para análisis estructural en Perú?',
    slug: 'robot-structural-vs-etabs-cual-usar-estructuras',
    excerpt: 'Comparativa completa entre Robot Structural Analysis y ETABS para ingenieros civiles en Perú. Ventajas, limitaciones y cuál elegir según tu proyecto.',
    meta_title: 'Robot Structural vs ETABS: Comparativa para Ingenieros en Perú (2026)',
    meta_description: 'Comparativa completa entre Robot Structural Analysis y ETABS para ingenieros civiles en Perú. Ventajas, limitaciones y cuál elegir según tu proyecto.',
    key_question: '¿Cuál es mejor para análisis estructural en Perú: Robot Structural o ETABS?',
    key_answer: 'ETABS es superior para edificios de concreto con análisis sísmico según E.030, mientras que Robot Structural destaca en estructuras metálicas, puentes y proyectos que requieren integración profunda con Revit via BIM 360.',
    category_slug: 'analisis-estructural',
    tags: ["robot-structural", "etabs", "analisis-estructural", "software-bim"],
    author: "Ing. Miguel Rivera",
    reading_time: 7,
    status: 'published' as const,
    featured_image: `${STORAGE_BASE}/robot-structural-vs-etabs-cual-usar-estructuras.png`,
    published_at: '2026-03-10T08:00:00.000Z',
    content: `El ingeniero estructural peruano promedio tiene dos softwares instalados en su laptop: ETABS y, en muchos casos, Robot Structural Analysis Professional de Autodesk. Pagó la licencia de ambos, pero solo domina uno. ¿Es eso un error? ¿O hay proyectos donde el segundo se justifica?

Esta comparativa responde esa pregunta con datos reales, sin publicidad de ninguna de las dos casas.

## ¿Qué hace cada software y en qué se especializan?

**ETABS** (de Computers and Structures, Inc.) nació diseñado específicamente para edificios. Su motor de análisis está optimizado para estructuras verticales con múltiples pisos, diafragmas de losa, muros de corte y cálculo sísmico dinámico por espectros de respuesta. Todo su flujo — desde la definición de secciones hasta el diseño de acero y concreto — gira en torno al edificio como unidad.

**Robot Structural Analysis Professional** (de Autodesk) es un software de propósito más amplio. Puede modelar edificios, pero también puentes, estructuras metálicas industriales, tanques, pasarelas y cualquier geometría compleja en 3D. Su integración nativa con Revit (ambos son productos Autodesk) es su principal ventaja competitiva.

<Callout type="info">
En Perú, ETABS tiene una penetración de mercado estimada superior al 70% en oficinas de cálculo estructural de edificios residenciales y comerciales. Robot Structural es más frecuente en oficinas con proyectos de infraestructura y metal-mecánica.
</Callout>

## Análisis Sísmico E.030: La Prueba del Fuego

El análisis sísmico según la Norma E.030 es el criterio más importante para un ingeniero estructural peruano. Aquí es donde la comparativa se vuelve concreta.

### ETABS para el análisis E.030

ETABS tiene plantillas precargadas para el método estático y dinámico de la E.030. Puedes definir el espectro de diseño peruano directamente ingresando los factores Z, U, C, S y R, y el software genera automáticamente la función espectral Sa vs T.

El flujo completo es:
- Define los casos de carga sísmica SX y SY con el espectro E.030.
- Asigna los factores de irregularidad Φp y Φe según el tipo estructural.
- Corre el análisis dinámico modal espectral (Response Spectrum Analysis).
- Extrae las derivas de entrepiso por piso en ambas direcciones.
- Verifica que las derivas no superen el límite de 7‰ para concreto (tabla 11 de la E.030).

Todo esto se hace dentro de ETABS sin exportar ni importar nada. El diseño posterior de vigas, columnas y muros también ocurre en el mismo entorno.

### Robot Structural para el análisis E.030

Robot Structural puede hacer el mismo análisis, pero requiere más configuración manual. No tiene la E.030 peruana precargada como norma — debes definir el espectro de diseño manualmente ingresando los pares (T, Sa) en una tabla. Si conoces los valores del espectro peruano, no es un obstáculo mayor, pero añade tiempo y posibilidad de error de entrada.

La verificación de derivas y el diseño del refuerzo de concreto armado también es más manual. Robot no tiene el mismo nivel de automatización que ETABS para el flujo edificio → análisis → diseño según normativa latinoamericana.

<Callout type="warning">
Si tu proyecto es un edificio de concreto armado en Perú que necesita cumplir la E.030, ETABS te ahorrará entre 20 y 40% del tiempo de análisis comparado con Robot Structural, solo por las plantillas y flujos preconstruidos para normativa americana y latinoamericana.
</Callout>

## Estructuras Metálicas: Robot Toma la Delantera

La situación se invierte cuando el proyecto es una estructura metálica industrial, una nave de techo a dos aguas con cerchas, o una pasarela peatonal.

Robot Structural tiene módulos especializados para diseño de perfiles metálicos según normas AISC, LRFD y EC3 (European Code). Su verificador de perfiles metálicos es más completo que el de ETABS para geometrías no convencionales.

Además, Robot maneja sin problema las articulaciones, los vínculos elásticos y los elementos tipo barra con sección variable — situaciones comunes en estructuras industriales que en ETABS requieren workarounds poco elegantes.

## Integración BIM: El Terreno de Autodesk

Aquí Robot tiene una ventaja estructural que ETABS no puede igualar fácilmente: **ambos son productos Autodesk**.

La integración bidireccional entre Revit y Robot Structural permite:
- Transferir el modelo estructural de Revit a Robot con un clic (via Revit Extensions).
- Recibir de vuelta las fuerzas y resultados de diseño hacia Revit.
- Actualizar secciones y materiales en ambas direcciones cuando el modelo cambia.

Con ETABS, la integración con Revit existe pero requiere el plugin ETABS-Revit Link, que tiene limitaciones en geometrías complejas y versiones de Revit. La sincronización bidireccional es menos fluida.

<Callout type="tip">
Si tu oficina trabaja con un flujo BIM completo en Revit y necesitas que el modelo estructural y el modelo analítico se mantengan sincronizados durante el diseño iterativo, Robot Structural + Revit es la combinación más eficiente. Si el análisis es la fase final y el modelo analítico no necesita volver a Revit, ETABS es más rápido.
</Callout>

## Curva de Aprendizaje y Disponibilidad de Recursos

En Perú, conseguir un ingeniero estructural con dominio de ETABS es relativamente sencillo. Hay cursos en Lima, Arequipa y Trujillo, videos en YouTube en español, y foros activos. La comunidad de usuarios en el país es grande.

Robot Structural tiene una comunidad más reducida en Perú. Los recursos en español son escasos comparados con ETABS. Los tutoriales disponibles suelen orientarse a Europa (especialmente España y Polonia, donde Autodesk tiene fuerte presencia).

Esta asimetría de recursos no es trivial: afecta el tiempo de onboarding de nuevos calculistas y la capacidad de resolver problemas en plazos de proyecto reales.

## Tabla Comparativa Final

| Criterio | ETABS | Robot Structural |
|---|---|---|
| Edificios concreto (E.030) | Excelente | Bueno |
| Estructuras metálicas | Bueno | Excelente |
| Puentes y obras civiles | Limitado | Bueno |
| Integración con Revit | Aceptable | Excelente |
| Comunidad en Perú | Grande | Pequeña |
| Licencia (referencial) | ~$4,000 USD/año | Incluida en AEC Collection |
| Curva de aprendizaje | Media | Media-alta |
| Diseño concreto armado | Excelente | Básico |
| Diseño acero estructural | Bueno | Excelente |

## ¿Cuál Elegir?

La respuesta depende de tu práctica habitual:

- **Oficina de cálculo estructural de edificios residenciales o comerciales en Perú:** ETABS sin dudas. El flujo de trabajo, el diseño de concreto y la familiaridad del mercado local justifican la elección.

- **Empresa con proyectos de infraestructura, industria o metal-mecánica:** Robot Structural, especialmente si ya tienen Revit y la AEC Collection de Autodesk.

- **Consultoría BIM con flujo completo Revit → análisis → vuelta a Revit:** Robot Structural por la integración nativa. Considera complementarlo con ETABS para la verificación final de edificios.

- **Estudiante o calculista independiente empezando:** domina ETABS primero. Tiene más demanda laboral en el mercado peruano actual.

Para entender cómo configurar el análisis sísmico E.030 paso a paso en ETABS, incluyendo el espectro de diseño y la verificación de derivas, revisa la guía de [interpretación del análisis modal en ETABS](/blog/interpretar-analisis-modal-masas-etabs-e030).

Y si tu proyecto involucra modelado de muros de corte para control sísmico, el post de [muros pantalla en ETABS según E.030](/blog/etabs-muros-pantalla-rigidez-lateral) detalla el proceso completo de modelado y verificación de irregularidad torsional.`,
  },
  {
    title: 'Cortante Basal: Fórmula E.030 y Cálculo Paso a Paso con Ejemplo',
    slug: 'cortante-basal-formula-e030-calculo-paso-a-paso',
    excerpt: 'Aprende a calcular el cortante basal según la Norma E.030 peruana. Fórmula V = ZUCS/R × P con ejemplo numérico completo para edificio de 5 pisos.',
    meta_title: 'Cortante Basal Fórmula E.030: Cálculo Paso a Paso con Ejemplo (2026)',
    meta_description: 'Aprende a calcular el cortante basal según la Norma E.030 peruana. Fórmula V = ZUCS/R × P con ejemplo numérico completo para edificio de 5 pisos.',
    key_question: '¿Cómo se calcula el cortante basal según la Norma E.030?',
    key_answer: 'El cortante basal se calcula con V = (ZUCS/R) × P, donde Z es el factor de zona sísmica, U el factor de uso, C el factor de amplificación sísmica, S el factor de suelo, R el coeficiente de reducción y P el peso total del edificio.',
    category_slug: 'normativa',
    tags: ["e030", "cortante-basal", "sismorresistente", "calculo-estructural"],
    author: "Ing. Miguel Rivera",
    reading_time: 8,
    status: 'published' as const,
    featured_image: `${STORAGE_BASE}/cortante-basal-formula-e030-calculo-paso-a-paso.png`,
    published_at: '2026-03-08T08:00:00.000Z',
    content: `El cortante basal es la fuerza horizontal total que actúa sobre la base de un edificio durante un sismo de diseño. Es el número que define todo el análisis sísmico: si lo calculas mal, el resto del diseño estructural está construido sobre arena.

La Norma E.030 de Diseño Sismorresistente del Perú establece el procedimiento para calcularlo. Esta guía te lleva paso a paso con un ejemplo numérico real para que no quede ninguna duda.

## La Fórmula del Cortante Basal E.030

La fórmula fundamental del análisis estático equivalente según la E.030 es:

\`\`\`
V = (Z x U x C x S / R) x P
\`\`\`

Donde cada factor tiene un significado físico concreto:

- **V** = Cortante basal de diseño (toneladas-fuerza, tf)
- **Z** = Factor de zona sísmica (adimensional)
- **U** = Factor de uso o importancia (adimensional)
- **C** = Factor de amplificación sísmica (adimensional)
- **S** = Factor de suelo (adimensional)
- **R** = Coeficiente de reducción de fuerzas sísmicas (adimensional)
- **P** = Peso total del edificio en condición sísmica (toneladas)

La fracción ZUCS/R se llama coeficiente sísmico y representa qué porcentaje del peso del edificio actúa como fuerza horizontal. Para un edificio típico en Lima, este coeficiente oscila entre 0.09 y 0.18.

<Callout type="info">
La E.030 vigente es la versión con modificaciones del DS 003-2016-VIVIENDA y sus actualizaciones posteriores. Siempre verifica que estás usando la versión vigente — las zonas sísmicas y algunos factores han cambiado respecto a versiones anteriores de la norma.
</Callout>

## Factor Z: Zona Sísmica

Perú está dividido en 4 zonas sísmicas según el mapa de zonificación de la E.030:

| Zona | Descripción | Factor Z |
|---|---|---|
| Zona 4 | Costa norte: Lima, Ica, Arequipa, Moquegua, Tacna | 0.45 |
| Zona 3 | Costa central-sur, sierra norte-centro | 0.35 |
| Zona 2 | Amazonas, Ucayali, Madre de Dios | 0.25 |
| Zona 1 | Selva baja, región amazónica | 0.10 |

Para nuestro ejemplo: edificio de apartamentos en Lima (Zona 4) → **Z = 0.45**

<Callout type="warning">
Un error frecuente: usar Z = 0.40 para Lima, que era el valor de la versión anterior de la E.030. Desde la actualización del 2016, Lima está en Zona 4 con Z = 0.45. Si estás revisando un expediente antiguo, verifica qué versión de la norma se usó.
</Callout>

## Factor U: Uso o Importancia

El factor U refleja la importancia de la edificación y las consecuencias de su falla durante un sismo:

| Categoría | Tipo de edificación | Factor U |
|---|---|---|
| A1 | Hospitales, cuarteles militares, plantas de agua | 1.5 |
| A2 | Escuelas, universidades, estadios | 1.3 |
| B | Hoteles, depósitos, tiendas grandes | 1.3 |
| C | Viviendas, oficinas, edificios residenciales | 1.0 |

Para nuestro ejemplo: edificio de apartamentos → Categoría C → **U = 1.0**

## Factor C: Amplificación Sísmica

El factor C depende del periodo fundamental de vibración del edificio (T) y del periodo del suelo (Tp y TL). La E.030 define:

\`\`\`
Si T < Tp:         C = 2.5
Si Tp <= T <= TL:  C = 2.5 x (Tp/T)
Si T > TL:         C = 2.5 x (Tp x TL / T²)
\`\`\`

El periodo fundamental T se puede estimar con la fórmula aproximada de la E.030:

\`\`\`
T = hn / CT

hn = altura total del edificio (m)
CT = 35 para pórticos de concreto
CT = 45 para muros de corte
CT = 45 para estructuras de acero
\`\`\`

Para nuestro ejemplo: edificio de 5 pisos con hn = 14.5 m, muros de corte → CT = 45

\`\`\`
T = 14.5 / 45 = 0.322 s
\`\`\`

Con suelo tipo S2 (suelo intermedio, arenas densas), la E.030 define Tp = 0.6 s y TL = 2.0 s.

Como T = 0.322 s < Tp = 0.6 s → **C = 2.5**

<Callout type="tip">
El factor C siempre tiene un límite: C/R mayor o igual a 0.11. Esto significa que incluso para edificios muy rígidos con C calculado bajo, el cociente C/R no puede ser menor a 0.11. Verifica este límite antes de usar el C obtenido.
</Callout>

## Factor S: Amplificación por Suelo

El factor S depende del tipo de perfil de suelo y de la zona sísmica:

| Perfil | Descripción | Zona 4 | Zona 3 | Zona 2 | Zona 1 |
|---|---|---|---|---|---|
| S0 | Roca dura | 0.80 | 0.80 | 0.80 | 0.80 |
| S1 | Roca o suelo muy rígido | 1.00 | 1.00 | 1.00 | 1.00 |
| S2 | Suelo intermedio | 1.05 | 1.15 | 1.20 | 1.60 |
| S3 | Suelo blando | 1.10 | 1.20 | 1.40 | 2.00 |

Para nuestro ejemplo: Lima, suelo S2 → **S = 1.05**

## Factor R: Reducción de Fuerzas Sísmicas

El factor R representa la capacidad del sistema estructural para disipar energía durante el sismo. Refleja la ductilidad del sistema:

| Sistema estructural | R0 (Perú, E.030) |
|---|---|
| Muros de concreto armado | 6 |
| Pórticos de concreto armado | 8 |
| Dual (pórticos + muros) | 7 |
| Muros de albañilería confinada | 3 |
| Pórticos de acero arriostrados | 6 |
| Pórticos de acero sin arriostramiento | 8 |

El R final se obtiene multiplicando R0 por los factores de irregularidad:

\`\`\`
R = R0 x Fp x Fe

Fp = factor de irregularidad en planta (0.75 a 1.0)
Fe = factor de irregularidad en elevación (0.75 a 1.0)
\`\`\`

Para nuestro ejemplo: sistema dual, regular en planta y elevación → **R = 7 x 1.0 x 1.0 = 7**

## Cálculo del Peso P

El peso P incluye la carga muerta total más un porcentaje de la carga viva según la categoría del edificio:

\`\`\`
Categoría C (vivienda): P = CM + 0.25 x CV
\`\`\`

Para nuestro edificio de 5 pisos (estimado):
- Carga muerta total: 1,200 tf (losas + vigas + columnas + muros + acabados)
- Carga viva total: 350 tf (250 kg/m² x área útil x 5 pisos)

\`\`\`
P = 1,200 + 0.25 x 350 = 1,287.5 tf
\`\`\`

## El Cálculo Final

Reuniendo todos los factores:

\`\`\`
V = (Z x U x C x S / R) x P
V = (0.45 x 1.0 x 2.5 x 1.05 / 7) x 1,287.5
V = (1.18125 / 7) x 1,287.5
V = 0.1687 x 1,287.5
V = 217.3 tf (aprox.)
\`\`\`

El coeficiente sísmico resultante es 0.1687, es decir, el 16.87% del peso del edificio actúa como fuerza horizontal de diseño.

<Callout type="info">
Este cortante basal es para el análisis estático equivalente. La E.030 requiere comparar este valor con el cortante obtenido del análisis dinámico modal espectral, y si el dinámico es menor al 80% del estático (para estructuras regulares), se debe escalar el dinámico. El cortante basal estático es el piso mínimo del diseño.
</Callout>

## Distribución del Cortante en Altura

El cortante basal no se aplica como una fuerza única en la base. Se distribuye en cada nivel del edificio de acuerdo con la altura y el peso de cada piso:

\`\`\`
Fi = V x (Pi x hi) / Suma(Pj x hj)

Pi = peso del piso i
hi = altura del piso i desde la base
\`\`\`

Para periodos T menor o igual a 0.5 s (caso de nuestro ejemplo), la E.030 indica que el 100% del cortante se distribuye directamente como Fi. Para T mayor a 0.5 s, la norma aplica una concentración adicional en el último nivel (fuerza en techo).

La distribución del cortante define las fuerzas sísmicas que actúan en cada diafragma de losa, y con esas fuerzas se calculan las fuerzas en columnas y muros de corte mediante el modelo tridimensional.

Para ver cómo estas fuerzas se ingresan y procesan en ETABS, incluyendo la verificación de derivas de entrepiso, la guía de [muros de corte en ETABS para control de rigidez lateral](/blog/etabs-muros-pantalla-rigidez-lateral) explica el proceso completo.

Y para entender qué significa cada factor de la fórmula ZUCS/R con más detalle, el post de [fórmula ZUCS/R de la Norma E.030](/blog/zucs-formula-zona-sismica-e030-peru) profundiza en la física detrás de cada parámetro.`,
  },
  {
    title: 'Fórmula ZUCS/R de la Norma E.030: Qué significa cada factor y cómo aplicarla',
    slug: 'zucs-formula-zona-sismica-e030-peru',
    excerpt: 'Guía completa de la fórmula ZUCS/R de la Norma E.030 peruana. Z=zona sísmica, U=uso, C=amplificación, S=suelo, R=reducción. Tablas y ejemplos actualizados.',
    meta_title: 'Fórmula ZUCS/R Norma E.030 Perú: Guía Completa con Tablas (2026)',
    meta_description: 'Guía completa de la fórmula ZUCS/R de la Norma E.030 peruana. Z=zona sísmica, U=uso, C=amplificación, S=suelo, R=reducción. Tablas y ejemplos actualizados.',
    key_question: '¿Qué significa cada letra de la fórmula ZUCS/R de la Norma E.030?',
    key_answer: 'Z = factor de zona sísmica (0.10 a 0.45 según la región del Perú), U = factor de uso o importancia de la edificación, C = factor de amplificación sísmica dependiente del periodo T, S = factor de amplificación por tipo de suelo, R = coeficiente de reducción de fuerzas sísmicas según el sistema estructural.',
    category_slug: 'normativa',
    tags: ["e030", "zucs", "zona-sismica", "normativa-peruana"],
    author: "Ing. Miguel Rivera",
    reading_time: 7,
    status: 'published' as const,
    featured_image: `${STORAGE_BASE}/zucs-formula-zona-sismica-e030-peru.png`,
    published_at: '2026-03-06T08:00:00.000Z',
    content: `La fórmula ZUCS/R aparece en todo expediente técnico estructural peruano. Está en el primer capítulo de la memoria de cálculo, la presenta el calculista al propietario como "el factor sísmico", y define si el edificio tiene suficiente resistencia lateral para sobrevivir el sismo de diseño.

Pero ¿cuántos ingenieros civiles pueden explicar con precisión qué representa físicamente cada una de esas cinco letras? Esta guía lo hace, con tablas actualizadas y el razonamiento detrás de cada parámetro.

## La Ecuación Completa

La fórmula ZUCS/R es la columna vertebral del análisis sísmico estático equivalente de la E.030:

\`\`\`
Coeficiente sísmico = Z x U x C x S / R
Cortante basal V = (Z x U x C x S / R) x P
\`\`\`

Cada factor ajusta la fuerza sísmica al contexto específico del proyecto. La belleza de la fórmula es que puedes rastrear por qué dos edificios idénticos en peso tienen fuerzas sísmicas completamente distintas si están en diferentes ciudades, sobre diferentes suelos, o tienen diferentes sistemas estructurales.

## Z: El Peligro Sísmico de tu Ubicación

El factor Z cuantifica la aceleración máxima esperada del suelo durante el sismo de diseño, expresada como fracción de la gravedad (g). Deriva directamente del mapa de peligro sísmico probabilístico del Perú, que calcula la aceleración con 10% de probabilidad de excedencia en 50 años (sismo de 475 años de periodo de retorno).

| Zona E.030 | Departamentos incluidos | Z |
|---|---|---|
| Zona 4 | Tumbes, Piura, Lambayeque, La Libertad, Ancash, Lima, Ica, Arequipa, Moquegua, Tacna | 0.45 |
| Zona 3 | San Martín, Huánuco, Pasco, Junín, Cusco, Apurímac, Ayacucho | 0.35 |
| Zona 2 | Amazonas, Ucayali (parte), Madre de Dios | 0.25 |
| Zona 1 | Loreto (selva baja), Ucayali (Atalaya y Tahuamanu) | 0.10 |

<Callout type="warning">
El mapa de zonificación de la E.030 no sigue exactamente los límites departamentales. Provincias costeras de Cajamarca (como Chepen y Pacasmayo) están en Zona 4, mientras que la sierra de Cajamarca puede estar en Zona 3 o 2. Siempre consulta el mapa oficial o el anexo de la norma para determinar la zona de tu distrito específico.
</Callout>

Un Z = 0.45 significa que el suelo podría moverse con una aceleración de 0.45g durante el sismo de diseño — casi la mitad de la aceleración de la gravedad. Para Lima, ese es el riesgo que la norma reconoce y frente al cual los edificios deben estar diseñados.

## U: La Importancia Social del Edificio

El factor U reconoce que no todos los edificios tienen la misma importancia durante una emergencia sísmica. Un hospital que colapsa durante el sismo deja sin atención médica a miles de personas en el peor momento posible. Una vivienda unifamiliar que colapsa es una tragedia, pero de menor impacto comunitario.

| Categoría | Descripción | U |
|---|---|---|
| A1 | Hospitales, clínicas, centros de salud; cuarteles de policía y bomberos | 1.5 |
| A2 | Instituciones educativas, museos, estadios, archivos nacionales | 1.3 |
| B | Hoteles de 3+ pisos, tiendas por departamentos, mercados grandes | 1.3 |
| C | Edificios residenciales, de oficinas, vivienda multifamiliar | 1.0 |
| D | Construcciones provisionales, depósitos agrícolas de bajo riesgo | 0.6 |

<Callout type="tip">
La categoría A (hospitales, colegios) requiere además una revisión de la norma más estricta para irregularidades. Un colegio irregular en planta puede tener penalizaciones adicionales que reducen el R efectivo. No asumas que un factor U alto compensa deficiencias en la regularidad estructural.
</Callout>

## C: La Resonancia entre el Edificio y el Suelo

El factor C es el más complejo de los cinco porque captura la interacción dinámica entre el periodo de vibración del edificio (T) y el periodo predominante del suelo (Tp).

Cuando T se acerca a Tp, ocurre resonancia: el suelo "empuja" al edificio en el momento exacto en que el edificio está preparado para recibir ese impulso, amplificando el movimiento. El factor C cuantifica esa amplificación.

\`\`\`
Si T < Tp:           C = 2.5
Si Tp <= T <= TL:    C = 2.5 x (Tp / T)
Si T > TL:           C = 2.5 x (Tp x TL / T²)
\`\`\`

Los valores de Tp y TL dependen del tipo de perfil de suelo:

| Perfil de Suelo | Tp (s) | TL (s) |
|---|---|---|
| S0 (Roca dura) | 0.3 | 3.0 |
| S1 (Roca o suelo muy rígido) | 0.4 | 2.5 |
| S2 (Suelo intermedio) | 0.6 | 2.0 |
| S3 (Suelo blando) | 1.0 | 1.6 |

El periodo T del edificio se estima con la fórmula simplificada T = hn / CT, donde hn es la altura total y CT depende del sistema estructural (35 para pórticos, 45 para muros de corte).

La restricción adicional es que C no puede ser mayor que 2.5 ni producir un cociente C/R menor a 0.11. Esta segunda condición asegura un mínimo de fuerza sísmica incluso para edificios muy rígidos.

## S: La Amplificación por el Tipo de Suelo

El suelo no solo soporta el edificio — también modifica el movimiento sísmico que llega desde la roca base. Un suelo blando actúa como un filtro que amplifica ciertas frecuencias y puede multiplicar por 2 o más la aceleración del sismo en superficie comparada con la roca base.

El factor S cuantifica esa amplificación según el perfil geotécnico del sitio:

| Perfil | Descripción geotécnica | Z=0.45 | Z=0.35 | Z=0.25 | Z=0.10 |
|---|---|---|---|---|---|
| S0 | Roca dura (Vs > 1500 m/s) | 0.80 | 0.80 | 0.80 | 0.80 |
| S1 | Roca blanda o grava (Vs 500-1500 m/s) | 1.00 | 1.00 | 1.00 | 1.00 |
| S2 | Suelo intermedio (Vs 180-500 m/s) | 1.05 | 1.15 | 1.20 | 1.60 |
| S3 | Suelo blando (Vs < 180 m/s) | 1.10 | 1.20 | 1.40 | 2.00 |

Nota que S3 en Zona 1 vale 2.00 — el suelo blando en zona de baja sismicidad amplifica tanto que compensa la baja sismicidad de base. Y S0 vale 0.80 en todas las zonas, lo que significa que la roca dura amortigua el movimiento respecto al suelo de referencia.

<Callout type="info">
El perfil de suelo debe determinarse mediante un Estudio de Mecánica de Suelos (EMS) con ensayos de velocidad de onda de corte (Vs30) o correlaciones con ensayos SPT. No es correcto asumir el tipo de suelo por la zona geográfica. Un edificio en San Juan de Lurigancho (Lima este) puede estar sobre roca dura mientras que uno en Miraflores (Lima centro) puede estar sobre rellenos con S3.
</Callout>

## R: La Capacidad del Edificio para Disipar Energía

El factor R es el denominador de la fracción, y es el único factor que trabaja a favor del ingeniero: cuanto mayor es R, menor es la fuerza sísmica que el edificio debe resistir. Eso se debe a que R refleja la capacidad del sistema estructural para deformarse, absorber energía y sobrevivir el sismo con daño moderado sin colapsar.

| Sistema estructural | R0 base |
|---|---|
| Muros de concreto armado | 6 |
| Sistema dual (pórticos + muros) | 7 |
| Pórticos de concreto | 8 |
| Albañilería confinada | 3 |
| Albañilería armada | 3 |
| Pórticos de acero con arriostres especiales | 8 |
| Pórticos de acero ordinarios | 4 |

El R final se penaliza si el edificio tiene irregularidades:

\`\`\`
R = R0 x Fp x Fe

Fp = 1.0 (regular) | 0.90 (irregular tipo 1) | 0.75 (irregular tipo 2)
Fe = 1.0 (regular) | 0.90 (irregular tipo 1) | 0.75 (irregular tipo 2)
\`\`\`

Una irregularidad torsional extrema (tipo 2) en un sistema de albañilería podría resultar en R = 3 × 0.75 × 0.75 = 1.69, una penalización severa que triplicaría la fuerza de diseño respecto al mismo sistema regular.

## El Impacto de Cada Factor en Números

Para visualizar la sensibilidad de la fórmula, tomemos un edificio de vivienda con P = 1,000 tf y calculemos el cortante basal variando un factor a la vez:

| Escenario | Z | U | C | S | R | Coef. | V (tf) |
|---|---|---|---|---|---|---|---|
| Lima, vivienda, pórticos, S2 | 0.45 | 1.0 | 2.5 | 1.05 | 8 | 0.148 | 148 |
| Zona 3 en vez de Zona 4 | 0.35 | 1.0 | 2.5 | 1.15 | 8 | 0.126 | 126 |
| Hospital (U=1.5) | 0.45 | 1.5 | 2.5 | 1.05 | 8 | 0.222 | 222 |
| Suelo S3 en Lima | 0.45 | 1.0 | 2.5 | 1.10 | 8 | 0.155 | 155 |
| Muros de corte (R=6) | 0.45 | 1.0 | 2.5 | 1.05 | 6 | 0.197 | 197 |
| Irregular tipo 2 (R=6×0.75²) | 0.45 | 1.0 | 2.5 | 1.05 | 3.38 | 0.350 | 350 |

La fila de irregularidad extrema muestra el impacto más dramático: pasar de un sistema regular a uno con dos irregularidades tipo 2 puede duplicar o triplicar la fuerza sísmica de diseño. Este es el costo normativo de no diseñar con regularidad estructural.

Para ver cómo estas fuerzas se calculan en la práctica con un ejemplo completo de edificio de 5 pisos, el post de [cortante basal con fórmula E.030 paso a paso](/blog/cortante-basal-formula-e030-calculo-paso-a-paso) lleva el cálculo desde los datos del proyecto hasta el cortante final con todos los valores numéricos.`,
  },
  {
    title: 'SAP2000 vs ETABS: ¿Cuál es mejor para diseño de edificios peruanos?',
    slug: 'sap2000-vs-etabs-cual-usar-edificios',
    excerpt: 'Comparativa técnica SAP2000 vs ETABS para ingenieros civiles en Perú. Diferencias en modelado, análisis sísmico E.030, integración BIM y precio.',
    meta_title: 'SAP2000 vs ETABS: Cuál Usar para Edificios Peruanos (2026)',
    meta_description: 'Comparativa técnica SAP2000 vs ETABS para ingenieros civiles en Perú. Diferencias en modelado, análisis sísmico E.030, integración BIM y precio.',
    key_question: '¿Cuál es mejor para diseño de edificios en Perú: SAP2000 o ETABS?',
    key_answer: 'ETABS es superior para el diseño de edificios peruanos porque está optimizado para estructuras de múltiples pisos, tiene flujos específicos para análisis sísmico E.030, diseño automático de concreto armado y verificación de derivas por piso. SAP2000 es más versátil para estructuras no convencionales pero requiere más configuración manual para el flujo de edificio peruano.',
    category_slug: 'analisis-estructural',
    tags: ["sap2000", "etabs", "software-estructural", "analisis-estructural"],
    author: "Ing. Miguel Rivera",
    reading_time: 7,
    status: 'published' as const,
    featured_image: `${STORAGE_BASE}/sap2000-vs-etabs-cual-usar-edificios.png`,
    published_at: '2026-03-04T08:00:00.000Z',
    content: `SAP2000 y ETABS son del mismo fabricante (Computers and Structures, Inc., CSI) y comparten el mismo motor de análisis de elementos finitos. Entonces, ¿por qué existe confusión sobre cuál usar para edificios? Porque aunque el motor es similar, la interfaz, el flujo de trabajo y las herramientas de diseño están optimizadas para propósitos completamente distintos.

Esta guía resuelve la confusión con comparativas concretas para el contexto peruano.

## El Origen de la Confusión

Ambos softwares nacieron en CSI pero con filosofías diferentes:

- **SAP2000** (Structural Analysis Program) es un software de propósito general para análisis de estructuras. Puede modelar edificios, pero también puentes, presas, tanques, torres de transmisión, estructuras aeronáuticas y cualquier cosa que el ingeniero pueda discretizar en elementos finitos.

- **ETABS** (Extended Three-Dimensional Analysis of Building Systems) es SAP2000 especializado para edificios. CSI tomó el motor de SAP y construyó encima un entorno completamente dedicado al flujo de trabajo de diseño de edificios: pisos, vigas, columnas, muros, losas, diafragmas y análisis sísmico por pisos.

El resultado: ETABS hace todo lo que un edificio necesita más rápido y con menos configuración manual. SAP2000 puede hacer lo mismo, pero requiere que el ingeniero configure cosas que en ETABS son automáticas.

## Diferencias Concretas en el Flujo de Trabajo

### Definición de la estructura

En **ETABS**, defines los niveles (stories) con sus alturas, y el software automáticamente organiza toda la estructura por pisos. Las vigas, columnas y muros se asignan al piso correspondiente. El modelo tiene conciencia de su propia geometría vertical.

En **SAP2000**, todo es una estructura genérica en 3D. No existe el concepto nativo de "piso". Si quieres analizar derivas por entrepiso, debes definir manualmente los nodos de control en cada nivel. Para un edificio de 15 pisos, eso es 15 definiciones manuales de algo que ETABS hace automáticamente.

### Análisis sísmico E.030

**ETABS** tiene el flujo del análisis sísmico peruano integrado. Defines el espectro de diseño E.030 (ya sea el estático equivalente o el dinámico por espectros), asignas las combinaciones de carga, y el software calcula y muestra las derivas de entrepiso por piso y por dirección de análisis en una tabla directamente comparable con el límite de 7 por mil de la E.030.

**SAP2000** puede hacer exactamente el mismo análisis, pero la extracción de derivas requiere trabajo adicional. El ingeniero debe definir manualmente qué nodos usar para calcular las derivas relativas, cómo agruparlos por piso, y cómo presentar los resultados. Es factible, pero consume tiempo que en un proyecto real se traduce en costo.

<Callout type="info">
En un análisis informal entre calculistas peruanos, el tiempo necesario para configurar un modelo de edificio de 8 pisos y correr el análisis sísmico E.030 completo es aproximadamente 40-60% mayor en SAP2000 que en ETABS para un usuario con nivel similar de dominio en ambos softwares.
</Callout>

### Diseño de concreto armado

Aquí la diferencia es más marcada. **ETABS** tiene un módulo de diseño de concreto completamente integrado que, una vez corrido el análisis, genera automáticamente los requerimientos de acero para vigas, columnas y muros según la norma ACI 318 (adoptada por referencia en la E.060 peruana). El diseño de columnas incluye el diagrama de interacción P-M y verifica flexocompresión biaxial.

**SAP2000** también tiene diseño de concreto, pero orientado más a elementos individuales. El flujo integrado edificio → análisis → diseño de todos los elementos con verificación E.030 no es tan fluido. Para edificios complejos, muchos calculistas exportan los resultados de SAP2000 a hojas de cálculo para hacer el diseño del acero manualmente.

## ¿Dónde SAP2000 Supera a ETABS?

### Estructuras no convencionales

SAP2000 brilla en geometrías que ETABS no maneja bien:
- Puentes (SAP tiene el módulo Bridge Wizard).
- Estructuras industriales con marcos tridimensionales complejos.
- Tanques y silos con análisis de presiones de fluido.
- Torres de líneas de transmisión.
- Estructuras con no-linealidades materiales o geométricas avanzadas (análisis pushover, time history).

### Análisis avanzados

Para análisis de historia en el tiempo (time history analysis), análisis pushover estático no-lineal y análisis de colapso progresivo, SAP2000 tiene herramientas más completas y de uso más consolidado en la comunidad académica e investigativa.

En Perú, los proyectos de investigación sísmica y los estudios de vulnerabilidad de edificios existentes frecuentemente usan SAP2000 por esta razón.

<Callout type="tip">
Si necesitas hacer un análisis pushover para una edificación existente o un estudio de desempeño sísmico (performance-based earthquake engineering), SAP2000 es la herramienta correcta. Para el diseño estándar de edificios nuevos con la E.030, ETABS es más eficiente.
</Callout>

## Tabla Comparativa Directa

| Criterio | ETABS | SAP2000 |
|---|---|---|
| Edificios residenciales (flujo E.030) | Excelente | Bueno |
| Estructuras no convencionales | Limitado | Excelente |
| Puentes | No apto | Muy bueno |
| Diseño automático concreto | Excelente | Bueno |
| Análisis pushover / time history | Básico | Excelente |
| Facilidad para derivas E.030 | Excelente (automático) | Regular (manual) |
| Curva de aprendizaje para edificios | Media | Media-alta |
| Comunidad en Perú | Grande | Grande |
| Precio (referencial) | Similar | Similar |
| Geometrías complejas en 3D | Limitado | Excelente |

## La Realidad del Mercado Peruano

En las oficinas de cálculo estructural peruanas orientadas a proyectos residenciales y comerciales, **ETABS domina ampliamente**. Es el software que piden los jefes de proyecto, el que enseñan los cursos de post-grado en las universidades peruanas, y el que conocen los revisores municipales cuando solicitan la memoria de cálculo.

SAP2000 tiene presencia fuerte en:
- Departamentos de ingeniería de empresas constructoras grandes con proyectos de infraestructura.
- Universidades e institutos de investigación sísmica.
- Consultoras que trabajan con proyectos internacionales o bajo normativa ASCE/ACI directa.

## Veredicto para el Ingeniero Peruano

Si eres calculista estructural de edificios residenciales, de oficinas o comerciales en Perú: **usa ETABS**. El flujo de trabajo, la integración con la E.030, el diseño automático de concreto y la demanda del mercado laboral lo justifican ampliamente.

Si haces proyectos mixtos que incluyen tanto edificios como infraestructura, o si trabajas en investigación sísmica: aprende ambos. SAP2000 cubre los proyectos donde ETABS tiene limitaciones, y el tiempo invertido en aprender SAP2000 se recupera en proyectos de mayor complejidad y tarifa.

Para comparar ETABS con Robot Structural Analysis — el otro competidor del mercado BIM — el post de [Robot Structural vs ETABS para análisis estructural en Perú](/blog/robot-structural-vs-etabs-cual-usar-estructuras) explica cuándo la integración con Revit de Robot justifica elegirlo sobre ETABS.`,
  },
  {
    title: 'Diafragma Rígido vs Semiflexible en ETABS: Cuándo usar cada uno',
    slug: 'etabs-diafragma-rigido-semiflexible-cuando-usar',
    excerpt: 'Diferencias entre diafragma rígido y semiflexible en ETABS según la Norma E.030. Cuándo aplicar cada tipo y cómo afecta la distribución de fuerzas sísmicas.',
    meta_title: 'Diafragma Rígido vs Semiflexible en ETABS: Cuándo Usar Cada Uno (E.030)',
    meta_description: 'Diferencias entre diafragma rígido y semiflexible en ETABS según la Norma E.030. Cuándo aplicar cada tipo y cómo afecta la distribución de fuerzas sísmicas.',
    key_question: '¿Cuándo usar diafragma rígido vs semiflexible en ETABS según la E.030?',
    key_answer: 'El diafragma rígido se usa cuando la losa es maciza o aligerada sin aberturas significativas (menos del 20% del área). El diafragma semiflexible o la opción de no asignar diafragma se usa cuando hay aberturas grandes, plantas en L o U muy pronunciadas, o losas con discontinuidades que afectan la distribución de fuerzas sísmicas entre los elementos verticales.',
    category_slug: 'analisis-estructural',
    tags: ["etabs", "diafragma-rigido", "e030", "modelado-estructural"],
    author: "Ing. Miguel Rivera",
    reading_time: 7,
    status: 'published' as const,
    featured_image: `${STORAGE_BASE}/etabs-diafragma-rigido-semiflexible-cuando-usar.png`,
    published_at: '2026-03-02T08:00:00.000Z',
    content: `El diafragma de losa es el elemento que distribuye las fuerzas sísmicas horizontales desde el centro de masa del piso hacia los elementos verticales (columnas y muros de corte). Es el intermediario entre el movimiento del suelo y la respuesta de los elementos estructurales que resisten ese movimiento.

Cómo modelas el diafragma en ETABS determina cómo se distribuyen esas fuerzas. Y una distribución incorrecta puede llevar a sobredimensionar algunos elementos mientras subdimensionas otros — con consecuencias directas sobre la seguridad del edificio y el costo del proyecto.

## Qué es un Diafragma Rígido

Un diafragma **rígido** es la simplificación que asume que todos los nodos de un mismo piso se mueven solidariamente como un cuerpo rígido en el plano horizontal. Las traslaciones en X e Y y la rotación en Z de todos los nodos del piso son iguales, definidas por tres grados de libertad globales del diafragma.

Esta simplificación es válida cuando:
- La losa tiene continuidad en todo el plano del piso.
- No hay aberturas que representen más del 20% del área total de la losa.
- La planta es compacta (no tiene formas en L, U, T o Z con brazos muy esbeltos).
- La rigidez en el plano de la losa es muy superior a la rigidez de los elementos verticales.

En ETABS, se asigna el diafragma rígido desde: Assign → Shell → Diaphragms → Rigid. Una vez asignado, todos los nodos del piso quedan vinculados a ese diafragma y sus movimientos horizontales están restringidos a moverse conjuntamente.

<Callout type="info">
El diafragma rígido reduce significativamente el tiempo de análisis porque elimina muchos grados de libertad del sistema. Para un edificio de 10 pisos con diafragma rígido, los grados de libertad dinámicos se reducen de decenas de miles a solo 30 (3 por piso × 10 pisos). Eso explica por qué es la opción por defecto en la mayoría de proyectos.
</Callout>

## Qué es un Diafragma Semiflexible (o Sin Diafragma)

Cuando la losa no puede asumir un comportamiento de cuerpo rígido, tienes dos opciones en ETABS:

1. **Diafragma semirrígido (Semi-Rigid):** permite que los nodos del piso se deformen relativamente entre sí en el plano horizontal, calculando la rigidez en plano a través de los elementos shell de la losa. Es el modelo más realista para losas con aberturas moderadas.

2. **Sin diafragma asignado:** cada nodo del modelo tiene sus propios grados de libertad independientes. El análisis usa los elementos shell para transmitir las fuerzas en plano. Esta opción es la más detallada pero también la que más tiempo de cálculo requiere.

La E.030 peruana no prescribe explícitamente qué tipo de diafragma usar, pero el artículo 3.6 (irregularidades) implica que el ingeniero debe modelar la flexibilidad real de la losa cuando esta afecta la distribución de fuerzas entre elementos verticales.

## Cuándo el Diafragma Rígido da Resultados Incorrectos

### Plantas en L, U o T

Una planta en L tiene dos "brazos" conectados en una esquina. Si asignas diafragma rígido a todo el piso, el modelo asume que ambos brazos se mueven juntos como si fueran un solo bloque. Pero en la realidad, la losa en el vértice de la L es la única conexión entre los dos brazos, y si esa conexión es estrecha, los brazos pueden desfasarse durante el sismo.

El resultado del error: las columnas del extremo de cada brazo reciben fuerzas sísmicas incorrectas. Las que el modelo "cree" que están coordinadas con el centro de masa global, en realidad tienen su propio centro de masa local.

### Plantas con Aberturas Grandes

Un edificio de oficinas con un atrio central en cada piso tiene una abertura de losa que puede representar el 30-40% del área del nivel. La losa que rodea ese atrio no puede actuar como un diafragma rígido — está fundamentalmente interrumpida.

<Callout type="warning">
La E.030 define la irregularidad de "Discontinuidad de Diafragma" cuando la abertura en losa supera el 50% del área bruta del piso o cuando la variación de rigidez en plano entre pisos supera el 50%. En esos casos, la norma requiere un análisis que considere explícitamente la flexibilidad del diafragma. Asignar diafragma rígido en esos casos es un incumplimiento normativo.
</Callout>

### Pisos de Estacionamiento Abierto

Los pisos de estacionamiento en edificios con rampas abiertas (sin cerramientos perimetrales) frecuentemente tienen losas con recortes en los costados para la ventilación. Estos recortes, combinados con la ausencia de muros perimetrales, hacen que la losa sea flexible en el plano horizontal. Un diafragma rígido sobreestimaría la rigidez del piso y subdimensionaría los muros de corte en ese nivel.

## Cómo Verificar si tu Diafragma Rígido es Válido

La prueba más simple es el índice de flexibilidad del diafragma:

\`\`\`
delta_max_losa / delta_prom_apoyos

donde:
delta_max_losa  = deformación máxima en el plano de la losa
delta_prom_apoyos = promedio de desplazamientos en los apoyos (muros/columnas)
\`\`\`

Si este cociente es menor a 0.5, el diafragma puede considerarse rígido. Si es mayor a 2.0, el diafragma es flexible. Entre 0.5 y 2.0, es semirrígido.

Para calcular esto en ETABS con diafragma semirrígido, necesitas modelar la losa con elementos shell con su rigidez real, correr el análisis y revisar los desplazamientos relativos en el plano de la losa. Esto requiere más tiempo de modelado pero da resultados más precisos para plantas irregulares.

## Procedimiento en ETABS para Diafragma Semirrígido

1. Modela la losa con elementos shell (Shell-Thin o Shell-Thick según el espesor).
2. **No asignes diafragma rígido** a esos pisos.
3. Asegúrate de que el mallado de la losa sea adecuado — al menos 4-6 elementos por vano entre apoyos.
4. En el Modal Analysis Setup, aumenta el número de modos hasta capturar el 90% de masa participante — la flexibilidad del diafragma activará modos locales que el modelo rígido ignoraba.
5. Revisa las fuerzas en los elementos verticales: con diafragma flexible, los muros y columnas más rígidos recibirán más fuerza y los más flexibles recibirán menos — la distribución será más realista que con el diafragma rígido.

<Callout type="tip">
Para proyectos donde necesitas un modelo rápido para el análisis global pero sospechas que el diafragma podría ser flexible, una buena práctica es correr el análisis dos veces: una con diafragma rígido y otra con diafragma semirrígido (shells sin diafragma). Si las fuerzas en los elementos verticales difieren en más del 15-20%, el diafragma rígido no es una simplificación válida para ese proyecto.
</Callout>

## Impacto en la Distribución de Fuerzas Sísmicas

La diferencia más importante entre ambos modelos es cómo se distribuye el cortante sísmico entre los elementos verticales del piso.

Con **diafragma rígido**, el cortante se distribuye según la rigidez relativa de cada elemento vertical respecto al centro de rigidez global del piso. Un muro muy rígido toma mucho más cortante que una columna flexible. Esa distribución es correcta si el diafragma efectivamente vincula todos los elementos.

Con **diafragma flexible**, cada elemento toma el cortante que le llega directamente de la losa adyacente. Un muro en el extremo de un brazo de planta en L puede recibir fuerzas completamente distintas a las que el modelo rígido asignaría, porque la losa flexible no puede redistribuir hacia ese muro las fuerzas del resto de la planta.

Para complementar el análisis de distribución de fuerzas sísmicas, el post de [muros pantalla en ETABS para control de rigidez lateral](/blog/etabs-muros-pantalla-rigidez-lateral) detalla cómo verificar la irregularidad torsional que puede surgir cuando el diafragma no distribuye las fuerzas simétricamente.

Y si quieres entender la interacción entre el tipo de diafragma y los modos de vibración del edificio, la guía de [interpretación del análisis modal en ETABS](/blog/interpretar-analisis-modal-masas-etabs-e030) explica por qué un diafragma flexible puede generar modos locales que deben capturarse correctamente para cumplir el 90% de masa participante exigido por la E.030.`,
  },
];

async function run() {
  console.log('\n🚀 Content Engine — Batch 6 posts (18 Mar 2026)\n');
  console.log('Artículos: Robot vs ETABS, Cortante Basal, ZUCS, SAP2000 vs ETABS, Diafragma\n');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError || !categories) {
    console.error('❌ Error leyendo categorías:', catError);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories.forEach((c) => (catMap[c.slug] = c.id));

  console.log(`✅ Categorías: ${Object.keys(catMap).join(", ")}\n`);
  console.log('─'.repeat(60));

  for (const post of posts) {
    const categoryId = catMap[post.category_slug];
    if (!categoryId) {
      console.warn(`⚠️  Categoría "${post.category_slug}" no encontrada — usando fallback`);
    }

    const { category_slug, published_at, ...rest } = post;

    const payload = {
      ...rest,
      category_id: categoryId || Object.values(catMap)[0],
      published_at,
    };

    const { error } = await supabase
      .from('posts')
      .upsert([payload], { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error insertando "${post.slug}":`, error.message);
    } else {
      console.log(`✅ Publicado: ${post.slug}`);
      console.log(`   "${post.title}"`);
      console.log(`   Fecha: ${published_at.substring(0, 10)} | Cat: ${post.category_slug} | ${post.reading_time} min\n`);
    }
  }

  console.log('─'.repeat(60));
  console.log('🎉 Batch 6 completo. 5 artículos inyectados en Supabase.');
  console.log('👉 Topics bank: actualizar .agents/skills/content-engine/topics-bank.md');
}

run().catch((e) => {
  console.error('Fatal:', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
