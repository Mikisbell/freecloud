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
version: "2.0.0"
---

# SDD Orchestrator — FreeCloud (V3 — Verificación de Sistema + Multi-Model Routing)

## Cuándo usar esta Skill
Cuando el trabajo involucra **una feature nueva, un cambio significativo de arquitectura o cualquier tarea que requiera más de 3 archivos modificados**.

## Tu Rol como Orquestador
Eres el **coordinador liviano**. Tu única responsabilidad es:
1. **Verificar el sistema** antes de iniciar
2. Leer el requerimiento
3. Crear sub-agentes en el orden correcto con rutas físicas
4. Hacer checkpoint por fase
5. Sintetizar el resultado final

**NO escribas código directamente.** Delega siempre.

## Paso 0 — Verificación del Sistema (NUEVO V3)

Antes de iniciar cualquier DAG, verificar que Engram está activo:

```
mem_stats()
```

- Si responde: ✅ Sistema listo. Continuar con Paso 1.
- Si falla: ⚠️ Engram no disponible. El flujo puede continuar pero sin memoria persistente. Notificar al usuario y continuar igualmente.

## Flujo DAG Paginado (.sdd/)

Para evitar la "amnesia" del LLM, el Orquestador **siempre requiere** que cada agente lea y escriba archivos físicos en `.sdd/`. No dependemos de la memoria efímera del chat.

```
0. [SISTEMA]  → Verificar Engram (mem_stats)
    ↓
1. [EXPLORE]  → mem_session_start + mem_search → lee codebase. Escribe: .sdd/1-explore.md
    ↓
2. [PROPOSE]  → Lee 1-explore.md → <reflexion> → Escribe: .sdd/2-propose.md
    ↓
3. [SPEC]     → Lee 2-propose.md → Escribe: .sdd/3-spec.md (Given/When/Then)
    ↓
4. [DESIGN]   → Lee 3-spec.md + 2-propose.md → Escribe: .sdd/4-design.md
    ↓
5. [TASKS]    → Lee 4-design.md → Escribe: .sdd/tasks.md (formato [ ])
    ↓
6. [APPLY]    → Lee tasks.md. Implementa [ ]. npx tsc (auto-heal 3 ciclos). Marca [x]. mem_save con topic_key.
    ↓
7. [VERIFY]   → Lee 3-spec.md, ejecuta npm run build. Escribe: .sdd/7-verify.md (✅/❌)
    ↓
8. [ARCHIVE]  → Lee .sdd/*, mem_save + mem_session_end, commit, rm -rf .sdd/
```

## Motor Recomendado por Fase (Multi-Model Routing)

| Fase | Motor Óptimo | Razón |
|---|---|---|
| EXPLORE | GPT-4o / Gemini Pro | Bueno explorando y resumiendo código |
| PROPOSE / DESIGN | **Gemini 2.0 Pro** | Razonamiento profundo espacial y creativo |
| SPEC | Gemini Pro / Claude | Precisión en Given/When/Then |
| TASKS | Claude Sonnet | Razonamiento secuencial y desglose |
| **APPLY** | **Claude 3.7 Sonnet / Opus** | El mejor generando código TypeScript exacto |
| **VERIFY** | **Claude Sonnet** | Matador de bugs y triangulación TDD |
| ARCHIVE | Cualquiera | Tarea mecánica |

## Cómo Lanzar un Sub-Agente

Para cada fase, dale al agente las **rutas absolutas/relativas de los archivos `.sdd/`** para que use sus propias tools (`view_file`).

**Regla Sagrada:** NO pegues el contenido completo del output anterior en el prompt. Dale la ruta del archivo y que lo lea él mismo. Así prevenimos desbordamiento de Token Context y alucinaciones.

```
# Ejemplo de prompt para lanzar PROPOSE:
"Eres el agente PROPOSE del flujo SDD.
Lee tu skill en: .agents/skills/sdd-propose/SKILL.md
Lee el contexto en: .sdd/1-explore.md
Feature original: [descripción]
Evaluá opciones y escribí la propuesta en: .sdd/2-propose.md"
```

## Reglas del Orquestador

1. **Contexto mínimo:** Pasa SOLO la ruta del archivo del agente anterior, no el contenido
2. **Un agente a la vez:** No lances dos sub-agentes en paralelo salvo que sean independientes
3. **Checkpoint por fase:** Si una fase falla (❌), no avances a la siguiente
4. **Iterativo, no cascada:** Si el spec cambia, rebobinar desde DESIGN, no desde EXPLORE
5. **Guardar en Engram** al finalizar cada feature via ARCHIVE

## Sparking Prompt (Arranque en Frío)

Si es la primera sesión del proyecto, antes de cualquier `/sdd-new`, ejecutar el Sparking Prompt:
```
Ver: docs/sparking-prompt.md
```
