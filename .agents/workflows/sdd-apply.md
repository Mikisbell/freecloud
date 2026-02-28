---
description: Continuar implementando la siguiente tarea del plan SDD activo
---

# /sdd-apply — Aplicar Siguiente Tarea

Usa este comando cuando ya tenés el plan de tareas y querés implementar la siguiente.

## Cómo activarlo
```
/sdd-apply
```
O con tarea específica:
```
/sdd-apply T02: Crear componente SearchBar.tsx
```

---

## Paso 1 — Leer el contexto activo
// turbo

```
Eres el agente APPLY del flujo SDD de FreeCloud.
Lee las instrucciones en: .agents/skills/sdd-apply/SKILL.md

Antes de implementar:
1. Lee el design.md de la feature activa (si existe en .sdd/)
2. Lee la tarea específica del checklist de tasks.md
3. Lee el archivo que vas a modificar completo

Implementa SOLO la tarea indicada. Respeta las convenciones del proyecto en AGENTS.md.
```

---

## Paso 2 — Implementar
*El agente implementa exactamente lo que dice la tarea, sin improvisar.*

---

## Paso 3 — Reporte de tarea completada

Al terminar, el agente reporta:
```
✅ Tarea completada: [nombre de la tarea]
Archivos modificados: [lista]
Próxima tarea: [siguiente del checklist]
```
