# 📋 Cómo Obtener los Slot IDs de Google AdSense

## ⚠️ IMPORTANTE
Los Slot IDs NO están en ningún archivo del proyecto. Debes crearlos en tu cuenta de Google AdSense.

## 🎯 Paso a Paso (Actualizado 2025)

### 1. Accede a Google AdSense
Ve a: **https://adsense.google.com**

### 2. Navega a la sección de Anuncios
1. En el menú lateral izquierdo, haz clic en **"Anuncios"** (Ads)
2. Haz clic en **"Por unidad de anuncio"** (By ad unit)
3. Verás un botón **"+ Nueva unidad de anuncio"** (+ New ad unit)

### 3. Crea las Unidades de Anuncio

Necesitas crear 3 unidades diferentes:

#### 📄 Unidad 1: Article Ad (Para artículos)
1. Haz clic en "Nueva unidad de anuncio"
2. Selecciona "Anuncio adaptable"
3. Nombre: `FreeCloud - Article Ad`
4. Configuración:
   - Tipo: Anuncio adaptable
   - Tamaño: Automático
5. Haz clic en "Crear"
6. **Copia el número que aparece en `data-ad-slot="XXXXXXXXXX"`**
7. Pégalo en `.env.local` en `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=`

#### 📊 Unidad 2: Sidebar Ad (Para barra lateral)
1. Haz clic en "Nueva unidad de anuncio"
2. Selecciona "Anuncio adaptable"
3. Nombre: `FreeCloud - Sidebar Ad`
4. Configuración:
   - Tipo: Anuncio adaptable
   - Tamaño: Vertical (300x600 recomendado)
5. Haz clic en "Crear"
6. **Copia el número que aparece en `data-ad-slot="XXXXXXXXXX"`**
7. Pégalo en `.env.local` en `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=`

#### 📰 Unidad 3: InFeed Ad (Para listados)
1. Haz clic en "Nueva unidad de anuncio"
2. Selecciona "Anuncio In-feed"
3. Nombre: `FreeCloud - InFeed Ad`
4. Configuración:
   - Tipo: In-feed
   - Diseño: Automático
5. Haz clic en "Crear"
6. **Copia el número que aparece en `data-ad-slot="XXXXXXXXXX"`**
7. Pégalo en `.env.local` en `NEXT_PUBLIC_ADSENSE_SLOT_INFEED=`

### 3. Ejemplo de cómo se ve un Slot ID

Cuando creas una unidad, Google te muestra un código como este:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6799761285901174"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6799761285901174"
     data-ad-slot="1234567890"  ← ESTE ES EL SLOT ID QUE NECESITAS
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

El número en `data-ad-slot` es lo que necesitas copiar.

### 4. Actualiza tu .env.local

Tu archivo `.env.local` debería verse así después de obtener los Slot IDs:

```env
# AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-6799761285901174
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=0987654321
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=5678901234
```

### 5. Verifica que funcione

1. Guarda los cambios en `.env.local`
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Abre tu blog en el navegador
4. Abre DevTools → Network
5. Busca requests a `pagead2.googlesyndication.com`
6. Deberías ver requests exitosos (status 200)

## ⏱️ Tiempo de Aprobación

- **Nuevas cuentas**: Google puede tardar 1-2 días en aprobar tu sitio
- **Cuentas existentes**: Los anuncios aparecen inmediatamente

## 🚨 Problemas Comunes

### "Los anuncios no aparecen"
- Verifica que los Slot IDs estén correctos
- Asegúrate de que tu sitio esté aprobado por AdSense
- Revisa la consola del navegador por errores
- Espera 10-15 minutos después de crear las unidades

### "Error: adsbygoogle.push() error"
- Verifica que el script de AdSense esté cargando
- Revisa que el Content-Security-Policy permita AdSense (ya está configurado)

### "Los anuncios aparecen en blanco"
- Es normal en desarrollo local
- Despliega a producción para ver anuncios reales
- En desarrollo, verás el placeholder "Espacio Publicitario"

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la [documentación oficial de AdSense](https://support.google.com/adsense)
2. Verifica que tu sitio cumpla con las [políticas de AdSense](https://support.google.com/adsense/answer/48182)
3. Contacta al soporte de Google AdSense

## ✅ Checklist Final

- [ ] Cuenta de AdSense creada y aprobada
- [ ] 3 unidades de anuncio creadas (Article, Sidebar, InFeed)
- [ ] Slot IDs copiados a `.env.local`
- [ ] Servidor reiniciado
- [ ] Anuncios visibles en el sitio (o placeholder en desarrollo)
- [ ] Requests a AdSense exitosos en DevTools Network
