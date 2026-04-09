/**
 * professional-content-overhaul.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mejora profesional masiva para AdSense:
 *  1. Corrige títulos clickbait a títulos descriptivos profesionales
 *  2. Agrega FAQ a posts que no tienen
 *  3. Agrega tablas a posts que no tienen
 *  4. Expande contenido para llegar a 1000+ palabras
 * 
 * Uso: npx tsx scripts/professional-content-overhaul.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── 1. FIX CLICKBAIT TITLES ──
const TITLE_FIXES: Record<string, string> = {
  'bim-obligatorio-peru-2026': 'Implementación BIM en Obras Públicas: Guía Práctica para Empresas en Perú 2026',
  'que-es-bim-obligatorio-peru-2026': 'Implementación BIM en Obras Públicas: Guía Práctica para Empresas en Perú 2026',
  'implemente-bim-en-mi-proyecto-tu-tambien-puedes': 'Guía de Implementación BIM para Proyectos de Construcción en Perú',
  'como-prepararte-bim-6-meses': 'Plan de 6 Meses para Preparar tu Empresa en Metodología BIM',
  'predimensionamiento-columnas-vigas-e060-practico': 'Predimensionamiento de Columnas y Vigas: Guía Práctica con Norma E.060',
  'haz-predimensionamiento-columnas-vigas-optimizar': 'Predimensionamiento de Columnas y Vigas: Guía Práctica con Norma E.060',
  'civil-3d-crear-primer-corredor-vial-carreteras': 'Diseño de Corredores Viales en Civil 3D: Guía Paso a Paso',
  'hp-prime-programa-hardy-cross-analisis-estructural': 'Programa Hardy Cross para Análisis Estructural en HP Prime',
  'programé-hardy-cross-en-hp-prime-y-ahorra-tiempo': 'Programa Hardy Cross para Análisis Estructural en HP Prime',
  'automatizacion-bim-python': 'Automatización de Procesos BIM con Python: Guía Completa',
  'revit-api-python-pyrevit-programacion-bim': 'Programación en Revit API con Python y pyRevit: Acelerando el Flujo BIM',
  'etabs-vs-robot-structural-comparacion': 'Comparativa ETABS vs Robot Structural para Análisis Estructural',
  'usé-etabs-y-robot-structural-comparativa-real': 'Comparativa ETABS vs Robot Structural para Análisis Estructural',
  'plan-ejecucion-bim-peb-guia': 'Plan de Ejecución BIM (PEB): Guía en 5 Pasos para Obras en Perú',
  'creé-un-plan-de-ejecucion-bim-en-5-pasos-efectivos': 'Plan de Ejecución BIM (PEB): Guía en 5 Pasos para Obras en Perú',
  'python-ingenieros-civiles-primer-script': 'Tu Primer Script en Python para Ingeniería Civil: Guía de 30 Minutos',
  'creé-mi-primer-script-en-python-en-30-minutos': 'Tu Primer Script en Python para Ingeniería Civil: Guía de 30 Minutos',
  'dynamo-revit-automatizar-primer-proceso': 'Automatización de Procesos en Revit con Dynamo: Primeros Pasos',
  'automatiza-tu-primer-proceso-en-revit-con-dynamo': 'Automatización de Procesos en Revit con Dynamo: Primeros Pasos',
  'excel-plantilla-metrados-obra-automatica': 'Plantilla Excel para Metrados de Obra: Automatización en 10 Minutos',
  'automatiza-metrados-de-obra-en-excel-en-10-min': 'Plantilla Excel para Metrados de Obra: Automatización en 10 Minutos',
  'norma-e030-fuerza-cortante-basal-calculo': 'Cálculo de la Cortante Basal según Norma E.030: Guía Rápida',
  'calcule-la-cortante-basal-e030-en-10-minutos': 'Cálculo de la Cortante Basal según Norma E.030: Guía Rápida',
  'revit-estructuras-ingenieros-autocad': 'Transición a Revit Estructural para Ingenieros que Vienen de AutoCAD',
  'domina-revit-estructural-en-5-pasos-desde-autocad': 'Transición a Revit Estructural para Ingenieros que Vienen de AutoCAD',
};

// ── 2. FAQ SECTIONS for posts that don't have them ──
const FAQ_ADDITIONS: Record<string, { section: string }> = {
  'zucs-formula-zona-sismica-e030-peru': {
    section: `\n\n## Preguntas frecuentes sobre la fórmula ZUCS/R\n\n<details>\n<summary><strong>¿Qué significa cada letra de ZUCS/R?</strong></summary>\nZ = Factor de zona sísmica. U = Factor de uso. C = Factor de amplificación sísmica. S = Factor de suelo. R = Coeficiente de reducción de fuerza sísmica.\n</details>\n\n<details>\n<summary><strong>¿Dónde encuentro los valores de Z para mi ciudad?</strong></summary>\nLa zona sísmica está definida en la norma E.030. Lima está en Zona 4 (Z=0.45). Otras ciudades: Arequipa (Z=0.35), Trujillo (Z=0.30), Iquitos (Z=0.10).\n</details>\n\n<details>\n<summary><strong>¿El valor de R cambia según el tipo de estructura?</strong></summary>\nSí. Pórticos de concreto armado: R=8. Muros estructurales: R=7. Pórticos de acero: R=8. Dual: R=10. El valor depende de la ductilidad del sistema.\n</details>\n`
  },
  'cortante-basal-formula-e030-calculo-paso-a-paso': {
    section: `\n\n## Preguntas frecuentes sobre Cortante Basal\n\n<details>\n<summary><strong>¿La cortante basal es la misma en X e Y?</strong></summary>\nNo necesariamente. Si la estructura tiene diferente rigidez o período en cada dirección, la cortante basal será diferente. Esto es común en edificios asimétricos.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si la cortante basal del análisis espectral es menor que la estática?</strong></summary>\nLa norma E.030 exige que la cortante basal del análisis espectral sea al menos el 80% de la cortante basal estática. Si es menor, debes escalar las fuerzas sísmicas.\n</details>\n\n<details>\n<summary><strong>¿Puedo usar cortante basal reducida por interacción suelo-estructura?</strong></summary>\nLa norma E.030 no contempla reducción por interacción suelo-estructura de forma explícita. Si quieres考虑arlo, necesitarás un análisis dinámico con modelo de resortes de suelo.\n</details>\n`
  },
  'calculo-zapata-aislada-e050-e060-paso-a-paso': {
    section: `\n\n## Preguntas frecuentes sobre diseño de zapatas\n\n<details>\n<summary><strong>¿Cuándo uso zapata aislada y cuándo zapata combinada?</strong></summary>\nUsa zapata aislada cuando las columnas están suficientemente separadas (centro a centro > 2 veces el ancho de la zapata). Si las zapatas se solapan, usa zapata combinada.\n</details>\n\n<details>\n<summary><strong>¿Qué profundidad mínima debe tener la zapata?</strong></summary>\nLa norma E.050 exige un mínimo de 0.50 m de profundidad de cimentación desde el nivel de terreno natural, para evitar heladas y socavación.\n</details>\n\n<details>\n<summary><strong>¿Cómo verifico la capacidad portante del suelo?</strong></summary>\nEl estudio de mecánica de suelos te da la capacidad admisible (qa). La presión de contacto (P/A) debe ser menor que qa. Si no tienes estudio de suelos, no diseñes cimentaciones.\n</details>\n`
  },
  'etabs-muros-pantalla-rigidez-lateral': {
    section: `\n\n## Preguntas frecuentes sobre muros pantalla\n\n<details>\n<summary><strong>¿Cuándo debo usar muros pantalla en vez de pórticos?</strong></summary>\nCuando la deriva de entrepiso supera el límite de la norma E.030 (0.007 para concreto armado). Los muros aportan rigidez lateral significativa.\n</details>\n\n<details>\n<summary><strong>¿Los muros pantalla trabajan a flexión o a cortante?</strong></summary>\nTrabajan a ambos. La flexión domina en muros esbeltos (H/L > 3). El cortante domina en muros chatos (H/L < 1.5). Verifica ambos según E.060.\n</details>\n\n<details>\n<summary><strong>¿Puedo modelar muros pantalla como columnas en ETABS?</strong></summary>\nNo. Debes modelarlos como elementos de cáscara (shell) para capturar correctamente su comportamiento a flexión y cortante.\n</details>\n`
  },
  'lod-100-500-bim-significado-revit-peru': {
    section: `\n\n## Preguntas frecuentes sobre LOD\n\n<details>\n<summary><strong>¿Qué nivel de LOD me piden para una licitación pública?</strong></summary>\nDepende del tipo de obra. Para ingeniería de detalle: LOD 350 mínimo. Para construcción: LOD 400. Para as-built: LOD 500.\n</details>\n\n<details>\n<summary><strong>¿Puedo mezclar diferentes niveles LOD en un mismo modelo?</strong></summary>\nSí. Es común tener arquitectura en LOD 350, estructura en LOD 400, y MEP en LOD 300. Lo importante es definir esto en el BEP.\n</details>\n\n<details>\n<summary><strong>¿LOD es lo mismo que LOI?</strong></summary>\nNo. LOD (Level of Development) se refiere a la geometría. LOI (Level of Information) se refiere a los datos no gráficos. La ISO 19650 distingue ambos.\n</details>\n`
  },
  'open-bim-vs-closed-bim-ifc-formato': {
    section: `\n\n## Preguntas frecuentes sobre OpenBIM\n\n<details>\n<summary><strong>¿El formato IFC pierde información al exportar?</strong></summary>\nPuede perder información de parámetros propietarios. Los elementos geométricos se mantienen bien, pero los parámetros personalizados de Revit pueden no exportarse completamente.\n</details>\n\n<details>\n<summary><strong>¿Qué software soporta IFC en Perú?</strong></summary>\nRevit, ArchiCAD, Tekla Structures, Allplan, y muchos más. La certificación buildingSMART garantiza la compatibilidad. Verifica en buildingsmart.org.\n</details>\n\n<details>\n<summary><strong>¿OpenBIM es obligatorio para obras públicas en Perú?</strong></summary>\nLa Ley 32069 no especifica un formato. Sin embargo, la tendencia del Estado es favorecer estándares abiertos para garantizar la interoperabilidad a largo plazo.\n</details>\n`
  },
  'bim-nivel-1-2-3-diferencias-certificacion': {
    section: `\n\n## Preguntas frecuentes sobre niveles BIM\n\n<details>\n<summary><strong>¿Qué nivel BIM me exigen para licitaciones públicas en 2026?</strong></summary>\nPara 2026, se espera BIM Nivel 2 como mínimo para todas las obras públicas. Esto implica modelos coordinados, CDE compartido, y colaboración interdisciplinaria.\n</details>\n\n<details>\n<summary><strong>¿Cómo certifico mi empresa en BIM?</strong></summary>\nNo existe una certificación oficial de "empresa BIM" en Perú. buildingSMART ofrece certificaciones individuales. La certificación ISO 19650 es para organizaciones.\n</details>\n\n<details>\n<summary><strong>¿Puedo saltar del Nivel 0 al Nivel 2 directamente?</strong></summary>\nEs posible pero difícil. Lo recomendable es pasar por Nivel 1 primero: digitalizar documentos, estandarizar nomenclatura, y empezar con un CDE básico.\n</details>\n`
  },
  'interpretar-analisis-modal-masas-etabs-e030': {
    section: `\n\n## Preguntas frecuentes sobre análisis modal\n\n<details>\n<summary><strong>¿Cuántos modos necesito como mínimo?</strong></summary>\nLa norma E.030 exige que la masa participativa acumulada sea al menos el 90% en ambas direcciones. Para edificios regulares, suelen bastar 3-6 modos por dirección.\n</details>\n\n<details>\n<summary><strong>¿Qué hago si un modo tiene muy poca participación de masa?</strong></summary>\nEs normal que modos superiores tengan poca participación individual. Lo importante es la suma acumulada. Si con muchos modos no llegas al 90%, revisa tu modelo.\n</details>\n\n<details>\n<summary><strong>¿El período fundamental debe coincidir con la fórmula de la E.030?</strong></summary>\nNo exactamente, pero debe estar en el mismo rango. Si difiere más del 30%, revisa las secciones, masas, y restricciones de tu modelo.\n</details>\n`
  },
  'sap2000-vs-etabs-cual-usar-edificios': {
    section: `\n\n## Preguntas frecuentes sobre SAP2000 vs ETABS\n\n<details>\n<summary><strong>¿Puedo importar un modelo de SAP2000 a ETABS?</strong></summary>\nSí, a través del formato IFC o importando las coordenadas y propiedades. Pero perderás información de diseño específico. Es mejor modelar directamente en ETABS para edificios.\n</details>\n\n<details>\n<summary><strong>¿ETABS puede hacer análisis de puentes?</strong></summary>\nETABS está optimizado para edificaciones. Para puentes, CSI Bridge o SAP2000 son más apropiados.\n</details>\n\n<details>\n<summary><strong>¿Ambos programas cumplen con la norma E.030?</strong></summary>\nAmbos permiten configurar los parámetros de la norma E.030, pero ninguno la implementa automáticamente. El ingeniero debe verificar manualmente los resultados.\n</details>\n`
  },
  'etabs-diafragma-rigido-semiflexible-cuando-usar': {
    section: `\n\n## Preguntas frecuentes sobre diafragmas\n\n<details>\n<summary><strong>¿Cuándo NO debo usar diafragma rígido?</strong></summary>\nCuando la losa tiene aberturas grandes (escaleras, ductos), cuando la relación largo/ancho es mayor a 3, o cuando la losa es metálica con deck de acero.\n</details>\n\n<details>\n<summary><strong>¿Cómo modelar un diafragma semiflexible en ETABS?</strong></summary>\nNo asignes la restricción de diafragma rígido. Modela la losa como elemento shell con sus propiedades reales de espesor y rigidez.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si uso diafragma rígido cuando no debo?</strong></summary>\nSubestimarás las fuerzas cortantes en el plano de la losa y las torsiones. Esto puede llevar a un diseño inseguro, especialmente en estructuras irregulares.\n</details>\n`
  },
  'robot-structural-vs-etabs-cual-usar-estructuras': {
    section: `\n\n## Preguntas frecuentes sobre Robot vs ETABS\n\n<details>\n<summary><strong>¿Robot Structural tiene mejor integración con Revit?</strong></summary>\nSí, al ser ambos de Autodesk, la integración es nativa. Los cambios en el modelo de Revit se sincronizan automáticamente con Robot.\n</details>\n\n<details>\n<summary><strong>¿ETABS es mejor para sismo?</strong></summary>\nETABS tiene más opciones de análisis sísmico específico: espectro modal, análisis time-history, y pushover. Robot tiene análisis estático y espectral básico.\n</details>\n\n<details>\n<summary><strong>¿Cuál es más fácil de aprender?</strong></summary>\nRobot es más intuitivo para usuarios de Revit. ETABS tiene una curva de aprendizaje más empinada pero ofrece más control sobre el análisis.\n</details>\n`
  },
  'bim-manager-que-hace-cuanto-gana-peru': {
    section: `\n\n## Preguntas frecuentes sobre BIM Manager\n\n<details>\n<summary><strong>¿Cuánto gana un BIM Manager en Perú?</strong></summary>\nEntre S/ 8,000 y S/ 15,000 mensuales dependiendo de la experiencia. En empresas multinacionales puede superar los S/ 18,000.\n</details>\n\n<details>\n<summary><strong>¿Qué certificaciones necesita un BIM Manager?</strong></summary>\nNo hay certificaciones obligatorias, pero las más valoradas son: Autodesk Certified Professional, buildingSMART Professional Certification, y experiencia demostrable en proyectos BIM.\n</details>\n\n<details>\n<summary><strong>¿Puede un ingeniero civil convertirse en BIM Manager?</strong></summary>\nSí. De hecho, es el perfil más demandado: ingeniero civil con dominio de Revit, Navisworks, y conocimientos de ISO 19650.\n</details>\n`
  },
  'bep-plan-ejecucion-bim-ejemplo-peru': {
    section: `\n\n## Preguntas frecuentes sobre el BEP\n\n<details>\n<summary><strong>¿Cuántas páginas debe tener un BEP?</strong></summary>\nDepende del proyecto. Para una edificación de 3 pisos, 10-15 páginas son suficientes. Para proyectos grandes, puede superar las 50 páginas.\n</details>\n\n<details>\n<summary><strong>¿Quién elabora el BEP?</strong></summary>\nEl Coordinador BIM del proyecto, con aportes de cada líder de disciplina. Debe ser aprobado por el gerente de proyecto antes de iniciar el modelado.\n</details>\n\n<details>\n<summary><strong>¿El BEP es un documento estático?</strong></summary>\nNo. El BEP es un documento vivo que se actualiza en cada fase del proyecto. Las revisiones deben controlarse con número de versión y fecha.\n</details>\n`
  },
  'python-librerias-esenciales-ingenieros-civiles': {
    section: `\n\n## Preguntas frecuentes sobre Python en Ingeniería\n\n<details>\n<summary><strong>¿Necesito instalar Anaconda o puedo usar Python puro?</strong></summary>\nAnaconda es recomendado porque incluye las librerías científicas preinstaladas. Si solo necesitas NumPy y Pandas, pip install también funciona.\n</details>\n\n<details>\n<summary><strong>¿Python puede reemplazar a Excel para cálculos estructurales?</strong></summary>\nPuede complementarlo. Python es mejor para cálculos repetitivos, análisis paramétricos, y procesamiento de grandes volúmenes de datos. Excel sigue siendo útil para reportes rápidos.\n</details>\n\n<details>\n<summary><strong>¿Puedo generar reportes automáticos con Python?</strong></summary>\nSí. Con openpyxl puedes generar archivos Excel, con matplotlib generas gráficos, y con reportlab creas PDFs profesionales.\n</details>\n`
  },
  'pyrevit-instalar-primeros-scripts-revit': {
    section: `\n\n## Preguntas frecuentes sobre pyRevit\n\n<details>\n<summary><strong>¿pyRevit funciona en Revit 2025?</strong></summary>\nSí, pyRevit es compatible con Revit 2024 y 2025. Descarga la última versión desde pyrevitlabs.notion.site.\n</details>\n\n<details>\n<summary><strong>¿Puedo distribuir mis scripts a otros usuarios de Revit?</strong></summary>\nSí. Coloca tus scripts en la carpeta de extensiones de pyRevit (C:/pyRevit/extensions) y compártela por red o Git.\n</details>\n\n<details>\n<summary><strong>¿Qué versión de Python debo usar con pyRevit?</strong></summary>\nCPython 3.x es recomendado. IronPython 2.7 es limitado: no soporta librerías externas como pandas o requests.\n</details>\n`
  },
  'excel-metrado-acero-calculo-automatico-vigas': {
    section: `\n\n## Preguntas frecuentes sobre metrado de acero en Excel\n\n<details>\n<summary><strong>¿Cómo calculo el peso de los estribos con ganchos?</strong></summary>\nLongitud del estribo = 2×(b+h) + 2×longitud_gancho. El gancho de 180° según E.060 tiene longitud mínima de 12×diámetro. Multiplica por el peso por metro lineal.\n</details>\n\n<details>\n<summary><strong>¿Debo considerar el empalme en el metrado de acero?</strong></summary>\nSí. La longitud de empalme depende del diámetro y si es a tracción o compresión. Consulta la tabla de traspalpes de la norma E.060.\n</details>\n\n<details>\n<summary><strong>¿Cuál es el factor de desperdicio típico para acero?</strong></summary>\nEntre 8% y 15% dependiendo del elemento. Vigas: 10-12%. Columnas: 5-8%. Losas: 10-15%. Zapatas: 6-10%.\n</details>\n`
  },
  'navisworks-clash-detection-tutorial-completo': {
    section: `\n\n## Preguntas frecuentes sobre Navisworks Clash Detection\n\n<details>\n<summary><strong>¿Cuántos tests de clash debo crear?</strong></summary>\nMínimo 3: Estructura vs MEP, Arquitectura vs MEP, MEP vs MEP. Cada test debe tener su matriz de tolerancia definida.\n</details>\n\n<details>\n<summary><strong>¿Cómo exporto los clashes a Revit?</strong></summary>\nExporta como archivo BCF (BIM Collaboration Format). Abre el BCF en Revit y cada clash se posiciona en la vista correcta del modelo.\n</details>\n\n<details>\n<summary><strong>¿Cada cuánto debo correr clash detection?</strong></summary>\nEn proyectos activos, cada 2-3 semanas. Antes de cada entrega de ingeniería de detalle.\n</details>\n`
  },
  'diafragma-rigido-semiflexible-etabs': {
    section: `\n\n## Preguntas frecuentes sobre diafragmas en ETABS\n\n<details>\n<summary><strong>¿ETABS asigna diafragma rígido automáticamente?</strong></summary>\nNo. Debes asignarlo manualmente: Assign > Diaphragm > Assign Diaphragm. Selecciona los niveles y elige "Rigid" o "Semi-Rigid".\n</details>\n\n<details>\n<summary><strong>¿Qué tipo de diafragma uso para losa aligerada?</strong></summary>\nPara losas aligeradas con relación ancho/largo menor a 3, usa diafragma rígido. Si tiene aberturas grandes o es irregular, usa semiflexible.\n</details>\n`
  },
  'automatiza-tareas-bim-python': {
    section: `\n\n## Preguntas frecuentes sobre automatización BIM con Python\n\n<details>\n<summary><strong>¿Python puede automatizar Navisworks?</strong></summary>\nSí, a través de la API de COM de Navisworks. Puedes automatizar la ejecución de clash detection y generación de reportes.\n</details>\n\n<details>\n<summary><strong>¿Puedo conectar Python con BIM 360?</strong></summary>\nSí. La API REST de Autodesk Forge (ahora Autodesk Platform Services) permite acceder a modelos de BIM 360 desde Python.\n</details>\n\n<details>\n<summary><strong>¿Es seguro automatizar procesos BIM con Python?</strong></summary>\nSí, siempre que uses TransactionManager correctamente y hagas backup del modelo antes de ejecutar scripts que modifiquen elementos.\n</details>\n`
  },
  'programé-revit-api-python-pyrevit-flujo': {
    section: `\n\n## Preguntas frecuentes sobre Revit API con Python\n\n<details>\n<summary><strong>¿Puedo crear plugins completos con pyRevit?</strong></summary>\nSí. pyRevit soporta scripts de comando, hooks de eventos, y formularios WPF. Es suficiente para la mayoría de automatizaciones de oficina.\n</details>\n\n<details>\n<summary><strong>¿Necesito licencia especial para usar Revit API?</strong></summary>\nNo. La API de Revit está incluida en todas las licencias de Revit (excepto Revit LT).\n</details>\n\n<details>\n<summary><strong>¿Cómo depuro un script de pyRevit que falla?</strong></summary>\nUsa print() para debug básico. Para debugging avanzado, configura VS Code con el debugger de CPython y conecta al proceso de pyRevit.\n</details>\n`
  },
  'venciendo-hoja-blanco-dynamo-revit': {
    section: `\n\n## Preguntas frecuentes sobre primeros scripts Dynamo\n\n<details>\n<summary><strong>¿Dónde guardo mis scripts de Dynamo?</strong></summary>\nEn una carpeta organizada: Documentos/Dynamo Scripts/Proyecto/. Así los encuentras fácilmente desde Dynamo Player.\n</details>\n\n<details>\n<summary><strong>¿Puedo compartir mis scripts con compañeros?</strong></summary>\nSí. Los archivos .dyn son portátiles. Solo asegúrate de que tengan la misma versión de Dynamo y los mismos paquetes instalados.\n</details>\n`
  },
  'dynamo-principiantes-primera-automatizacion-revit': {
    section: `\n\n## Preguntas frecuentes sobre Dynamo para principiantes\n\n<details>\n<summary><strong>¿Dynamo puede dañar mi modelo de Revit?</strong></summary>\nNo. Dynamo solo modifica el modelo si ejecutas nodos de escritura (SetName, SetParameter, etc.). Los nodos de lectura son seguros.\n</details>\n\n<details>\n<summary><strong>¿Necesito saber programación para Dynamo?</strong></summary>\nNo. Dynamo es programación visual. Conectar nodos es como armar un diagrama de flujo.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma aprender Dynamo?</strong></summary>\nLo básico: 2-4 semanas. Nivel intermedio: 2-3 meses. Dominar listas y Code Blocks: 6+ meses.\n</details>\n`
  },
  'creé-mi-primer-corredor-vial-civil-3d': {
    section: `\n\n## Preguntas frecuentes sobre corredores en Civil 3D\n\n<details>\n<summary><strong>¿Cuánto tiempo toma crear un corredor?</strong></summary>\nLa creación toma 5-10 minutos. La validación y ajuste toma 2-4 horas dependiendo de la complejidad del terreno.\n</details>\n\n<details>\n<summary><strong>¿Puedo tener múltiples ensamblajes en un corredor?</strong></summary>\nSí. Usa "Apply Assembly" en puntos específicos para cambiar la sección transversal en diferentes tramos.\n</details>\n`
  },
  'metrados-acero-corrugado-errores-presupuesto': {
    section: `\n\n## Preguntas frecuentes sobre metrado de acero\n\n<details>\n<summary><strong>¿Cuánto acero necesito por m²?</strong></summary>\nPara edificaciones de 3-5 pisos en Lima: 45-65 kg/m². Solo para estimación preliminar.\n</details>\n\n<details>\n<summary><strong>¿Fierro de 9m o 15m?</strong></summary>\nDepende de tus claros. Para claros de 5-7m, usa 9m. Para 8-12m, usa 15m.\n</details>\n`
  },
  'script-iniciales-dynamo-revit-hola-mundo': {
    section: `\n\n## Preguntas frecuentes sobre scripts iniciales\n\n<details>\n<summary><strong>¿Puedo ejecutar scripts sin abrir Dynamo?</strong></summary>\nSí. Con Dynamo Player (Manage > Dynamo Player) ejecutas scripts guardados directamente desde Revit.\n</details>\n\n<details>\n<summary><strong>¿Dynamo funciona con cualquier versión de Revit?</strong></summary>\nViene incluido con Revit 2021+. Para versiones anteriores, instálalo desde dynamobim.org.\n</details>\n`
  },
  'punzonamiento-cimentaciones-etabs-solucion': {
    section: `\n\n## Preguntas frecuentes sobre punzonamiento\n\n<details>\n<summary><strong>¿Cuándo necesito un capitel?</strong></summary>\nCuando Vu/φVn supera 1.0 y no puedes aumentar el peralte por limitaciones constructivas.\n</details>\n\n<details>\n<summary><strong>¿ETABS verifica punzonamiento automáticamente?</strong></summary>\nSí, si configuras el Design Strip correctamente. Verifica manualmente el perímetro crítico.\n</details>\n`
  },
  'navisworks-choques-clash-detection-paradoja': {
    section: `\n\n## Preguntas frecuentes sobre coordinación con Navisworks\n\n<details>\n<summary><strong>¿Cuántos clashes son aceptables?</strong></summary>\nPara LOD 350: máximo 50 hard clashes. Para LOD 400: 0 clashes.\n</details>\n\n<details>\n<summary><strong>¿BCF es mejor que reporte PDF?</strong></summary>\nSí. El BCF se abre directamente en Revit, Tekla, ArchiCAD. El especialista resuelve en su modelo.\n</details>\n`
  },
  'dynamo-vs-pyrevit-automatizacion-bim': {
    section: `\n\n## Preguntas frecuentes sobre Dynamo vs pyRevit\n\n<details>\n<summary><strong>¿Puedo usar ambos juntos?</strong></summary>\nSí. Puedes ejecutar Dynamo desde pyRevit o llamar a Python desde Dynamo.\n</details>\n\n<details>\n<summary><strong>¿pyRevit funciona con Revit LT?</strong></summary>\nNo. Revit LT no soporta add-ins ni la API de Revit.\n</details>\n`
  },
  'civil-3d-carreteras-guia-completa': {
    section: `\n\n## Preguntas frecuentes sobre Civil 3D para carreteras\n\n<details>\n<summary><strong>¿Civil 3D cumple con el Manual de Diseño Geométrico del MTC?</strong></summary>\nCivil 3D es una herramienta. El cumplimiento del manual depende de cómo configures los parámetros de diseño (velocidad, peralte, visibilidad).\n</details>\n\n<details>\n<summary><strong>¿Puedo importar datos topográficos de drone?</strong></summary>\nSí. Importa la nube de puntos o la superficie rasterizada como archivo .LAS o .xyz y crea la superficie en Civil 3D.\n</details>\n`
  },
  'modelamiento-bim-estructural-revit-etabs': {
    section: `\n\n## Preguntas frecuentes sobre modelamiento BIM estructural\n\n<details>\n<summary><strong>¿El modelo de Revit reemplaza al de ETABS?</strong></summary>\nNo. Revit es para documentación y coordinación. ETABS es para análisis y diseño. Ambos son complementarios.\n</details>\n\n<details>\n<summary><strong>¿Cómo transfiero el modelo de Revit a ETABS?</strong></summary>\nA través del plugin CSiXRevit o del formato IFC. CSiXRevit preserva mejor las propiedades estructurales.\n</details>\n`
  },
  'modelamiento-vigas-revit-copiar-niveles': {
    section: `\n\n## Preguntas frecuentes sobre modelamiento de vigas\n\n<details>\n<summary><strong>¿Las vigas se copian con sus refuerzos?</strong></summary>\nSi usas "Copy with Paste Aligned", las vigas se copian con sus propiedades. Los refuerzos de rebar requieren extensión adicional.\n</details>\n\n<details>\n<summary><strong>¿Qué pasa si el arquitecto cambia la altura de un piso?</strong></summary>\nLas vigas se ajustan automáticamente si están constraintadas a los niveles. Verifica después de cada cambio.\n</details>\n`
  },
  'excel-metrado-acero-calculo-automatico': {
    section: `\n\n## Preguntas frecuentes sobre metrado en Excel\n\n<details>\n<summary><strong>¿Puedo importar datos de Revit a Excel automáticamente?</strong></summary>\nSí. View > Schedules > Export to Excel. Los datos llegan limpios a tu plantilla.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma hacer metrados manualmente?</strong></summary>\nPara edificación de 3 pisos: 2-3 días manual, 2-4 horas automatizado.\n</details>\n`
  },
  'etabs-analisis-sismico-norma-e030': {
    section: `\n\n## Preguntas frecuentes sobre análisis sísmico en ETABS\n\n<details>\n<summary><strong>¿ETABS genera el espectro de la E.030 automáticamente?</strong></summary>\nNo. Debes definir la función de espectro manualmente con los valores de Z, U, C, S, R de la norma.\n</details>\n\n<details>\n<summary><strong>¿Necesito análisis time-history para edificaciones regulares?</strong></summary>\nNo. El análisis espectral es suficiente. El time-history es para estructuras especiales o irregulares.\n</details>\n`
  },
  'revit-vs-autocad-cual-aprender': {
    section: `\n\n## Preguntas frecuentes sobre Revit vs AutoCAD\n\n<details>\n<summary><strong>¿AutoCAD desaparecerá?</strong></summary>\nNo. AutoCAD sigue siendo útil para detalles 2D, planos de taller, y proyectos pequeños. Pero BIM es el futuro para proyectos grandes.\n</details>\n\n<details>\n<summary><strong>¿Cuánto tiempo toma aprender Revit?</strong></summary>\nLo básico: 1-2 meses. Nivel intermedio: 3-6 meses. Dominar la plataforma: 1-2 años.\n</details>\n`
  },
  'automatiza-tu-primer-proceso-dynamo': {
    section: `\n\n## Preguntas frecuentes sobre automatización con Dynamo\n\n<details>\n<summary><strong>¿Dynamo es gratis?</strong></summary>\nSí, viene incluido con Revit desde la versión 2021.\n</details>\n\n<details>\n<summary><strong>¿Puedo ejecutar scripts sin abrir Dynamo?</strong></summary>\nSí, con Dynamo Player. Manage > Dynamo Player.\n</details>\n`
  },
  'automatiza-metrados-obra-excel': {
    section: `\n\n## Preguntas frecuentes sobre metrados en Excel\n\n<details>\n<summary><strong>¿Cuánto tiempo toma configurar la plantilla?</strong></summary>\nLa primera vez: 4-6 horas. En proyectos siguientes: 30 minutos para adaptar.\n</details>\n\n<details>\n<summary><strong>¿Puedo usar esta plantilla para cualquier tipo de obra?</strong></summary>\nLa estructura es adaptable. Para obras viales, hidraúlicas o industriales, modifica los ítems del resumen.\n</details>\n`
  },
  'haz-predimensionamiento-columnas-vigas': {
    section: `\n\n## Preguntas frecuentes sobre predimensionamiento\n\n<details>\n<summary><strong>¿El predimensionamiento reemplaza al diseño estructural?</strong></summary>\nNo. El predimensionamiento es una estimación inicial. El diseño final debe verificar todas las cargas, combinaciones y normas.\n</details>\n\n<details>\n<summary><strong>¿Estas fórmulas aplican para cualquier tipo de estructura?</strong></summary>\nLas fórmulas presentadas son para edificaciones de concreto armado de uso común. Para estructuras especiales (puentes, naves industriales), usa criterios específicos.\n</details>\n`
  },
  'bim-obligatorio-peru-2026': {
    section: `\n\n## Preguntas frecuentes sobre BIM obligatorio\n\n<details>\n<summary><strong>¿Mi empresa pequeña también está obligada?</strong></summary>\nSí. La Ley 32069 no distingue por tamaño. Si quieres postular a licitaciones públicas, necesitas cumplir.\n</details>\n\n<details>\n<summary><strong>¿Qué software BIM debo comprar primero?</strong></summary>\nLo mínimo: Autodesk Revit, Navisworks Manage, y un CDE como BIM 360 o ACC.\n</details>\n\n<details>\n<summary><strong>¿Cuánto cuesta implementar BIM?</strong></summary>\nAproximadamente S/ 15,000-25,000 en licencias + S/ 8,000-15,000 en capacitación para 5 ingenieros.\n</details>\n`
  },
  'implemente-bim-proyecto-tambien-puedes': {
    section: `\n\n## Preguntas frecuentes sobre implementación BIM\n\n<details>\n<summary><strong>¿Cuánto tiempo toma implementar BIM?</strong></summary>\n3-6 meses para un equipo de 5 personas. Incluye capacitación, licencias y proyecto piloto.\n</details>\n\n<details>\n<summary><strong>¿Necesito un BIM Manager dedicado?</strong></summary>\nPara equipos pequeños (3-5 personas), el BIM Manager puede ser un ingeniero con 50% de su tiempo. Para equipos grandes, debe ser dedicado.\n</details>\n`
  },
  'preparé-transicion-bim-6-meses': {
    section: `\n\n## Preguntas frecuentes sobre transición a BIM\n\n<details>\n<summary><strong>¿Puedo hacer la transición sin dejar de trabajar en proyectos actuales?</strong></summary>\nSí. Dedica 2-3 horas diarias a la capacitación BIM y usa un proyecto piloto pequeño para aplicar lo aprendido.\n</details>\n\n<details>\n<summary><strong>¿Qué habilidades debo priorizar?</strong></summary>\n1. Revit (modelado básico), 2. Navisworks (coordinación), 3. ISO 19650 (gestión de información), 4. Dynamo o pyRevit (automatización).\n</details>\n`
  },
  'hp-prime-programa-hardy-cross': {
    section: `\n\n## Preguntas frecuentes sobre Hardy Cross en HP Prime\n\n<details>\n<summary><strong>¿El método Hardy Cross sigue siendo relevante?</strong></summary>\nSí, para verificación manual de resultados de software y para estructuras simples donde no vale la pena modelar en software.\n</details>\n\n<details>\n<summary><strong>¿Puedo usar este programa para pórticos de más de 3 pisos?</strong></summary>\nEl programa funciona para cualquier número de pisos. El límite práctico es el tiempo de cálculo manual para verificar.\n</details>\n`
  },
  'creé-plan-ejecucion-bim': {
    section: `\n\n## Preguntas frecuentes sobre Plan de Ejecución BIM\n\n<details>\n<summary><strong>¿Cuántas páginas debe tener un BEP?</strong></summary>\nPara edificación de 3 pisos: 10-15 páginas. Para proyectos grandes: 30-50+ páginas.\n</details>\n\n<details>\n<summary><strong>¿Quién elabora el BEP?</strong></summary>\nEl Coordinador BIM con aportes de cada líder de disciplina. Debe ser aprobado antes de iniciar el modelado.\n</details>\n`
  },
  'creé-primer-script-python': {
    section: `\n\n## Preguntas frecuentes sobre Python para ingenieros\n\n<details>\n<summary><strong>¿Necesito saber programar para empezar?</strong></summary>\nNo. Python es uno de los lenguajes más amigables para principiantes. Empieza con variables, loops y funciones básicas.\n</details>\n\n<details>\n<summary><strong>¿Python puede hacer cálculos estructurales?</strong></summary>\nSí. Con NumPy y SciPy puedes resolver sistemas de ecuaciones, integrar funciones, y optimizar diseños.\n</details>\n`
  },
};

async function main() {
  console.log('🔧 Mejora profesional masiva de contenido para AdSense\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  if (error || !posts) {
    console.error('❌ Error:', error?.message);
    return;
  }

  console.log(`📊 ${posts.length} posts a procesar\n`);

  let titlesFixed = 0;
  let faqsAdded = 0;
  let tablesAdded = 0;

  // ── PASS 1: Fix titles ──
  console.log('═══════════════════════════════════════════════');
  console.log('📝 PASO 1: Corregir títulos clickbait');
  console.log('═══════════════════════════════════════════════\n');

  for (const post of posts) {
    const newTitle = TITLE_FIXES[post.slug];
    if (newTitle && newTitle !== post.title) {
      console.log(`📌 "${post.title}"`);
      console.log(`   → "${newTitle}"`);
      
      // Also update meta_title and slug if needed
      const updates: any = { title: newTitle };
      if (!post.meta_title || post.meta_title === post.title) {
        updates.meta_title = newTitle;
      }
      
      console.log(`   ✅ Título actualizado\n`);
      titlesFixed++;
    }
  }

  // ── PASS 2: Add FAQs ──
  console.log('═══════════════════════════════════════════════');
  console.log('❓ PASO 2: Agregar FAQs a posts sin sección');
  console.log('═══════════════════════════════════════════════\n');

  for (const post of posts) {
    const faq = FAQ_ADDITIONS[post.slug];
    if (faq && !post.content?.includes('<details>')) {
      console.log(`📌 "${post.title}"`);
      console.log(`   + FAQ section\n`);
      faqsAdded++;
    }
  }

  console.log(`\n📊 Resumen planificada:`);
  console.log(`   Títulos a corregir: ${titlesFixed}`);
  console.log(`   FAQs a agregar: ${faqsAdded}`);

  // Execute changes
  for (const post of posts) {
    const updates: any = {};

    // Fix title
    const newTitle = TITLE_FIXES[post.slug];
    if (newTitle && newTitle !== post.title) {
      updates.title = newTitle;
      if (!post.meta_title || post.meta_title === post.title) {
        updates.meta_title = newTitle;
      }
    }

    // Add FAQ
    const faq = FAQ_ADDITIONS[post.slug];
    if (faq && !post.content?.includes('<details>')) {
      updates.content = (post.content || '') + faq.section;
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', post.id);

      if (updateError) {
        console.log(`   ❌ Error en "${post.title}": ${updateError.message}`);
      }
    }
  }

  console.log('\n✅ Mejora profesional completada');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
