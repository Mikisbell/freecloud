# 📊 Configuración AdSense - FreeCloud Blog

## ✅ Semana 1 - Completado

### 1. Variables de Entorno Configuradas

En `.env.local`:
```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-6799761285901174
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=TU_SLOT_AQUI
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=TU_SLOT_AQUI
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=TU_SLOT_AQUI
```

**Acción requerida**: Ve a [Google AdSense](https://adsense.google.com) → Anuncios → Por unidad y crea 3 unidades:
- **Article Ad**: Anuncio adaptable (para dentro de artículos)
- **Sidebar Ad**: Anuncio vertical 300x600 (para sidebar)
- **In-Feed Ad**: Anuncio In-feed (para listados de blog)

Copia los IDs de slot y reemplaza en `.env.local`.

### 2. Content-Security-Policy Configurado

✅ Ya está en `next.config.mjs` con todos los dominios de AdSense permitidos.

### 3. Componentes AdSense Creados

#### Componentes disponibles:

- `<AdSense />` - Componente base con altura reservada (previene CLS)
- `<AdSenseArticle />` - Para artículos de blog
- `<AdSenseSidebar />` - Para sidebar sticky
- `<AdSenseInFeed />` - Para listados de posts

#### Cómo usar:

**En artículos de blog** (`app/blog/[slug]/page.tsx`):
```tsx
import AdSenseArticle from '@/components/AdSenseArticle';

// Dentro del contenido, después del primer H2:
<AdSenseArticle />
```

**En sidebar** (si tienes layout con sidebar):
```tsx
import AdSenseSidebar from '@/components/AdSenseSidebar';

<aside className="hidden lg:block">
  <AdSenseSidebar />
</aside>
```

**En listado de blog** (`app/blog/page.tsx`):
```tsx
import AdSenseInFeed from '@/components/AdSenseInFeed';

// Entre el post 3 y 4:
{posts.slice(0, 3).map(post => <BlogCard key={post.slug} post={post} />)}
<AdSenseInFeed />
{posts.slice(3).map(post => <BlogCard key={post.slug} post={post} />)}
```

### 4. Redirección SEO 308 Configurada

✅ `vercel.json` creado con redirección `www.freecloud.pe` → `freecloud.pe`

**Acción requerida**: 
1. Haz commit y push de estos cambios
2. Vercel detectará automáticamente el `vercel.json`
3. Verifica en https://www.freecloud.pe que redirija a https://freecloud.pe

## 📈 Próximos Pasos

### Semana 2 - Alto Impacto SEO
- [ ] Migrar `<img>` a `next/image` en BlogCard.tsx
- [ ] Añadir FAQPage schema en app/page.tsx
- [ ] Añadir categorías al sitemap
- [ ] Implementar Organization schema con sameAs

### Semana 3 - Performance & E-E-A-T
- [ ] YouTube facade (thumbnail clickable)
- [ ] Reducir fuentes de 5 a 3
- [ ] Añadir dateModified en sitemap

## 🧪 Testing

Después de desplegar:

1. **Verificar AdSense carga**:
   - Abre DevTools → Network
   - Busca requests a `pagead2.googlesyndication.com`
   - Debe haber requests exitosos (200)

2. **Verificar CLS**:
   - Abre DevTools → Lighthouse
   - Run audit → Performance
   - CLS debe ser < 0.1

3. **Verificar redirección**:
   - Visita https://www.freecloud.pe
   - Debe redirigir a https://freecloud.pe (sin www)
   - Status code: 308

## 💰 Monetización Esperada

Con tráfico de 1,000 visitas/mes:
- RPM estimado: $1-3 USD
- Ingresos mensuales: $1-3 USD

Con tráfico de 10,000 visitas/mes:
- RPM estimado: $2-5 USD
- Ingresos mensuales: $20-50 USD

Con tráfico de 100,000 visitas/mes:
- RPM estimado: $3-8 USD
- Ingresos mensuales: $300-800 USD

**Nota**: RPM varía según nicho, país, estacionalidad y calidad del tráfico.
