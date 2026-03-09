# Hook: Post-Edit Guardrail

> **Cuándo activar:** Inmediatamente después de terminar cambios en cualquier archivo.
> Este es el último filtro antes de declarar el trabajo como "listo".

---

## ✅ Checklist Post-Edición

### Calidad de código
- [ ] Sin `any` explícito en TypeScript
- [ ] Sin rutas relativas largas — solo `@/`
- [ ] Sin `console.log` de debugging olvidados
- [ ] Sin `TODO` sin ticket/tarea asociada
- [ ] Los imports no traen dependencias innecesarias

### Reglas Next.js
- [ ] Nuevas páginas tienen `export const metadata` con `title` y `description`
- [ ] `'use client'` solo en componentes que realmente necesitan interactividad
- [ ] Imágenes usan `next/image` (no `<img>` nativo)
- [ ] Rutas de API son `route.ts` dentro de `app/api/`

### Seguridad
- [ ] No hay secrets, keys o tokens en el código (usar `.env`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está en variables server-only
- [ ] Validaciones de input en server-side, no solo en frontend

### Persistencia en Engram
- [ ] ¿Tomé una decisión técnica importante durante el trabajo?
  - Si **SÍ** → `mem_save` con formato: `qué, por qué, dónde, aprendizaje`
  - Si **NO** → omitir (no guardar ruido)

### Build & Deploy
- [ ] ¿El cambio podría romper el build?
  - Si **SÍ** → correr `npm run build` antes de continuar
  - Si **NO** → al menos verificar que `npm run lint` pase
- [ ] Si el cambio es para deploy → `npm run build` es OBLIGATORIO

---

## 🚀 ¿Listo para commit?

Si vas a hacer `git commit`:
1. Asegurarte de que `npm run build` pasó sin errores
2. Usar convención: `feat(scope):`, `fix(scope):`, `style(scope):`, `refactor(scope):`
3. GGA corre automáticamente como pre-commit hook — revisará los archivos staged
4. Manual (opcional): `bash .agents/gentleman-guardian-angel/bin/gga run`

---

## 📋 Plantilla para mem_save

```
título: "[área] - [qué se hizo]"
tipo: "architecture" | "bugfix" | "decision" | "pattern"
contenido:
  What: [descripción concisa]
  Why: [por qué se hizo así]
  Where: [archivos afectados]
  Learned: [gotcha o aprendizaje]
```
