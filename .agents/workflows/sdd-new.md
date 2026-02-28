---
description: Iniciar una nueva feature con el flujo SDD completo (Explorar → Proponer → Spec → Diseño → Tareas → Implementar → Verificar → Archivar)
---

# /sdd-new — Nueva Feature SDD

Usa este workflow cuando quieras implementar una feature nueva de forma estructurada.

## Cómo activarlo
Escribe: `/sdd-new` seguido de la descripción de la feature.

**Ejemplo:**
```
/sdd-new agregar buscador de posts en el blog con Supabase FTS
```

---

## Paso 1 — EXPLORE (Subagente: Detective)
// turbo

Lee el skill del explorador y analiza el codebase relevante:

```
Eres el agente EXPLORE del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-explore/SKILL.md
Feature a analizar: {{FEATURE_DESCRIPTION}}
Produce el reporte de contexto estructurado completo.
```

---

## Paso 2 — PROPOSE (Subagente: Arquitecto)

Con el reporte del explorador, define la dirección técnica:

```
Eres el agente PROPOSE del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-propose/SKILL.md
Feature: {{FEATURE_DESCRIPTION}}
Contexto del Explore: {{OUTPUT_EXPLORE}}
Evalúa alternativas y elige la mejor solución técnica.
```

---

## Paso 3 — SPEC (Subagente: Notario)

Convierte la propuesta en escenarios Given/When/Then:

```
Eres el agente SPEC del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-spec/SKILL.md
Propuesta técnica: {{OUTPUT_PROPOSE}}
Escribe los requisitos formales y escenarios de prueba TDD.
```

---

## Paso 4 — DESIGN (Subagente: Plano)

Define la arquitectura técnica completa:

```
Eres el agente DESIGN del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-design/SKILL.md
Propuesta: {{OUTPUT_PROPOSE}}
Spec: {{OUTPUT_SPEC}}
Define: archivos a crear/modificar, interfaces TypeScript, contratos de función.
```

---

## Paso 5 — TASKS (Subagente: Jefe de Obra)

Divide el diseño en tareas atómicas:

```
Eres el agente TASKS del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-tasks/SKILL.md
Diseño técnico: {{OUTPUT_DESIGN}}
Crea el checklist priorizado de tareas implementables.
```

---

## Paso 6 — APPLY (Subagente: Implementador)
*Repetir por cada tarea del checklist*

```
Eres el agente APPLY del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-apply/SKILL.md
Tarea a implementar: {{TAREA_ACTUAL}}
Diseño técnico: {{OUTPUT_DESIGN}}
Contexto del codebase: {{OUTPUT_EXPLORE}}
Implementa SOLO esta tarea. No más.
```

---

## Paso 7 — VERIFY (Subagente: Inspector)

Valida todo lo implementado:

```
Eres el agente VERIFY del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-verify/SKILL.md
Spec de referencia: {{OUTPUT_SPEC}}
Ejecuta: npm run build | npx tsc --noEmit
Verifica cada escenario del spec. Reporta ✅/❌.
```

---

## Paso 8 — ARCHIVE (Subagente: Historiador)
*Solo si VERIFY reporta ✅ APROBADO*

```
Eres el agente ARCHIVE del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-archive/SKILL.md
Feature completada: {{FEATURE_DESCRIPTION}}
Resumen de decisiones: {{RESUMEN_DE_TODO_EL_FLUJO}}
Guarda en Engram (si disponible) y crea el commit convencional final.
```
