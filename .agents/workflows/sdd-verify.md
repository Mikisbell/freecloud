---
description: Verificar que la implementación actual cumple con el spec SDD (build + TypeScript + escenarios)
---

# /sdd-verify — Verificar Implementación (V3 — Escribe .sdd/7-verify.md)

Usa este comando cuando terminaste de implementar y querés validar todo antes del commit.

## Cómo activarlo
```
/sdd-verify
```

---

## Paso 1 — Build Check
// turbo

```bash
npm run build
```

Si falla → **STOP**. Reportar el error exacto y no continuar.

---

## Paso 2 — TypeScript Check
// turbo

```bash
npx tsc --noEmit
```

Si hay errores → reportar archivo y línea exacta.

---

## Paso 3 — Verificar contra Spec

```
Eres el agente VERIFY del flujo SDD de FreeCloud.
Lee tu skill en: .agents/skills/sdd-verify/SKILL.md

Lee el spec original en: .sdd/3-spec.md
Verifica cada escenario Given/When/Then.
Para cada uno: ¿Pasa ✅ o Falla ❌? Reporta la evidencia.
```

---

## Paso 4 — Escribir Resultado en .sdd/7-verify.md

El agente VERIFY debe escribir el reporte en el archivo físico:

```
Escribir el siguiente reporte en: .sdd/7-verify.md

## Reporte de Verificación — [Feature]

### Build
- npm run build: ✅ / ❌
- npx tsc --noEmit: ✅ / ❌

### Escenarios del Spec
| Escenario | Resultado | Evidencia |
|---|---|---|
| Dado que... cuando... entonces... | ✅ | [descripción breve] |

### Veredicto
✅ APROBADO — listo para /sdd-archive
❌ RECHAZADO — problemas a corregir:
  - [Problema 1]
  - [Problema 2]
```

---

## Paso 5 — Decisión Final

- Si ✅ APROBADO → ejecutar `/sdd-archive` o el Paso 8 del flujo `/sdd-new`
- Si ❌ RECHAZADO → usar `/sdd-apply` para corregir los problemas específicos listados
