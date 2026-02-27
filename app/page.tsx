import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Settings, BookOpen, ArrowRight, Github, Linkedin, Youtube } from 'lucide-react';
import { getPosts } from '@/lib/supabase';
import { generateOrganizationSchema } from '@/lib/seo';
import Newsletter from '@/components/Newsletter';

const SERVICES = [
  {
    title: 'Desarrollo Web a Medida',
    desc: 'Aplicaciones web, dashboards y sistemas de gestión para constructoras y consultoras. Next.js, React, bases de datos, APIs.',
    icon: Monitor,
    href: '/sobre-mi#contacto',
  },
  {
    title: 'Automatización BIM',
    desc: 'Scripts para Revit API, flujos Dynamo y programas Python que eliminan trabajo repetitivo en modelado, metrados y documentación.',
    icon: Settings,
    href: '/sobre-mi#contacto',
  },
  {
    title: 'Consultoría y Capacitación BIM',
    desc: 'Plan de Ejecución BIM (PEB), capacitación de equipos técnicos y preparación para licitaciones públicas bajo Ley 32069.',
    icon: BookOpen,
    href: '/sobre-mi#contacto',
  }
];

const PRODUCTS = [
  {
    tag: 'Excel',
    tagColor: 'bg-green-100 text-green-800',
    title: 'Plantilla Diseño Sísmico E.030',
    price: '$7 USD',
    desc: 'Cortante basal, distribución por pisos y derivas. Fórmulas automáticas según norma vigente.',
    href: '#', // TODO: URL_HOTMART_E030
    image: '/productos/cover-plantilla-e030.png'
  },
  {
    tag: 'Excel',
    tagColor: 'bg-green-100 text-green-800',
    title: 'Plantilla Metrados de Obra',
    price: '$5 USD',
    desc: 'Concreto, acero y encofrado con fórmulas automáticas por elemento estructural.',
    href: '#', // TODO: URL_HOTMART_METRADOS
    image: '/productos/cover-plantilla-metrados.png'
  },
  {
    tag: 'HP Prime',
    tagColor: 'bg-blue-100 text-blue-800',
    title: 'Hardy Cross — Análisis Estructural',
    price: '$10 USD',
    desc: 'Programa completo para análisis de pórticos. Código listo para copiar a tu calculadora.',
    href: '#', // TODO: URL_HOTMART_HARDYCROSS
    image: '/productos/cover-hardy-cross-hp-prime.png'
  }
];

const SKILLS = [
  'Revit', 'Python', 'Robot Structural', 'Dynamo', 'TypeScript',
  'Next.js', 'E.030', 'E.060', 'Civil 3D', 'ETABS', 'Supabase', 'n8n'
];

export default async function HomePage() {
  const postsRes = await getPosts({ limit: 3 });
  const recentPosts = postsRes.posts;
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 to-[#1A3C6D] flex items-center min-h-[70vh] max-h-[85vh] py-20 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Herramientas, tutoriales y desarrollo a medida para{' '}
              <span className="text-[#38BDF8]">Ingenieros Civiles</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Programación, automatización BIM y software a medida para ingenieros civiles en Perú.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ver Recursos Gratuitos
              </Link>
              <Link
                href="/sobre-mi#contacto"
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SERVICIOS ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
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
      </section>

      {/* ── 3. PRODUCTOS DIGITALES ── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
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
                {/* Fallback pattern if image is missing, utilizing the tag color logic visually */}
                <div className="w-full h-48 bg-gray-100 relative border-b border-gray-100 overflow-hidden flex items-center justify-center">
                  {/* Using next/image for production, fallback style strictly for visual preview if missing */}
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay text in case image 404s locally, invisible normally */}
                  <span className="text-gray-300 font-bold tracking-widest uppercase opacity-20 text-3xl z-0">{prod.tag}</span>
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 z-10" />
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
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {prod.price}
                  </div>
                  <Link
                    href={prod.href}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block mt-auto"
                  >
                    Próximamente
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BLOG ── */}
      {recentPosts.length > 0 && (
        <section className="bg-white py-20 px-6 border-y border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
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
                  <p className="text-sm text-gray-500 mt-auto">
                    {new Date(post.created_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {post.reading_time && ` · ${post.reading_time} min`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. SOBRE MÍ ── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-blue-600/5 rounded-2xl transform rotate-3 scale-105 -z-10" />
              <Image
                src="/me.png"
                alt="Miguel Angel Rivera"
                width={500}
                height={500}
                className="rounded-2xl shadow-lg w-full max-w-md mx-auto object-cover aspect-square md:aspect-auto"
              />
            </div>

            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
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
      </section>

      {/* ── 6. NEWSLETTER ── */}
      <section className="bg-blue-900 py-20 px-6 text-center">
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
      </section>

    </>
  );
}
