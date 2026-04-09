# Engram Connection for Qwen Code

## Configuración
- **Ejecutable:** `C:\tools\engram\engram.exe`
- **Base de datos:** `%USERPROFILE%\.engram\engram.db`
- **Versión instalada:** 1.7.0

## ✅ MCP Nativo (Método Principal)

Engram está configurado como servidor MCP nativo en `.qwen/settings.json`:

```json
{
  "mcpServers": {
    "engram": {
      "command": "C:\\tools\\engram\\engram.exe",
      "args": ["mcp", "--tools=agent"],
      "trust": true,
      "description": "Engram memory v1.7.0"
    }
  }
}
```

**Verificar:** `qwen mcp list` → debe mostrar `✓ engram - Connected`

**11 herramientas del perfil `agent` disponibles nativamente.**

## Workflow al inicio de sesión

1. Verificar conexión: `qwen mcp list`
2. Si dice "Connected", las herramientas Engram están disponibles automáticamente
3. Si falla, usar método CLI de respaldo

## Comandos CLI de respaldo (si MCP falla)

| Comando | Propósito |
|---------|-----------|
| `engram context` | Contexto del proyecto actual |
| `engram search "query"` | Buscar memorias por tema |
| `engram stats` | Estadísticas de memorias |
| `engram timeline <obs_id>` | Contexto cronológico |
| `engram save "titulo" "mensaje"` | Guardar memoria |

**Script rápido:** `.agents\engram-connect.bat`

## Fallback final
Si todo falla, leer `MEMORY.md` en la raíz del proyecto.
