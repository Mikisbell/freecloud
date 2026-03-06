# FreeCloud.pe — Blog BIM + Ingeniería Civil Perú

## Proyecto
Blog y ecosistema de contenido sobre BIM para ingenieros civiles peruanos. Next.js 16 + Supabase + Vercel. BIM será obligatorio en Perú desde agosto 2026 (Ley 32069). Todo el contenido está en español.

## Autor
Miguel Angel Rivera Ospina. Ingeniero civil + ingeniero de sistemas. Huancayo, Perú. Solo founder sin empleados. Empresas: FreeCloud (freecloud.pe, 2015) y Rivamez (rivamez.com, constructora). YouTube: mikisbell (~2,000 subs). GitHub: mikisbell.

## Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Content:** MDX con next-mdx-remote, posts almacenados en Supabase CMS (tabla `posts`)
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
  blog/[slug]/page.tsx  # Post individual (renderiza MDX desde Supabase)
  recursos/page.tsx     # Tienda de productos digitales
  apps/page.tsx         # Web apps
  apps/calculadora-sismica/  # Calculadora E.030
  sobre-mi/page.tsx     # About con E-E-A-T
  admin/                # CMS admin panel
  api/newsletter/       # Endpoint newsletter
  sitemap.ts            # Sitemap dinámico
  robots.ts             # robots.txt
middleware.ts           # Auth guard para /admin (Supabase)
config/
  site.ts               # Configuración del sitio
  products.ts           # Catálogo unificado de productos
components/             # Componentes React
  Header.tsx, Footer.tsx, BlogCard.tsx, Newsletter.tsx, AdSense.tsx,
  ContactForm.tsx, HeroBackground.tsx, HeroCountdown.tsx,
  TableOfContents.tsx, ShareButtons.tsx, ScrollRevealProvider.tsx,
  Callout.tsx, DownloadButton.tsx, YouTubeFacade.tsx
  admin/                # Componentes del CMS
    Sidebar.tsx, PostEditor.tsx
lib/                    # Utilidades
  blog.ts               # Lectura MDX desde Supabase, categorías, posts relacionados
  seo.ts                # Meta tags, JSON-LD schemas
  supabase.ts           # Cliente Supabase, newsletter, analytics
types/
  supabase.ts           # Tipos de la base de datos
content/blog/           # Vacío (posts migrados a Supabase)
public/                 # Assets estáticos
```

## Admin CMS
- **Rutas:** `/admin` (dashboard), `/admin/login`, `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]/edit`, `/admin/categories`, `/admin/contacts`
- **Auth:** Middleware de Supabase (`middleware.ts` en la raíz del proyecto)
- **Componentes:** `admin/Sidebar.tsx`, `admin/PostEditor.tsx`

## Posts del blog (MDX)
Los posts se crean y editan desde el CMS admin (`/admin/posts`). Se almacenan en la tabla `posts` de Supabase y se renderizan con next-mdx-remote. Campos principales:
```yaml
title: "Título del post"
description: "Descripción para SEO (150-160 caracteres)"
date: "YYYY-MM-DD"
author: "Miguel Angel Rivera"
category: "bim-peru"
tags: ["tag1", "tag2"]
featured: false
image: "/images/blog/nombre-imagen.jpg"
imageAlt: "Descripción de la imagen"
```

## Categorías válidas
`bim-peru`, `revit`, `dynamo`, `python`, `robot-structural`, `civil-3d`, `excel`, `hp-prime`, `analisis-estructural`, `normativa`

## Componentes disponibles en MDX
- `<Callout type="tip|info|warning">texto</Callout>` — cajas de aviso
- `<DownloadButton url="/archivo" text="Descargar" />` — botón de descarga
- `<YouTubeFacade id="videoId" />` — embed de YouTube (lazy-loaded)

## 5 Pilares de contenido (en orden de prioridad)
1. **BIM Perú** — Normativa, Ley 32069, plazos, roles, PEB. URGENTE.
2. **Revit + Robot** — Modelado estructural, familias, interoperabilidad.
3. **Python + Dynamo** — Automatización Revit, scripts, API. Diferenciador único.
4. **Excel + Plantillas** — Diseño sísmico E.030, metrados. Alto volumen.
5. **Análisis Estructural** — Hardy Cross, HP Prime. Funnel de entrada.

## Reglas IMPORTANTES
- Todo contenido en **ESPAÑOL** contextualizado a **PERÚ** (normas E.030, E.020, Ley 32069).
- SEO siempre: meta descriptions, keywords, estructura H2/H3, internal links.
- Posts deben ser usables inmediatamente — creados desde el CMS admin.
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
Tablas: `posts` (blog CMS), `categories` (categorías), `contacts` (formulario de contacto), `leads` (captación), `subscribers` (newsletter), `downloads` (tracking), `page_views` (analytics). Todas con RLS. Cliente en `lib/supabase.ts`.

## Productos digitales (Gumroad)
Pack HP Prime (S/35), Excel E.030 (S/25), Excel Metrados (S/20), Plantilla PEB (S/60), Scripts Python Revit (S/50), Familias Revit (S/40). Catálogo centralizado en `config/products.ts`.

## Stack Cognitivo (Sistema de IA)

```
TÚ (usuario)
 │
 ▼
CLAUDE.md / AGENTS.md ── Router principal
 │
 ├─► Engram ────── Memoria persistente (cross-session) — mem_context al inicio
 │
 ├─► Skills ────── Lazy-loaded desde .agents/skills/
 │
 ├─► Hooks ─────── Guardrails Capa 1 (.agents/hooks/pre-edit.md + post-edit.md)
 │
 ├─► SDD ──────── Cambios grandes → /sdd-new (.agents/workflows/)
 │
 ├─► GGA ──────── Guardrail Capa 2 — scripts/gga-review.ps1 antes de git push
 │
 └─► MEMORY.md ── Safety net (fallback si todo lo anterior falla)
```

**Capa 1 (mientras escribo código):** Claude + Hooks + Engram + Skills → previene errores ANTES de que existan
**Capa 2 (al hacer commit):** GGA + Claude Haiku + AGENTS.md → atrapa lo que se escapó en Capa 1
