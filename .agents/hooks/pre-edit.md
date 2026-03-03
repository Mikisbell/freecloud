# Hook: Pre-Edit Guardrail

> **Cuándo activar:** Antes de escribir o modificar CUALQUIER archivo de código.
> Este es el guardián de Capa 1 — previene errores antes de que existan.

---

## ✋ STOP — Responde estas preguntas antes de editar

### 1. ¿Entiendo el scope del cambio?
- [ ] Sé exactamente QUÉ archivo(s) voy a tocar
- [ ] Sé exactamente QUÉ NO voy a tocar
- [ ] El cambio es atómico (una sola responsabilidad)

### 2. ¿Estoy en el scope correcto de AGENTS.md?
- Cambio en UI/Formularios/Layouts/Blog → leer `app/(main)/agents.md` primero
- Cambio en API/DB/Supabase Server → leer `app/api/agents.md` primero
- Si no existe el agents.md del scope → proceder con CLAUDE.md + MEMORY.md

### 3. ¿El patrón es seguro?

| Si vas a... | Verificar que... |
|---|---|
| Usar Supabase | Importes desde `lib/supabase.ts` (nunca instanciar directo) |
| Crear nueva página | Incluirás `export const metadata` con title + description |
| Agregar `'use client'` | Hay hooks o listeners del DOM que realmente lo necesitan |
| Hacer lógica de roles/perms | La validación está en el servidor/RLS, NO en el frontend |
| Agregar una imagen | Usas `next/image` con `alt` descriptivo y tamaños correctos |
| Importar módulos | Usas `@/` en vez de rutas relativas largas |
| Crear un tipo TypeScript | Evitas `any` y el tipo es lo más específico posible |

### 4. ¿Tengo contexto de Engram?
- Si es una feature o área donde hemos trabajado antes:
  ```
  mem_search("nombre del área/feature")
  ```
- Si Engram no está disponible → leer `MEMORY.md` como alternativa

### 5. ¿El cambio es grande? → Activar SDD
Si el cambio toca más de 3 archivos o introduce una feature nueva:
- NO proceder sin el flujo SDD (`/sdd-new`)
- Razón: los cambios grandes sin spec generan deuda técnica oculta

---

## 🟢 Si pasaste todas las verificaciones: PUEDES EDITAR

Después de editar, activa el **post-edit hook** (`.agents/hooks/post-edit.md`).
