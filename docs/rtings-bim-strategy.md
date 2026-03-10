# Estrategia RTINGS.com adaptada a FreeCloud (BIM en LATAM)

Analizar el modelo de **RTINGS.com** es mirar al "santo grial" del SEO moderno enfocado en reviews y autoridad. Ellos han dominado el mercado de la electrónica no haciendo artículos genéricos de blog, sino construyendo **una base de datos relacional masiva** expuesta al usuario.

Si el objetivo de FreeCloud es dominar y difundir el conocimiento BIM y la Ingeniería Civil en Perú y Latam, clonar la arquitectura y estrategia de RTINGS es la jugada ganadora. Aquí tienes el desglose táctico en 4 pilares:

---

## 1. Arquitectura de la Información (Programmatic SEO)

La clave de RTINGS es que no redactan páginas individuales desde cero; estructuran datos concretos y generan miles de URLs a partir de combinaciones.

### El modelo RTINGS:
- `/tv/reviews/lg/c3-oled` (Review Específica)
- `/tv/reviews/best/gaming` (Lista generada por BD)
- `/tv/tools/compare/lg-c3-vs-samsung-s90c` (Herramienta Programática vs)

### La adaptación FreeCloud (BIM):
Deberías estructurar tu Supabase para generar **Programmatic SEO**:
- **Comparativas automatizadas (El oro del SEO):** `/herramientas/comparar/revit-vs-archicad` o `/plugins/comparar/enscape-vs-twinmotion`. Estas páginas se generan solas comparando los metadatos (precio, curva de aprendizaje, requisitos gráficos, openBIM).
- **Listados dinámicos ("Best of"):** `/recursos/mejores-laptops-para-revit-2026`, `/plugins/mejores-para-cuantificacion`.
- **Estandarización:** En lugar de simples "posts", crea "Fichas Técnicas" de software, normas o flujos de trabajo.

---

## 2. Marketing de Transparencia y Autoridad Extrema (E-E-A-T)

Google prioriza la **Experiencia, Expertise, Autoridad y Transfiabilidad (E-E-A-T)**. RTINGS aplasta a sus competidores porque *compran sus propios productos* y muestran su *metodología exacta de testeo*.

### Cómo replicarlo en FreeCloud:
- **"Tests Reales, No Publicidad":** Cuando analices un plugin o un software, muestra capturas tuyas usándolo en un proyecto real (ej. un edificio en Miraflores). Di los tiempos exactos que tardó en renderizar en tu máquina.
- **Transparencia en Metodología BIM:** Crea una página de `/como-testeamos` donde expliques tu entorno de prueba (CPU, RAM, tamaño del modelo en MB, coordenadas usadas).
- **Votación de la comunidad:** RTINGS permite a los usuarios votar qué probarán después. **Aplica esto ya:** *¿Qué queréis que analice la próxima semana: Navisworks Clash Detective o Solibri Model Checker? Da los votos a los suscriptores de tu newsletter.*

---

## 3. Herramientas Interactivas (Link Magnet Supremo)

RTINGS tiene calculadoras como "Distancia vs Tamaño de TV" o "Herramientas 3D de forma de zapatillas". Esos pequeños _widgets_ consiguen back-links masivos de foros como Reddit porque resuelven problemas reales.

### Herramientas BIM para FreeCloud:
Tú ya empezaste con tu `/apps/calculadora-sismica`. Escala esto para el ecosistema BIM global:
1. **Generador de Matriz LOD / Nd:** Una UI sencilla para que un usuario sepa qué exigir en LOD 300 vs LOD 400.
2. **Calculadora de Requisitos de Hardware BIM:** Un input donde pones "Disciplina", "Tamaño esperado del modelo" y te bota las specs ideales de Laptop/PC.
3. **Conversor de Coordenadas UTM a Coordenadas Internas Revit:** Una web-app ultra nicho que resuelve el dolor de cabeza número #1 de los topógrafos y modeladores.

---

## 4. Búsqueda de Palabras Clave (Keywords) "Bottom-of-Funnel"

RTINGS no compite por "¿Qué es un televisor?". Saben que el dinero está en la intención de búsqueda comercial y de decisión.

### Estrategia de Keywords BIM:
No publiques solo "¿Qué es BIM?". Eso ya lo cubren Autodesk y Wikipedia. Ve por el SEO de "larga cola" con alta intención transaccional o de resolución de dolores:

*   **Intención Comparativa (Vs):**
    *   `Revit 2026 vs 2025 vale la pena actualizar`
    *   `BIM 360 vs ACC diferencias Latam`
    *   `Cypecad vs Etabs diseño sismorresistente Perú`
*   **Intención de Solución de Errores (Troubleshooting):**
    *   `Error coordenadas compartidas Revit IFC export`
    *   `Como purgar modelo Archicad pesado`
*   **Intención por Nicho Local:**
    *   `Implementación Plan BIM Perú 2030 guía pymes`
    *   `Costo hora modelador BIM freelance Latinoamérica 2026`

## Conclusión Ejecutiva

Para pasar de un "Blog más" a un "Ecosistema Coginitivo como RTINGS", tu arquitectura Next.js actual es perfecta. Necesitas tratar el **contenido como Datos**.
Deja de escribir "Artículos" en texto plano. Empieza a llenar una **Base de Datos de entidades** (Software, Hardware, Plugins, Errores, Normas) y usa Next.js Server Components para orquestar cruces y comparativas generadas automáticamente (Programmatic SEO). Esa es la llave para dominar todo el tráfico de Ingeniería en habla hispana.
