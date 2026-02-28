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

Prepara el entorno creando la carpeta de trabajo y empieza la exploración:

```
> Crea el directorio `.sdd/` si no existe.
Eres el agente EXPLORE del flujo SDD.
Feature a analizar: {{FEATURE_DESCRIPTION}}
1. Usa `mem_search` para buscar en Engram contexto histórico.
2. Lee `.agents/skills/sdd-explore/SKILL.md`
3. Explora el codebase real.
4. Escribe tu reporte completo en un archivo nuevo `>.sdd/1-explore.md`
```

---

## Paso 2 — PROPOSE (Subagente: Arquitecto)

```
Eres el agente PROPOSE del flujo SDD.
1. Lee tu skill en `.agents/skills/sdd-propose/SKILL.md`
2. Lee el contexto en `<.sdd/1-explore.md`
3. Feature original: {{FEATURE_DESCRIPTION}}
4. Evalúa y elige la mejor solución.
5. Escribe la propuesta técnica en `>.sdd/2-propose.md`
```

---

## Paso 3 — SPEC (Subagente: Notario y Test-Writer)

```
Eres el agente SPEC del flujo SDD.
1. Lee tu skill en `.agents/skills/sdd-spec/SKILL.md`
2. Lee la propuesta técnica en `<.sdd/2-propose.md`
3. Escribe los escenarios Given/When/Then.
4. Escribe el spec completo en `>.sdd/3-spec.md`
Opcional Avanzado: Crea archivos vacíos `.test.ts` que fallen por ahora si el framework está seteado.
```

---

## Paso 4 — DESIGN (Subagente: Plano)

```
Eres el agente DESIGN.
1. Lee el spec en `<.sdd/3-spec.md` y la propuesta en `<.sdd/2-propose.md`
2. Define arquitectura, contratos y schemas (Type/Supabase).
3. Escribe el diseño formal en `>.sdd/4-design.md`
```

---

## Paso 5 — TASKS (Subagente: Jefe de Obra)

```
Eres el agente TASKS.
1. Lee el diseño en `<.sdd/4-design.md`
2. Desglosa en tareas atómicas y dependientes.
3. Escribe un CHECKLIST con [ ] en el archivo `>.sdd/tasks.md`
IMPORTANTE: A partir de ahora, el agente APPLY mutará este mismo archivo.
```

---

## Paso 6 — APPLY (Subagente: Implementador con Auto-Sanación)
*Repetir ordenadamente por cada tarea no-marcada en .sdd/tasks.md*

```
Eres el agente APPLY del flujo SDD.
1. Lee `<.sdd/tasks.md`, `<.sdd/4-design.md` y escanea el código referenciado.
2. Implementa SOLO la primera tarea marcada como [ ].
3. Corre `npx tsc --noEmit` despues de tu cambio. Si falla, arréglalo tú mismo (máx 3 intentos de fix_loop).
4. Cuando el build pase, marca la tarea con una [x] en `>.sdd/tasks.md`.
```

---

## Paso 7 — VERIFY (Subagente: Inspector de Specs)

```
Eres el agente VERIFY.
1. Lee el spec original en `<.sdd/3-spec.md`
2. Ejecuta `npm run build` o pruebas pertinentes.
3. Repasa que todos los requisitos y flujos esten programados.
4. Genera tu reporte final en `>.sdd/7-verify.md` marcando ✅ APROBADO o ❌ REACHAZADO.
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
