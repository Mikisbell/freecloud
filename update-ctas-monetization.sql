-- =============================================
-- FreeCloud - Inyección de CTAs de Gumroad en Posts Pilar
-- =============================================
-- INSTRUCCIONES:
-- Reemplaza 'URL_GUMROAD_E030', 'URL_GUMROAD_METRADOS', 'URL_GUMROAD_HP_PRIME'
-- con tus verdaderos enlaces de Gumroad (ej. https://freecloud.gumroad.com/l/e030)
-- y luego ejecuta el script en el Editor SQL de Supabase.

UPDATE posts
SET content = content || E'\n\n## Descarga la Plantilla\n\n¿Quieres automatizar este cálculo y asegurar precisión en tus expedientes? Descarga la **Plantilla Excel Diseño Sísmico E.030** con todas las fórmulas listas, referencias normativas y celdas protegidas.\n\n[👉 Descargar Plantilla E.030 — $7 USD](https://pay.hotmart.com/A104627651Y)'
WHERE slug = 'norma-e030-fuerza-cortante-basal-calculo';

UPDATE posts
SET content = content || E'\n\n## Automatiza tus Metrados\n\nNo pierdas más horas arrastrando fórmulas en cuadros rotos. Descarga la **Plantilla Excel Profesional de Metrados de Obra** (concreto, acero, encofrado y resumen), parametrizada bajo la norma OE.\n\n[👉 Descargar Plantilla de Metrados — $5 USD](URL_GUMROAD_METRADOS)'
WHERE slug = 'excel-plantilla-metrados-obra-automatica';

UPDATE posts
SET content = content || E'\n\n## Lleva el Código a tu Calculadora\n\nSi tienes una HP Prime y quieres ganar tiempo en tus exámenes o trabajos, descarga el código fuente completo listo para instalar. Incluye instrucciones de transferencia.\n\n[👉 Descargar Script Hardy Cross HP Prime — $10 USD](URL_GUMROAD_HP_PRIME)'
WHERE slug = 'hardy-cross-hp-prime-programa';
