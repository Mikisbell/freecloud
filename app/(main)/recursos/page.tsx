import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Download, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recursos - Plantillas, Scripts y Herramientas para Ingenieros',
  description: 'Descarga plantillas Excel, scripts Python, programas HP Prime y familias Revit para ingeniería civil y BIM en Perú.',
};

const PRODUCTS = [
  {
    title: 'Plantilla Excel - Diseño Sísmico E.030',
    description: 'Hoja de cálculo completa para análisis sísmico estático y dinámico según norma peruana E.030. Incluye espectro, fuerzas por piso y derivas.',
    price: 'S/ 25',
    priceUsd: '$7',
    iconUrl: '/excel.svg',
    category: 'Ing. Sísmica',
    href: 'https://pay.hotmart.com/E98246344E?checkoutMode=10', // link update from previous instruction
    isGumroad: false,
    tags: ['E.030', 'Sísmica', 'Excel'],
    badge: '🔥 Más Vendido',
  },
  {
    title: 'Plantilla Excel - Metrados de Obra',
    description: 'Plantilla profesional de metrados con formatos de partidas según normativa peruana. Incluye macros para resumen automático de acero.',
    price: 'S/ 20',
    priceUsd: '$5',
    iconUrl: '/excel.svg',
    category: 'Metrados',
    href: 'https://freecloud.gumroad.com/l/plantilla-metrados',
    isGumroad: true,
    tags: ['Metrados', 'Excel', 'Presupuesto'],
    badge: '⭐ Nuevo',
  },
  {
    title: 'Pack Programas HP Prime - Hardy Cross',
    description: 'Programa completo para el método de Hardy Cross. Incluye cálculo automático de caudales corregidos y presiones en nodos.',
    price: 'S/ 35',
    priceUsd: '$10',
    iconUrl: '/hp.svg',
    category: 'HP Prime',
    href: 'https://freecloud.gumroad.com/l/hp-prime-hardy-cross',
    isGumroad: true,
    tags: ['HP Prime', 'Hardy Cross', 'Hidráulica'],
  },
  {
    title: 'Pack Scripts Python para Revit API',
    description: 'Ahorra horas en Revit: crear hojas automáticamente, renombrar vistas masivamente y numerar parqueos. Código fuente comentado.',
    price: 'S/ 50',
    priceUsd: '$15',
    iconUrl: '/python.svg',
    category: 'Python',
    href: 'https://freecloud.gumroad.com/l/revit-scripts-python',
    isGumroad: true,
    tags: ['Python', 'Revit API', 'Automatización'],
  },
  {
    title: 'Familias Revit - Estructural Perú',
    description: 'Pack de familias Revit paramétricas adaptadas a la construcción peruana. Zapatas conectadas, vigas peraltadas y viguetas.',
    price: 'S/ 40',
    priceUsd: '$12',
    iconUrl: '/revit.png',
    category: 'Revit',
    href: 'https://freecloud.gumroad.com/l/familias-revit-estructural',
    isGumroad: true,
    tags: ['Revit', 'Familias', 'Estructuras'],
  },
  {
    title: 'Plantilla Plan de Ejecución BIM (PEB)',
    description: 'Documento Word y PDF editable con la estructura del PEB según la Guía Nacional BIM Perú. Rápido de adaptar a tu proyecto.',
    price: 'S/ 60',
    priceUsd: '$18',
    iconUrl: '/BIM 360.png',
    category: 'BIM',
    href: 'https://freecloud.gumroad.com/l/plantilla-peb-bim',
    isGumroad: true,
    tags: ['BIM', 'PEB', 'Gestión'],
    badge: '💼 Para Empresas',
  },
];

const TRUST_SIGNALS = [
  '✓ Descarga inmediata',
  '✓ Soporte personalizado por email',
  '✓ 7 días de garantía de reembolso',
  '✓ Pagos seguros a través de Hotmart',
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
        'description': p.description,
        'image': `https://freecloud.pe${p.iconUrl}`,
        'offers': {
          '@type': 'Offer',
          'price': p.price.replace('S/ ', ''),
          'priceCurrency': 'PEN',
          'url': p.href.startsWith('mailto:') ? 'https://freecloud.pe/recursos' : p.href,
          'availability': 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      {/* ── SCRIPT DE GUMROAD OVERLAY ── */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />

      {/* ── JSON-LD SCHEMA PARA SEO DE PRODUCTOS ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO DE CONVERSIÓN ── */}
      <section className="bg-dataiku-navy text-white relative overflow-hidden pb-16 pt-20 border-b-4 border-fc-gold">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.1]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fc-cyan/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-fade-in">
          <p className="text-fc-cyan font-bold tracking-wider text-sm mb-4">RECURSOS PREMIUM</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight max-w-4xl mx-auto">
            Automatiza tu trabajo y <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light">multiplica tu eficiencia</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plantillas Excel profesionales, programas para calculadoras y scripts BIM diseñados específicamente para ingenieros civiles en Perú.
          </p>

          {/* Trust signals bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 border-t border-surface-800 animate-slide-up stagger-2">
            {TRUST_SIGNALS.map(signal => (
              <span key={signal} className="text-sm font-medium text-surface-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-fc-blue" />
                {signal.replace('✓ ', '')}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERTA DE HERRAMIENTAS GRATUITAS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-16">
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
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, i) => (
            <div
              key={product.title}
              className="group dataiku-card flex flex-col overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-surface-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-fc-cyan/10 group-hover:scale-110 transition-all duration-300 overflow-hidden p-2 border border-transparent group-hover:border-fc-cyan/20 relative">
                    <Image src={product.iconUrl} alt={product.category} width={50} height={50} className="w-full h-full object-contain" />
                  </div>
                  {product.badge && (
                    <span className="px-3 py-1 bg-gradient-to-r from-fc-gold to-fc-gold-light text-white text-xs font-bold rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <span className="text-xs font-bold tracking-wider text-fc-blue uppercase">{product.category}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-surface-900 mb-3 group-hover:text-fc-blue transition-colors">
                  {product.title}
                </h3>

                <p className="text-surface-600 mb-6 flex-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-8">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-surface-50 border border-surface-100 text-surface-500 font-medium text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Pricing & CTA Section */}
                <div className="pt-6 border-t border-surface-100 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-3xl font-display font-black text-surface-900 leading-none">
                      {product.price}
                    </span>
                    <span className="text-sm font-medium text-surface-400 mt-1">
                      (aprox. {product.priceUsd})
                    </span>
                  </div>
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3.5 bg-dataiku-navy text-white font-bold rounded-full hover:bg-fc-blue hover:shadow-lg hover:shadow-fc-blue/30 transition-all duration-300 group-hover:scale-105 btn-pill ${product.isGumroad ? 'gumroad-button' : ''}`}
                    data-gumroad-overlay-checkout={product.isGumroad ? "true" : undefined}
                  >
                    <Download className="w-5 h-5" />
                    Obtener
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SERVICIOS PERSONALIZADOS ── */}
        <div className="mt-20 text-center dataiku-card shadow-sm p-10 md:p-14 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fc-cyan/10 rounded-full blur-[80px] -z-10" />
          <h2 className="font-display font-black text-surface-900 text-3xl mb-4">
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
      </div>
    </div>
  );
}
