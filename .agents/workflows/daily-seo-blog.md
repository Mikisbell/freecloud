---
description: Create a daily SEO-optimized blog post based on the Nicho Nauta protocol
---
# Daily SEO Blog Post (Nicho Nauta Protocol)

Este flujo de trabajo es activado cuando el usuario solicita su "rutina diaria de blog" o indica que es momento de publicar un nuevo artículo para monetización/SEO.

## Objetivo
Mantener el sitio vivo y activo publicando artículos de alta calidad basados en el **Search Intent** real, siguiendo la metodología probada (Nicho Nauta) de sintetizar el top 3 de los resultados de Google y enlazado interno eficiente.

## Instrucciones Paso a Paso para el Agente

1. **Solicitar Tema/Keyword (si no fue proveído):** El agente debe pedirle al usuario cuál es la palabra clave de baja competencia o el tema técnico de hoy dentro del nicho (Automatización, Revit, Dynamo, BIM, Estructuras, Next.js).
2. **Investigación (Scraping Inteligente):**
   - Usa herramientas de búsqueda (ej. `search_web`) para la palabra clave.
   - Analiza (visita y haz un resumen) de **los 3 primeros resultados** orgánicos.
   - Extrae los puntos clave y abordajes de esos 3 artículos para **sintetizar un artículo definitivo** que sea más completo y mejor estructurado que ellos.
3. **Creación del Artículo (MDX):**
   - Escribe un artículo extenso en la ruta `/content/blog/` (o la ruta donde existan los posts del proyecto). Verifica la ruta correcta para crear el archivo `.mdx` o `.md`.
   - **Metadatos SEO:**
     - `title`: Máximo 60 caracteres, debe generar intriga e incluir la palabra clave principal al inicio si es posible.
     - `description`: Resumen atractivo para el meta description.
   - **Enlazado Interno (Interlinking):** Inserta un máximo de 3 enlaces (relacionados con el tema) **dentro del contenido** hacia otros artículos del blog, usando el componente correspondiente o enlaces Markdown nativos. No lo escondas en menús.
   - **Imágenes:**
     - 1 imagen de portada (Hero/Cover).
     - 1 imagen interna (mitad del post).
     - Escribe `alt` texts extremadamente exhaustivos y naturales en español para ambas imágenes. Esto atrae peticiones por Google Images.
     - *Nota:* Usa el generador de imágenes o avisa al usuario para proveer las imágenes pasadas a formato WebP (<100KB, ej. 800x450).
4. **Verificación y Push:**
   - Asegúrate de que el código recompile (`npm run build`).
   - Haz commit de los cambios bajo `feat(blog): post diario sobre [keyword]`.
   - Empuja los cambios (`git push`) para que Vercel haga deploy y el contenido quede indexado.
   
## Notas de Comportamiento
No inventes información, básate en el Top 3 y mejóralo estructuralmente. Escribe párrafos cortos y usa subtítulos (H2, H3), viñetas y negritas de manera natural y esporádica resaltando conceptos clave, no forzando el "keyword stuffing".
