/**
 * Natural Language Generation (NLG) Engine
 * Inyecta datos crudos y scores matemáticos en plantillas de texto SEO
 * para generar párrafos de justificación únicos para cada cruce M x N.
 */

export interface NLGContext {
  softwareName: string; // ej: 'Revit 2024'
  val: string | number | null; // ej: 48.5
  unit: string | null; // ej: 'segundos'
  benchVersion: string; // ej: 'v1.0'
  score: number; // del 0 al 10 calculado previamente
}

/**
 * Selecciona un adjetivo dinámico según el cuartil de rendimiento del score
 */
function getPerformanceAdjective(score: number): string {
  if (score >= 9.0) return 'excepcional';
  if (score >= 8.0) return 'sobresaliente';
  if (score >= 6.5) return 'bueno';
  if (score >= 5.0) return 'dentro del promedio';
  if (score >= 3.0) return 'deficiente';
  return 'inaceptable';
}

/**
 * Genera el documento semántico rico en SEO
 */
export function generateVerdictText(template: string | null, context: NLGContext): string {
  if (!template) return '';
  if (context.val === null) return 'No hay datos de laboratorio disponibles para esta prueba actualmente.';

  const adjective = getPerformanceAdjective(context.score);
  
  // Procesamiento humano amigable (no mostrar "45.00 segundos" si "45" basta)
  const displayVal = typeof context.val === 'number' ? context.val.toFixed(2).replace(/\.?0+$/, '') : context.val;
  
  // Si el valor era texto "true" o "false", un token extra útil para traducciones booleanas fluidas.
  const valText = context.val === 'true' ? 'sí cumple' : (context.val === 'false' ? 'no cumple' : String(context.val));

  // Reemplazo Léxico (Lexical Replacement) multi-token
  const finalParagraph = template
    .replace(/{software}/g, context.softwareName)
    .replace(/{val}/g, String(displayVal))
    .replace(/{val_text}/g, valText)
    .replace(/{unit}/g, context.unit || '')
    .replace(/{bench}/g, context.benchVersion)
    .replace(/{score}/g, context.score.toFixed(1))
    .replace(/{adjective}/g, adjective);
    
  // Cleanup tokens que hayan quedado huérfanos (espacios dobles por unidades vacías)
  return finalParagraph.replace(/\s+/g, ' ').trim();
}
