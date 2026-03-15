# FreeCloud.pe — Agent Context Router

## Identidad del Proyecto
- **Nombre:** FreeCloud.pe
- **Propósito:** Blog técnico y plataforma de recursos BIM/Ingeniería Civil para Perú y LATAM
- **URL:** https://freecloud.pe
- **Stack principal:** Next.js 16 (App Router) + TypeScript + Supabase + Tailwind CSS + Vercel

## Stack Técnico
- **Frontend:** Next.js 16 (Turbopack), React Server Components, App Router
- **Estilos:** Tailwind CSS (convención BEM-light, no hardcoded values)
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Vercel (automático desde `main`)
- **CMS contenido:** Supabase DB como CMS headless
- **Monetización:** AdSense (In-Feed, Sidebar, Article), Venta de Productos (Gumroad), Leads (Newsletter)
- **SEO Hacker Strategy:** Generación de JSON-LD estricto (FAQPage, Organization), evasión de CLS (para ads), y contenido evergreen anticipatorio para la obligatoriedad BIM Perú 2026 (Ley 32069).

## Estructura de carpetas clave
```
app/
 ├── (main)/          → Páginas públicas (/, /blog, /recursos, /apps)
 ├── admin/           → Panel CMS (auth requerida)
 └── api/             → Route handlers (contact, newsletter)
components/           → Componentes reutilizables
lib/                  → Utilities (supabase.ts, seo.ts)
public/images/        → Assets estáticos
docs/arquitectura.md  → Documento vital de Core Technical Spec
.agents/skills/       → Skills de agentes IA
```

## Convenciones irrompibles
- **TypeScript estricto:** sin `any` explícito
- **Server Components por defecto:** usar `'use client'` solo cuando necesario (interactividad, hooks)
- **Imports absolutos:** usar `@/` siempre, nunca rutas relativas largas
- **Commits:** `feat(scope):`, `fix(scope):`, `style(scope):`, `refactor(scope):`
- **No romper el build:** siempre correr `npm run build` antes de `git push`

## Sistema de Skills — Lazy Loading (Scope Root)

⚠️ **ESTÁS EN EL ROOT DEL REPOSITORIO.** Cargas SOLO la skill crítica general. 

| Acción Solicitada | Skill a Cargar (USA ESTA RUTA) |
| :--- | :--- |
| **Arquitectura SDD:** Desarrollar nueva feature backend o bug | `.agents/workflows/sdd-new.md` |
| **Ingeniería:** "Crea una skill para esto", automatizar proceso | `.agents/skills/skill-creator/SKILL.md` |
| **DevOps / QA:** Revisión profunda de PRs, Code Review Estricto | `.agents/skills/code-review-excellence/SKILL.md` |
| **Next.js:** App Router, Server Actions, Middleware, Data Fetching | `.agents/skills/nextjs-15/SKILL.md` |
| **React:** Componentes, hooks, memoización, use() hook | `.agents/skills/react-19/SKILL.md` |
| **Tailwind:** Estilos, cn(), theming, responsive, dark mode | `.agents/skills/tailwind-4/SKILL.md` |
| **TypeScript:** Tipos, interfaces, generics, type guards | `.agents/skills/typescript/SKILL.md` |
| **Testing E2E:** Playwright, Page Objects, selectores, MCP workflow | `.agents/skills/playwright/SKILL.md` |
| **Validación:** Schemas Zod, React Hook Form, parsing | `.agents/skills/zod-4/SKILL.md` |
| **Rutina Diaria SEO:** Crear blog post optimizado (Nicho Nauta) | `.agents/workflows/daily-seo-blog.md` |
| **Content Engine:** Pipeline autónomo keyword→investigar→HTML→Supabase→IndexNow | `.agents/skills/content-engine/SKILL.md` |

**🛑 ENRUTAMIENTO POR SCOPE (CRÍTICO - V3):**
- Si el usuario te pide tocar **UI, Formularios, Landing, Layouts de Next.js, Tailwnid o el Blog**: **ABORTA** la lectura de este archivo y ve OBLIGATORIAMENTE a leer el archivo de contexto `app/(main)/agents.md`. No programes sin él.
- Si el usuario te pide tocar **Base de Datos, Endpoints API puras, o Supabase Sever**: **ABORTA** la lectura y ve OBLIGATORIAMENTE a leer `app/api/agents.md`.

## Guardrails (Hooks — Capa 1 de protección)
Antes y después de cada edición de código:
- **Pre-edit:** leer `.agents/hooks/pre-edit.md` — checklist de 5 preguntas antes de tocar código
- **Post-edit:** leer `.agents/hooks/post-edit.md` — verificación de calidad + persistencia en Engram

## GGA — Guardian Angel (Capa 2 de protección)
GGA corre **automáticamente** como pre-commit hook en cada `git commit`.
- Revisa solo archivos staged que coincidan con `FILE_PATTERNS` (`.ts`, `.tsx`, `.js`, `.jsx`)
- Cachea archivos ya revisados (no re-valida si no cambiaron)
- Config: `.gga` en la raíz del proyecto
- Manual: `bash .agents/gentleman-guardian-angel/bin/gga run`
- Sin caché: `bash .agents/gentleman-guardian-angel/bin/gga run --no-cache`
- Ver workflow completo en `.agents/workflows/gga-commit.md`
- Requiere `ANTHROPIC_API_KEY` en `.env.local`

## Memoria Persistente (Engram)
Si Engram MCP está disponible:
- Al iniciar una sesión: `mem_context` para recuperar contexto anterior del proyecto
- Al tomar una decisión técnica importante: `mem_save` con formato: `qué, por qué, dónde, qué se aprendió`
- Antes de que el contexto se llene: `mem_session_summary` para no perder info crítica
- Si Engram no responde → usar `MEMORY.md` como fallback

## Variables de entorno relevantes
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (solo server-side)
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` — AdSense ID
- `NEXT_PUBLIC_ADSENSE_APPROVED` — `'true'` cuando AdSense apruebe la cuenta
- `NEXT_PUBLIC_SITE_URL` — `https://freecloud.pe`
