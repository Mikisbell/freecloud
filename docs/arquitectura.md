# Arquitectura de Sistema — FreeCloud.pe

## 1. Visión General
FreeCloud.pe es una plataforma educativa híbrida construida sobre Next.js 16 (App Router) y React 19, con un enfoque intensivo en SEO, Server-Side Rendering (SSR) y Static Site Generation (SSG). Utiliza Supabase como CMS headless y base de datos, con una capa visual basada en Tailwind CSS y Radix UI (shadcn/ui).

El sistema está optimizado para:
1. **Indexación SEO y Core Web Vitals:** Arquitectura server-first, múltiples fuentes de Google tipografiadas cargadas vía `display: optional` para eliminar CLS, y lazy loading estricto de componentes pesados de terceros (AdSense, YouTube).
2. **Monetización Híbrida:** Integra Google AdSense (cargado de forma deferida) y venta directa de cursos.
3. **Mantenibilidad Inteligente:** UI tipada y estandarizada con `class-variance-authority`.

---

## 2. Diagrama de Componentes (Stack View)

```text
[ Usuario / Googlebot ]
       │
       ▼ (Edge Network / CDN)
[ Vercel Edge Cache ] ─────────────┐
       │                           │ Cache Invalidation (SSG)
       ▼ (Next.js App Router)      │
┌──────────────────────────────────┴─────┐
│ 🌐 CAPA DE PRESENTACIÓN (React 19)     │
│  ├─ app/layout.tsx (Master Layout)     │
│  ├─ Server Components (Layout, Page)   │
│  ├─ Client Components (Islas interac.) │
│  └─ SEO Metadata & JSON-LD             │
└──────────────┬─────────────────────────┘
               │ (Server-side Data Fetching)
               ▼
┌────────────────────────────────────────┐
│ 🧠 CAPA DE LÓGICA & CMS                │
│  ├─ lib/supabase.ts (Data Bridge)      │
│  ├─ lib/seo.ts (Structured Data)       │
│  └─ API Routes (Webhooks)              │
└──────────────┬─────────────────────────┘
               │ (PostgreSQL / REST)
               ▼
┌────────────────────────────────────────┐
│ 🗄️ CAPA DE DATOS (Supabase)           │
│  ├─ DB: posts, categories, leads       │
│  ├─ Auth: Row Level Security (RLS)     │
│  └─ Storage: blog-images               │
└────────────────────────────────────────┘

[ Integraciones Core ]
 - Google AdSense (Lazy) → <AdSenseLoader /> en RootLayout
 - YouTube Iframe → Facade Pattern (<YouTubeFacade />)
 - Analytics → @vercel/analytics & Custom DB Tracking
```

---

## 3. Flujo de Datos y Eventos

### Renderizado de una página de Blog (Lectura Masiva)
1. **Solicitud entrante:** Crawler o navegador pide `/blog/[slug]`.
2. **Route Handler:** Next.js ejecuta la función Server Component de la página.
3. **Fetching Tipado:** La página llama a `getPostBySlug(slug)` desde `lib/supabase.ts`, NO directamente al cliente Supabase.
4. **Metadata SEO:** Mientras tanto, `generatePostMetadata()` de `lib/seo.ts` inyecta las variables `og:image`, `canonical`, y el Schema `{ "@type": "Article" }` al `<head>`.
5. **Streaming SSR:** Se envía el HTML completo al cliente. Googlebot ve 0 bytes de Javascript necesario para el contenido.
6. **Hidratación de Islas:** Los componentes marcados con `'use client'` (ShareButtons, Newsletter) toman control en el navegador.

### Flujo de Mutación (Ej. Formulario de Contacto)
1. **Interacción:** El usuario envía el formulario en el Client Component `<ContactForm />`.
2. **Server Action:** Invoca la función `submitContact()` en el servidor.
3. **Query Builder:** Supabase hace insert en la tabla `contacts`. Las políticas RLS restringen operaciones a roles anónimos según aplique.
4. **Respuesta:** La UI actualiza el success state.

---

## 4. Directorios Core y Responsabilidades

### `app/(main)` y `app/admin` (Las Rutas Mágicas)
- FreeCloud usa el App Router moderno de Next.js. El contenido público vive dentro del grupo de rutas `(main)`, lo que permite compartir el `layout.tsx` sin inyectarlo en secciones del `/admin`.
- Todos los metadatos exportan el const tipado genialmente estructurado por la función de SEO compartida.

### `lib/supabase.ts` (El Guardián de la Data)
Este archivo es crucial. NUNCA se interactúa con Supabase usando fetch nativo en Server Components.
- Implementa el patrón Singleton/Wrapper para `SupabaseClient`.
- Maneja queries y las castean automáticamente a los tipos generados `Post`, `Category`, `Lead`.
- Aloja analytics caseros asíncronos (`trackPageView`) con bloques `try/catch` que evitan tumbar la página entera si fallan.

### `lib/seo.ts` (El Motor de Tráfico)
- Concentra toda la taxonomía y jerarquía que Googlebot ama.
- Define el siteMap, schemas Json-Ld corporativos (`WebSite`, `Organization`, `Article`, `FAQPage`) de manera programática.

### `components/ui/` (Design System de shadcn/ui)
- Componentes puros de Radix Ui con clases estandarizadas por `class-variance-authority`.
- No tocan lógica de negocio. Son tontos visualmente perfectos y re-utilizables.

---

## 5. Diseño de Base de Datos y CMS (Supabase relacional)
- **`posts`:** Núcleo. Posee array text de `tags`, foreign key a `categories` para jerarquía fuerte, campos SEO hard-codeados (ej. `meta_title`, `canonical_url`) y campos booleanos como `featured`.
- **`categories`:** Entidades indexables en la base de datos (con su propio slug de URL).
- **`leads` & `subscribers`:** Tablas planas para funnel de marketing.

## 6. Decisiones Arquitectónicas Rigurosas (ADRs)

| Decisión | Por qué | Beneficio Inmediato |
|---|---|---|
| **Server Components First** | FreeCloud vive de su legibilidad rápida para indexación. | Reduce drásticamente el TTI (Time to Interactive). |
| **Encapsulamiento de Ads y iframes** | `<iframe>` puros generan penalización CLS, First Input Delay. | Render blocking JS erradicado mediante Facade y LazyOnLoad de Next. |
| **TailwindCSS en vez de styled-components** | Elimina parsers de CSS-in-JS que arruinan cache en Edge runtime. | Estilo `0kb` en Next 16 usando tailwind classes hardcoded. |
| **Supabase Client Wrapper** | Evita mermas de memoria e injertos de variables de sesión cliente en servidor. | Abstracción de tipos limpia para todo el equipo. |

---

## 7. Contratos Técnicos para Desarrolladores

Si vas a agregar código a FreeCloud, debes seguir estas 3 reglas de hierro:

1. `'use client'` se usa **exclusivamente** en los nudos del árbol más distantes posibles (hojas del React Tree) donde ocurren eventos DOM concretos (`onClick`, form states). Nunca en layouts de contenedores o layouts que obtienen datos de la DB.
2. Todas las llamadas a bases de datos (`GET`/`POST`/`DELETE`) nuevas **deben vivir centralizadas** en `lib/supabase.ts` implementando una función tipada asíncrona dedicada.
3. Para nuevos tipos de entidades se debe forzar una **extensión SEO del esquema estructurado en `lib/seo.ts`** para no perder jerarquía frente a motores de búsqueda (ej. nuevo post tipo Video → Schema `VideoObject`).
