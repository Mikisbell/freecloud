# ⚙️ FreeCloud — Scope: Backend & API `app/api`

**ESTÁS EN LA CAPA DE LÓGICA DE NEGOCIO.** Tu contexto son las Rutas API, Supabase Server, Node.js y Seguridad.

## Lazy Loading de Contexto Backend

| Tarea de Backend | Skill a Cargar Inmediatamente |
| :--- | :--- |
| Arquitectura de Base de Datos o Endpoints Completos (Usa Orquestador SDD) | `.agents/workflows/sdd-new.md` |
| Revisión estricta de seguridad o PR Backend | `.agents/skills/code-review-excellence/SKILL.md` |

**Reglas de Backend (Inquebrantables):**
1. Usar siempre `@supabase/ssr` en Server Components y Route Handlers (NO usar `@supabase/supabase-js` pelado del lado del cliente).
2. Todo endpoint público que modifique DB debe verificar protección (CORS / Honeypot) o RLS previo.
3. Jamás renderices JSX/UI desde estas carpetas.

**🛑 REGLA DE ABORTO:** Si el usuario te pide hacer "animaciones", botones, o Tailwind, **detente**. Salta obligatoriamente al enrutador `app/(main)/agents.md`.
