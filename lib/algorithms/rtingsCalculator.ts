/**
 * Motor Matemático God-Tier para evaluar puntuaciones BIM.
 * Usa `mathjs` como evaluador de expresiones seguro (sin new Function / eval).
 *
 * Las fórmulas provienen de la tabla `test_definitions` en la BB.DD. propia
 * (escritura exclusiva vía admin con service_role key).
 */

import { evaluate } from 'mathjs';

/** Caracteres prohibidos en fórmulas — cualquier intento de inyección se rechaza. */
const FORBIDDEN_PATTERNS = [
  /import/i,
  /require/i,
  /process/i,
  /fetch/i,
  /window/i,
  /document/i,
  /global/i,
  /prototype/i,
  /constructor/i,
  /__proto__/,
];

/**
 * Valida que la fórmula no contenga patrones de inyección conocidos.
 * Retorna false si detecta cualquier patrón prohibido.
 */
function isFormulaAllowed(formula: string): boolean {
  return !FORBIDDEN_PATTERNS.some(pattern => pattern.test(formula));
}

/**
 * Normaliza la fórmula del formato JS ("return Math.max(...)") al
 * formato de expresión pura que mathjs puede evaluar.
 *
 * mathjs entiende: max(0, min(10, 10 - val / 12))
 * No entiende: return Math.max(0, Math.min(10, 10 - (val / 12)))
 */
function normalizeFormula(formula: string, val: number | string): string {
  return formula
    .replace(/^return\s+/i, '')  // quita el return
    .replace(/Math\./g, '')       // quita el prefijo Math. (mathjs expone max, min, etc. directamente)
    .replace(/val/g, String(val)) // sustituye val por el valor real
    .trim();
}

export function evaluateTestScore(
  formula: string | null,
  rawValue: string | number | null
): number {
  if (rawValue === null || rawValue === undefined) return 0;
  if (!formula) return 0;

  // — BARRERA DE SEGURIDAD: rechazar fórmulas con patrones peligrosos —
  if (!isFormulaAllowed(formula)) {
    console.warn(`[RTINGS Engine] Fórmula rechazada por seguridad: "${formula}"`);
    return 0;
  }

  try {
    let val: number | string = rawValue;

    // Parsear strings numéricos para matemáticas.
    if (typeof rawValue === 'string') {
      const parsed = Number(rawValue);
      if (!isNaN(parsed)) val = parsed;
    }

    // Normalizar y evaluar con mathjs (sandbox seguro sin acceso a runtime).
    const expression = normalizeFormula(formula, val);
    const result = evaluate(expression) as unknown;

    if (typeof result !== 'number' || isNaN(result)) {
      console.warn(
        `[RTINGS Engine] La fórmula no devolvió un número válido: "${formula}" con valor: ${val}`
      );
      return 0;
    }

    // Clamp: RTINGS nunca da menos de 0 ni más de 10.
    return Math.max(0, Math.min(10, result));
  } catch (error) {
    console.error(
      `[RTINGS Engine] Error evaluando fórmula: "${formula}" | Valor: ${rawValue}`,
      error
    );
    return 0;
  }
}
