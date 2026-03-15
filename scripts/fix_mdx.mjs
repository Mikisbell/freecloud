import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envFile = readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
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

const newContent = `<h2>¿Por qué Python se está convirtiendo en herramienta estándar en ingeniería civil?</h2>
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

\`\`\`python
import numpy as np

# Ejemplo: Cálculo de inercia de sección compuesta
b, h = 0.30, 0.60  # m
A = b * h
I = (b * h**3) / 12
print("Área:", round(A, 4), "m² | Inercia:", round(I, 6), "m⁴")
\`\`\`

<h2>2. Pandas: dominio total de datos tabulares</h2>
<p><strong>Pandas</strong> es tu reemplazo a Excel para análisis de datos. Lee, procesa y exporta archivos CSV, Excel y bases de datos con pocas líneas de código.</p>
<p>Aplicaciones prácticas:</p>
<ul>
  <li>Procesamiento de datos de estación total (coordenadas, cotas, ángulos)</li>
  <li>Análisis estadístico de ensayos de resistencia de concreto</li>
  <li>Generación automática de cuadros de metrados desde modelos BIM exportados a CSV</li>
  <li>Control de calidad de compactación (registro de densidades por punto)</li>
</ul>

\`\`\`python
import pandas as pd

# Leer ensayos de resistencia de concreto
df = pd.read_excel("resistencias.xlsx")
df["f'c (MPa)"] = df["Carga (kN)"] / (3.14159 * (0.075**2))
print(df.describe())  # Estadísticas: media, desvío, mínimo, máximo
print("Resistencia promedio:", round(df["f'c (MPa)"].mean(), 1), "MPa")
\`\`\`

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

\`\`\`python
import matplotlib.pyplot as plt
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
plt.savefig("DMF.png", dpi=150, bbox_inches='tight')
\`\`\`

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

\`\`\`python
from openpyxl import load_workbook

wb = load_workbook("plantilla_metrados.xlsx")
ws = wb.active

# Escritura de metrados calculados
ws['D5'] = 24.50  # m³ de excavación masiva
ws['D6'] = 8.25   # m³ de concreto f'c=210
ws['D7'] = 1850   # kg de acero fy=4200

wb.save("metrados_completados.xlsx")
print("✅ Metrados generados correctamente")
\`\`\`

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
<p>El mejor momento para empezar fue ayer. El segundo mejor momento es ahora.</p>`;

async function overrideContent() {
  const { error } = await supabase.from('posts').update({ content: newContent }).eq('slug', 'python-librerias-esenciales-ingenieros-civiles');
  if (error) {
    console.error("Error overwriting post:", error);
  } else {
    console.log("✅ Sobreescrito exitosamente con Markdown puro!");
  }
}
overrideContent();
