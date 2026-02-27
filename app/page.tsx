import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Monitor, Terminal, FileCheck, ShoppingCart, User, Github, Linkedin, Youtube } from 'lucide-react';
import { getPosts, getCategories } from '@/lib/supabase';
import Newsletter from '@/components/Newsletter';
import { generateFAQSchema, generateOrganizationSchema } from '@/lib/seo';

const SERVICES = [
  {
    title: 'Desarrollo Web a Medida',
    desc: 'Sistemas, aplicaciones web y dashboards personalizados para constructoras y estudios de ingeniería. Digitalizamos tus procesos.',
    icon: Monitor,
    href: '/contacto',
    features: ['React & Next.js', 'Bases de Datos', 'Dashboards interactivos']
  },
  {
    title: 'Automatización BIM',
    desc: 'Scripts y plugins para Revit. Automatizamos el modelado, extracción de datos y control de calidad estructural.',
    icon: Terminal,
    href: '/contacto',
    features: ['API de Revit (C#)', 'Python Scripts', 'Rutinas Dynamo']
  },
  {
    title: 'Consultoría BIM',
    desc: 'Implementación BIM bajo normativa peruana. Elaboración de Planes de Ejecución BIM (PEB) para licitaciones públicas.',
    icon: FileCheck,
    href: '/contacto',
    features: ['Normativa E.030/E.060', 'Estandarización', 'Capacitación']
  }
];

const PRODUCTS = [
  {
    tag: 'EXCEL INGENIERÍA',
    title: 'Plantilla Automática para Metrados de Obra (Norma Peruana)',
    price: '$15.00',
    desc: 'Formato oficial para expedientes técnicos. Fórmulas integradas y resúmenes automáticos por especialidad.',
    href: '#', // TODO: Enlace a Hotmart
  },
  {
    tag: 'SOFTWARE',
    title: 'Calculadora de Espectros Sísmicos E.030 2018',
    price: '$20.00',
    desc: 'Generador automático de espectros de pseudoaceleración, sismo de diseño y exportación a ETABS/SAP2000.',
    href: '#', // TODO: Enlace a Hotmart
  },
  {
    tag: 'REVIT',
    title: 'Template Estructural Completo + Familias Paramétricas',
    price: '$35.00',
    desc: 'Plantilla configurada con estándares peruanos. Vistas de acero, cuadros de planificación de zapatas y más.',
    href: '#', // TODO: Enlace a Hotmart
  }
];

export default async function HomePage() {
  const [postsRes, dbCategories] = await Promise.all([
    getPosts({ limit: 3 }), // Solo necesitamos 3 highlight posts
    getCategories()
  ]);

  const posts = postsRes.posts;
  const highlightPosts = posts.slice(0, 3); // 3 tarjetas destacadas

  // Mantenemos solo schema de Organización, quitamos FAQ schema del home ya que no hay FAQs aquí ahora.
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      {/* Organization Schema — authority building */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ── SECCIÓN 1: HERO (Claridad y Foco) ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fc-navy-deep via-fc-navy to-fc-blue">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-fc-cyan/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-fc-gold/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-36">
          <div className="max-w-3xl">
            {/* H1 masivo directo al valor */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand font-black text-white mb-6 leading-[1.05] text-balance animate-slide-up">
              Herramientas, tutoriales y desarrollo a medida para{' '}
              <span className="gradient-text">Ingenieros Civiles</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl animate-slide-up stagger-1 leading-relaxed">
              Elevamos la ingeniería en Perú mediante programación, automatización BIM y software personalizado.
            </p>

            {/* CTAs de negocio */}
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link href="/blog" className="btn-pill-primary text-base px-7 py-3.5 shadow-lg shadow-fc-blue/20 hover:shadow-fc-blue/40 transition-all">
                <BookOpen className="w-5 h-5 mr-2 inline-block" />
                Ver Recursos Gratuitos
              </Link>
              <Link
                href="/contacto"
                className="btn-pill bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-surface-900 text-base px-7 py-3.5"
              >
                Solicitar Cotización
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

      {/* ── SECCIÓN 2: SERVICIOS (Desarrollo B2B) ── */}
      <section className="bg-surface-50 py-24 border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal">
            <p className="label-uppercase mb-2 text-fc-blue">Soluciones B2B</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
              Desarrollo & Automatización a Medida
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((srv, i) => (
              <div key={i} className="bg-white border border-surface-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-fc-blue/10 text-fc-blue rounded-lg flex items-center justify-center mb-6">
                  <srv.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-surface-900 mb-3">{srv.title}</h3>
                <p className="text-surface-600 mb-6 text-sm leading-relaxed">{srv.desc}</p>
                <ul className="space-y-2 mb-8 border-t border-surface-100 pt-6">
                  {srv.features.map((feat, j) => (
                    <li key={j} className="flex items-center text-sm text-surface-700">
                      <div className="w-1.5 h-1.5 bg-fc-cyan rounded-full mr-3" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={srv.href} className="flex items-center justify-center w-full py-3 bg-surface-100 hover:bg-fc-blue hover:text-white transition-colors text-sm font-bold text-surface-900 uppercase tracking-widest rounded-lg">
                  Cotizar Proyecto
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: PRODUCTOS DIGITALES (Monetización) ── */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal">
            <p className="label-uppercase mb-2 text-fc-gold">Tienda</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
              Herramientas listas para usar
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((prod, i) => (
              <div key={i} className="group flex flex-col border border-surface-200 rounded-2xl overflow-hidden hover:border-fc-cyan transition-colors reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="bg-surface-50 p-6 border-b border-surface-100 flex flex-col justify-between items-start h-40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-fc-blue/5 rounded-full blur-2xl -mr-10 -mt-10" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-fc-blue bg-white px-2 py-1 rounded shadow-sm border border-surface-200 isolate">
                    {prod.tag}
                  </span>
                  <div className="mt-4">
                    <span className="text-2xl font-black font-brand text-surface-900 isolate relative">{prod.price}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <h3 className="font-bold text-lg mb-3 leading-tight">{prod.title}</h3>
                  <p className="text-sm text-surface-600 mb-6 flex-1 bg-white">{prod.desc}</p>
                  <Link href={prod.href} className="btn-pill-primary w-full justify-center mt-auto">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Comprar Ahora
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: BLOG / CONTENIDO ── */}
      {highlightPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t border-surface-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 reveal">
            <div>
              <p className="label-uppercase mb-2 text-fc-cyan">Contenido Gratis</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900">
                Últimos Artículos
              </h2>
            </div>
            <Link href="/blog" className="text-sm text-fc-blue font-bold hover:underline mb-1 inline-flex items-center">
              Ver todo el blog <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
            {highlightPosts.map((post, i) => {
              const isMid = i === 1;
              return (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group relative flex flex-col justify-end p-5 min-h-[160px] overflow-hidden transition-all duration-300 ${isMid ? 'bg-[#3fb8d1] hover:brightness-105' : 'bg-[#292c3a] hover:brightness-110'
                    }`}
                >
                  {/* Decoración geométrica muy sutil en fondo */}
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none transform translate-x-1/3 -translate-y-1/3 rotate-12 ${isMid ? 'opacity-10' : ''}`}>
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-white"><polygon points="50,0 100,100 0,100" /></svg>
                  </div>

                  {/* Contenido principal */}
                  <div className="relative z-10 w-full">
                    {/* Título - Regular font, no bold */}
                    <h3 className={`font-brand text-white text-base leading-[1.3] mb-4 font-normal ${isMid ? 'text-[#0a1e35]' : ''}`}>
                      {post.title}
                    </h3>

                    {/* CTA con flecha Dataiku-style */}
                    <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-200 mt-auto ${isMid ? 'text-[#0a1e35]' : 'text-white'
                      }`}>
                      {/* Icono flecha "L" girada */}
                      <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                      {isMid ? 'LEER ARTÍCULO' : 'LEER ARTÍCULO'}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SECCIÓN 5: SOBRE MÍ (Credibilidad E-E-A-T Real) ── */}
      <section className="bg-dataiku-navy py-24 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 rounded-full border-4 border-white/10 overflow-hidden bg-fc-navy-deep flex items-center justify-center">
            {/* Fallback avatar si no hay imagen de autor aún */}
            <User className="w-12 h-12 text-white/50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Detrás de FreeCloud
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ingeniero Civil y Desarrollador de Software. Combino +5 años de experiencia estructural con programación avanzada para automatizar procesos y construir soluciones BIM a medida.
          </p>

          <div className="flex justify-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5 text-white" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: NEWSLETTER SIMPLIFICADO ── */}
      <section className="bg-surface-50 py-24">
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center reveal">
          <div className="w-16 h-16 bg-fc-cyan/20 text-fc-cyan rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">
            Tutoriales y recursos en tu bandeja
          </h2>
          <p className="text-surface-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Recibe contenido sobre automatización BIM, normativas peruanas y desarrollo de software para ingeniería. Sin spam.
          </p>
          <div className="bg-white p-2 rounded border border-surface-200 shadow-sm max-w-md mx-auto">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
