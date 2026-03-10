import { compareSoftware } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SoftwareCompareHero } from '@/components/herramientas/SoftwareCompareHero';
import { SoftwareCompareTable } from '@/components/herramientas/SoftwareCompareTable';

interface ComparePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Extrae slug A y B de forma segura
function extractSlugs(combinedSlug: string): [string, string] | [null, null] {
  const parts = combinedSlug.split('-vs-');
  if (parts.length !== 2) return [null, null];
  return [parts[0], parts[1]];
}

/**
 * METADATA SEO DINÁMICA
 * Fase 1 de optimización Programmatic SEO (RTINGS Model)
 */
export async function generateMetadata(props: ComparePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const [slugA, slugB] = extractSlugs(slug);
  
  if (!slugA || !slugB) {
    return { title: 'Comparativa No Encontrada' };
  }

  const { a, b } = await compareSoftware(slugA, slugB);

  // Si no existen en DB, no rankea
  if (!a || !b) {
    return { title: 'Herramienta BIM No Encontrada | FreeCloud' };
  }

  return {
    title: `${a.name} vs ${b.name}: ¿Cuál es la mejor opción en 2026?`,
    description: `Análisis técnico y comparativa detallada entre ${a.name} y ${b.name}. Descubre qué software de la categoría ${a.category} se adapta mejor a tu flujo de trabajo BIM.`,
    alternates: {
      canonical: `https://freecloud.pe/herramientas/comparar/${slug}`
    }
  };
}

/**
 * SERVER COMPONENT — COMPARATIVA
 * Genera la UI lado a lado para dos softwares BIM.
 */
export default async function ComparePage(props: ComparePageProps) {
  const { slug } = await props.params;
  const [slugA, slugB] = extractSlugs(slug);
  
  // Validar URL formatting
  if (!slugA || !slugB) {
    notFound();
  }

  // Fetch parallelized en db con cache nativo de Next.js
  const { a, b } = await compareSoftware(slugA, slugB);

  // Validar existencia en base de datos
  if (!a || !b) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pb-24">
      <SoftwareCompareHero a={a} b={b} />
      
      {/* Veredicto Express o TL;DR (Futuro componente) */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 mt-12">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span> Veredicto Express
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tanto <strong>{a.name}</strong> como <strong>{b.name}</strong> son soluciones excepcionales 
            dentro de la categoría de <em>{a.category}</em>. La elección final dependerá 
            estrictamente del tamaño de la oficina, los requisitos del cliente y la curva 
            de aprendizaje de tu equipo (ver tabla técnica abajo).
          </p>
        </div>
      </section>

      <SoftwareCompareTable a={a} b={b} />
    </article>
  );
}
