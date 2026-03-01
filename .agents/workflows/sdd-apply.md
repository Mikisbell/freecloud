---
description: Continuar implementando la siguiente tarea del plan SDD activo
---

# /sdd-apply — Aplicar Siguiente Tarea (V3 — Auto-Heal Explícito)

Usa este comando cuando ya tenés el plan de tareas en `.sdd/tasks.md` y querés implementar la siguiente.

## Cómo activarlo
```
/sdd-apply
```
O con tarea específica:
```
/sdd-apply T02: Crear componente SearchBar.tsx
```

---

## Paso 1 — Leer Contexto Activo
// turbo

```
Eres el agente APPLY del flujo SDD de FreeCloud.
Lee tu skill en: .agents/skills/sdd-apply/SKILL.md

Antes de implementar:
1. Lee .sdd/tasks.md — identifica la primera tarea [ ] sin completar
2. Lee .sdd/4-design.md — respetar interfaces y contratos definidos
3. Lee el archivo que vas a modificar completo (view_file)
4. Abre <reflexion> — valida Server/Client boundary, tipos TypeScript, scope
```

---

## Paso 2 — Implementar con Auto-Heal
// turbo

*El agente implementa exactamente lo que dice la tarea, siguiendo la reflexión previa.*

Después de implementar:
```bash
npx tsc --noEmit
```

- Si pasa → Continuar al Paso 3
- Si falla → Corregir y volver a ejecutar (máx 3 intentos)
- Si falla 3 veces → DETENER y reportar el error exacto

---

## Paso 3 — Verificar TypeScript y Marcar Tarea

```
Tarea completada, TypeScript pasa limpio.
Actualizar .sdd/tasks.md: cambiar [ ] → [x] para la tarea implementada.
Si se tomó una decisión de diseño importante: usar mem_save con topic_key.
```

## Reporte de Tarea Completada

```markdown
✅ Tarea completada: [nombre de la tarea]
Archivos modificados: [lista]
TypeScript: ✅ limpio (intento N de 3)
Próxima tarea: [siguiente [ ] del checklist]
```
