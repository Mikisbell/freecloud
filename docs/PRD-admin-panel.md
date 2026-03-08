# PRD: FreeCloud.pe - Sistema Completo

**Autor:** Miguel Angel Rivera Ospina
**Fecha:** 2026-03-05
**Estado:** Draft
**URL:** https://freecloud.pe
**Repo:** github.com/Mikisbell/freecloud

---

## 1. Vision del Producto

FreeCloud.pe es un ecosistema digital para ingenieros civiles peruanos que necesitan prepararse para BIM obligatorio (agosto 2026, Ley 32069). Combina blog tecnico, herramientas web, productos digitales y servicios profesionales en una sola plataforma.

**Modelo de negocio:** Contenido gratuito (blog, apps) atrae trafico organico -> captura leads (newsletter) -> vende productos digitales (Gumroad) y servicios de consultoria.

**Solo founder:** Miguel Angel Rivera Ospina. Ingeniero civil + ingeniero de sistemas. Huancayo, Peru. Empresas: FreeCloud (2015) y Rivamez (constructora).

---

## 2. Stack Tecnico

| Capa | Tecnologia | Notas |
|------|-----------|-------|
| **Framework** | Next.js 16.1.6 (App Router, TypeScript) | PPR habilitado, Turbopack |
| **React** | React 19.2.4 | Server Components por defecto |
| **Styling** | Tailwind CSS 3.4 + tailwindcss-animate | Colores custom fc-cyan, fc-blue, fc-navy |
| **UI Components** | shadcn/ui (Radix primitives) | 14 componentes instalados |
| **Content** | MDX via next-mdx-remote | remark-gfm, rehype-highlight, rehype-katex |
| **Database** | Supabase (PostgreSQL + RLS) | 7 tablas con Row Level Security |
| **Auth** | Supabase Auth + SSR middleware | Protege /admin/* |
| **Storage** | Supabase Storage | Bucket `blog-images`, max 5MB |
| **Hosting** | Vercel | Auto-deploy desde main, PPR |
| **Analytics** | Supabase custom + Vercel Analytics | page_views table + @vercel/analytics |
| **Ads** | Google AdSense | In-feed cada 4 posts + sidebar |
| **E-commerce** | Gumroad overlay checkout | 6 productos digitales |
| **SEO** | JSON-LD schemas, sitemap dinamico, meta tags | Article, WebSite, Organization, FAQ, SoftwareApplication |
| **Fonts** | Space Grotesk (display), DM Sans (body), JetBrains Mono (code) | + Montserrat, Rajdhani (brand) |
| **Validation** | Zod | API routes newsletter + contact |
| **Rate Limiting** | In-memory Map | Newsletter 5/min, Contact 3/min |
| **Math** | KaTeX via rehype-katex | Formulas en posts MDX |

---

## 3. Arquitectura del Sistema

```
freecloud.pe/
|
|-- PUBLICO (Route Group: (main))
|   |-- /                    Homepage con hero, servicios, productos, blog reciente
|   |-- /blog                Listado con filtros por categoria, featured post, ads in-feed
|   |-- /blog/[slug]         Post MDX con TOC, sidebar, schema Article, share, related posts
|   |-- /recursos            Tienda productos digitales Gumroad (6 productos)
|   |-- /apps                Listado de web apps de ingenieria
|   |-- /apps/calculadora-sismica   Calculadora E.030 interactiva
|   |-- /servicios           3 servicios + metodologia + formulario contacto
|   |-- /sobre-mi            E-E-A-T page, timeline, skills, contacto
|   |-- /sitemap.xml         Sitemap dinamico (posts + categorias + estaticas)
|   |-- /robots.txt          Allow all excepto /api/ y /admin/
|
|-- API
|   |-- /api/newsletter      POST: subscribe con Zod + rate limit + honeypot
|   |-- /api/contact          POST: contacto con Zod + rate limit + honeypot
|
|-- ADMIN (protegido por auth middleware)
|   |-- /admin               Dashboard con analytics reales
|   |-- /admin/login          Login Supabase
|   |-- /admin/posts          CRUD posts con filtros
|   |-- /admin/posts/new      Editor MDX nuevo post
|   |-- /admin/posts/[id]/edit Editor MDX editar post
|   |-- /admin/categories     CRUD categorias inline
|   |-- /admin/contacts       Bandeja de mensajes
|   |-- /admin/stats          Analytics con graficos
|   |-- /admin/subscribers    Gestion suscriptores
|   |-- /admin/settings       Config readonly
|
|-- MIDDLEWARE
|   |-- proxy.ts              Auth guard Supabase para /admin/*
```

---

## 4. Base de Datos (Supabase)

### 4.1 Tablas

| Tabla | Proposito | Campos clave | RLS |
|-------|----------|-------------|-----|
| **posts** | Blog CMS | id, title, slug, content, excerpt, status (draft/published), featured, category_id, tags[], meta_title, meta_description, featured_image, image_alt, key_question, key_answer, cta_product_*, reading_time, published_at, created_at, updated_at, author | Si |
| **categories** | Taxonomia blog | id, name, slug, emoji, color, description | Si |
| **contacts** | Formulario contacto | id, name, email, message, service, read, created_at | Si |
| **subscribers** | Newsletter | id, email, name, source, created_at | Si |
| **downloads** | Tracking ventas | id, product_slug, email, created_at | Si |
| **page_views** | Analytics custom | id, path, referrer, created_at | Si |
| **leads** | Captacion leads | id, email, name, interest, source, utm_source, utm_medium, utm_campaign, created_at | Si |

### 4.2 Storage
- **Bucket:** `blog-images`
- **Validacion:** Solo imagenes, max 5MB
- **Naming:** Hash random + timestamp
- **Cache:** 3600s

---

## 5. Modulos del Sistema (Detalle)

### 5.1 Frontend Publico

#### Homepage (`app/(main)/page.tsx` - 471 lineas)
- **Hero:** Titulo con gradiente, countdown a agosto 2026, CTA "Explora el Blog" + "Ver Recursos"
- **HeroBackground:** Canvas animado con particulas y lineas (client component)
- **HeroCountdown:** Cuenta regresiva en tiempo real a BIM obligatorio
- **Carrusel tecnologias:** Logos de Revit, AutoCAD, Dynamo, Python, etc. (marquee CSS)
- **Servicios:** 3 cards con iconos (Desarrollo, BIM Consulting, Ingenieria Estructural)
- **Productos digitales:** Grid 3 columnas con precios, badges "Bestseller"/"Nuevo", overlay Gumroad
- **Blog reciente:** Async component con Suspense, ultimos 6 posts desde Supabase
- **About section:** Foto autor, estadisticas (150+ proyectos, 8+ anos), bio
- **Newsletter:** Formulario de suscripcion con validacion

#### Blog Listing (`app/(main)/blog/page.tsx` - 310 lineas)
- **Hero dark:** Titulo, descripcion, contador de articulos
- **Filtros sticky:** Chips de categorias con scroll horizontal
- **Featured post:** Card grande si hay post destacado
- **Grid posts:** Responsive 1/2/3 columnas con BlogCard
- **Ads in-feed:** Google AdSense cada 4 posts
- **Sidebar recomendados:** Recursos, Web Apps, Sobre el Autor
- **Newsletter:** Al final de la pagina
- **searchParams:** Promise (Next.js 16), filtro por ?category=slug

#### Blog Post (`app/(main)/blog/[slug]/page.tsx` - 446 lineas)
- **Metadata dinamica:** Title, description, OG image, canonical
- **Schemas JSON-LD:** Article + FAQ (si hay key_question) + Breadcrumb
- **Breadcrumbs:** Home > Blog > Categoria > Post
- **Article:** Imagen hero, fecha, autor, reading time, tags
- **MDX rendering:** next-mdx-remote con custom components (Callout, DownloadButton, YouTubeFacade)
- **Table of Contents:** Extraido de headings H2/H3 con github-slugger
- **Sidebar desktop:** Autor card, posts populares, ads
- **CTA Gumroad:** Si el post tiene cta_product_*, muestra bloque de compra
- **Share buttons:** Copiar link, WhatsApp, LinkedIn, Twitter, Facebook
- **Navegacion secuencial:** Post anterior / siguiente
- **Posts relacionados:** 3 posts de la misma categoria
- **Newsletter:** Al final

#### Recursos / Tienda (`app/(main)/recursos/page.tsx` - 198 lineas)
- **Hero:** Titulo, descripcion con badge "2026"
- **Trust signals:** Pagos seguros via Gumroad, soporte por email
- **Alerta tools gratuitas:** Link a /apps
- **Grid productos:** 3 columnas desde config/products.ts
- **Badges:** Bestseller (excel-e030), Nuevo (plantilla-peb), Empresas (python-revit)
- **Gumroad overlay:** data-gumroad-overlay para checkout in-page
- **CTA servicios custom:** Seccion al final para consultoria

#### Apps (`app/(main)/apps/page.tsx` - 89 lineas)
- **Grid de 4 apps:** Calculadora Sismica (activa), + 3 "proximamente"
- **Apps futuras:** Diseno de Vigas, Metrados Rapidos, Combinaciones de Carga

#### Calculadora Sismica (`calculator.tsx` - 234 lineas)
- **Formula:** V = (ZUCS/R) x P segun norma E.030
- **Inputs interactivos:**
  - Zona sismica (Z1-Z4 con valores 0.10-0.45)
  - Tipo de suelo (S0-S3 con periodos Tp, Tl)
  - Categoria de uso (A1, A2, B, C con factor U)
  - Sistema estructural (Porticos, Dual, Muros, Albanileria con R0)
  - Factores de irregularidad (Ia, Ip)
  - Periodo fundamental (T) y Peso (P)
- **Output:** Cortante basal V con desglose de todos los parametros
- **Schema:** SoftwareApplication JSON-LD

#### Servicios (`app/(main)/servicios/page.tsx` - 227 lineas)
- **3 servicios:** Desarrollo Web Custom, Consultoria BIM, Ingenieria Estructural
- **Metodologia:** 4 pasos (Diagnostico, Planificacion, Ejecucion, Soporte)
- **Formulario contacto:** Nombre, email, servicio (select), mensaje

#### Sobre Mi (`app/(main)/sobre-mi/page.tsx` - 238 lineas)
- **E-E-A-T optimizado** para SEO (Experience, Expertise, Authority, Trust)
- **Stats:** 150+ proyectos, 8+ anos, 2000+ subs YouTube
- **Timeline:** Trayectoria profesional
- **Skills:** BIM & Ingenieria, Desarrollo & Automatizacion
- **CTA contacto:** Formulario integrado

### 5.2 Componentes Compartidos

| Componente | Archivo | Tipo | Funcion |
|-----------|---------|------|---------|
| **Header** | Header.tsx | Client | Navbar sticky con logo, nav items, mobile hamburger, scroll effect |
| **Footer** | Footer.tsx | Server | Links, redes sociales, copyright, contacto |
| **BlogCard** | BlogCard.tsx | Server | Card de post con imagen, categoria, titulo, excerpt, fecha, reading time |
| **Newsletter** | Newsletter.tsx | Client | Formulario email con honeypot, validacion, loading state |
| **ContactForm** | ContactForm.tsx | Client | Formulario nombre/email/servicio/mensaje con validacion |
| **HeroBackground** | HeroBackground.tsx | Client | Canvas animado con particulas conectadas por lineas |
| **HeroCountdown** | HeroCountdown.tsx | Client | Cuenta regresiva a agosto 2026 (dias, horas, minutos, segundos) |
| **TableOfContents** | TableOfContents.tsx | Client | TOC flotante con scroll spy, highlight heading activo |
| **ShareButtons** | ShareButtons.tsx | Client | Copiar link + share a WhatsApp, LinkedIn, Twitter, Facebook |
| **ScrollRevealProvider** | ScrollRevealProvider.tsx | Client | IntersectionObserver para animaciones reveal on scroll |
| **Callout** | Callout.tsx | Server | Caja MDX tipo tip/info/warning con iconos |
| **DownloadButton** | DownloadButton.tsx | Server | Boton de descarga estilizado para MDX |
| **YouTubeFacade** | YouTubeFacade.tsx | Client | YouTube embed lazy-loaded con thumbnail placeholder |
| **AdSense** | AdSense.tsx | Server | Script loader de Google AdSense |
| **AdSenseLoader** | AdSenseLoader.tsx | Client | Carga async del script AdSense |
| **GoogleAd** | GoogleAd.tsx | Server | Slot de anuncio individual |
| **ClientGoogleAd** | ClientGoogleAd.tsx | Client | Push de ad unit con useEffect |
| **ClientAnalytics** | ClientAnalytics.tsx | Client | trackPageView on route change |

### 5.3 API Routes

#### POST /api/newsletter
- **Input:** `{ email, _honeypot? }` validado con Zod
- **Rate limit:** 5 requests/min por IP
- **Honeypot:** Campo oculto anti-bot
- **Accion:** `subscribeNewsletter(email, 'blog')` con upsert
- **Responses:** 200 OK, 400 Invalid, 429 Rate limited, 500 Error

#### POST /api/contact
- **Input:** `{ name, email, service?, message, _honeypot? }` validado con Zod
- **Rate limit:** 3 requests/min por IP
- **Honeypot:** Campo oculto anti-bot
- **Accion:** `submitContact(name, email, message, service)`
- **Responses:** 200 OK, 400 Invalid, 429 Rate limited, 500 Error

### 5.4 SEO (`lib/seo.ts`)

| Schema | Donde se usa | Datos |
|--------|-------------|-------|
| **WebSite** | Root layout | Nombre, URL, potentialAction SearchAction |
| **Organization** | Root layout | Logo, founder, sameAs (redes) |
| **Article** | Blog post | Titulo, fecha, autor, imagen, description |
| **FAQPage** | Blog post (si tiene key_question) | Question/Answer desde campos AEO |
| **BreadcrumbList** | Blog post | Home > Blog > Categoria > Post |
| **SoftwareApplication** | Calculadora sismica | Nombre, rating, OS, offers |

### 5.5 Seguridad

| Medida | Implementacion |
|--------|---------------|
| **Auth middleware** | proxy.ts redirige /admin/* sin sesion a /admin/login |
| **RLS** | Todas las tablas Supabase con Row Level Security |
| **Rate limiting** | In-memory por IP en API routes (5/min newsletter, 3/min contact) |
| **Honeypot** | Campo oculto _honeypot en formularios |
| **Input validation** | Zod schemas en API routes |
| **Security headers** | HSTS, X-Content-Type-Options, X-Frame-Options, CSP |
| **Image validation** | Solo image/*, max 5MB en upload |
| **CORS** | CSP permite solo dominios conocidos (Google, Supabase, Gumroad, Vercel) |

### 5.6 Performance

| Optimizacion | Detalle |
|-------------|---------|
| **PPR** | Partial Prerender en paginas con datos dinamicos |
| **Image optimization** | avif/webp, quality 60/75, sizes responsive |
| **Font preconnect** | Preconexion a Google Fonts CDN |
| **Lazy YouTube** | Facade con thumbnail, carga iframe on click |
| **Inline CSS** | Experimental inlineCss habilitado |
| **Package optimization** | lucide-react optimizado con optimizePackageImports |
| **Cache headers** | 1 ano para static assets, 1 dia para imagenes |
| **Console strip** | removeConsole en produccion (excepto error/warn) |
| **Compression** | Habilitado en next.config |

### 5.7 Admin Panel (8 paginas + 2 componentes)

Ver seccion 5.1-5.10 del PRD anterior (ya documentado). Resumen:

| Pagina | Funcionalidad |
|--------|--------------|
| Dashboard | 4 stat cards clickables, sparkline 14d, posts + mensajes recientes |
| Posts | CRUD, filtros (busqueda, status, categoria), toggle publish, mobile+desktop |
| Post Editor | MDX toolbar, preview, SEO/AEO/SERP, CTA Gumroad, auto-save, image upload |
| Categorias | CRUD inline, emoji, color, proteccion eliminar |
| Contactos | Bandeja Gmail-style, split-pane, mark read |
| Estadisticas | Periodo 7/30/90d, graficos CSS, top pages, referrers |
| Suscriptores | Busqueda, export CSV, eliminar, stats |
| Configuracion | Vista readonly de site config y productos |

---

## 6. Productos Digitales (config/products.ts)

| Slug | Nombre | Precio | Plataforma |
|------|--------|--------|-----------|
| excel-e030 | Plantilla Diseno Sismico E.030 | S/25 | Gumroad |
| excel-metrados | Plantilla Metrados de Obra | S/20 | Gumroad |
| hp-prime-hardy-cross | Hardy Cross - Analisis Estructural | S/35 | Gumroad |
| python-revit-scripts | Scripts Python para Revit API | S/50 | Gumroad |
| familias-revit | Familias Revit Estructural | S/40 | Gumroad |
| plantilla-peb | Plantilla Plan de Ejecucion BIM (PEB) | S/60 | Gumroad |

**Total catalogo:** 6 productos, rango S/20-S/60, todos en Gumroad con overlay checkout.

---

## 7. Categorias de Contenido

| Slug | Nombre | Pilar |
|------|--------|-------|
| bim-peru | BIM Peru | 1 - URGENTE |
| revit | Revit | 2 |
| robot-structural | Robot Structural | 2 |
| dynamo | Dynamo | 3 |
| python | Python | 3 |
| civil-3d | Civil 3D | 2 |
| excel | Excel | 4 |
| hp-prime | HP Prime | 5 |
| analisis-estructural | Analisis Estructural | 5 |
| normativa | Normativa | 1 |

---

## 8. Inventario Completo de Archivos

### Paginas (29 archivos)
```
app/
  layout.tsx                          # Root layout (fonts, schemas, AdSense)
  not-found.tsx                       # 404 branded
  error.tsx                           # Error boundary
  (main)/
    layout.tsx                        # Header + Footer wrapper
    loading.tsx                       # Loading dots
    page.tsx                          # Homepage (471 lineas)
    blog/
      page.tsx                        # Blog listing (310 lineas)
      [slug]/page.tsx                 # Post template (446 lineas)
    recursos/page.tsx                 # Tienda Gumroad (198 lineas)
    apps/
      layout.tsx                      # Apps layout decorativo
      page.tsx                        # Apps listing
      calculadora-sismica/
        page.tsx                      # Calculadora wrapper + schema
        calculator.tsx                # Calculadora E.030 (234 lineas)
    servicios/page.tsx                # Servicios + contacto (227 lineas)
    sobre-mi/page.tsx                 # About E-E-A-T (238 lineas)
  admin/
    layout.tsx                        # Admin shell + sidebar
    page.tsx                          # Dashboard
    loading.tsx                       # Loading
    actions.ts                        # Login/logout server actions
    login/page.tsx                    # Login form
    posts/
      page.tsx                        # Posts list
      PostsClientTable.tsx            # Posts table client
      new/page.tsx                    # New post
      [id]/edit/page.tsx              # Edit post
    categories/
      page.tsx                        # Categories list
      CategoriesClientTable.tsx       # Categories CRUD client
    contacts/page.tsx                 # Contacts inbox
    stats/page.tsx                    # Analytics
    subscribers/page.tsx              # Subscribers mgmt
    settings/page.tsx                 # Site config readonly
  api/
    newsletter/route.ts               # POST newsletter
    contact/route.ts                  # POST contact
  sitemap.ts                          # Dynamic sitemap
  robots.ts                           # robots.txt
```

### Componentes (20 archivos)
```
components/
  Header.tsx                          # Navbar sticky + mobile
  Footer.tsx                          # Footer global
  BlogCard.tsx                        # Card de post
  Newsletter.tsx                      # Form newsletter
  ContactForm.tsx                     # Form contacto
  HeroBackground.tsx                  # Canvas particulas
  HeroCountdown.tsx                   # Countdown 2026
  TableOfContents.tsx                 # TOC con scroll spy
  ShareButtons.tsx                    # Social share
  ScrollRevealProvider.tsx            # Reveal animations
  Callout.tsx                         # MDX callout box
  DownloadButton.tsx                  # MDX download button
  YouTubeFacade.tsx                   # Lazy YouTube
  AdSense.tsx                         # AdSense script
  AdSenseLoader.tsx                   # AdSense async loader
  GoogleAd.tsx                        # Ad slot
  ClientGoogleAd.tsx                  # Ad push client
  ClientAnalytics.tsx                 # Page view tracking
  admin/
    Sidebar.tsx                       # Admin nav + drawer
    PostEditor.tsx                    # Editor completo (749 lineas)
```

### Librerias (8 archivos)
```
lib/
  supabase.ts                         # DB client + todas las queries (432 lineas)
  blog.ts                             # extractHeadings para TOC
  seo.ts                              # 6 schemas JSON-LD + metadata generators
  rate-limit.ts                       # In-memory rate limiter
  utils.ts                            # cn() helper
  supabase/
    client.ts                         # Browser Supabase client
    server.ts                         # Server Supabase client
    middleware.ts                      # Auth session + admin guard
```

### Config (4 archivos)
```
config/
  site.ts                             # Nombre, URL, autor, redes
  products.ts                         # 6 productos Gumroad

middleware.ts (o proxy.ts)            # Auth middleware Next.js 16
next.config.mjs                       # Security headers, images, cache, CSP
tailwind.config.ts                    # Brand colors, fonts, animations
```

### Total: ~61 archivos, ~8,000+ lineas de codigo

---

## 9. Gaps y Mejoras Propuestas

### P0 - Critico (afecta productividad diaria)

| # | Mejora | Donde | Impacto |
|---|--------|-------|---------|
| 1 | **Paginacion posts admin** | PostsClientTable, lib/supabase | 50+ posts = performance muerta |
| 2 | **Programar publicacion** | PostEditor, types, supabase, Edge Function | No puedes planificar contenido |
| 3 | **Busqueda en contactos** | contacts/page.tsx | 100+ mensajes = caos |

### P1 - Importante (mejora significativa)

| # | Mejora | Donde | Impacto |
|---|--------|-------|---------|
| 4 | **Media Library** | Nueva pagina, PostEditor, supabase | Imagenes perdidas, no reusables |
| 5 | **Acciones masivas posts** | PostsClientTable | Publicar/borrar uno por uno |
| 6 | **Settings editables** | settings/page.tsx, nueva tabla DB | Config requiere editar codigo |
| 7 | **Preview real del post** | Nueva ruta blog/preview, PostEditor | Preview actual != blog real |
| 8 | **Mas web apps** | apps/* | Solo 1 de 4 apps funciona |
| 9 | **Paginacion blog publico** | blog/page.tsx | Con 50+ posts publicos |

### P2 - Nice to have (pulido profesional)

| # | Mejora | Donde | Impacto |
|---|--------|-------|---------|
| 10 | **Perfil y contrasena** | Nueva pagina admin/profile | Dependes de Supabase Dashboard |
| 11 | **Eliminar/archivar contactos** | contacts/page.tsx | Mensajes se acumulan sin limpieza |
| 12 | **Comparacion periodos stats** | stats/page.tsx | No sabes si creciste o bajaste |
| 13 | **Ordenar tabla por columnas** | PostsClientTable | Solo orden por fecha creacion |
| 14 | **Badges en sidebar** | Sidebar.tsx | No sabes no-leidos sin entrar |
| 15 | **Paginacion suscriptores** | subscribers/page.tsx | Escala igual que posts |
| 16 | **Newsletter email integration** | Nueva integracion | Capturas emails pero no envias newsletters |
| 17 | **Mas productos Gumroad** | config/products.ts | 6 productos, potencial para mas |

### P3 - Futuro (v3.0+)

| # | Mejora | Notas |
|---|--------|-------|
| 18 | Sistema de comentarios | En posts del blog |
| 19 | Multi-idioma | Blog en ingles para latam |
| 20 | A/B testing de titulos | Para optimizar CTR |
| 21 | Historial de cambios | Versiones de posts |
| 22 | Email marketing | Resend o similar para newsletter real |
| 23 | Dashboard Gumroad embebido | API Gumroad para ver ventas en admin |
| 24 | PWA | Offline reading de posts |
| 25 | AI writing assistant | Sugerencias de titulo, meta desc, contenido |

---

## 10. Fases de Implementacion

| Fase | Items | Foco |
|------|-------|------|
| **Fase 1** | #1 Paginacion + #3 Busqueda contactos + #11 Eliminar contactos + #13 Ordenar tabla + #14 Badges sidebar | Quick wins UX |
| **Fase 2** | #5 Acciones masivas + #12 Comparacion stats + #9 Paginacion blog publico + #15 Paginacion suscriptores | Escalar para crecimiento |
| **Fase 3** | #4 Media Library + #7 Preview real + #8 Mas web apps | Features nuevas grandes |
| **Fase 4** | #2 Programar publicacion + #6 Settings editables + #10 Perfil admin | Requieren cambios DB |
| **Fase 5** | #16 Email integration + #23 Gumroad API + #25 AI assistant | Integraciones externas |

---

## 11. Metricas de Exito

| Metrica | Hoy | Target |
|---------|-----|--------|
| Paginas totales | 10 publicas + 8 admin | 12 publicas + 12 admin |
| Posts antes de perf issues | ~30 | 500+ (paginacion) |
| Web apps funcionales | 1 de 4 | 4 de 4 |
| Productos digitales | 6 | 10+ |
| Tiempo crear+publicar post | ~15 min | ~8 min |
| Imagenes reusables | 0% | 100% (media library) |
| Busqueda en admin | Solo posts | Global (posts, contactos, suscriptores) |

---

## 12. Restricciones Tecnicas

1. **Next.js 16 PPR** - Server components con `new Date()` necesitan `await connection()`
2. **No chart libraries** - Graficos son CSS puro, mantener asi
3. **Supabase RLS** - Todas las tablas con Row Level Security
4. **Mobile-first** - Touch targets min 44px (min-h-11), responsive obligatorio
5. **Deploy = git push** - No CI custom, Vercel auto-deploy
6. **Solo 1 admin** - No multi-tenancy ni roles
7. **No romper SEO** - Cambios al admin no deben afectar frontend/SEO
8. **Rate limiting in-memory** - Funciona en serverless pero se resetea por cold start
9. **Gumroad overlay** - Checkout embebido, no redireccion
10. **MDX no WYSIWYG** - El editor es markdown, no rich text

---

## 13. Dependencias del package.json

### Produccion (27 deps)
```
next 16.1.6, react 19.2.4, react-dom 19.2.4
@supabase/ssr, @supabase/supabase-js
next-mdx-remote, remark-gfm, rehype-highlight, rehype-raw, rehype-slug, rehype-katex
@radix-ui/* (dialog, dropdown, label, select, separator, slot, tabs, tooltip, toggle)
class-variance-authority, clsx, tailwind-merge, tailwindcss-animate
lucide-react, react-markdown, github-slugger, zod
@vercel/analytics, @vercel/speed-insights
```

### Dev (6 deps)
```
typescript 5.x, @types/node, @types/react, @types/react-dom
eslint, eslint-config-next, autoprefixer, postcss, tailwindcss 3.4
```
