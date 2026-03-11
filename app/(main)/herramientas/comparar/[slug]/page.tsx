import { compareSoftware } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SoftwareCompareHero } from '@/components/herramientas/SoftwareCompareHero';
import { SoftwareCompareScores } from '@/components/herramientas/SoftwareCompareScores';
import { SoftwareCompareProsCons } from '@/components/herramientas/SoftwareCompareProsCons';
import { SoftwareVerdict } from '@/components/herramientas/SoftwareVerdict';
import { SoftwareCompareTable } from '@/components/herramientas/SoftwareCompareTable';
import { getGodTierComparison } from '@/lib/data/rtingsFetcher';
import { InteractiveScoreTable } from '@/components/herramientas/rtings/InteractiveScoreTable';

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
  
  // Fetcher Algorítmico M x N
  const rtingsData = await getGodTierComparison(slugA, slugB);

  // Validar existencia en base de datos
  if (!a || !b) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pb-24">
      <SoftwareCompareHero a={a} b={b} />

      {/* MOTOR M x N (Evaluado Matemáticamente) */}
      {rtingsData && (
        <section className="container mx-auto max-w-6xl px-4 mt-16 mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">
             Análisis de Laboratorio: <span className="text-blue-500">{rtingsData.softwareA.releaseName}</span> vs <span className="text-blue-500">{rtingsData.softwareB.releaseName}</span>
          </h2>
          <InteractiveScoreTable initialData={rtingsData} />
        </section>
      )}
      <SoftwareCompareScores 
        a={a} 
        b={b} 
        reviewA={a.software_reviews?.[0]} 
        reviewB={b.software_reviews?.[0]} 
      />
      
      <SoftwareCompareProsCons 
        a={a} 
        b={b} 
        reviewA={a.software_reviews?.[0]} 
        reviewB={b.software_reviews?.[0]} 
      />

      <SoftwareVerdict 
        a={a} 
        b={b} 
        reviewA={a.software_reviews?.[0]} 
        reviewB={b.software_reviews?.[0]} 
      />

      <SoftwareCompareTable a={a} b={b} />
    </article>
  );
}
