# 🧠 Engram — Guía de Instalación (Windows + Antigravity)

> **Engram** es el hipocampo del sistema SDD. Un binario nativo Go con SQLite+FTS5 que persiste decisiones arquitectónicas entre sesiones. Sin Node.js, sin Docker, sin ChromaDB. Un binario, un archivo SQLite.

---

## 📦 Instalación en Windows

### Opción A — Descarga Binario (Recomendada)

1. Ve a [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases)
2. Descarga `engram_<version>_windows_amd64.zip`
3. Extrae `engram.exe` y ponlo en un folder de tu PATH, por ejemplo `C:\Users\TuNombre\bin\`

```powershell
# Extraer y agregar al PATH (PowerShell — ejecutar una sola vez)
Expand-Archive engram_*_windows_amd64.zip -DestinationPath "$env:USERPROFILE\bin"

# Agregar al PATH permanentemente
[Environment]::SetEnvironmentVariable(
  "Path",
  "$env:USERPROFILE\bin;" + [Environment]::GetEnvironmentVariable("Path", "User"),
  "User"
)
```

4. Verifica la instalación (abre una nueva terminal):
```powershell
engram version
```

### Opción B — Build desde fuente (requiere Go)

```powershell
git clone https://github.com/Gentleman-Programming/engram.git
cd engram
go install ./cmd/engram
# El binario queda en %USERPROFILE%\go\bin\engram.exe
```

> **Datos almacenados en:** `%USERPROFILE%\.engram\engram.db`  
> Para cambiar la ruta: `ENGRAM_DATA_DIR=<ruta>` como variable de entorno

---

## ⚙️ Configurar Engram como MCP en Antigravity

Antigravity usa MCP vía `~/.gemini/antigravity/mcp_config.json`.

1. Abre (o crea) el archivo:
```
C:\Users\TuNombre\.gemini\antigravity\mcp_config.json
```

2. Agrega la entrada de Engram:
```json
{
  "mcpServers": {
    "engram": {
      "command": "engram",
      "args": ["mcp"]
    }
  }
}
```

> Si ya tienes otras entradas MCP (ej. `notion`), agrega `"engram"` dentro del mismo objeto `mcpServers`.

3. **Reinicia Antigravity** para que detecte el nuevo servidor MCP.

4. Verifica que Engram está activo — en el chat escribe:
```
¿Tienes acceso a mem_stats?
```
El agente debería poder llamar `mem_stats` y devolver estadísticas de la base de datos.

---

## 🧠 Memory Protocol (Regla Global — Recomendado)

Para que el agente use Engram proactivamente, agrega el Memory Protocol como regla global en:
```
C:\Users\TuNombre\.gemini\GEMINI.md
```

Contenido mínimo a agregar:
```markdown
## Memory Protocol (Engram)

Al INICIO de cada sesión de trabajo:
1. Llama `mem_session_start` para inicializar el tracking.
2. Llama `mem_search "<feature o área de trabajo>"` para recuperar contexto histórico.

Durante la sesión:
- Guarda decisiones importantes con `mem_save` (formato: what/why/where/learned).
- Usa `topic_key` para decisiones que evolucionan con el tiempo.

Al FINAL de cada sesión de trabajo:
- Llama `mem_session_summary` con un resumen Goal/Discoveries/Accomplished/Files.
- Llama `mem_session_end`.
```

---

## 🔧 Las 13 Tools MCP de Engram

| Tool | Uso |
|---|---|
| `mem_search` | Buscar en la memoria por texto libre |
| `mem_save` | Guardar una observación (what/why/where/learned) |
| `mem_update` | Actualizar una observación existente |
| `mem_delete` | Borrar una observación (soft-delete por defecto) |
| `mem_get_observation` | Obtener el contenido completo de una observación por ID |
| `mem_timeline` | Ver qué pasó antes/después de una observación |
| `mem_context` | Contexto reciente de la sesión activa |
| `mem_stats` | Estadísticas generales de la base de datos |
| `mem_suggest_topic_key` | Sugerir un topic_key consistente |
| `topic_key` | Gestionar topic keys |
| `mem_session_start` | Iniciar tracking de sesión |
| `mem_session_summary` | Escribir resumen de sesión (Goal/Discoveries/Files) |
| `mem_session_end` | Cerrar la sesión activa |

### Patrón de 3 Capas (Token-Efficient)

```
1. mem_search "auth middleware"       → resultados compactos con IDs (~100 tokens c/u)
2. mem_timeline observation_id=42    → qué pasó antes/después en esa sesión
3. mem_get_observation id=42         → contenido completo sin truncar
```

### Topic Key Pattern (para decisiones evolutivas)

```
1. mem_suggest_topic_key(type="architecture", title="Blog search")
   → devuelve: "architecture-blog-search"

2. mem_save(..., topic_key="architecture-blog-search")
   → Si ya existe con ese topic_key: UPSERT (revision_count++)
   → Si es nuevo: INSERT
```

---

## 🔄 Git Sync (Memoria Compartida entre Equipo)

```powershell
# Empaquetar y subir tu memoria al repositorio
engram sync

# Importar la memoria de un compañero (después de git pull)
engram import
```

> Esto sube chunks de la SQLite junto con el commit. Tus compañeros hacen `engram import` y sus IAs tendrán el mismo contexto institucional.

---

## ✅ Checklist de Verificación

- [ ] `engram version` responde sin error
- [ ] `~/.gemini/antigravity/mcp_config.json` tiene la entrada de Engram
- [ ] Antigravity fue reiniciado después de editar el config
- [ ] El agente puede llamar `mem_stats` en el chat
- [ ] Memory Protocol agregado a `~/.gemini/GEMINI.md`

---

## 🔗 Referencias

- [Repositorio oficial](https://github.com/Gentleman-Programming/engram)
- [DOCS.md completo](https://github.com/Gentleman-Programming/engram/blob/main/DOCS.md)
- [Releases / Descargas](https://github.com/Gentleman-Programming/engram/releases)
