# Workflow: GGA — Guardian Angel en Git Commit
description: Review independiente con IA antes de hacer git push

---

> **¿Qué es?** El GGA es una Capa 2 de protección independiente del agente principal.
> No tiene contexto de la sesión — solo ve el diff y las reglas. Atrapa lo que se escapó en Capa 1.

## Cuándo usar

- Antes de cualquier `git push` a `main` o `feat/*`
- Especialmente en cambios que tocan seguridad, API routes, o Supabase
- Opcional (pero recomendado) para refactors de componentes UI

## Pasos

### Paso 1: Asegurarte de que el build pasa

```powershell
npm run build
```

Si falla → corregir ANTES de continuar. No hacer commit con build roto.

### Paso 2: Correr el GGA

```powershell
.\scripts\gga-review.ps1
```

El script:
1. Captura el diff de los cambios staged (`git diff --staged`)
2. Carga el contexto de `AGENTS.md` como rulebook
3. Envía ambos a la API de Anthropic (Claude)
4. Imprime un reporte con: ✅ aprobado / ⚠️ advertencias / 🚫 bloqueadores

### Paso 3: Interpretar el reporte

| Resultado | Acción |
|---|---|
| ✅ Sin issues | Proceder con `git commit` |
| ⚠️ Advertencias | Revisar, decidir conscientemente si son aceptables |
| 🚫 Bloqueadores | Corregir antes de hacer commit |

### Paso 4: Hacer commit con convención

```powershell
git add .
git commit -m "feat(scope): descripción clara del cambio"
git push origin main
```

## Configuración requerida

El script necesita un GitHub Personal Access Token. Agregar a `.env.local`:

```
GITHUB_TOKEN=ghp_...
```

Crear el token en: **[github.com/settings/tokens](https://github.com/settings/tokens)**
- Classic token o Fine-grained → ambos sirven
- No necesita scopes especiales para acceder a GitHub Models
- Acceso a GitHub Models: **[github.com/marketplace/models](https://github.com/marketplace/models)**

> ✅ Esta variable es segura en `.env.local` — ya está en `.gitignore`.
> ⚠️ No agregar a variables de Vercel — es solo para uso local en desarrollo.

## Notas

- El GGA es **asíncrono y manual** — no bloquea el commit automáticamente.
- Es una herramienta de revisión, no un guardián absoluto. La decisión final es tuya.
- Si la API no responde, proceder con el criterio propio + reglas de `AGENTS.md`.
- Modelo por defecto: `gpt-4o-mini`. Cambiar con: `.\scripts\gga-review.ps1 -Model "gpt-4o"`

