import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Ruler, Layers, Zap, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Herramientas Gratuitas para Ingenieros Civiles',
  description: 'Calculadoras online, recursos descargables y herramientas gratuitas para ingenieros civiles en Perú. Sin registro, sin costo.',
};

const FREE_TOOLS = [
  {
    icon: <Calculator className="w-8 h-8 text-fc-blue" />,
    title: 'Calculadora Sísmica E.030',
    description: 'Calcula la cortante basal de tu edificio según la norma peruana E.030. Ingresa los datos y obtén el resultado al instante.',
    href: '/apps/calculadora-sismica',
    features: ['Cálculo automático de ZUCS/R', 'Resultados inmediatos', 'Sin registro requerido'],
  },
  {
    icon: <Ruler className="w-8 h-8 text-fc-gold" />,
    title: 'Predimensionamiento Estructural',
    description: 'Próximamente: calcula las dimensiones preliminares de vigas y columnas para edificaciones de concreto armado.',
    href: '/apps',
    features: ['Próximamente', 'Según E.060', 'Sin registro requerido'],
    comingSoon: true,
  },
  {
    icon: <Layers className="w-8 h-8 text-fc-cyan" />,
    title: 'Recursos y Plantillas',
    description: 'Plantillas Excel, scripts Python y programas para calculadoras. Algunos gratuitos, otros premium para quienes necesitan más.',
    href: '/recursos',
    features: ['Plantillas Excel', 'Scripts Python', 'Programas HP Prime'],
  },
  {
    icon: <Zap className="w-8 h-8 text-fc-navy" />,
    title: 'Blog Técnico BIM',
    description: '+48 artículos con datos reales de proyectos: errores encontrados, soluciones aplicadas, y números específicos.',
    href: '/blog',
    features: ['48+ artículos', 'Datos de proyectos reales', 'Gratis para siempre'],
  },
];

export default function FreeToolsPage() {
  return (
    <>
      {/* ── HERO ESTANDARIZADO 2026 ── */}
      <PageHeader
        badge="GRATUITO"
        badgeEmoji="🆓"
        title={<>Herramientas <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">Gratuitas</span></>}
        description="Calculadoras, recursos y contenido educativo gratis para ingenieros civiles en Perú y Latinoamérica. Sin registro, sin costo, sin compromisos."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── NOTA EDITORIAL ── */}
        <section className="py-6">
          <div className="p-5 bg-fc-cyan/5 border border-fc-cyan/20 rounded-xl flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm text-surface-700 leading-relaxed">
              <strong>Compromiso:</strong> Todo el contenido educativo de FreeCloud.pe es y será siempre gratuito. 
              No ponemos información técnica detrás de muros de pago. Si algo tiene costo, es una plantilla o script 
              que te ahorra horas de trabajo manual — pero el conocimiento base siempre es gratis.
            </div>
          </div>
        </section>

        {/* ── HERRAMIENTAS ── */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {FREE_TOOLS.map((tool) => (
              <div
                key={tool.title}
                className={`rounded-2xl border p-8 transition-shadow hover:shadow-lg ${
                  tool.comingSoon
                    ? 'bg-surface-50 border-surface-200 opacity-75'
                    : 'bg-white border-surface-200'
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-surface-50 rounded-2xl flex items-center justify-center shrink-0 border border-surface-100">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-surface-900 mb-1">
                      {tool.title}
                      {tool.comingSoon && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          Próximamente
                        </span>
                      )}
                    </h3>
                    <p className="text-surface-600 text-sm leading-relaxed">{tool.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {tool.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-surface-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={tool.href}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                    tool.comingSoon
                      ? 'bg-surface-200 text-surface-500 cursor-not-allowed'
                      : 'bg-fc-blue text-white hover:bg-fc-navy shadow-lg shadow-fc-blue/20'
                  }`}
                >
                  {tool.comingSoon ? 'Próximamente' : 'Acceder'}
                  {!tool.comingSoon && <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── POR QUÉ GRATIS ── */}
        <section className="py-12 border-t border-surface-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mb-6">
              ¿Por qué es gratis?
            </h2>
            <div className="text-surface-600 leading-relaxed space-y-4">
              <p>
                Porque cuando empecé en 2016, la información técnica sobre BIM y normas peruanas 
                estaba dispersa, era difícil de encontrar, y mucha estaba detrás de muros de pago. 
                Yo aprendí a base de prueba y error, y esos errores me costaron dinero y tiempo.
              </p>
              <p>
                FreeCloud.pe existe para que otros ingenieros no cometan los mismos errores. 
                Los artículos, las calculadoras, y los tutoriales son gratuitos porque el conocimiento 
                técnico debería ser accesible para todos los ingenieros de Perú y Latinoamérica.
              </p>
              <p>
                Si quieres apoyar este proyecto, puedes compartir los artículos, dejar un comentario 
                en los posts, o simplemente aplicar lo que aprendes en tus proyectos. Eso es suficiente.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 mb-12">
          <div className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
                ¿Necesitas algo más específico?
              </h2>
              <p className="text-surface-300 text-lg max-w-2xl mx-auto mb-8">
                Si necesitas consultoría BIM, diseño estructural o herramientas a medida para tu empresa, 
                puedo ayudarte con eso también.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sobre-mi#contacto"
                  className="flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-fc-blue/30"
                >
                  Contactar
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:contacto@freecloud.pe"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors border border-white/20"
                >
                  contacto@freecloud.pe
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
