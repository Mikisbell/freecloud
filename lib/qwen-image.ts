/**
 * Qwen Image Generation Client via Alibaba Cloud DashScope API
 *
 * Modelos disponibles:
 * - qwen-image-2.0 — Estándar, rápido (DEFAULT)
 * - qwen-image-2.0-pro — Mejor calidad, un poco más lento
 * - qwen-image-max — Máxima calidad, más lento
 * - qwen-image-plus — Buena calidad, buen precio
 *
 * Región: Singapore (intl)
 * Docs: https://www.alibabacloud.com/help/en/model-studio/text-to-image
 */

const DASHSCOPE_BASE_URL =
  process.env.DASHSCOPE_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const IMAGE_API_URL = `${DASHSCOPE_BASE_URL}/images/generations`;

export interface ImageGenerationOptions {
  /** Modelo a usar (default: qwen-image-2.0) */
  model?: string;
  /** Prompt — inglés o chino para mejor resultado */
  prompt: string;
  /** Tamaño de la imagen (default: 1024*1024) */
  size?: "1024*1024" | "1024*768" | "768*1024" | "1920*1080" | "1080*1920";
  /** Número de imágenes a generar (1-4) */
  n?: number;
  /** Style preset para contenido BIM/ingeniería */
  style?: "architectural" | "technical" | "photorealistic" | "illustration" | "3d-render";
}

export interface ImageGenerationResult {
  success: boolean;
  urls: string[];
  error?: string;
  model: string;
  prompt: string;
}

/** Construye un prompt optimizado para contenido BIM/Ingeniería */
function buildPrompt(basePrompt: string, style?: string): string {
  const stylePrefixes: Record<string, string> = {
    architectural: "Architectural visualization style, ",
    technical: "Technical diagram style, clean and professional, ",
    photorealistic: "Photorealistic, ",
    illustration: "Modern flat illustration style, ",
    "3d-render": "3D render with soft lighting, ",
  };

  const prefix = style && stylePrefixes[style] ? stylePrefixes[style] : "";
  return `${prefix}${basePrompt}, high quality, professional, no text or watermarks`;
}

/** Genera imágenes usando Qwen Image via DashScope API */
export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      urls: [],
      error: "DASHSCOPE_API_KEY no configurada en .env",
      model: options.model || "qwen-image-2.0",
      prompt: options.prompt,
    };
  }

  const model = options.model || "qwen-image-2.0";
  const prompt = buildPrompt(options.prompt, options.style);
  const size = options.size || "1024*1024";
  const n = Math.min(options.n || 1, 4);

  try {
    const response = await fetch(IMAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        n,
        size,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
      return {
        success: false,
        urls: [],
        error: `DashScope API error: ${errorMessage}`,
        model,
        prompt: options.prompt,
      };
    }

    const data = await response.json();

    // DashScope compatible mode retorna: { data: [{ url: "..." }] }
    const urls = data.data
      ?.map((item: { url?: string; b64_json?: string }) => item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : ""))
      .filter(Boolean) as string[];

    if (!urls || urls.length === 0) {
      return {
        success: false,
        urls: [],
        error: "No se recibieron URLs de imagen en la respuesta",
        model,
        prompt: options.prompt,
      };
    }

    return { success: true, urls, model, prompt: options.prompt };
  } catch (error) {
    return {
      success: false,
      urls: [],
      error: error instanceof Error ? error.message : "Error de red desconocido",
      model,
      prompt: options.prompt,
    };
  }
}

/** Genera una imagen destacada para un post de blog */
export async function generatePostFeaturedArt(
  title: string,
  category: string,
  extra?: string
): Promise<ImageGenerationResult> {
  const categoryContexts: Record<string, string> = {
    bim: "Building Information Modeling, Revit, Navisworks, BIM coordination, modern construction",
    "ingenieria-civil": "civil engineering, structural design, construction site, Peru Andes mountains",
    software: "engineering software, laptop with CAD interface, modern workspace",
    tutoriales: "step-by-step tutorial, educational infographic style, clean design",
    tecnologia: "technology in construction, drones, laser scanning, digital tools",
    sismo: "seismic analysis, earthquake resistant buildings, Peru architecture",
    etabs: "ETABS software interface, structural analysis, high-rise building design",
    revit: "Autodesk Revit interface, 3D BIM model, architectural design",
    excel: "Microsoft Excel spreadsheets, engineering calculations, data analysis",
    python: "Python programming for engineering, Jupyter notebooks, automation scripts",
  };

  const context = categoryContexts[category.toLowerCase()] || "civil engineering, construction, BIM, modern architecture";
  const prompt = `Featured article hero image for "${title}". ${context}. ${extra || ""}. Professional engineering blog style, cinematic lighting, no people, no text`;

  return generateImage({ prompt, size: "1920*1080", style: "photorealistic", n: 1 });
}
