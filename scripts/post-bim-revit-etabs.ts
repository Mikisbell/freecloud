import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const content = `En Perú, BIM ya no es opcional. La Ley 32069 establece que todos los proyectos de inversión pública deben implementar la metodología BIM, y el software más usado para estructuras es la combinación Revit + ETABS. Pero ¿cómo se trabaja con los dos al mismo tiempo? ¿Qué significa realmente "trabajo colaborativo" en un proyecto estructural?

Esta guía está basada en el flujo real que usan los ingenieros estructurales en Perú para modelar edificios de concreto armado con BIM.

## ¿Qué es el Modelamiento BIM Estructural?

El modelamiento BIM estructural no es solo dibujar en 3D. Es crear un modelo digital con información — materiales, secciones, cargas, niveles — que luego se exporta a ETABS para el análisis sísmico según la Norma E.030.

El flujo básico es:

1. **Revit** → modelamiento arquitectónico y estructural (geometría, niveles, secciones)
2. **Exportación IFC/vínculo** → interoperabilidad entre los dos softwares
3. **ETABS** → análisis y diseño estructural (cargas, derivas, diseño E.030)
4. **Coordinación** → actualizaciones bidireccionales entre ambos modelos

<Callout type="info">
En proyectos públicos peruanos que exigen BIM, el modelo de Revit se convierte en el entregable oficial (PEB). ETABS genera las memorias de cálculo. Ambos deben estar coordinados.
</Callout>

## La Interfaz de Revit para Estructuras

Cuando abres Revit por primera vez, vas a ver varias pestañas. La que más vas a usar como ingeniero estructural es la pestaña **Estructura**, no Arquitectura.

La diferencia es importante:

| Elemento | Arquitectónico | Estructural |
|---|---|---|
| Pilar | Recubrimiento decorativo | Columna de concreto portante |
| Muro | Tabiquería / acabados | Muro de corte o portante |
| Suelo | Cielo raso | Losa estructural |

### Elementos que vas a modelar en Revit Estructuras

- **Vigas** — definidas por sección (30x60, 25x50, etc.)
- **Columnas estructurales** — diferentes de pilares arquitectónicos
- **Muros de corte** — los que resisten la fuerza sísmica lateral
- **Losas** — losa maciza o nervada, con su espesor
- **Cimentaciones** — zapatas aisladas, combinadas, losa de cimentación

<Callout type="tip">
Revit tiene dos tipos de pilares: el arquitectónico y el estructural. Para análisis en ETABS, solo los pilares estructurales se exportan correctamente. Si modelás con pilar arquitectónico, ETABS no lo va a leer.
</Callout>

## Trabajo Colaborativo: Revit Arquitectura + Revit Estructuras

Aquí está el punto clave que diferencia BIM de trabajar con archivos separados.

En un proyecto BIM, el arquitecto trabaja en su modelo de Revit y el ingeniero estructural trabaja en el suyo. Los dos modelos se **vinculan** — no se copian, se vinculan — para que cuando el arquitecto mueve una pared, el ingeniero lo ve en su modelo.

El proceso es:

1. El arquitecto entrega su archivo RVT (modelo de arquitectura)
2. El ingeniero lo **inserta como vínculo** en su modelo estructural
3. El ingeniero **copia y monitorea** los niveles y ejes del modelo arquitectónico
4. A partir de esos niveles, modela las columnas, vigas y losas estructurales

<Callout type="warning">
Nunca copies y pegues elementos del modelo arquitectónico en el modelo estructural. Usa "Copiar/Monitorear" para mantener la coordinación. Si el arquitecto cambia la altura de un piso, te va a aparecer una alerta de coordinación automáticamente.
</Callout>

## Interoperabilidad Revit → ETABS

La exportación del modelo de Revit a ETABS es el paso más crítico del flujo BIM estructural.

Hay dos métodos:

### Método 1: Exportación IFC

- Revit exporta el modelo en formato IFC (estándar internacional BIM)
- ETABS importa el IFC y genera el modelo estructural
- **Ventaja:** estándar abierto, funciona con cualquier versión
- **Desventaja:** necesita revisión manual de propiedades de materiales

### Método 2: Plugin CSiXRevit (recomendado)

- Autodesk y CSI desarrollaron un plugin específico para Revit → ETABS
- Exporta directamente las secciones, materiales y restricciones
- **Ventaja:** mapeo automático de propiedades estructurales
- **Desventaja:** requiere configurar el mapeo de materiales peruanos (f'c=210, fy=4200)

## Configuración Inicial en Revit para Proyectos Peruanos

Antes de empezar a modelar, configurá estas opciones:

**Unidades:**
- Sistema: métrico (metros o milímetros)
- Perú usa metros para dimensiones de planos y milímetros para secciones

**Niveles:**
- Define todos los pisos desde el inicio
- Nombra como: Sótano, Piso 1, Piso 2... (no "Level 1", "Level 2")
- La altura entre pisos debe coincidir con la memoria de cálculo

**Materiales:**
- Concreto f'c = 210 kg/cm² (el más común en edificios residenciales en Perú)
- Acero fy = 4,200 kg/cm² (corrugado ASTM A615 Grado 60)

<Callout type="info">
En Perú, el f'c = 210 kg/cm² equivale a 20.6 MPa. Cuando configures los materiales en Revit, asegurate de usar las unidades correctas para que la exportación a ETABS sea consistente.
</Callout>

## Qué viene en las siguientes clases

El flujo completo del modelamiento BIM estructural con Revit y ETABS cubre:

1. **Clase 1 (esta):** Introducción, interfaz Revit, trabajo colaborativo
2. **Clase 2:** Modelamiento de columnas y vigas en Revit Estructuras
3. **Clase 3:** Losas, muros de corte y cimentaciones
4. **Clase 4:** Exportación a ETABS, configuración de materiales y secciones
5. **Clase 5:** Análisis sísmico E.030 en ETABS — espectro de diseño y derivas

Si estás empezando con BIM estructural en Perú, dominar este flujo Revit → ETABS es el requisito mínimo para trabajar en proyectos que ya exigen la metodología BIM según la Ley 32069.`;

async function main() {
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'bim-peru')
    .single();

  if (!cat) { console.error('Category not found'); process.exit(1); }

  const { data, error } = await supabase.from('posts').insert({
    title: 'Modelamiento BIM Estructural con Revit y ETABS: Guía para Ingenieros Peruanos',
    slug: 'modelamiento-bim-estructural-revit-etabs-guia',
    excerpt: 'Aprende el flujo real de trabajo BIM estructural en Perú: Revit para modelar, ETABS para analizar. Interoperabilidad, trabajo colaborativo y configuración para la norma E.030.',
    meta_title: 'Modelamiento BIM Estructural con Revit y ETABS — Guía Perú 2026',
    meta_description: 'Flujo completo de trabajo BIM estructural en Perú: Revit + ETABS, interoperabilidad IFC, trabajo colaborativo y configuración para norma E.030. Para ingenieros civiles.',
    content,
    category_id: cat.id,
    tags: ['revit', 'etabs', 'bim', 'modelamiento-estructural', 'e030', 'interoperabilidad'],
    author: 'Miguel Angel Rivera',
    reading_time: 8,
    status: 'published',
    featured_image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
    published_at: '2026-03-26T08:00:00.000Z',
  }).select('id, slug').single();

  if (error) console.error('❌', error.message);
  else console.log('✅ Published:', data.slug);
}

main();
