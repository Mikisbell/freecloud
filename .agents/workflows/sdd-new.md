---
description: Iniciar una nueva feature con el flujo SDD completo (Explorar → Proponer → Spec → Diseño → Tareas → Implementar → Verificar → Archivar)
---

# /sdd-new — Nueva Feature SDD (V3 — Pipeline Físico .sdd/)

Usa este workflow cuando quieras implementar una feature nueva de forma estructurada.

## Cómo activarlo
```
/sdd-new <descripción de la feature>
```

**Ejemplo:**
```
/sdd-new agregar buscador de posts en el blog con Supabase FTS
```

---

## Paso 0 — VERIFICAR SISTEMA + CREAR ENTORNO
// turbo

```bash
# Crear la carpeta temporal de trabajo (ignorada en git)
mkdir -p .sdd
```

Luego verificar Engram en el chat:
```
Llama mem_stats para verificar que Engram está activo.
Si responde: ✅ continuar. Si falla: ⚠️ notificar y continuar sin memoria.
```

---

## Paso 1 — EXPLORE (Subagente: Detective)

```
Eres el agente EXPLORE del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-explore/SKILL.md

Feature a analizar: <FEATURE_DESCRIPTION>

Sigue las instrucciones del SKILL.md:
  - mem_session_start
  - mem_search (búsqueda en 3 capas si hay resultados)
  - Explorar el codebase
  - Escribir reporte en: .sdd/1-explore.md
```

---

## Paso 2 — PROPOSE (Subagente: Arquitecto)

```
Eres el agente PROPOSE del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-propose/SKILL.md
Lee el contexto en: .sdd/1-explore.md

Feature: <FEATURE_DESCRIPTION>

Sigue las instrucciones del SKILL.md:
  - Abrir <reflexion> ANTES de proponer
  - Evaluar mínimo 2 alternativas
  - Elegir la mejor opción justificada
  - Escribir propuesta en: .sdd/2-propose.md
```

---

## Paso 3 — SPEC (Subagente: Notario)

```
Eres el agente SPEC del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-spec/SKILL.md
Lee la propuesta en: .sdd/2-propose.md

Sigue las instrucciones del SKILL.md:
  - Escribir escenarios Given/When/Then
  - Escribir el spec completo en: .sdd/3-spec.md
  Opcional: crear archivos .test.ts vacíos (stubs en rojo)
```

---

## Paso 4 — DESIGN (Subagente: Plano)

```
Eres el agente DESIGN para FreeCloud.
Lee tu skill en: .agents/skills/sdd-design/SKILL.md
Lee el spec en: .sdd/3-spec.md
Lee la propuesta en: .sdd/2-propose.md

Sigue las instrucciones del SKILL.md:
  - Definir interfaces TypeScript
  - Definir queries Supabase
  - Definir schema de DB si aplica
  - Escribir diseño técnico en: .sdd/4-design.md
```

---

## Paso 5 — TASKS (Subagente: Jefe de Obra)

```
Eres el agente TASKS para FreeCloud.
Lee tu skill en: .agents/skills/sdd-tasks/SKILL.md
Lee el diseño en: .sdd/4-design.md

Sigue las instrucciones del SKILL.md:
  - Desglosar en tareas atómicas ordenadas por dependencia
  - Escribir CHECKLIST con [ ] en: .sdd/tasks.md
  IMPORTANTE: El agente APPLY mutará este archivo marcando [x].
```

---

## Paso 6 — APPLY (Subagente: Implementador)
*Repetir por cada tarea [ ] en .sdd/tasks.md*

```
Eres el agente APPLY del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-apply/SKILL.md
Lee las tareas en: .sdd/tasks.md
Lee el diseño en: .sdd/4-design.md

Implementa SOLO la primera tarea marcada como [ ].
Sigue el ciclo de Auto-Heal: corre npx tsc --noEmit (máx 3 intentos).
Cuando pase limpio, marca la tarea [x] en .sdd/tasks.md.
Si tomaste una decisión de diseño importante: usa mem_save con topic_key.
```

---

## Paso 7 — VERIFY (Subagente: Inspector)

```
Eres el agente VERIFY del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-verify/SKILL.md
Lee el spec en: .sdd/3-spec.md

Ejecuta npm run build.
Valida cada escenario Given/When/Then del spec.
Escribe el reporte en: .sdd/7-verify.md con ✅ APROBADO o ❌ RECHAZADO.
```

---

## Paso 8 — ARCHIVE (Subagente: Historiador)
*Solo si .sdd/7-verify.md dice ✅ APROBADO*

```
Eres el agente ARCHIVE del flujo SDD para FreeCloud.
Lee tu skill en: .agents/skills/sdd-archive/SKILL.md
Lee todos los archivos en .sdd/ (1-explore, 2-propose, 3-spec, 4-design, tasks, 7-verify).

Feature completada: <FEATURE_DESCRIPTION>

Sigue las instrucciones del SKILL.md:
  - Guardar en Engram con mem_save + topic_key (mem_suggest_topic_key primero)
  - mem_session_summary + mem_session_end
  - Crear commit convencional
  - Eliminar la carpeta .sdd/ (Remove-Item -Recurse -Force .sdd/)
```
