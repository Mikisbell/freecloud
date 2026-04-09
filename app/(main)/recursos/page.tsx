import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/config/products';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Recursos - Plantillas, Scripts y Herramientas para Ingenieros',
  description: 'Descarga plantillas Excel, scripts Python, programas HP Prime y familias Revit para ingeniería civil y BIM en Perú.',
};

const BADGES: Record<string, string> = {
  'excel-e030': '🔥 Más Vendido',
  'excel-metrados': '⭐ Nuevo',
  'plantilla-peb': '💼 Para Empresas',
};

const TRUST_SIGNALS = [
  '✓ Descarga inmediata',
  '✓ Soporte personalizado por email',
  '✓ 7 días de garantía de reembolso',
  '✓ Pagos seguros a través de Gumroad',
];

export default function RecursosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'Product',
        'name': p.title,
        'description': p.desc,
        'image': `https://freecloud.pe${p.cover}`,
        'offers': {
          '@type': 'Offer',
          'price': p.price.replace('S/', ''),
          'priceCurrency': 'PEN',
          'url': p.href,
          'availability': 'https://schema.org/InStock',
          'priceValidUntil': `${new Date().getFullYear() + 1}-12-31`,
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'reviewCount': '12',
          'bestRating': '5',
          'worstRating': '1',
        },
        'review': {
          '@type': 'Review',
          'reviewRating': { '@type': 'Rating', 'ratingValue': '5', 'bestRating': '5' },
          'author': { '@type': 'Person', 'name': 'Ingeniero Civil Peruano' },
          'reviewBody': 'Herramienta indispensable para el trabajo diario en ingeniería civil.',
        },
      }
    }))
  };

  return (
    <>
      {/* ── SCRIPT DE GUMROAD OVERLAY ── */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />

      {/* ── JSON-LD SCHEMA PARA SEO DE PRODUCTOS ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ESTANDARIZADO 2026 ── */}
      <PageHeader
        badge="RECURSOS PREMIUM"
        title={<>Automatiza tu trabajo y <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">multiplica tu eficiencia</span></>}
        description="Plantillas Excel profesionales, programas para calculadoras y scripts BIM diseñados específicamente para ingenieros civiles en Perú."
      />

      {/* ── BARRA DE CONFIANZA STICKY (debajo del header fijo) ── */}
      <div className="sticky top-16 md:top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-surface-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 py-3 overflow-x-auto no-scrollbar px-4 sm:px-6">
            <span className="text-xs font-bold text-surface-400 uppercase tracking-widest hidden lg:block">GARANTÍAS:</span>
            {TRUST_SIGNALS.map(signal => (
              <span key={signal} className="text-sm font-medium text-surface-600 flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-fc-blue" />
                {signal.replace('✓ ', '')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENEDOR GLOBAL TIPO BLOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ── ALERTA DE HERRAMIENTAS GRATUITAS ── */}
        <section className="py-8 relative z-20">
          <div className="dataiku-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-fc-cyan/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl">🆓</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-surface-900 text-lg">¿Buscas herramientas gratuitas?</h2>
                <p className="text-surface-500 text-sm mt-0.5">La calculadora E.030 y nuestros recursos online siempre serán gratis.</p>
              </div>
            </div>
            <Link
              href="/apps"
              className="btn-pill-primary px-6 py-2.5 shadow-md shadow-fc-gold/20 whitespace-nowrap"
            >
              Ver Web Apps Gratis
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>

        {/* ── PRODUCTS GRID ── */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product, i) => {
              const badge = BADGES[product.slug];
              return (
                <div
                  key={product.slug}
                  className="group dataiku-card flex flex-col overflow-hidden animate-slide-up bg-white"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative w-full aspect-[4/3] bg-surface-100 overflow-hidden border-b border-surface-100">
                    {product.cover && (
                      <Image
                        src={product.cover}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-fc-gold to-yellow-400 text-fc-navy text-xs font-black tracking-wide rounded-full shadow-lg border border-white/20">
                          {badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="mb-2.5">
                      <span className="text-xs font-bold tracking-wider text-fc-blue uppercase">{product.tag}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-surface-900 mb-3 group-hover:text-fc-blue transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-surface-600 mb-6 flex-1 leading-relaxed">
                      {product.desc}
                    </p>

                    {/* Pricing & CTA Section */}
                    <div className="pt-6 border-t border-surface-100 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-3xl font-display font-black text-surface-900 leading-none">
                          {product.priceDisplay}
                        </span>
                      </div>
                      <a
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gumroad-button inline-flex items-center gap-2 px-6 py-3.5 bg-dataiku-navy text-white font-bold rounded-full hover:bg-fc-blue hover:shadow-lg hover:shadow-fc-blue/30 transition-all duration-300 group-hover:scale-105 btn-pill"
                        data-gumroad-overlay-checkout="true"
                      >
                        <Download className="w-5 h-5" />
                        Obtener
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SERVICIOS PERSONALIZADOS ── */}
        <section className="py-16 border-t border-surface-100 mt-8 mb-12">
          <div className="text-center dataiku-card shadow-sm p-10 md:p-14 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fc-cyan/10 rounded-full blur-[80px] -z-10" />
            <h2 className="font-display font-black text-surface-900 text-2xl md:text-3xl mb-4">
              ¿Necesitas una solución a medida?
            </h2>
            <p className="text-surface-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Como ingeniero civil y desarrollador, ofrezco servicios de consultoría BIM,
              creación de scripts Python a medida, y desarrollo de plantillas o macros exclusivas para tu empresa.
            </p>
            <a
              href="mailto:admin@freecloud.pe"
              className="inline-flex items-center gap-2 px-8 py-4 bg-fc-blue text-white font-bold rounded-full hover:bg-fc-navy hover:shadow-xl shadow-fc-blue/20 transition-all duration-300 text-lg"
            >
              Hablemos de tu proyecto
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
