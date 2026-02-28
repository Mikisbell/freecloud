---
name: sdd-orchestrator
description: >
  Orquestador SDD (Spec Driven Development) para FreeCloud. Coordina sub-agentes
  especializados para implementar features de forma estructurada. NO implementa
  código directamente — solo delega, coordina y sintetiza.
triggers:
  - "nueva feature"
  - "nuevo endpoint"
  - "nueva página"
  - "refactoring complejo"
  - "cambio arquitectónico"
  - "implementar [cualquier feature grande]"
version: "1.0.0"
---

# SDD Orchestrator — FreeCloud

## Cuándo usar esta Skill
Cuando el trabajo involucra **una feature nueva, un cambio significativo de arquitectura o cualquier tarea que requiera más de 3 archivos modificados**.

## Tu Rol como Orquestador
Eres el **coordinador liviano**. Tu única responsabilidad es:
1. Leer el requerimiento
2. Crear sub-agentes en el orden correcto
3. Pasar el output de cada uno al siguiente
4. Sintetizar el resultado final

**NO escribas código directamente.** Delega siempre.

## Flujo DAG Paginado (.sdd/)

Para evitar la "amnesia" del LLM y pérdida de contexto, el Orquestador **siempre requiere** que cada agente lea y escriba archivos físicos en una carpeta `.sdd/` (State Driven Development). No dependemos de la memoria efímera del chat.

```
1. [EXPLORE]  → Lee Engram + Codebase. Guarda: `.sdd/1-explore.md`
    ↓
2. [PROPOSE]  → Lee 1-explore.md. Guarda: `.sdd/2-propose.md`
    ↓
3. [SPEC]     → Lee 2-propose.md. Guarda: `.sdd/3-spec.md`
    ↓
4. [DESIGN]   → Lee 3-spec.md + 2-propose.md. Guarda: `.sdd/4-design.md`
    ↓
5. [TASKS]    → Divide en tareas. Guarda: `.sdd/tasks.md` (formato [ ])
    ↓
6. [APPLY]    → Implementa tareas [ ]. Corre tsc puro (auto-heal) y marca [x].
    ↓
7. [VERIFY]   → Valida contra 3-spec.md, ejecuta build. Reporta ✅/❌ en `.sdd/7-verify.md`
    ↓
8. [ARCHIVE]  → Lee `.sdd/*` y sube lecciones a Engram. Borra la carpeta.
```

## Cómo lanzar un Sub-Agente

Para cada fase, debes lanzar un sub-agente limpio copiando siempre la orden exacta descrita en `.agents/workflows/sdd-new.md`.

Regla Sagrada: **NO pases el contexto completo pegado en el prompt**. En su lugar, dale al agente las rutas absolutas o relativas de los archivos `.sdd/...` para que use sus propias tools (`view_file`) de recolección de contexto. Así prevenimos desbordamientos de Token Context y alucinaciones.

## Reglas del Orquestador

1. **Contexto mínimo:** Pasa SOLO el output del agente anterior, no el historial completo
2. **Un agente a la vez:** No lances dos sub-agentes en paralelo salvo que sean independientes
3. **Checkpoint por fase:** Si una fase falla, no avances a la siguiente
4. **Iterativo, no cascada:** Si el spec cambia, rebobinar desde DESIGN, no desde EXPLORE
5. **Guardar en Engram** al finalizar cada feature via `sdd-archive`

## Ejemplo de uso real

**Input del usuario:**
> "Agregar sistema de búsqueda full-text en el blog"

**El orquestador crea:**
1. EXPLORE: "Lee `app/(main)/blog/page.tsx`, `lib/supabase.ts`. ¿Cómo se obtienen los posts hoy?"
2. PROPOSE: "Definir si la búsqueda es client-side (filtro local) o server-side (Supabase FTS)"
3. SPEC: "Dado que el usuario escribe en el input, cuando presiona Enter, entonces ve posts filtrados por título y contenido"
4. DESIGN: "Agregar parámetro `?q=` a la URL, nueva función `searchPosts()` en `lib/supabase.ts`"
5. TASKS: "[ ] searchPosts(), [ ] URL param handling, [ ] UI SearchBar, [ ] debounce"
6. APPLY: "Implementa searchPosts() primero"
7. VERIFY: "npm run build pasa, búsqueda retorna resultados correctos"
8. ARCHIVE: "Guardar en Engram: Búsqueda implementada con Supabase FTS, patrón URL param, SearchBar como Client Component"
