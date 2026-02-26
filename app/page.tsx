import Link from 'next/link';
import { ArrowRight, BookOpen, Download, Calculator, Code, Cpu, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { getPosts, getCategories } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';
import TabShowcase from '@/components/TabShowcase';
import SocialProof from '@/components/SocialProof';

const TOOLS = [
  { name: 'Autodesk Revit', href: '/recursos?type=revit', iconUrl: '/revit.png', desc: 'Plantillas BIM, modelos y familias paramétricas para diseño.' },
  { name: 'Python API', href: '/recursos?type=python', iconUrl: '/python.svg', desc: 'Scripts para automatizar tareas repetitivas en Revit y BIM.' },
  { name: 'Dynamo', href: '/recursos?type=dynamo', iconUrl: '/Dynamo.png', desc: 'Programación visual y flujos de trabajo de ingeniería.' },
  { name: 'Civil 3D', href: '/recursos?type=civil3d', iconUrl: '/civil.png', desc: 'Herramientas de topografía y diseño vial normativo.' },
];

const TESTIMONIALS = [
  {
    quote: 'Por fin alguien explica BIM en peruano. Los tutoriales de Dynamo me ahorraron semanas de prueba y error en mi proyecto de la Municipalidad.',
    name: 'Carlos Quispe',
    role: 'Ingeniero Civil — Lima',
    initials: 'CQ',
    color: 'bg-fc-gold',
  },
  {
    quote: 'La plantilla de metrados es exactamente lo que buscaba. Tiene el formato correcto para licitaciones públicas y me salvó en un proyecto urgente.',
    name: 'Ana Flores',
    role: 'Residente de Obra — Arequipa',
    initials: 'AF',
    color: 'bg-fc-blue',
  },
  {
    quote: 'El post de Robot Structural vs ETABS es el más completo que encontré en español. Me ayudó a elegir el software correcto para mi empresa.',
    name: 'Diego Mamani',
    role: 'Jefe de Proyectos — Cusco',
    initials: 'DM',
    color: 'bg-fc-navy',
  },
];

const FAQS = [
  {
    q: '¿El contenido es específico para la normativa peruana?',
    a: 'Sí, todo el contenido (tutoriales, plantillas y herramientas) está orientado a la normativa peruana: E.030 Diseño Sísmico, E.060 Concreto Armado, Plan BIM Perú y la Ley 32069 de obligatoriedad BIM.',
  },
  {
    q: '¿Los recursos son realmente descargables después de comprar?',
    a: 'Sí. La descarga es inmediata a través de Hotmart después del pago. Recibes el archivo directamente en tu email.',
  },
  {
    q: '¿Qué herramientas son completamente gratis?',
    a: 'La Calculadora Sísmica E.030 y todas las Web Apps (en /apps) son 100% gratuitas. Los artículos del blog también son gratuitos. Solo los productos descargables (plantillas y scripts) tienen costo.',
  },
  {
    q: '¿Puedo usar las plantillas en proyectos comerciales?',
    a: 'Sí, la licencia incluye uso profesional y comercial. Puedes usarla en todos tus proyectos sin restricciones adicionales.',
  },
  {
    q: '¿BIM ya es obligatorio en Perú?',
    a: 'La Ley 32069 establece la obligatoriedad BIM para proyectos públicos de inversión. La implementación por fases está en marcha y el horizonte es agosto 2026 para la mayoría de entidades públicas.',
  },
];

export default async function HomePage() {
  const [postsRes, dbCategories] = await Promise.all([
    getPosts({ limit: 7 }),
    getCategories()
  ]);

  const posts = postsRes.posts;
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const recentPosts = posts.filter(p => p.slug !== featuredPost?.slug).slice(0, 6);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fc-navy-deep via-fc-navy to-fc-blue">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-fc-cyan/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-fc-gold/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-36">
          <div className="max-w-3xl">
            {/* Badge urgencia */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fc-blue/10 border border-fc-blue/20 text-fc-cyan-light text-xs font-semibold rounded-full mb-8 backdrop-blur-sm animate-fade-in">
              <span className="w-2 h-2 bg-fc-cyan rounded-full animate-pulse" />
              <span className="font-slogan tracking-[0.2em] text-xs uppercase">BIM OBLIGATORIO EN PERÚ — AGOSTO 2026</span>
            </div>

            {/* H1 masivo con staggered animation */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand font-black text-white mb-6 leading-[1.05] text-balance animate-slide-up">
              BIM, Ingeniería Civil y{' '}
              <span className="gradient-text">Tecnología</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl animate-slide-up stagger-1 leading-relaxed">
              Tutoriales de Revit, Dynamo, Python y Robot Structural.
              Plantillas, herramientas y recursos para ingenieros en Perú — en español, con normativa peruana.
            </p>

            {/* CTAs primarios */}
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link href="/blog" className="btn-pill-primary text-base px-7 py-3.5 shadow-lg shadow-fc-blue/20 hover:shadow-fc-blue/40 transition-all">
                <BookOpen className="w-5 h-5" />
                Ver Tutoriales
              </Link>
              <Link
                href="/recursos"
                className="btn-pill bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-surface-900 text-base px-7 py-3.5"
              >
                <Download className="w-5 h-5" />
                Recursos y Herramientas
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-16">
            <path d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR (Elemento 5) ── */}
      <SocialProof />

      {/* ── FEATURED POST ── */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="reveal">
            <BlogCard post={featuredPost as unknown as import('@/types/supabase').Post} dbCategory={featuredPost.categories} featured />
          </div>
        </section>
      )}

      {/* ── RECENT POSTS ── */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 reveal">
            <div>
              <p className="label-uppercase mb-2">Blog</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
                Últimos artículos
              </h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm text-fc-blue font-semibold hover:gap-2 transition-all pb-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, i) => (
              <div key={post.slug} className="reveal relative" style={{ transitionDelay: `${i * 100}ms` }}>
                <BlogCard post={post as unknown as import('@/types/supabase').Post} dbCategory={post.categories} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB SHOWCASE ── */}
      <TabShowcase />

      {/* ── TESTIMONIALS (Elemento 8) ── */}
      <section className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal">
            <p className="label-uppercase mb-2 text-fc-gold">Comunidad</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
              Lo que dicen los ingenieros
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="reveal dataiku-card p-8 relative"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Quote marks */}
                <div className="absolute -top-6 -left-2 text-8xl text-surface-50 font-display font-black leading-none z-0">"</div>
                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-surface-700 text-base leading-relaxed mb-8 font-medium">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 text-base">{t.name}</p>
                      <p className="text-sm text-surface-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES — Dark Section ── */}
      <section className="section-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <p className="label-uppercase mb-2 text-fc-cyan">Categorías</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Explora por tema
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {dbCategories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/blog?cat=${cat.slug}`}
                className="reveal group flex flex-col items-center justify-center gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-none border border-white/10 hover:border-fc-cyan hover:bg-fc-cyan/10 transition-all duration-300 hover:scale-105"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{cat.emoji || '📝'}</span>
                <span className="text-sm font-bold text-surface-200 group-hover:text-fc-cyan transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-14 reveal">
          <div className="text-center max-w-3xl mx-auto">
            <p className="label-uppercase mb-3 text-fc-blue">Herramientas</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-surface-900 mb-6">
              Recursos para agilizar<br />tu trabajo diario
            </h2>
            <p className="text-surface-500 text-lg">
              Calculadoras online, plantillas profesionales y scripts automatizados.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool, i) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="reveal group p-6 dataiku-card h-full flex flex-col"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-surface-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-fc-cyan/10 group-hover:scale-110 transition-all duration-300 overflow-hidden p-2 border border-transparent group-hover:border-fc-cyan/20">
                <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-display font-bold text-surface-900 text-lg mb-2 group-hover:text-fc-blue transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ (Elemento 9) ── */}
      <section className="bg-surface-50 py-24 border-t border-surface-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal">
            <p className="label-uppercase mb-2 text-fc-blue">Preguntas</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
              ¿Tienes dudas?
            </h2>
          </div>
          <div className="space-y-4 reveal">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-dataiku-border hover:border-fc-cyan-light rounded-none overflow-hidden shadow-sm transition-colors dataiku-card"
              >
                <summary className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 cursor-pointer font-bold text-surface-900 group-hover:text-fc-blue transition-colors list-none select-none">
                  <span className="text-base md:text-lg">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center shrink-0 group-open:bg-fc-cyan/20 transition-colors">
                    <ChevronDown className="w-5 h-5 text-surface-500 group-open:text-fc-blue group-open:rotate-180 transition-all duration-300" />
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 text-surface-600 leading-relaxed pt-2">
                  <p className="opacity-0 translate-y-2 group-open:opacity-100 group-open:translate-y-0 transition-all duration-300 ease-out">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA DRAMÁTICO (Elemento 10) ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fc-navy-deep via-surface-900 to-surface-800 py-24 border-t-4 border-fc-gold">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-fc-cyan/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fc-gold/10 text-fc-gold text-xs font-bold rounded-full mb-8 backdrop-blur-sm border border-fc-gold/30">
            ÚNETE A +500 INGENIEROS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-brand font-black text-white mb-6 leading-tight">
            Aprende BIM antes de que<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light">
              se vuelva obligatorio
            </span>
          </h2>
          <p className="text-surface-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Recibe tutoriales prácticos, plantillas y novedades sobre automatización y estructuras en Perú directo a tu email. Sin spam, solo valor.
          </p>
          <div className="bg-dataiku-navy backdrop-blur-sm p-4 rounded-none border border-white/10 shadow-dataiku-hover">
            <Newsletter />
          </div>
          <p className="mt-6 text-surface-500 text-sm">
            Al suscribirte aceptas nuestra Política de Privacidad. Puedes desuscribirte cuando quieras.
          </p>
        </div>
      </section>
    </>
  );
}
