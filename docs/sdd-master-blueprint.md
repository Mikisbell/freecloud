# 🧠 SDD Master Blueprint: Sistema Cognitivo Autónomo Integrado (Edition 2026)

> **Guía Definitiva "End-to-End"** basada en la Masterclass de Ingeniería de Agentes de Gentleman Programming, potenciada con las reglas Arquitectónicas V3 de Zero-Shot Reflection y State Persistence.
>
> Abandona la idea de "conversar con un chat". Estás a punto de ensamblar una **Línea de Ensamblaje de Código Guiada por Especificaciones** (Spec-Driven Development) operada por un enjambre de sub-agentes sin pérdida de memoria.

---

## 📦 1. El Arsenal Oficial (Repositorios del Curso)

Para ensamblar la fábrica cognitiva, requerirás integrar los siguientes 7 repositorios base:

| # | Repositorio | Descripción |
|---|---|---|
| 1 | 🧠 [Engram](https://github.com/Gentleman-Programming/engram.git) | Memoria persistente SQLite/Go/MCP — evita compactación y amnesia |
| 2 | 🤖 [Agent Teams Lite](https://github.com/Gentleman-Programming/agent-teams-lite.git) | Los obreros SDD (Explore, Propose, Spec, Apply) |
| 3 | 📚 [Gentleman Skills](https://github.com/Gentleman-Programming/Gentleman-Skills.git) | Skills modulares — Lazy Loading Context |
| 4 | ⚙️ [Gentleman Dots](https://github.com/Gentleman-Programming/Gentleman.Dots.git) | Configuración & Agent CMD Scopes |
| 5 | 🛡️ [Guardian Angel](https://github.com/Gentleman-Programming/gentleman-guardian-angel.git) | AI Code Review asíncrono para Pull Requests |
| 6 | 🔒 [Veil.nvim](https://github.com/Gentleman-Programming/veil.nvim.git) | Ocultador de ENVs para streaming en vivo |
| 7 | 🎓 [Material Teórico](https://github.com/Gentleman-Programming/from-chat-to-cognitive-system.git) | Slide deck del curso |

---

## ⚙️ 2. Core Arquitectónico: Por qué esto funciona (y los Chats no)

### A. La Trampa de la Ventana de Contexto (Lobotomía Forzada)

Un chat clásico (Agents.md gigante) colapsa: a mayor contexto, aumenta el "ruido matemático" y la IA alucina. Cuando los tokens se llenan, el sistema hace un "Summary" genérico y borra tu historial fino (**Compactación**).

**La Solución Engram:** Una base de datos ultraligera (Go + SQLite + FTS5) servida vía MCP. El Agente no guarda código, guarda **Decisiones Arquitectónicas**. Tu obrero del Viernes sabrá por qué el del Lunes usó Next.js y no Vite, mediante `mem_search` en el momento exacto.

### B. "Divide y Vencerás" — El Flujo DAG / SDD

No uses un solo prompt para armar una Feature. Usa un orquestador ligero que asigne tareas aisladas arrancando desde cero (Zero Context) en una cadena secuencial:

```
Explore ➔ Propose ➔ Spec (TDD) ➔ Design ➔ Tasks ➔ Apply ➔ Verify ➔ Archive
```

### C. Multi-Model Routing (Motores Especializados)

No hay "mejor modelo", hay **modelos especialistas**. Asigna el motor correcto a la fase correcta:

| Fase | Motor Recomendado | Razón |
|---|---|---|
| 🎨 Creativa (Propose/Design) | Gemini 2.0 Pro | Excelente razonamiento profundo espacial |
| 🧱 Codificación (Apply/Tasks) | Claude 3.7 Sonnet/Opus | El mejor generando código exacto |
| 🐛 Debugging/Testing (Verify) | Claude Sonnet / Codex | Matadores de bugs y triangulación TDD |

---

## 🚀 3. Montando el Sistema: Guía de Implementación Práctica

### Paso 3.1: El Hipocampo (Configurar Engram como Servidor MCP)

1. Instala Engram en tu PC (`go build` o vía script de Node).
2. Asegúrate de que el MCP esté registrado en tu cliente (ej. RooCode/Claude Desktop/Antigravity).
3. En `.mcp.json` apunta al binario compilado:
   ```json
   {
     "mcpServers": {
       "engram": {
         "type": "stdio",
         "command": "C:\\tools\\engram\\engram.exe",
         "args": ["mcp"]
       }
     }
   }
   ```
4. **El SuperPoder (Git Sync):** Ejecuta `engram sync` rutinariamente. Empaqueta tu SQLite en chunks y los sube junto con tu repositorio. Tus compañeros harán `engram import` e inmediatamente sus IAs tendrán tu conocimiento exacto.

### Paso 3.2: Los Obreros — Router de Skills (Agents.md Sectorizado)

No satures cargando 50 skills de golpe. Aplica **Lazy Loading de Contexto**. En tu monorepo:

- En `/frontend` → `agents.md` que carga la Skill de React + UI
- En `/api` → `agents.md` que carga la Skill de Supabase + Node
- Cuando el Orquestador trabaje en Backend, **jamás** leerá las reglas de React

### Paso 3.3: La Cadena Física "State-Driven" — El Aporte V2

Para prevenir alucinaciones, crea la carpeta física `/.sdd` (ignorada en Git). El Orquestador obliga la cadena así:

```
1. EXPLORE  → Lee Engram + Código Fuente  → Escribe: .sdd/1-explore.md
2. PROPOSE  → Lee 1-explore.md            → Escribe: .sdd/2-propose.md
3. SPEC     → Lee 2-propose.md            → Escribe: .sdd/3-spec.md + stubs de tests en rojo
4. DESIGN   → Lee spec + propuesta        → Escribe: .sdd/4-design.md
5. TASKS    → Lee 4-design.md             → Escribe: .sdd/tasks.md (checklist con [ ])
6. APPLY    → Lee tasks.md. Corre tsc.   → Marca [x] en .sdd/tasks.md
7. VERIFY   → Lee 3-spec.md. Corre build → Escribe: .sdd/7-verify.md (✅ o ❌)
8. ARCHIVE  → Lee .sdd/* → Guarda en Engram → rm -rf .sdd/
```

> ⚠️ **MANDAMIENTO V2:** Prohibido pasar `{{output_anterior}}` mediante llaves al prompt. Todo Agente lee un archivo `.sdd/` y escupe su resultado en otro archivo `.sdd/`.

> ❗ Añade `.sdd/` a tu `.gitignore` local para no ensuciar el repo.

---

## 🔥 4. Tácticas V3 Inyectadas — Frontera Cognitiva 2026

### V3.A: Zero-Shot Reflection (Reflexión Obligatoria)

Inyectar en `sdd-propose/SKILL.md` y `sdd-apply/SKILL.md`:

```
ANTES de entregar una propuesta final o código, debes abrir obligatoriamente
un tag oculto <reflexion>. En su interior, debilita lógicamente tu propia solución:
busca loops infinitos, N+1 queries, o dependencias innecesarias.
Critícate como un Senior QA. Al cerrar </reflexion>, entrega la versión perfecta.
```

**Efecto:** Multiplica por 3x la probabilidad de inferencia correcta en TypeScript.

### V3.B: Ciclo de Auto-Sanación Obligatorio (Shift-Left Verification)

Inyectar en `sdd-apply/SKILL.md`:

```
Después de codear, estás forzado a ejecutar npx tsc --noEmit en el terminal.
Si el testeo crashea por tipos, arréglalo tú mismo silenciosamente
(hasta 3 ciclos permitidos). Nunca le entregues código roto al orquestador humano.
```

### V3.C: Búsqueda Retrospectiva Inversa (Amnesia Cero)

Inyectar en `sdd-explore/SKILL.md`:

```
ANTES de analizar el código, ejecuta obligatoriamente mem_search buscando
decisiones arquitectónicas previas sobre esta feature. Si va a reconstruir
un sistema de Login, debe saber por qué fallaron los tokens JWT la semana pasada.
```

### V3.D: La Auto-Creación (El Agente Inventor)

Tareas repetitivas deben volverse Skills. Lanza un chat y di:

> "Siempre que deployo corro estos 3 comandos. Usa tu Skill 'skill-creator' para generar el archivo `deploy.md` y guárdala en mi router de Skills (.agents/workflows/)."

---

## ⚡ 5. Encendido a Sangre Fría (The Sparking Prompt)

Cuando el proyecto es 100% virgen, lanza este **Prompt de Encendido** en tu cliente LLM:

```
Modo Orquestador. Vas a Inicializar el Sistema Cognitivo leyendo la base de código.

1. Verifica con tus tools que [engram] esté activo conectando vía MCP.
2. Lee los archivos de configuración y docs/arquitectura.md.
3. Extrae nuestros 3 mandamientos sagrados (stack, ADTs preferidos, restricciones).
4. Usa mem_save para guardar esta semilla permanentemente en el Hipocampo.
5. Luego, indícame qué motor recomiendas usar para comenzar el /sdd-new.
```

> A partir de allí, con tu mente Engram cargada y tu DAG físico configurado, bastará con escribir:
> **`/sdd-new Crear panel estadístico con filtros fecha y export PDF`**
> para que toda la cadena de IA funcione sin interrupción mecánica.

---

## 📍 Implementación en FreeCloud.pe

Este Blueprint está **activo** en el proyecto `Mikisbell/freecloud`:

- `.agents/skills/` — Todos los sub-agentes (explore, propose, spec, design, tasks, apply, verify, archive)
- `.agents/workflows/sdd-new.md` — El orquestador maestro del flujo DAG
- `AGENTS.md` (root) — Lazy Loading sectorizado con rutas de skill por dominio
- `app/(main)/agents.md` — Scope UI/Frontend
- `app/api/agents.md` — Scope Backend/Supabase
- `.mcp.json` — Engram + Notion MCP registrados
- `docs/arquitectura.md` — La "semilla" para el Sparking Prompt

**Commit de referencia SDD en producción:** `ef50b23` — `feat(blog): robust dynamic table of contents via DOM`
