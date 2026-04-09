import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Target, TrendingUp, Code, Building2, Lightbulb } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Empieza Aquí — Guía para Ingenieros Civiles que Quieren Aprender BIM',
  description: 'No sabes por dónde empezar? Esta guía te lleva desde los fundamentos hasta la automatización avanzada con BIM, paso a paso.',
};

const LEARNING_PATHS = [
  {
    icon: <BookOpen className="w-6 h-6 text-fc-blue" />,
    title: 'Soy Principiante',
    description: 'Nunca he tocado Revit ni sé qué es BIM',
    steps: [
      { title: '¿Qué es BIM y por qué es obligatorio?', href: '/blog/bim-obligatorio-peru-2026', time: '8 min' },
      { title: 'Revit vs AutoCAD: ¿Cuál aprender primero?', href: '/blog/revit-vs-autocad-cual-aprender-primero-2025', time: '9 min' },
      { title: 'Domina Revit Estructural en 5 pasos', href: '/blog/revit-estructuras-ingenieros-autocad', time: '8 min' },
      { title: 'Cuánto me costó aprender BIM', href: '/blog/cuanto-costo-aprender-bim-2024-desglose-completo-soles', time: '10 min' },
    ],
  },
  {
    icon: <Building2 className="w-6 h-6 text-fc-gold" />,
    title: 'Quiero Estructuras',
    description: 'Ya sé modelar, quiero analizar y diseñar',
    steps: [
      { title: 'Cálculo de Cortante Basal E.030', href: '/blog/cortante-basal-formula-e030-calculo-paso-a-paso', time: '8 min' },
      { title: 'Análisis Sísmico en ETABS', href: '/blog/etabs-analisis-sismico-norma-e030-guia-practica', time: '12 min' },
      { title: 'Muros Pantalla para Rigidez Lateral', href: '/blog/etabs-muros-pantalla-rigidez-lateral', time: '8 min' },
      { title: 'Diseño de Zapatas Aisladas', href: '/blog/calculo-zapata-aislada-e050-e060-paso-a-paso', time: '9 min' },
    ],
  },
  {
    icon: <Code className="w-6 h-6 text-fc-cyan" />,
    title: 'Quiero Automatizar',
    description: 'Estoy cansado de hacer lo mismo manualmente',
    steps: [
      { title: 'Dynamo para Principiantes', href: '/blog/dynamo-principiantes-primera-automatizacion-revit-guia', time: '11 min' },
      { title: 'Tu Primer Script en Python', href: '/blog/python-ingenieros-civiles-primer-script', time: '7 min' },
      { title: 'PyRevit: Instalar y primeros scripts', href: '/blog/pyrevit-instalar-primeros-scripts-revit', time: '7 min' },
      { title: '50 Errores en Modelos BIM', href: '/blog/50-errores-encontrados-en-modelos-bim-revit-etabs', time: '12 min' },
    ],
  },
  {
    icon: <Target className="w-6 h-6 text-fc-navy" />,
    title: 'Necesito Certificación',
    description: 'Mi empresa necesita cumplir con la Ley 32069',
    steps: [
      { title: 'Lo que nadie te dice sobre la Ley 32069', href: '/blog/verdad-sobre-ley-32069-bim-obligatorio-peru-2026', time: '11 min' },
      { title: 'BIM Nivel 1, 2 y 3 en Perú', href: '/blog/bim-nivel-1-2-3-diferencias-certificacion', time: '10 min' },
      { title: 'Plan de Ejecución BIM (PEB)', href: '/blog/bep-plan-ejecucion-bim-ejemplo-peru', time: '8 min' },
      { title: 'BIM Manager en Perú 2026', href: '/blog/bim-manager-que-hace-cuanto-gana-peru', time: '9 min' },
    ],
  },
];

const QUICK_LINKS = [
  { icon: <Lightbulb className="w-5 h-5 text-amber-500" />, title: 'Los más leídos', href: '/blog?cat=bim-peru' },
  { icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, title: 'Nuevos esta semana', href: '/blog' },
  { icon: <CheckCircle2 className="w-5 h-5 text-fc-blue" />, title: 'Herramientas gratuitas', href: '/herramientas-gratuitas' },
  { icon: <BookOpen className="w-5 h-5 text-fc-gold" />, title: 'Portfolio de proyectos', href: '/portfolio' },
];

export default function StartHerePage() {
  return (
    <>
      <PageHeader
        badge="EMPIEZA AQUÍ"
        badgeEmoji="🚀"
        title={<>No sabes por dónde <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">empezar?</span></>}
        description="Te guío paso a paso según tu nivel y objetivos. Elige tu camino y empieza a aprender hoy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── NOTA RÁPIDA ── */}
        <section className="py-6">
          <div className="p-5 bg-fc-cyan/5 border border-fc-cyan/20 rounded-xl flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm text-surface-700 leading-relaxed">
              Todo el contenido educativo de FreeCloud.pe es <strong>gratuito para siempre</strong>. 
              No necesitas registrarte ni pagar nada para aprender. Si algo tiene costo, es una plantilla 
              que te ahorra horas de trabajo manual — pero el conocimiento base siempre es gratis.
            </div>
          </div>
        </section>

        {/* ── ACCESOS RÁPIDOS ── */}
        <section className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-white border border-surface-200 rounded-xl hover:shadow-md hover:border-fc-blue/30 transition-all group"
              >
                {link.icon}
                <span className="text-sm font-medium text-surface-700 group-hover:text-fc-blue">{link.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── RUTAS DE APRENDIZAJE ── */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Elige tu Camino</h2>
            <div className="h-px bg-surface-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {LEARNING_PATHS.map((path) => (
              <div key={path.title} className="bg-white border border-surface-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 border-b border-surface-100 bg-surface-50/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-surface-100">
                      {path.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-surface-900">{path.title}</h3>
                      <p className="text-sm text-surface-500">{path.description}</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-surface-100">
                  {path.steps.map((step, i) => (
                    <Link
                      key={i}
                      href={step.href}
                      className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-fc-blue/10 text-fc-blue rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-surface-700 group-hover:text-fc-blue transition-colors">
                          {step.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-400">{step.time}</span>
                        <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-fc-blue transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONSEJO FINAL ── */}
        <section className="py-16 mb-12">
          <div className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
                ¿Necesitas algo personalizado?
              </h2>
              <p className="text-surface-300 text-lg max-w-2xl mx-auto mb-8">
                Si tu empresa necesita una ruta de aprendizaje a medida para su equipo, 
                puedo diseñar un plan de capacitación BIM adaptado a tus proyectos reales.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sobre-mi#contacto"
                  className="flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-fc-blue/30"
                >
                  Solicitar Capacitación
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/servicios"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors border border-white/20"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
