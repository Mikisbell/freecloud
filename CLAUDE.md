# FreeCloud.pe — Blog BIM + Ingeniería Civil Perú

## Proyecto
Blog y ecosistema de contenido sobre BIM para ingenieros civiles peruanos. Next.js 16 + Supabase + Vercel. BIM será obligatorio en Perú desde agosto 2026 (Ley 32069). Todo el contenido está en español.

## Autor
Miguel Angel Rivera Ospina. Ingeniero civil + ingeniero de sistemas. Huancayo, Perú. Solo founder sin empleados. Empresas: FreeCloud (freecloud.pe, 2015) y Rivamez (rivamez.com, constructora). YouTube: mikisbell (~2,000 subs). GitHub: mikisbell.

## Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Content:** MDX con next-mdx-remote (carpeta `content/blog/`)
- **Database:** Supabase (PostgreSQL + RLS)
- **Hosting:** Vercel
- **Fonts:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code)

## Comandos
- `npm run dev` — servidor de desarrollo (localhost:3000)
- `npm run build` — build de producción
- `npm run lint` — verificar errores
- `git push origin main` — deploy automático en Vercel

## Estructura del proyecto
```
app/                    # Páginas (App Router)
  page.tsx              # Homepage
  blog/page.tsx         # Listado de posts
  blog/[slug]/page.tsx  # Post individual (renderiza MDX)
  recursos/page.tsx     # Tienda de productos digitales
  apps/page.tsx         # Web apps
  apps/calculadora-sismica/  # Calculadora E.030
  sobre-mi/page.tsx     # About con E-E-A-T
  api/newsletter/       # Endpoint newsletter
  sitemap.ts            # Sitemap dinámico
  robots.ts             # robots.txt
components/             # Componentes React
  Header.tsx, Footer.tsx, BlogCard.tsx, Newsletter.tsx, AdSense.tsx
lib/                    # Utilidades
  blog.ts               # Lectura MDX, categorías, posts relacionados
  seo.ts                # Meta tags, JSON-LD schemas
  supabase.ts           # Cliente Supabase, newsletter, analytics
content/blog/           # Posts en MDX (aquí van los artículos)
public/                 # Assets estáticos
```

## Posts del blog (MDX)
Cada post va en `content/blog/nombre-del-post.mdx` con este frontmatter obligatorio:
```yaml
---
title: "Título del post"
description: "Descripción para SEO (150-160 caracteres)"
date: "YYYY-MM-DD"
author: "Miguel Angel Rivera"
category: "bim-peru"
tags: ["tag1", "tag2"]
featured: false
image: "/images/blog/nombre-imagen.jpg"
imageAlt: "Descripción de la imagen"
---
```

## Categorías válidas
`bim-peru`, `revit`, `dynamo`, `python`, `robot-structural`, `civil-3d`, `excel`, `hp-prime`, `analisis-estructural`, `normativa`

## Componentes disponibles en MDX
- `<Callout type="tip|info|warning">texto</Callout>` — cajas de aviso
- `<DownloadButton url="/archivo" text="Descargar" />` — botón de descarga
- `<YouTube id="videoId" />` — embed de YouTube

## 5 Pilares de contenido (en orden de prioridad)
1. **BIM Perú** — Normativa, Ley 32069, plazos, roles, PEB. URGENTE.
2. **Revit + Robot** — Modelado estructural, familias, interoperabilidad.
3. **Python + Dynamo** — Automatización Revit, scripts, API. Diferenciador único.
4. **Excel + Plantillas** — Diseño sísmico E.030, metrados. Alto volumen.
5. **Análisis Estructural** — Hardy Cross, HP Prime. Funnel de entrada.

## Reglas IMPORTANTES
- Todo contenido en **ESPAÑOL** contextualizado a **PERÚ** (normas E.030, E.020, Ley 32069).
- SEO siempre: meta descriptions, keywords, estructura H2/H3, internal links.
- Posts deben ser usables inmediatamente — archivo .mdx listo para copiar a `content/blog/`.
- **NUNCA perfeccionar código cuando hay contenido por publicar. Publicar > perfeccionar.**
- La voz es técnica pero accesible. No académica ni influencer. Ingeniero que explica directo.
- Incluir links internos entre posts y hacia /recursos y /apps cuando sea relevante.

## Normativa peruana de referencia
- **E.030** — Diseño sismorresistente. Zonas sísmicas, factores de suelo, espectro.
- **E.020** — Cargas. Cargas vivas y muertas para edificaciones.
- **Ley 32069** — Ley General de Contrataciones Públicas. Artículo 46.6 = BIM obligatorio.
- **Plan BIM Perú** — DS 289-2019-EF. Hoja de ruta nacional BIM.
- **Guía Nacional BIM** — Estándares y niveles de desarrollo (LOD).

## Supabase
Tablas: `subscribers` (newsletter), `downloads` (tracking), `page_views` (analytics). Todas con RLS. Cliente en `lib/supabase.ts`.

## Productos digitales (Gumroad)
Pack HP Prime (S/35), Excel E.030 (S/25), Excel Metrados (S/20), Plantilla PEB (S/60), Scripts Python Revit (S/50), Familias Revit (S/40).
