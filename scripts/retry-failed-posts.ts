/**
 * scripts/retry-failed-posts.ts
 *
 * Retries the 2 posts that failed in refactor-legacy.ts due to JSON parsing errors.
 * Uses a more robust JSON extraction strategy to handle LLM outputs with math formulas.
 *
 * Usage:
 *   npx tsx scripts/retry-failed-posts.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const GITHUB_MODELS_ENDPOINT = 'https://models.inference.ai.azure.com';
const MODEL = 'gpt-4o-mini';

// Posts to retry (slugs that failed)
const FAILED_SLUGS = [
  'predimensionamiento-columnas-vigas-e060-practico',
  'civil-3d-crear-primer-corredor-vial-carreteras',
];

interface LegacyPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
}

interface RefinedPost {
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
}

/**
 * Extracts JSON robustly from LLM output that might have
 * unescaped newlines or special chars in string values.
 * Strategy: find first { ... last } and use a relaxed JSON parse.
 */
function extractJsonFromLLMOutput(raw: string): RefinedPost {
  // 1. Strip markdown code fences if present
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  // 2. Try standard JSON.parse first
  try {
    return JSON.parse(cleaned) as RefinedPost;
  } catch {
    // Continue to manual extraction
  }

  // 3. Extract each field manually using regex to handle bad JSON
  const extractField = (fieldName: string): string => {
    // Matches "fieldName": "value" where value can span multiple lines
    const regex = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`, 's');
    const match = cleaned.match(regex);
    if (match) return match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    return '';
  };

  // 4. For content field (which is largest and most problematic), find it between markers
  const contentMatch = cleaned.match(/"content"\s*:\s*"([\s\S]*?)"\s*\}/);
  const content = contentMatch
    ? contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    : extractField('content');

  const result: RefinedPost = {
    title: extractField('title'),
    meta_title: extractField('meta_title'),
    meta_description: extractField('meta_description'),
    excerpt: extractField('excerpt'),
    content,
  };

  if (!result.title || !result.content) {
    throw new Error(`Could not extract title or content from LLM output. Raw (first 200 chars): ${raw.slice(0, 200)}`);
  }

  return result;
}

async function callGitHubModels(prompt: string, githubToken: string): Promise<string> {
  const response = await fetch(`${GITHUB_MODELS_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `Eres un experto en SEO técnico y redacción digital para el nicho de ingeniería civil en Perú.
Aplica el protocolo "Nicho Nauta":
1. title: máximo 60 caracteres, incluye keyword, estilo "Hice X y logré Y"
2. meta_title: máximo 58 caracteres, CTA implícita
3. meta_description: entre 130-155 caracteres con keyword + beneficio
4. excerpt: 1-2 frases concisas ~150 caracteres
5. content (MDX):
   - Párrafos CORTOS (máx 3 líneas)
   - H2 con keyword principal
   - Tablas Markdown para datos comparativos
   - Bloques de código con triple backtick si existían en el original
   - Negritas para conceptos clave
   - Incluir <InlineRelatedPost url="/servicios" title="Consultoría BIM — FreeCloud" /> en un lugar natural del texto
   - Tono: primera persona, auténtico, ingeniero peruano
   - Preservar la información técnica original (normas, fórmulas, cifras)
   - Preservar CTAs de venta Gumroad/Hotmart al final si existen

CRÍTICO: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido. Sin texto adicional. Sin markdown fences.
Los valores de string DEBEN usar escape correcto: \\n para saltos de línea dentro de strings JSON.
Usa \\n (doble backslash n) para los saltos de línea dentro del content string.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub Models API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? '';
}

async function main(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!supabaseUrl || !supabaseKey || !githubToken) {
    console.error('❌ Missing env vars');
    process.exit(1);
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  // Load legacy posts and filter the failed ones
  const legacyPath = path.join(process.cwd(), 'legacy_posts.json');
  const allPosts: LegacyPost[] = JSON.parse(fs.readFileSync(legacyPath, 'utf-8'));
  const failedPosts = allPosts.filter((p) => FAILED_SLUGS.includes(p.slug));

  console.log(`\n🔄 Retrying ${failedPosts.length} failed posts...\n`);

  for (let i = 0; i < failedPosts.length; i++) {
    const post = failedPosts[i];
    console.log(`[${i + 1}/${failedPosts.length}] Retrying: "${post.title}" (${post.slug})`);

    try {
      const prompt = `Refactoriza el siguiente artículo conforme al protocolo Nicho Nauta.

SLUG: ${post.slug}
TITLE actual: ${post.title}
EXCERPT actual: ${post.excerpt ?? '(ninguno)'}

---- CONTENT ACTUAL ----
${post.content}
---- FIN DEL CONTENT ----

Devuelve ÚNICAMENTE el objeto JSON. No añadas texto fuera del JSON.
Recuerda: dentro de los strings JSON, los saltos de línea deben ser \\n (no literales).`;

      const rawOutput = await callGitHubModels(prompt, githubToken);
      const refined = extractJsonFromLLMOutput(rawOutput);

      // Update in Supabase
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: refined.title,
          meta_title: refined.meta_title,
          meta_description: refined.meta_description,
          excerpt: refined.excerpt,
          content: refined.content,
        })
        .eq('id', post.id);

      if (updateError) {
        throw new Error(`Supabase update error: ${updateError.message}`);
      }

      console.log(`   ✅ Done! New title: "${refined.title}" (${refined.title.length} chars)`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Failed again: ${errMsg}`);
    }

    if (i < failedPosts.length - 1) {
      console.log(`   ⏳ Waiting 3s...`);
      await new Promise<void>((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log('\n✅ Retry complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
