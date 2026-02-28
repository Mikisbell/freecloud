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
- **Monetización:** Google AdSense (pendiente de aprobación)
- **SEO:** next-sitemap, JSON-LD, OpenGraph via `lib/seo.ts`

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

## Sistema de Skills — Lazy Loading de Contexto

Cargar SOLO la skill que aplica al contexto actual. No cargar varias a la vez.

| Contexto de trabajo | Skill a cargar |
|---|---|
| Componentes React, páginas, layouts Next.js | `.agents/skills/nextjs-shadcn-builder/SKILL.md` |
| Revisión de código, PRs, calidad | `.agents/skills/code-review-excellence/SKILL.md` |
| Estilos, Tailwind, responsive/mobile | `.agents/skills/tailwindcss-mobile-first/SKILL.md` |
| Performance, LCP, CLS, bundle optimization | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| Landing page, hero, conversión | `.agents/skills/landing-page-guide-v2/SKILL.md` |
| Feature nueva o cambio arquitectónico complejo | `.agents/skills/sdd-orchestrator/SKILL.md` |
| Explorar codebase antes de implementar | `.agents/skills/sdd-explore/SKILL.md` |
| Escribir especificaciones y tests | `.agents/skills/sdd-spec/SKILL.md` |
| Diseño técnico y decisiones de arquitectura | `.agents/skills/sdd-design/SKILL.md` |
| Planificar tareas de implementación | `.agents/skills/sdd-tasks/SKILL.md` |
| Implementar código siguiendo un plan | `.agents/skills/sdd-apply/SKILL.md` |
| Verificar que lo implementado cumple el spec | `.agents/skills/sdd-verify/SKILL.md` |

## Memoria Persistente (Engram)
Si Engram MCP está disponible:
- Al iniciar una sesión: `engram_search` para recuperar contexto anterior del proyecto
- Al tomar una decisión técnica importante: `engram_save` con formato: `qué, por qué, dónde, qué se aprendió`
- Antes de que el contexto se llene: `engram_summary` para no perder info crítica

## Variables de entorno relevantes
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (solo server-side)
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` — AdSense ID
- `NEXT_PUBLIC_ADSENSE_APPROVED` — `'true'` cuando AdSense apruebe la cuenta
- `NEXT_PUBLIC_SITE_URL` — `https://freecloud.pe`
