# Workflow: GGA — Guardian Angel en Git Commit
description: Review independiente con IA automatizado mediante hooks de Git

---

> **¿Qué es?** El GGA (Gentleman Guardian Angel) es la Capa 2 de protección independiente del Agente principal (Capa 1).
> Actúa como un Senior Developer que intercepta tus commits para asegurar que el código no rompe las reglas establecidas en `AGENTS.md`.

## Cuándo usar

**Siempre.** El GGA se ejecuta **automáticamente** en cada `git commit` gracias a los hooks instalados localmente.

## Pasos del Workflow

### Paso 1: Empaquetar estado SDD
Si estás trabajando bajo el marco SDD, asegúrate de haber consolidado tus notas de diseño e implementación en `.sdd/`. Verifica que el directorio `.sdd/` **no** se incluya en tus commits.

### Paso 2: Ejecutar Build y validación estricta
Antes de hacer commit, confirma que no hay errores de sintaxis o renderizado mediante los lints y TypeScript.
// turbo
```bash
npx tsc --noEmit && npm run build
```

### Paso 3: Stage de archivos
Agrega solo los archivos que modificarás. El caché inteligente de GGA ignorará los que no han cambiado.
```bash
git add app/ components/ lib/
```

### Paso 4: Commit interactivo
Lanza el commit. El hook `pre-commit` enviará los archivos a GGA, y luego el hook `commit-msg` analizará tu mensaje.
```bash
git commit -m "feat(scope): descripción clara del cambio"
```

### Paso 5: Manejo del Reporte GGA

- ✅ **Sin issues**: El commit pasará automáticamente y se guardará.
- 🚫 **Violaciones de código (FAILED)**: El commit se abortará. Lee los errores listados en la consola, corrige tu código en los archivos mencionados, haz `git add` nuevamente, y repite el commit.

### Paso 6: Push (Cierre del ciclo)
Una vez que el código y el mensaje pasen el filtro del ángel guardián, realiza el push.
```bash
git push
```

## Comandos Útiles de GGA

Si necesitas interactuar manualmente con la herramienta:

| Comando | Acción |
|---|---|
| `bash .agents/gentleman-guardian-angel/bin/gga run` | Forzar revisión de los archivos en *stage* sin hacer commit |
| `bash .agents/gentleman-guardian-angel/bin/gga run --no-cache` | Revisar ignorando el caché guardado |
| `bash .agents/gentleman-guardian-angel/bin/gga cache clear` | Limpiar el caché de la IA para este proyecto |

> **Nota para modificar modelo/proveedor:**  
> Edita el archivo `.gga` en la raíz del proyecto. Por defecto usa `claude`. Puedes cambiar `PROVIDER` a `gemini`, `opencode`, o `ollama:llama3`.
