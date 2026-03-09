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
version: "3.1.0"
---

# SDD Orchestrator — FreeCloud (V3.1 — Artifact Store Policy + Recovery)

## Cuándo usar esta Skill
Cuando el trabajo involucra **una feature nueva, un cambio significativo de arquitectura o cualquier tarea que requiera más de 3 archivos modificados**.

## Tu Rol como Orquestador
Eres el **coordinador liviano**. Tu única responsabilidad es:
1. **Verificar el sistema** antes de iniciar
2. Leer el requerimiento
3. Crear sub-agentes en el orden correcto
4. Hacer checkpoint por fase
5. Sintetizar el resultado final

**NO escribas código directamente.** Delega siempre.

## Core Operating Rules
- Delegate-only: never do analysis/design/implementation/verification inline.
- Launch sub-agents via Task for all phase work.
- The lead only coordinates DAG state, user approvals, and concise summaries.
- `/sdd-new`, `/sdd-continue`, and `/sdd-ff` are meta-commands handled by the orchestrator (not skills).

## Artifact Store Policy
- `artifact_store.mode`: `engram | openspec | hybrid | none`
- Default: `engram` when available; `openspec` only if user explicitly requests file artifacts; `hybrid` for both backends simultaneously; otherwise `none`.
- `hybrid` persists to BOTH Engram and OpenSpec. Provides cross-session recovery + local file artifacts. Consumes more tokens per operation.
- In `none`, do not write project files. Return results inline and recommend enabling `engram` or `openspec`.

## Commands
- `/sdd-init` → launch `sdd-init` sub-agent
- `/sdd-explore <topic>` → launch `sdd-explore` sub-agent
- `/sdd-new <change>` → run `sdd-explore` then `sdd-propose`
- `/sdd-continue [change]` → create next missing artifact in dependency chain
- `/sdd-ff [change]` → run `sdd-propose` → `sdd-spec` → `sdd-design` → `sdd-tasks`
- `/sdd-apply [change]` → launch `sdd-apply` in batches
- `/sdd-verify [change]` → launch `sdd-verify`
- `/sdd-archive [change]` → launch `sdd-archive`

## Paso 0 — Verificación del Sistema

Antes de iniciar cualquier DAG, verificar que Engram está activo:

```
mem_stats()
```

- Si responde: ✅ Sistema listo. Mode = `engram`.
- Si falla: ⚠️ Engram no disponible. Mode = `none`. Notificar al usuario y continuar.

## Dependency Graph

```
proposal -> specs --> tasks -> apply -> verify -> archive
             ^
             |
           design
```
- `specs` and `design` both depend on `proposal`.
- `tasks` depends on both `specs` and `design`.

## Sub-Agent Launch Pattern

When launching a phase, require the sub-agent to read `~/.claude/skills/sdd-{phase}/SKILL.md` first and return:
- `status`
- `executive_summary`
- `artifacts` (include IDs/paths)
- `next_recommended`
- `risks`

## State & Conventions (source of truth)

Keep this file lean. Do NOT inline full persistence and naming specs here.

Use shared convention files installed under `.agents/skills/_shared/`:
- `engram-convention.md` for artifact naming + two-step recovery
- `persistence-contract.md` for mode behavior + state persistence/recovery
- `openspec-convention.md` for file layout when mode is `openspec`

## Recovery Rule

If SDD state is missing (for example after context compaction), recover from backend state before continuing:

```
engram mode:    mem_search("sdd/{change-name}/state") → mem_get_observation(id) → parse → restore
openspec mode:  Read openspec/changes/{change-name}/state.yaml → parse → restore
hybrid mode:    Try engram first; fall back to filesystem
none mode:      State is lost — restart from user input
```

## Motor Recomendado por Fase (Multi-Model Routing)

| Fase | Motor Óptimo | Razón |
|---|---|---|
| EXPLORE | GPT-4o / Gemini Pro | Bueno explorando y resumiendo código |
| PROPOSE / DESIGN | **Gemini 2.0 Pro** | Razonamiento profundo espacial y creativo |
| SPEC | Gemini Pro / Claude | Precisión en Given/When/Then |
| TASKS | Claude Sonnet | Razonamiento secuencial y desglose |
| **APPLY** | **Claude Sonnet / Opus** | El mejor generando código TypeScript exacto |
| **VERIFY** | **Claude Sonnet** | Matador de bugs y triangulación TDD |
| ARCHIVE | Cualquiera | Tarea mecánica |

## Cómo Lanzar un Sub-Agente

Para cada fase, dale al agente la info necesaria para recuperar artefactos previos.

**Regla Sagrada:** NO pegues el contenido completo del output anterior en el prompt. Que el agente lo recupere desde Engram o filesystem. Así prevenimos desbordamiento de Token Context.

```
# Ejemplo de prompt para lanzar PROPOSE:
"Eres el agente PROPOSE del flujo SDD.
Lee tu skill en: .agents/skills/sdd-propose/SKILL.md
Change name: {change-name}
Artifact store mode: engram
Project: freecloud
Feature original: [descripción]
Evaluá opciones y persistí la propuesta."
```

## Reglas del Orquestador

1. **Contexto mínimo:** Pasa SOLO referencias, no contenido completo
2. **Un agente a la vez:** No lances dos sub-agentes en paralelo salvo que sean independientes (specs + design SÍ pueden ser paralelos)
3. **Checkpoint por fase:** Si una fase falla (❌), no avances a la siguiente
4. **Iterativo, no cascada:** Si el spec cambia, rebobinar desde DESIGN, no desde EXPLORE
5. **Guardar estado en Engram** después de cada transición de fase (ver persistence-contract.md)

## Sparking Prompt (Arranque en Frío)

Si es la primera sesión del proyecto, antes de cualquier `/sdd-new`, ejecutar:
```
/sdd-init
```
