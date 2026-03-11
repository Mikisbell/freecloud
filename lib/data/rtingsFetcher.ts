import { getClient } from '@/lib/supabase';
import { evaluateTestScore } from '@/lib/algorithms/rtingsCalculator';
import { generateVerdictText } from '@/lib/algorithms/nlgGenerator';

export interface RtingsSoftwareResult {
  score: number;
  rawValue: number | string | null;
  verdictText: string;
}

export interface RtingsTestData {
  id: string;
  name: string;
  slug: string;
  unit: string | null;
  softwareA: RtingsSoftwareResult;
  softwareB: RtingsSoftwareResult;
}

export interface RtingsCategoryData {
  id: string;
  name: string;
  slug: string;
  weight: number; // Default slider weight (0-100)
  tests: RtingsTestData[];
}

export interface RtingsComparisonPayload {
  softwareA: { name: string; releaseName: string; releaseId: string };
  softwareB: { name: string; releaseName: string; releaseId: string };
  categories: RtingsCategoryData[];
}

// Tipos base para mapeo in-memory temporal
interface DBProductLine { id: string; name: string; slug: string; }
interface DBRelease { id: string; product_line_id: string; name: string; slug: string; }
interface DBTestCat { id: string; slug: string; name: string; position: number; }
interface DBTestDef { id: string; category_id: string; slug: string; name: string; value_type: string; unit: string; scoring_formula: string; nlg_template: string; position: number; }
interface DBTestLog { release_id: string; test_id: string; raw_numeric_value: number | null; raw_text_value: string | null; }

/**
 * FETCH DE INGENIERÍA M x N
 * Resuelve el pipeline ETL desde la BD cruda -> Calculadora -> Compilador NLG.
 */
export async function getGodTierComparison(
  productSlugA: string,
  productSlugB: string
): Promise<RtingsComparisonPayload | null> {
  // 1. Obtener los Product Lines
  const { data: linesProxy, error: linesError } = await getClient()
    .from('bim_product_lines')
    .select('id, name, slug')
    .in('slug', [productSlugA, productSlugB]);

  const lines = linesProxy as DBProductLine[] | null;
  if (linesError || !lines || lines.length !== 2) return null;

  const lineA = lines.find((l) => l.slug === productSlugA)!;
  const lineB = lines.find((l) => l.slug === productSlugB)!;

  // 2. Obtener Releases (Versiones Específicas "is_latest")
  const { data: releasesProxy, error: relError } = await getClient()
    .from('bim_software_releases')
    .select('id, product_line_id, name, slug')
    .in('product_line_id', [lineA.id, lineB.id])
    .eq('is_latest', true);

  const releases = releasesProxy as DBRelease[] | null;
  if (relError || !releases || releases.length !== 2) return null;

  const relA = releases.find((r) => r.product_line_id === lineA.id)!;
  const relB = releases.find((r) => r.product_line_id === lineB.id)!;

  // 3. Obtener el Metamodel Completo (Categorías y Tests)
  const { data: categoriesProxy } = await getClient()
    .from('test_categories')
    .select('id, slug, name, position')
    .order('position');
  const categories = categoriesProxy as DBTestCat[] | null;

  const { data: testsProxy } = await getClient()
    .from('test_definitions')
    .select('id, category_id, slug, name, value_type, unit, scoring_formula, nlg_template, position')
    .order('position');
  const tests = testsProxy as DBTestDef[] | null;

  // 4. Obtener Data Cruda del Laboratorio
  // Asumimos v1.0 hardcoded por ahora, en un sistema real vendría por parámetro
  const { data: bench } = await getClient()
    .from('test_bench_versions')
    .select('id, version_code')
    .eq('version_code', 'v1.0')
    .single();

  const benchId = bench?.id;

  const { data: logsProxy } = await getClient()
    .from('software_test_logs')
    .select('release_id, test_id, raw_numeric_value, raw_text_value')
    .in('release_id', [relA.id, relB.id])
    .eq('bench_version_id', benchId || '');
  const logs = logsProxy as DBTestLog[] | null;

  if (!categories || !tests || !logs || !bench) return null;

  // 5. ETAPA DE COMPUTACIÓN IN-MEMORY (M x N Matrix)
  const payloadCategories: RtingsCategoryData[] = categories.map((cat) => {
    const catTests = tests.filter((t) => t.category_id === cat.id);

    const mappedTests: RtingsTestData[] = catTests.map((t) => {
      // Data Software A
      const logA = logs.find((l) => l.test_id === t.id && l.release_id === relA.id);
      const rawA = t.value_type === 'numeric' ? logA?.raw_numeric_value ?? null : logA?.raw_text_value ?? null;
      const scoreA = evaluateTestScore(t.scoring_formula, rawA);
      const verdictA = generateVerdictText(t.nlg_template, {
        softwareName: relA.name,
        val: rawA,
        unit: t.unit,
        benchVersion: bench.version_code,
        score: scoreA,
      });

      // Data Software B
      const logB = logs.find((l) => l.test_id === t.id && l.release_id === relB.id);
      const rawB = t.value_type === 'numeric' ? logB?.raw_numeric_value ?? null : logB?.raw_text_value ?? null;
      const scoreB = evaluateTestScore(t.scoring_formula, rawB);
      const verdictB = generateVerdictText(t.nlg_template, {
        softwareName: relB.name,
        val: rawB,
        unit: t.unit,
        benchVersion: bench.version_code,
        score: scoreB,
      });

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        unit: t.unit,
        softwareA: {
          score: scoreA,
          rawValue: rawA,
          verdictText: verdictA,
        },
        softwareB: {
          score: scoreB,
          rawValue: rawB,
          verdictText: verdictB,
        },
      };
    });

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      weight: 100 / categories.length, // Peso inicial balanceado
      tests: mappedTests,
    };
  });

  return {
    softwareA: { name: lineA.name, releaseName: relA.name, releaseId: relA.id },
    softwareB: { name: lineB.name, releaseName: relB.name, releaseId: relB.id },
    categories: payloadCategories,
  };
}
