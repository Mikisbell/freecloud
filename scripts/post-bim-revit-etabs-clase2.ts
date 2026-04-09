import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const content = `En la clase anterior configuramos el vínculo entre el modelo arquitectónico y el modelo estructural en Revit. Ahora viene el trabajo real: modelar las vigas, columnas y losas estructurales, y copiarlos en todos los niveles del edificio.

Esta es la clase más práctica del flujo BIM estructural — aquí es donde el modelo empieza a tomar forma.

## Copiar y Supervisar Elementos Estructurales

Cuando vinculás el modelo arquitectónico al modelo estructural, Revit te permite copiar elementos del vínculo y **supervisarlos**. Esto significa que si el arquitecto cambia algo en su modelo, Revit te avisa con una alerta de coordinación.

Los elementos que podés copiar y supervisar son:
- **Niveles** — la altura de cada piso
- **Rejillas** — los ejes A, B, C... y 1, 2, 3...
- **Pilares** — columnas arquitectónicas como referencia
- **Muros** — muros arquitectónicos para coordinar con muros estructurales
- **Suelos** — losas arquitectónicas como referencia

### Cómo configurar Copiar/Supervisar

1. Ve a la pestaña **Colaborar** → **Copiar/Supervisar** → **Seleccionar vínculo**
2. Clic en el modelo arquitectónico vinculado
3. Aparecen las opciones: Niveles, Rejillas, Pilares, Muros, Suelos
4. Seleccioná los elementos que querés copiar
5. En **Opciones** podés mapear el tipo arquitectónico al tipo estructural equivalente

<Callout type="tip">
Siempre supervisá los niveles y rejillas primero. Son la base de todo el modelo. Si el arquitecto cambia la altura de un piso, necesitás saberlo antes de que afecte tus vigas y columnas.
</Callout>

## Control de Visibilidad y Gráficos en Revit

Cuando trabajás con modelos vinculados, la pantalla se puede saturar de información. Revit tiene herramientas para controlar qué se muestra y qué no.

### Modificar visibilidad de gráficos (VG o VV)

El atajo de teclado **VG** (o **VV**) abre la ventana de Visibilidad/Gráficos. Desde ahí podés:
- Mostrar u ocultar categorías enteras (vigas, columnas, muros, etc.)
- Cambiar colores de línea y de relleno por categoría
- Controlar la transparencia de elementos
- Ocultar el modelo vinculado completo o por categoría

### Mostrar/Ocultar elementos individuales

- **HH** — oculta el elemento seleccionado temporalmente (solo en esa vista)
- **HA** — oculta el elemento seleccionado permanentemente en la vista
- Para volver a mostrar: botón de **bombilla** en la barra inferior de la vista

<Callout type="info">
El modelo analítico que genera Revit automáticamente al modelar se puede ocultar con VG. Para el trabajo diario de modelamiento no lo necesitás visible — lo activás solo cuando vas a exportar a ETABS.
</Callout>

## Modelamiento de Vigas en Revit Estructuras

Las vigas en Revit se dibujan desde la pestaña **Estructura** → **Viga**.

### Antes de dibujar: define la sección

1. En el panel de propiedades, seleccioná el tipo de viga
2. Si no existe la sección que necesitás (ej: 30x60 cm), cargá una familia o créala:
   - **Cargar familia** → busca en la librería de Autodesk familias de concreto
   - **Editar tipo** → duplicá un tipo existente y cambiá las dimensiones

### Cómo dibujar las vigas

1. Seleccioná la vista de planta del nivel donde vas a trabajar
2. Pestaña **Estructura** → **Viga**
3. Elegí la sección correcta en el panel de propiedades
4. Dibujá de eje a eje — de columna a columna
5. Revit genera automáticamente el modelo analítico de la viga

### El modelo analítico de vigas

Cuando dibujás una viga, Revit genera una línea analítica superpuesta:
- **Verde** en el extremo inicial
- **Naranja** en el centro
- **Rojo** en el extremo final

Este modelo analítico es lo que se exporta a ETABS. Si los extremos no están bien conectados a las columnas, el análisis estructural va a tener errores.

<Callout type="warning">
Verificá siempre que los extremos de las vigas estén conectados a los nodos de las columnas. En ETABS, una viga que "flota" sin conexión genera errores de análisis o resultados incorrectos.
</Callout>

## Copiar Vigas en Todos los Niveles

Una vez que terminaste de modelar las vigas en el Nivel 1 (o en el nivel base), podés copiarlas a todos los pisos superiores en un solo paso.

### Proceso:

1. En una **vista de alzado o sección**, seleccioná todas las vigas del nivel base
2. Pestaña **Modificar** → **Copiar al portapapeles** (Ctrl+C)
3. **Pegar** → **Alineado con niveles seleccionados**
4. En el cuadro de diálogo, seleccioná los niveles destino: Nivel 2, 3, 4, 5...
5. Clic en **Aceptar**

Revit copia las vigas con la misma sección y posición relativa en cada nivel seleccionado.

<Callout type="tip">
Si tenés pisos con diferente distribución estructural (planta baja vs pisos típicos), modelá primero el piso típico y copialo. La planta baja modélala por separado porque generalmente tiene columnas y vigas de mayor sección.
</Callout>

## Orden de Modelamiento Recomendado

Para un edificio de concreto armado típico en Perú, el orden correcto es:

1. **Niveles y rejillas** — copiados y supervisados del modelo arquitectónico
2. **Columnas** — de cimentación al último nivel
3. **Vigas** — por nivel, empezando desde el piso típico
4. **Losas** — después de vigas para que los bordes se definan correctamente
5. **Muros de corte** — si el sistema estructural los incluye
6. **Cimentación** — zapatas, vigas de cimentación o losa de cimentación

Este orden garantiza que Revit pueda generar el modelo analítico correctamente para la exportación a ETABS.

## Verificación antes de exportar a ETABS

Antes de exportar, revisá estos puntos en Revit:

- Todas las vigas están conectadas a columnas (sin extremos sueltos)
- Los niveles del modelo estructural coinciden con el arquitectónico
- Las secciones asignadas corresponden al predimensionamiento
- El modelo analítico está activo y sin advertencias

En la siguiente clase veremos cómo configurar las losas estructurales y los muros de corte — los elementos que completan el modelo antes de la exportación a ETABS.`;

async function main() {
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'bim-peru')
    .single();

  if (!cat) { console.error('Category not found'); process.exit(1); }

  const { data, error } = await supabase.from('posts').insert({
    title: 'Modelamiento de Vigas en Revit: Copiar, Supervisar y Pegar en Todos los Niveles',
    slug: 'revit-modelamiento-vigas-copiar-supervisar-niveles',
    excerpt: 'Aprende a modelar vigas estructurales en Revit, copiarlas en todos los niveles del edificio y controlar la visibilidad del modelo BIM. Flujo real para ingenieros peruanos.',
    meta_title: 'Modelamiento de Vigas en Revit Estructural — Copiar en Niveles (2026)',
    meta_description: 'Cómo modelar vigas en Revit Estructuras, copiarlas en todos los pisos y verificar el modelo analítico antes de exportar a ETABS. Guía paso a paso para ingenieros civiles en Perú.',
    content,
    category_id: cat.id,
    tags: ['revit', 'bim', 'modelamiento-estructural', 'vigas', 'etabs'],
    author: 'Miguel Angel Rivera',
    reading_time: 7,
    status: 'published',
    featured_image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
    published_at: '2026-03-25T08:00:00.000Z',
  }).select('id, slug').single();

  if (error) console.error('❌', error.message);
  else console.log('✅ Published:', data.slug);
}

main();
