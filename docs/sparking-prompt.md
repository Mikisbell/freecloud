# ⚡ Sparking Prompt — Encendido en Frío del Sistema Cognitivo

> Usa este prompt cuando abras un proyecto FreeCloud por primera vez en una nueva sesión, o cuando el agente haya perdido el contexto del proyecto.

---

## 🔥 El Prompt de Encendido (Big Bang)

Copia y pega esto en el chat de Antigravity:

```
Modo Orquestador SDD. Vas a inicializar el Sistema Cognitivo FreeCloud.

Paso 1 — Verificar Engram:
Llama mem_stats. Si responde, Engram está activo. Si falla, detente y avísame.

Paso 2 — Iniciar sesión:
Llama mem_session_start con el contexto "Inicio de sesión FreeCloud".

Paso 3 — Recuperar memoria histórica:
Busca en Engram con mem_search "FreeCloud arquitectura stack convenciones".
Si hay resultados, léelos. Aplica el patrón de 3 capas si necesitas detalle:
  mem_search → mem_timeline → mem_get_observation

Paso 4 — Leer el manifiesto del proyecto:
Lee el archivo docs/arquitectura.md con view_file.
Extrae los 3 mandamientos: stack, patrones de código, restricciones.

Paso 5 — Guardar semilla en Engram:
Si Engram no tenía memoria del proyecto, usa mem_save con topic_key para guardar los 3 mandamientos permanentemente:
  mem_suggest_topic_key(type="architecture", title="FreeCloud stack y convenciones")
  → luego mem_save(..., topic_key=resultado_anterior)

Paso 6 — Confirmar estado:
Dime:
  ✅ Engram: activo / ❌ inactivo
  ✅ Memoria cargada: N observaciones previas / sin historial
  ✅ Mandamientos inicializados
  → Listo para: /sdd-new <descripción de la feature>
```

---

## 🔄 Cuándo Usar Este Prompt

| Situación | Acción |
|---|---|
| Primera vez en el proyecto | Ejecutar el Sparking Prompt completo |
| Nueva sesión con Engram activo | Solo Pasos 1-3 (Engram ya tiene la semilla) |
| Cambiaste de feature o branch | Solo Paso 3 con términos específicos de la feature |
| Engram no responde | Instalar primero: ver `docs/engram-setup.md` |

---

## 🛡️ Después del Encendido

Una vez que el sistema está inicializado, el flujo normal es:

```
/sdd-new <descripción de la feature>
  → EXPLORE lea Engram + código → .sdd/1-explore.md
  → PROPOSE evalúe opciones → .sdd/2-propose.md
  → SPEC defina criterios de aceptación → .sdd/3-spec.md
  → DESIGN defina contratos técnicos → .sdd/4-design.md
  → TASKS genere checklist → .sdd/tasks.md
  → APPLY implemente con auto-heal → marca [x] en tasks.md
  → VERIFY valide build + spec → .sdd/7-verify.md
  → ARCHIVE guarde en Engram + commit + rm -rf .sdd/
```

---

## 📌 Notas de Uso

- **`.sdd/` es temporal** — ignora en git, se borra en ARCHIVE
- **Engram es permanente** — el conocimiento persiste entre sesiones
- **Un `mem_search` al inicio basta** — no saturar Engram con búsquedas repetitivas
- La **Auto-Creación de Skills**: si un proceso se repite 3+ veces, dile al agente: *"Usa la skill Skill-Creator para convertir esto en un workflow new en .agents/workflows/"*
