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

## Flujo DAG — Orden de Sub-Agentes

```
Entrada: Descripción de la feature / issue / spec de Notion
    ↓
1. [EXPLORE]  → Lee el codebase relevante. Output: contexto JSON
    ↓
2. [PROPOSE]  → Define qué cambiar y por qué. Output: propuesta técnica
    ↓
3. [SPEC]     → Escribe requisitos y escenarios de prueba. Output: spec.md
    ↓
4. [DESIGN]   → Arquitectura: archivos, interfaces, schema DB. Output: design.md
    ↓
5. [TASKS]    → Divide en tareas atómicas. Output: tasks.md (checklist)
    ↓
6. [APPLY]    → Implementa cada tarea. Output: código + diff
    ↓
7. [VERIFY]   → Valida contra el spec, ejecuta build. Output: ✅/❌
    ↓
8. [ARCHIVE]  → Guarda decisiones en Engram. Output: memoria persistida
```

## Cómo lanzar un Sub-Agente

Para cada fase, crear un sub-agente (contexto limpio) con este prompt base:

```
Eres el agente [NOMBRE]. Tu tarea es [DESCRIPCIÓN ESPECÍFICA].

Contexto del proyecto FreeCloud (stack: Next.js 16 + Supabase + TypeScript):
[PEGAR EL OUTPUT DEL SUB-AGENTE ANTERIOR]

Instrucciones detalladas: leer `.agents/skills/sdd-[nombre]/SKILL.md`

Cuando termines, devuelve SOLO el resultado en formato estructurado.
No hagas más de lo que te pido.
```

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
