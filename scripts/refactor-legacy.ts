/**
 * scripts/refactor-legacy.ts
 *
 * Refactors ALL legacy blog posts in Supabase to comply with the
 * FreeCloud "Nicho Nauta" SEO protocol using GitHub Models API (free,
 * uses GITHUB_TOKEN for auth — OpenAI-compatible endpoint).
 *
 * Usage:
 *   npx tsx scripts/refactor-legacy.ts
 *
 * Reads: legacy_posts.json (exported by scripts/export-posts.ts)
 * Writes: Updates posts in Supabase DB directly.
 */

// CRITICAL: Load env vars FIRST (top of file, before any module-level initializers)
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const GITHUB_MODELS_ENDPOINT = 'https://models.inference.ai.azure.com';
const MODEL = 'gpt-4o-mini';
const DELAY_MS = 3000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface LegacyPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  category_id: string;
}

interface RefinedPost {
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
}

// ─── LLM Helper ──────────────────────────────────────────────────────────────

async function callGitHubModels(prompt: string, githubToken: string): Promise<string> {
  const response = await fetch(`${GITHUB_MODELS_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `Eres un experto en SEO técnico y redacción digital para el nicho de ingeniería civil, BIM y tecnología en Perú y LATAM. 
Tu especialidad es el protocolo "Nicho Nauta": artículos que posicionan como Top 3 en búsquedas de Google gracias a una estructura de lectura extremadamente escaneable, interlinking inteligente y metadata milimétrica.

REGLAS IRROMPIBLES del protocolo Nicho Nauta (obligatorias en tu output):
1. **title**: Máximo 60 caracteres. Debe incluir la keyword principal. Formato "yo + resultado" (ej: "Calculé la Cortante E.030 en 10 min"). Sin signos de interrogación en el title principal.
2. **meta_title**: Máximo 58 caracteres. Ligeramente diferente al title. Incluye la keyword. CTA implícita.
3. **meta_description**: Entre 130 y 155 caracteres. Incluye keyword primaria + beneficio + CTA sutil.
4. **excerpt**: 1-2 frases concisas ~150 caracteres.
5. **content** (MDX):
   - Párrafos CORTOS (máximo 3 líneas).
   - H2 con la keyword principal o variantes de long-tail.
   - H3 para detalles o casos específicos.
   - Tablas Markdown donde haya datos comparativos.
   - Bloques de código con triple backtick si el artículo original los tiene.
   - Negritas (**texto**) para conceptos clave y cifras.
   - Al menos 1 instancia de <InlineRelatedPost url="/servicios" title="Consultoría BIM — FreeCloud" /> colocada de forma natural en el texto. Usa el url más relevante: "/servicios", "/recursos", "/apps", o "/blog".
   - Tono: primera persona singular con experiencia real ("En mi experiencia...", "Cuando diseñé...", "En Huancayo aprendí que...").
   - Nunca inventar datos normativos (E.030, E.060, ISO 19650) — preservar los originales.
   - Mantener los blockquotes de "Nota personal" del original si existen.
   - Mantener los bloques de código del original si existen.
   - Si el artículo original tiene un CTA de venta (link Gumroad/Hotmart), preservarlo al final.

Responde SIEMPRE con JSON válido puro (sin markdown wrappers tipo \`\`\`json). Estructura:
{"title":"...","meta_title":"...","meta_description":"...","excerpt":"...","content":"..."}`,
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
  const text: string = data.choices[0]?.message?.content ?? '';
  return text;
}

// ─── Core function ────────────────────────────────────────────────────────────

async function refinePost(post: LegacyPost, githubToken: string): Promise<RefinedPost> {
  const prompt = `Refactoriza el siguiente artículo de blog técnico conforme al protocolo Nicho Nauta.

SLUG: ${post.slug}
TITLE actual: ${post.title}
EXCERPT actual: ${post.excerpt ?? '(ninguno)'}
META_TITLE actual: ${post.meta_title ?? '(ninguno)'}
META_DESCRIPTION actual: ${post.meta_description ?? '(ninguno)'}

---- CONTENT ACTUAL ----
${post.content}
---- FIN DEL CONTENT ----

Devuelve ÚNICAMENTE el JSON. No añadas explicaciones fuera del JSON.`;

  const rawJson = await callGitHubModels(prompt, githubToken);

  // Strip markdown code fences if model wrapped output
  const cleaned = rawJson
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  const parsed = JSON.parse(cleaned) as RefinedPost;
  return parsed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Initialize clients here (after dotenv has loaded)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  if (!githubToken) {
    console.error('❌ Missing GITHUB_TOKEN in .env.local');
    process.exit(1);
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  // 1. Read the exported legacy posts
  const legacyPath = path.join(process.cwd(), 'legacy_posts.json');
  if (!fs.existsSync(legacyPath)) {
    console.error('❌ legacy_posts.json not found. Run scripts/export-posts.ts first.');
    process.exit(1);
  }

  const posts: LegacyPost[] = JSON.parse(fs.readFileSync(legacyPath, 'utf-8'));
  console.log(`\n🚀 Starting Nicho Nauta refactor for ${posts.length} legacy posts...\n`);

  const results: { slug: string; success: boolean; error?: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] Processing: "${post.title}" (${post.slug})`);

    try {
      // 2. Call LLM to refine the post
      const refined = await refinePost(post, githubToken);

      // 3. Validate LLM output minimally
      if (!refined.title || !refined.content) {
        throw new Error('LLM returned incomplete data (missing title or content)');
      }

      // 4. Update in Supabase
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
      results.push({ slug: post.slug, success: true });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Failed: ${errMsg}`);
      results.push({ slug: post.slug, success: false, error: errMsg });
    }

    // Delay between calls to avoid rate limits
    if (i < posts.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s before next post...`);
      await new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  // 5. Summary
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📊 Refactoring Complete!`);
  console.log(`   ✅ Success: ${successCount}/${posts.length}`);
  console.log(`   ❌ Failed:  ${failCount}/${posts.length}`);

  if (failCount > 0) {
    console.log('\n⚠️  Failed posts:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`   - ${r.slug}: ${r.error}`);
      });
  }

  console.log('\n🎉 Done! Check the blog to verify the new content.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
