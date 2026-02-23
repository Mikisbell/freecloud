# FreeCloud Blog - BIM e Ingeniería Civil

Blog profesional optimizado para SEO, AdSense y monetización. Stack: Next.js 14 + TypeScript + Supabase + Tailwind CSS + Vercel.

## 🚀 Setup rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```
Editar `.env.local` con tus datos:
- `NEXT_PUBLIC_SUPABASE_URL` → Tu URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Tu anon key de Supabase
- `NEXT_PUBLIC_ADSENSE_ID` → Tu ID de AdSense (ca-pub-XXXXX)
- `NEXT_PUBLIC_SITE_URL` → https://freecloud.pe

### 3. Configurar Supabase
Ejecutar el SQL del archivo `supabase-setup.sql` en el SQL Editor de Supabase.

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Deploy a Vercel
```bash
git add . && git commit -m "Initial blog setup"
git push origin main
```
Vercel hace el deploy automático.

---

## 📁 Estructura del proyecto

```
freecloud-blog/
├── app/
│   ├── layout.tsx              # Layout raíz (fonts, AdSense, SEO)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Estilos globales + Tailwind
│   ├── sitemap.ts              # Sitemap dinámico para Google
│   ├── robots.ts               # robots.txt
│   ├── blog/
│   │   ├── page.tsx            # Listado de posts con filtros
│   │   └── [slug]/page.tsx     # Post individual (MDX rendering)
│   ├── recursos/page.tsx       # Tienda de productos digitales
│   ├── apps/
│   │   └── calculadora-sismica/
│   │       ├── page.tsx        # SEO wrapper
│   │       └── calculator.tsx  # Calculadora E.030 interactiva
│   └── api/
│       └── newsletter/route.ts # API suscripción newsletter
├── components/
│   ├── Header.tsx              # Nav con dropdown categorías
│   ├── Footer.tsx              # Footer con newsletter y links
│   ├── BlogCard.tsx            # Card de post (normal + featured)
│   ├── Newsletter.tsx          # Form suscripción (inline + card)
│   └── AdSense.tsx             # Componentes de anuncios
├── lib/
│   ├── blog.ts                 # Utilidades MDX y categorías
│   ├── seo.ts                  # Meta tags, JSON-LD, Schema
│   └── supabase.ts             # Cliente Supabase + tipos
├── content/
│   └── blog/                   # Posts en MDX (aquí va tu contenido)
│       └── bim-obligatorio-peru-2026.mdx  # Post de ejemplo
└── public/                     # Imágenes, favicon, etc.
```

---

## ✍️ Cómo crear un nuevo post

Crear archivo `.mdx` en `content/blog/`:

```mdx
---
title: "Tu Título Aquí"
description: "Descripción para SEO (150-160 caracteres)"
date: "2026-03-01"
author: "Miguel Angel Rivera"
category: "revit"
tags: ["Revit", "BIM", "tutorial"]
featured: false
image: "/images/blog/tu-imagen.jpg"
imageAlt: "Descripción de la imagen"
youtubeId: "XXXXXXXXXXX"
relatedProduct: "Nombre del producto relacionado"
relatedProductUrl: "/recursos"
---

Tu contenido aquí en Markdown...

## Puedes usar componentes custom:

<YouTube id="dQw4w9WgXcQ" />

<Callout type="tip">
Un tip importante para tus lectores
</Callout>

<Callout type="warning">
Una advertencia
</Callout>

<DownloadButton href="/recursos/plantilla.xlsx" label="Descargar Plantilla" />
```

### Categorías disponibles
- `bim-peru` → BIM Perú y normativa
- `revit` → Autodesk Revit
- `dynamo` → Dynamo para Revit
- `python` → Python + BIM
- `robot-structural` → Robot Structural Analysis
- `civil-3d` → Civil 3D
- `excel` → Excel y plantillas
- `hp-prime` → HP Prime
- `analisis-estructural` → Análisis estructural
- `normativa` → Normativa técnica

---

## 🗄️ Supabase Setup

### Tablas necesarias

Ejecutar `supabase-setup.sql` o crear manualmente:

**subscribers** - Newsletter
- id (uuid, PK)
- email (text, unique)
- name (text, nullable)
- source (text, default 'blog')
- created_at (timestamptz)

**downloads** - Tracking descargas
- id (uuid, PK)
- product_slug (text)
- email (text)
- created_at (timestamptz)

**page_views** - Analytics simple
- id (uuid, PK)
- path (text)
- referrer (text, nullable)
- created_at (timestamptz)

---

## 💰 AdSense Setup

1. Ir a Google AdSense > Anuncios > Por unidad de anuncio
2. Crear 3 unidades:
   - **In-Article**: Para dentro del contenido del post
   - **Sidebar**: Para la barra lateral
   - **Banner**: Para entre secciones
3. Copiar el `data-ad-slot` de cada una
4. Reemplazar `XXXXXXXXXX` en los componentes `<AdInArticle>` y `<AdSidebar>`

---

## 📈 SEO incluido

- ✅ Meta tags dinámicos por página
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ JSON-LD Schema (Article, Website, BreadcrumbList, FAQ)
- ✅ Sitemap XML dinámico
- ✅ robots.txt
- ✅ Canonical URLs
- ✅ Heading hierarchy correcta
- ✅ Image alt tags
- ✅ Reading time
- ✅ Related posts

---

## 🛠️ Próximos pasos

1. [ ] Agregar Google Analytics 4
2. [ ] Página de recursos/tienda con Gumroad embeds
3. [ ] Más web apps (predimensionamiento, combinaciones de carga)
4. [ ] Comentarios (con Supabase o Disqus)
5. [ ] Búsqueda interna
6. [ ] RSS feed
7. [ ] Modo oscuro
8. [ ] i18n (español/inglés)
