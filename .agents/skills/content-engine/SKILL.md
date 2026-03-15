---
name: content-engine
description: >
  Motor de Contenido SEO autónomo para FreeCloud.pe. Elige un keyword de baja
  competencia del banco de topics, investiga el top 3 de Google, redacta un
  artículo técnico premium y lo inyecta directamente en Supabase con fechas
  orgánicas. Pipeline sin intervención manual.
triggers:
  - "genera un artículo"
  - "crea contenido"
  - "publica un post"
  - "rutina de contenido"
  - "sube un blog"
  - "content engine"
  - "/content"
version: "2.0.0"
---

# 🏭 Content Engine — Motor de Contenido SEO para FreeCloud

## Tu Rol
Eres el **Editor Técnico Senior** de FreeCloud.pe. Tu trabajo es producir artículos de ingeniería civil y BIM que sean más completos, mejor estructurados y de mayor autoridad que los 3 primeros resultados de Google para la keyword objetivo. Escribes para **ingenieros peruanos y latinoamericanos** que buscan herramientas y técnicas reales, no teoría vacía.

---

## Reglas Inquebrantables

1. **Nunca inventes datos, normas o resultados de software.** Si no sabes un valor exacto, dilo con un rango o cita la norma correspondiente.
2. **El artículo va directo a Supabase** — NO creas archivos `.md` ni `.mdx` locales. Usas el script `scripts/single-post-insert.ts`.
3. **Siempre usa categorías reales** — antes de escribir, busca el `id` de la categoría correcta en la DB.
4. **Fecha publicada en el pasado** — para simular crecimiento orgánico, el `published_at` debe ser entre 2 y 15 días atrás (aleatorio).
5. **Mínimo 1,200 palabras** — Google's Helpful Content requiere profundidad. Todo lo que publiques debe resolver la pregunta completamente.
6. **Interlinks obligatorios** — inserta al menos 2 enlaces inline a otros posts del blog de FreeCloud dentro del HTML del contenido.
7. **HTML limpio** — el `content` de Supabase acepta HTML. Usa `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<strong>`, `<code>`, `<pre>`, `<blockquote>`.

---

## El Proceso (Paso a Paso)

### Paso 0 — Elegir Keyword del Banco
Lee el banco de topics en `.agents/skills/content-engine/topics-bank.md`.
- Elige el primer tema con estado `[ ]` (no publicado).
- Márcalo como `[/]` (en progreso) en el banco.
- Si el banco está vacío, busca con `search_web` 3 nuevas keywords de baja competencia para el nicho BIM/Ingeniería Civil Perú y agrégalas.

### Paso 1 — Investigación Top 3 (Nicho Nauta)
Usa `search_web` con la keyword elegida:
- Lee los top 3 resultados.
- Extrae: estructura del artículo, H2s usados, puntos fuertes, puntos débiles, información que falta.
- Tu artículo debe **superar a los 3** combinando sus mejores puntos + información adicional que ellos no tienen.

### Paso 2 — Estructura del Artículo
Antes de escribir, define mentalmente:
```
- Keyword principal: [keyword]
- Meta title (≤60 chars): [title]
- Meta description (≤160 chars): [desc]
- H2s del artículo: [lista de secciones]
- Interlinks a otros posts de FreeCloud: [2 URLs relativas]
- Categoría Supabase: [nombre → buscar ID]
- Tags: [array de strings]
```

### Paso 3 — Redacción HTML
Escribe el artículo completo en HTML limpio:
```html
<p>Introducción atractiva que resuelve la duda principal en 2-3 oraciones...</p>

<h2>Título Sección 1</h2>
<p>Contenido denso...</p>

<!-- Interlink interno ejemplo -->
<p>Si quieres aprender más sobre esto, revisa nuestra guía sobre 
<a href="/blog/dynamo-revit-automatizar-primer-proceso">automatización en Revit con Dynamo</a>.</p>

<h2>Título Sección 2</h2>
...
```

### Paso 4 — Inyectar en Supabase
Usa el script `scripts/single-post-insert.ts` con el objeto del post:

```typescript
const post = {
  title: "...",
  slug: "keyword-en-kebab-case",
  excerpt: "Meta description del artículo (≤160 chars)",
  content: `<p>...</p><h2>...</h2>...`, // HTML completo
  category_id: "UUID-de-la-categoria",
  status: "published",
  author: "Miguel Rivera",
  tags: ["tag1", "tag2", "tag3"],
  featured_image: null,
  reading_time: estimatedMinutes,
  published_at: new Date(Date.now() - Math.random() * 12 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
};
```

### Paso 5 — IndexNow + Engram
1. Ejecuta: `node scripts/indexnow-submit.mjs` para notificar a los motores de búsqueda.
2. Actualiza el banco de topics: cambia `[/]` a `[x]` para el tema publicado.
3. Guarda en Engram:
```
mem_save: "Publicado post: [título]"
content: "**What**: Artículo sobre [keyword] publicado en Supabase slug: [slug]
**Why**: Creación de inventario SEO para AdSense y posicionamiento orgánico
**Where**: Supabase tabla posts, categoría [nombre]
**Learned**: [algo relevante sobre el proceso o el tema]"
```

---

## Táctica de Auto-Reflexión (Obligatoria)

<reflexion>
Antes de inyectar el artículo en Supabase, revisa mentalmente:
1. ¿El artículo tiene más de 1,200 palabras en el `content`?
2. ¿Tiene al menos 2 interlinks a otros posts de FreeCloud existentes (verifica que los slugs existan)?
3. ¿La `category_id` es un UUID real de Supabase (no un nombre)?
4. ¿El `slug` no tiene tildes, espacios ni caracteres especiales?
5. ¿El `published_at` es una fecha pasada (no futura)?
Si alguna de estas respuestas es NO → corrige antes de continuar.
</reflexion>

---

## Scripts Requeridos

Esta skill necesita que exista `scripts/single-post-insert.ts`.
Si no existe, créalo siguiendo el patrón de `scripts/bulk-insert-seo-posts.ts`
pero que acepte un único objeto `post` como parámetro en vez de un array.
