import { NextRequest, NextResponse } from 'next/server';
import { generateImage, generatePostFeaturedArt, type ImageGenerationOptions } from '@/lib/qwen-image';
import { createServerClient } from '@supabase/ssr';

/**
 * POST /api/image-generate
 *
 * Genera imágenes usando Gemini Image via OpenRouter.
 * Protegido: solo usuarios autenticados de admin pueden usarlo.
 *
 * Body:
 * {
 *   mode: "custom" | "featured",
 *   prompt: string,          // Requerido para mode: "custom"
 *   title: string,           // Requerido para mode: "featured"
 *   category: string,        // Requerido para mode: "featured"
 *   options?: ImageGenerationOptions
 * }
 */
export async function POST(request: NextRequest) {
  // 1. Verificar autenticación
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No necesitamos setear cookies en API routes
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // 2. Parsear body
  const body = await request.json();
  const { mode, prompt, title, category, options } = body;

  if (!mode || !['custom', 'featured'].includes(mode)) {
    return NextResponse.json(
      { error: 'Modo inválido. Use "custom" o "featured"' },
      { status: 400 }
    );
  }

  // 3. Generar imagen según modo
  let result;

  if (mode === 'featured') {
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Para modo featured se requiere title y category' },
        { status: 400 }
      );
    }
    result = await generatePostFeaturedArt(title, category, prompt);
  } else {
    if (!prompt) {
      return NextResponse.json(
        { error: 'Para modo custom se requiere prompt' },
        { status: 400 }
      );
    }
    const opts: ImageGenerationOptions = {
      prompt,
      ...(options || {}),
    };
    result = await generateImage(opts);
  }

  // 4. Responder
  if (!result.success) {
    return NextResponse.json(
      { error: result.error, urls: [], model: result.model, prompt: result.prompt },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    urls: result.urls,
    model: result.model,
    prompt: result.prompt,
  });
}
