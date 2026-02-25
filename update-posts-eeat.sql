-- =============================================
-- FreeCloud - Inyección de EEAT (Experiencia Personal)
-- Ejecutar en Supabase SQL Editor
-- =============================================

UPDATE posts
SET content = E'> **Nota personal:** En Huancayo, donde ejerzo, todavía no he visto una sola licitación que exija BIM de forma estructurada. Eso va a cambiar drásticamente en agosto, y la mayoría de consultorías locales no están preparadas para el golpe.\n\n' || content
WHERE slug = 'que-es-bim-obligatorio-peru-2026';

UPDATE posts
SET content = E'> **Nota personal:** La última vez que calculé la cortante basal fue para un edificio de 4 pisos en Junín. El valor de Z=0.35 para zona 3 me dio un cortante que obligó a replantear el tamaño de tres placas principales. La teoría es fácil, pero en la práctica el suelo manda.\n\n' || content
WHERE slug = 'norma-e030-fuerza-cortante-basal-calculo';

UPDATE posts
SET content = E'> **Nota personal:** Empecé a programar porque me cansé de repetir los mismos cálculos en Excel cada semana, arrastrando fórmulas rotas de planillas antiguas. Aprender Python fue la decisión más rentable de mi carrera como ingeniero.\n\n' || content
WHERE slug = 'python-ingenieros-civiles-primer-script';

UPDATE posts
SET content = E'> **Nota personal:** Usé AutoCAD por casi una década antes de tocar Revit. El primer mes fue frustrante porque intentaba dibujar líneas en lugar de modelar elementos constructivos. Cuando hice el "click" mental, mi velocidad de producción se triplicó.\n\n' || content
WHERE slug = 'revit-estructuras-ingenieros-autocad';

UPDATE posts
SET content = E'> **Nota personal:** En mi experiencia con proyectos en la sierra central, frecuentemente prefiero ETABS para edificaciones aporticadas complejas, pero he encontrado que Robot Structural se integra infinitamente mejor cuando el cliente exige BIM y entregables en Revit desde el día 1.\n\n' || content
WHERE slug = 'etabs-vs-robot-structural-comparacion';
