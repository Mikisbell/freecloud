---
description: Verificar que la implementación actual cumple con el spec SDD (build + TypeScript + escenarios)
---

# /sdd-verify — Verificar Implementación

Usa este comando cuando terminaste de implementar y querés validar todo antes del commit.

## Cómo activarlo
```
/sdd-verify
```

---

## Paso 1 — Build Check
// turbo

Ejecutar el build de producción:

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
Lee las instrucciones en: .agents/skills/sdd-verify/SKILL.md

Verifica cada escenario del spec (Given/When/Then).
Para cada uno: ¿Pasa ✅ o Falla ❌?
Reporta la evidencia de cada verificación.
```

---

## Paso 4 — Reporte Final

```markdown
## Resultado de Verificación

Build: ✅ / ❌
TypeScript: ✅ / ❌
Spec scenarios: N/N pasaron

Veredicto: ✅ APROBADO → listo para /sdd-archive
           ❌ RECHAZADO → lista de problemas a corregir con /sdd-apply
```
