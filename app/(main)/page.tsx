import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Monitor, Settings, BookOpen, ArrowRight, Github, Linkedin, Youtube } from 'lucide-react';
import { getPosts } from '@/lib/supabase';
import { generateOrganizationSchema, generateWebsiteSchema, generateFAQSchema } from '@/lib/seo';
import HeroCountdown from '@/components/HeroCountdown';
import HeroBackground from '@/components/HeroBackground';
import Newsletter from '@/components/Newsletter';
import { getHomepageProducts } from '@/config/products';

export const metadata: Metadata = {
  title: 'FreeCloud - BIM, Ingenieria Civil y Tecnologia | Peru',
  description: 'Tutoriales, herramientas y recursos BIM para ingenieros civiles en Peru. Revit, Python, Dynamo, normativa E.030 y preparacion para la Ley 32069 (BIM obligatorio 2026).',
  openGraph: {
    title: 'FreeCloud - BIM, Ingenieria Civil y Tecnologia',
    description: 'Desarrollo de software, automatizacion BIM y recursos tecnicos para ingenieros y empresas de construccion en Peru.',
  },
};

const SERVICES = [
  {
    title: 'Desarrollo Web a Medida',
    desc: 'Aplicaciones web, dashboards y sistemas de gestion para constructoras y consultoras. Next.js, React, bases de datos, APIs.',
    icon: Monitor,
    href: '/sobre-mi#contacto',
  },
  {
    title: 'Automatizacion BIM',
    desc: 'Scripts para Revit API, flujos Dynamo y programas Python que eliminan trabajo repetitivo en modelado, metrados y documentacion.',
    icon: Settings,
    href: '/sobre-mi#contacto',
  },
  {
    title: 'Consultoria y Capacitacion BIM',
    desc: 'Plan de Ejecucion BIM (PEB), capacitacion de equipos tecnicos y preparacion para licitaciones publicas bajo Ley 32069.',
    icon: BookOpen,
    href: '/sobre-mi#contacto',
  }
];

const PRODUCTS = getHomepageProducts(3);

const SKILLS = [
  'Revit', 'Python', 'Robot Structural', 'Dynamo', 'TypeScript',
  'Next.js', 'E.030', 'E.060', 'Civil 3D', 'ETABS', 'Supabase', 'n8n'
];

const A_TECH = [
  { name: 'Revit', icon: '🏗️' },
  { name: 'Dynamo', icon: '⚡' },
  { name: 'Python', icon: '🐍' },
  { name: 'ETABS', icon: '🏢' },
  { name: 'Robot Structural', icon: '🔧' },
  { name: 'AutoCAD', icon: '📐' },
  { name: 'Civil 3D', icon: '🛤️' },
  { name: 'Navisworks', icon: '🔍' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'Excel VBA', icon: '📊' }
];

export default async function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const webSchema = generateWebsiteSchema();
  const faqSchema = generateFAQSchema([
    {
      question: '¿Qué es BIM y por qué es obligatorio en Perú desde 2026?',
      answer: 'BIM (Building Information Modeling) es una metodología de trabajo colaborativo que usa modelos digitales 3D inteligentes para planificar, diseñar y construir proyectos. En Perú, la Ley 32069 establece su obligatoriedad progresiva desde agosto de 2026, comenzando con proyectos de inversión pública mayores a 5 millones de soles.',
    },
    {
      question: '¿Qué herramientas BIM debo aprender para cumplir con la Ley 32069?',
      answer: 'Las herramientas más demandadas en el mercado peruano son Autodesk Revit (modelado arquitectónico y estructural), Navisworks (coordinación y detección de interferencias), Robot Structural Analysis (cálculo estructural) y Dynamo (automatización con scripts). Python también es fundamental para workfows avanzados con la API de Revit.',
    },
    {
      question: '¿Cómo es el Plan BIM Perú y cuáles son sus fases?',
      answer: 'El Plan BIM Perú, impulsado por el Decreto Supremo 289-2019-EF y la Ley 32069, se implementa en fases progresivas. Fase 1 (hasta 2024): proyectos piloto del Estado. Fase 2 (2024-2026): proyectos de inversión pública grandes. Fase 3 (desde agosto 2026): obligatoriedad generalizada para proyectos de inversión pública.',
    },
    {
      question: '¿Cuánto cuesta aprender Revit en Perú?',
      answer: 'Los cursos presenciales de Revit en Lima cuestan entre S/800 y S/2,500. FreeCloud ofrece tutoriales gratuitos con ejercicios descargables y plantillas, además de scripts de automatización con Dynamo en nuestra sección de Recursos.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── 1. HERO ── */}
      <section className="relative w-full flex flex-col items-center text-center overflow-hidden"
        style={{
          backgroundColor: '#0a1628',
          padding: 'clamp(60px, 10vw, 80px) 24px clamp(40px, 8vw, 48px)',
          minHeight: 'min(70vh, 620px)',
        }}
      >
        {/* Background Gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(6,182,212,0.06) 0%, transparent 50%)
            `
          }}
        />

        {/* Canvas Animation - Edificio Wireframe + Matrix Rain */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroBackground />
        </div>

        {/* Protection Layer / Gradient Oscuro central */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: 'radial-gradient(circle at center, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.4) 45%, transparent 75%)'
          }}
        />

        <div className="relative z-10 w-full max-w-[740px] mx-auto flex flex-col items-center">
          {/* Elemento 1 — Badge countdown */}
          <div className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <HeroCountdown />
          </div>

          {/* Elemento 2 — H1 */}
          <h1
            className="mt-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] animate-fade-in-up flex flex-col items-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              animationDelay: '0.15s',
              animationFillMode: 'both'
            }}
          >
            <span className="text-white">Tecnología para</span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
            >
              Ingeniería Civil
            </span>
          </h1>

          {/* Elemento 3 — Subtítulo */}
          <p
            className="mt-[16px] max-w-[620px] font-normal leading-[1.6] animate-fade-in-up text-slate-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              animationDelay: '0.3s',
              animationFillMode: 'both'
            }}
          >
            Desarrollo de software a medida, automatización BIM y recursos técnicos para ingenieros y empresas de construcción en Perú.
          </p>

          {/* Elemento 4 — Botones */}
          <div
            className="mt-[36px] flex flex-col sm:flex-row justify-center gap-[14px] w-full max-w-[320px] sm:max-w-none animate-fade-in-up"
            style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
          >
            <Link
              href="/blog"
              className="group flex justify-center items-center rounded-[10px] w-full sm:w-auto transition-all bg-white text-[#0a1628] font-bold text-[15px] px-[30px] py-[14px] hover:bg-[#f0f4ff] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            >
              Explorar Tutoriales <span className="ml-1 text-[18px] transition-transform group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/sobre-mi#contacto"
              className="flex justify-center items-center rounded-[10px] w-full sm:w-auto transition-all font-semibold text-[15px] px-[30px] py-[14px] bg-transparent text-white/70 border border-white/15 hover:border-white/35 hover:text-white hover:bg-white/5"
            >
              Solicitar Cotización
            </Link>
          </div>


        </div>
      </section >

      {/* ── 2. CARRUSEL DE TECNOLOGÍAS ── */}
      <section className="bg-white py-7 overflow-hidden border-t border-gray-200">
        <div className="text-center mb-[20px]">
          <span
            className="font-semibold uppercase text-[11px] tracking-[0.12em] text-slate-400"
          >
            Tecnologías que domino
          </span>
        </div>

        <div className="relative w-full overflow-hidden flex group">
          {/* Fades */}
          <div className="absolute top-0 bottom-0 left-0 w-[60px] sm:w-[120px] z-10" style={{ background: 'linear-gradient(90deg, #fff 0%, transparent 100%)' }}></div>
          <div className="absolute top-0 bottom-0 right-0 w-[60px] sm:w-[120px] z-10" style={{ background: 'linear-gradient(270deg, #fff 0%, transparent 100%)' }}></div>

          {/* Track */}
          <div className="flex w-max animate-scroll-logos group-hover:[animation-play-state:paused] gap-[32px] sm:gap-[48px] px-[16px] sm:px-[24px]">
            {/* Duplicated for loop */}
            {[...A_TECH, ...A_TECH].map((tech, i) => (
              <div key={i} className="flex items-center gap-[10px] shrink-0 opacity-45 hover:opacity-100 transition-opacity duration-300">
                <div className="w-[32px] h-[32px] bg-[#f1f5f9] rounded-[8px] flex items-center justify-center text-lg">
                  {tech.icon}
                </div>
                <span className="text-[14px] font-semibold text-[#1e293b] whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ── 2. SERVICIOS ── */}
      < section className="bg-white py-20 px-6" >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">
              Servicios
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Qué podemos hacer por tu empresa?
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Combinamos ingeniería civil y desarrollo de software para resolver problemas reales del sector construcción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((srv, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col">
                <srv.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{srv.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {srv.desc}
                </p>
                <Link href={srv.href} className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center mt-auto">
                  Solicitar cotización <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ── 3. PRODUCTOS DIGITALES ── */}
      < section className="bg-gray-50 py-20 px-6" >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">
              Productos
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Herramientas listas para usar
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Plantillas profesionales y programas probados en proyectos reales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((prod, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col group">
                {/* Placeholder de imagen — reemplazar con imagen real cuando exista */}
                <div
                  className="w-full h-48 relative border-b border-gray-100 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${prod.tagBg}18 0%, ${prod.tagBg}30 100%)` }}
                >
                  <div className="text-center">
                    <span className="text-5xl font-black tracking-tighter opacity-20" style={{ color: prod.tagBg }}>
                      {prod.tag}
                    </span>
                    <p className="text-xs opacity-40 mt-1 font-medium" style={{ color: prod.tagBg }}>Imagen próximamente</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 relative z-20 bg-white">
                  <span className={`self-start text-xs font-semibold px-2 py-1 rounded mb-3 ${prod.tagColor}`}>
                    {prod.tag}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                    {prod.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {prod.desc}
                  </p>
                  <div className="text-2xl font-bold text-blue-700 mb-4">
                    {prod.priceDisplay}
                  </div>
                  <a
                    href={prod.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block mt-auto ${prod.isGumroad ? 'gumroad-button' : ''}`}
                    {...(prod.isGumroad ? { 'data-gumroad-overlay-checkout': 'true' } : {})}
                  >
                    Comprar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ── 4. BLOG ── */}
      < Suspense fallback={
        < section className="bg-white py-20 px-6 border-y border-gray-100" >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="animate-pulse">
                <div className="h-4 w-16 bg-blue-100 rounded mb-4"></div>
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4 animate-pulse">
                  <div className="w-full h-48 md:h-44 rounded-xl bg-gray-200"></div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/3 bg-gray-100 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section >
      }>
        <RecentBlogPosts />
      </Suspense >

      {/* ── 5. SOBRE MÍ ── */}
      < section className="bg-gray-50 py-20 px-6" >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-blue-600/5 rounded-2xl transform rotate-3 scale-105 -z-10" />
              <Image
                src="/me.png"
                alt="Miguel Angel Rivera"
                width={500}
                height={500}
                priority={false}
                className="rounded-2xl shadow-lg w-full max-w-md mx-auto object-cover aspect-square md:aspect-auto"
              />
            </div>

            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">
                Sobre Mí
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Miguel Angel Rivera
              </h2>
              <p className="text-lg text-gray-600 mb-6 font-medium">
                Ingeniero Civil · Ingeniero de Sistemas · Huancayo, Perú
              </p>

              <p className="text-gray-600 leading-relaxed mb-6">
                Fundador de FreeCloud y Rivamez. 10 años desarrollando software,
                5 años en diseño estructural. Trabajo en la intersección de tecnología
                y construcción — creando herramientas, contenido técnico y soluciones
                a medida para ingenieros civiles en Perú.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {SKILLS.map(skill => (
                  <span key={skill} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 items-center mb-8">
                <a href="https://youtube.com/@mikisbell" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="https://github.com/mikisbell" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="GitHub">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com/in/mikisbell" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>

              <Link href="/sobre-mi#contacto" className="text-blue-600 font-semibold hover:underline inline-flex items-center group">
                Trabajemos juntos <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section >

      {/* ── 6. NEWSLETTER ── */}
      < section className="bg-blue-900 py-20 px-6 text-center" >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Tutoriales y herramientas BIM cada semana
          </h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto text-lg">
            Recibe contenido técnico, plantillas y novedades de normativa peruana directo en tu email.
          </p>

          <div className="max-w-md mx-auto">
            {/* Componente Newsletter con styling customizado a la directiva The Newsletter is an existing component but we apply styling inside it or wrap it. */}
            <div className="newsletter-clean-override">
              <Newsletter variant="inline" />
            </div>
            <p className="text-xs text-blue-300 mt-4 opacity-80">
              Sin spam. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </section >

    </>
  );
}

// Server Component for the Blog Section to isolate data fetching and enable Suspense/PPR
async function RecentBlogPosts() {
  const postsRes = await getPosts({ limit: 3 });
  const recentPosts = postsRes.posts;

  if (recentPosts.length === 0) return null;

  return (
    <section className="bg-white py-20 px-6 border-y border-gray-100 min-h-[450px]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">
              Blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Últimos Artículos
            </h2>
          </div>
          <Link href="/blog" className="text-blue-600 font-semibold hover:underline flex items-center mb-1">
            Ver todos los artículos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col">
              <div className="relative w-full h-48 md:h-44 rounded-xl overflow-hidden mb-4 bg-gray-100">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-blue-200" />
                  </div>
                )}
                {post.categories && (
                  <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-xs font-semibold px-2 py-1 rounded shadow-sm">
                    {post.categories.emoji && <span className="mr-1">{post.categories.emoji}</span>}
                    {post.categories.name}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {post.meta_title || post.title}
              </h3>
              <p className="text-sm text-gray-600 mt-auto">
                {new Date(post.created_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                {post.reading_time && ` · ${post.reading_time} min`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
