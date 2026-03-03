# MEMORY.md — Safety Net FreeCloud.pe

> ⚠️ Este archivo es el último recurso. Se lee cuando Engram no está disponible,
> el contexto se saturó, o el agente inicia en frío sin contexto.
> Contiene SOLO decisiones permanentes que NO cambian.

---

## 🏗️ Identidad del Proyecto

- **Proyecto:** FreeCloud.pe — Blog BIM + Ingeniería Civil para Perú
- **Autor:** Miguel Angel Rivera Ospina (mikisbell)
- **Stack:** Next.js 16 (App Router) + TypeScript + Supabase + Tailwind CSS + Vercel
- **Deploy:** `git push origin main` → Vercel (automático)
- **Idioma:** TODO en español contextualizado a Perú

---

## 🚫 Patrones PROHIBIDOS (nunca hacer esto)

| Patrón peligroso | Por qué | Alternativa |
|---|---|---|
| `new PrismaClient()` en cualquier lugar | No usamos Prisma | Usar `createClient()` de `lib/supabase.ts` |
| `role === 'ADMIN'` en frontend | Bypasseable | Usar RLS en Supabase + verificación server-side |
| `import supabase from '@/lib/supabase'` con client-side secret | Expone la service key | Server-only: `createServerClient()`, Client: `createBrowserClient()` |
| Rutas relativas largas (`../../components/`) | Frágil al mover archivos | Siempre `@/components/` |
| `any` explícito en TypeScript | Rompe el tipado estricto | Tipar correctamente o usar `unknown` con guardia |
| `use client` en componentes que no tienen interactividad | Penaliza performance | Solo agregar cuando hay hooks o eventos del DOM |

---

## ✅ Convenciones IRROMPIBLES

### TypeScript
- Estricto: `"strict": true` en `tsconfig.json`
- Sin `any` explícito — usar tipos correctos o `unknown`
- Imports absolutos con `@/` siempre

### Next.js App Router
- **Server Components por defecto** — only add `'use client'` for interactivity/hooks
- Metadata de SEO **obligatoria** en cada `page.tsx` con `export const metadata`
- JSON-LD en páginas de contenido importante (Blog posts, Recursos, Sobre Mí)

### Supabase / Base de Datos
- Clientes en `lib/supabase.ts` — nunca instanciar directamente
- RLS habilitado en todas las tablas
- `SUPABASE_SERVICE_ROLE_KEY` solo en código server-side, nunca en cliente

### Git / Deploy
- Convención de commits: `feat(scope):`, `fix(scope):`, `style(scope):`, `refactor(scope):`
- **NUNCA** `git push` sin correr `npm run build` antes
- Build en Vercel es autoridad final — si falla, revertir inmediatamente

---

## 📁 Archivos Críticos (no borrar sin pensar)

| Archivo | Rol |
|---|---|
| `lib/supabase.ts` | Cliente Supabase centralizado |
| `lib/seo.ts` | Generador de metadata, JSON-LD |
| `lib/blog.ts` | Lectura MDX, categorías, posts relacionados |
| `app/sitemap.ts` | Sitemap dinámico (SEO crítico) |
| `app/robots.ts` | robots.txt (SEO crítico) |
| `AGENTS.md` | Router de skills (NO borrar) |
| `CLAUDE.md` | Contexto del proyecto (NO borrar) |
| `.agents/` | Skills, hooks, workflows (NO borrar) |

---

## 🧠 Sistema Cognitivo (stack de IA)

```
Engram          → Memoria persistente cross-session (MCP)
Skills          → Conocimiento lazy-loaded (.agents/skills/)
Hooks           → Guardrails pre/post edición (.agents/hooks/)
SDD Workflows   → Flujo para cambios grandes (.agents/workflows/)
GGA             → Review independiente en git commit (scripts/gga-review.ps1)
MEMORY.md       → Este archivo — safety net de último recurso
```

**Regla de oro:** Si Engram está disponible, úsalo. Si no, este archivo es suficiente para arrancar de forma segura.

---

## 📊 Rutas del Sitio

| URL | Archivo |
|---|---|
| `/` | `app/(main)/page.tsx` |
| `/blog` | `app/(main)/blog/page.tsx` |
| `/blog/[slug]` | `app/(main)/blog/[slug]/page.tsx` |
| `/recursos` | `app/(main)/recursos/page.tsx` |
| `/apps` | `app/(main)/apps/page.tsx` |
| `/servicios` | `app/(main)/servicios/page.tsx` |
| `/sobre-mi` | `app/(main)/sobre-mi/page.tsx` |
| `/api/newsletter` | `app/api/newsletter/route.ts` |

---

## 💰 Monetización

- **Productos digitales:** Gumroad (Pack HP Prime S/35, Excel E.030 S/25, etc.)
- **AdSense:** Pendiente aprobación (componente `AdSense.tsx` listo)
- **Newsletter:** Tabla `subscribers` en Supabase

---

*Última actualización: 2026-03-02 | Actualizar este archivo solo cuando una decisión se vuelva permanente.*
