import Link from 'next/link';
import { ArrowRight, BookOpen, Download, Calculator, Code, Cpu, FileSpreadsheet } from 'lucide-react';
import { getAllPosts, CATEGORIES } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';

const TOOLS = [
  { name: 'Calculadora Sísmica E.030', href: '/apps/calculadora-sismica', icon: Calculator, desc: 'Calcula fuerza cortante basal según norma peruana' },
  { name: 'Plantillas Excel', href: '/recursos?type=excel', icon: FileSpreadsheet, desc: 'Diseño sísmico, metrados y predimensionamiento' },
  { name: 'Scripts Python + Revit', href: '/recursos?type=python', icon: Code, desc: 'Automatiza tareas repetitivas en BIM' },
  { name: 'Programas HP Prime', href: '/recursos?type=hp-prime', icon: Cpu, desc: 'Hardy Cross, análisis estructural y más' },
];

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const recentPosts = posts.filter(p => p.slug !== featuredPost?.slug).slice(0, 6);

  return (
    <>
      {/* Hero — Dark with teal glow */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-950 via-surface-900 to-teal-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-teal-400/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold rounded-full mb-6 backdrop-blur-sm animate-fade-in">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              BIM OBLIGATORIO EN PERÚ DESDE AGOSTO 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-slide-up text-balance">
              BIM, Ingeniería Civil y{' '}
              <span className="gradient-text">Tecnología</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl animate-slide-up stagger-1">
              Tutoriales de Revit, Dynamo, Python, Robot Structural y más.
              Plantillas, herramientas y recursos para ingenieros en Perú y Latinoamérica.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link href="/blog" className="btn-pill-primary">
                <BookOpen className="w-5 h-5" />
                Ver Tutoriales
              </Link>
              <Link
                href="/recursos"
                className="btn-pill bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-surface-900"
              >
                <Download className="w-5 h-5" />
                Recursos Gratis
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-16">
            <path d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="reveal">
            <BlogCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10 reveal">
            <div>
              <p className="label-uppercase mb-2">Blog</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                Últimos artículos
              </h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm text-teal-600 font-medium hover:gap-2 transition-all"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, i) => (
              <div key={post.slug} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories — Dark Section */}
      <section className="section-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 reveal">
            <p className="label-uppercase mb-2">Categorías</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Explora por tema
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(CATEGORIES).map(([key, cat], i) => (
              <Link
                key={key}
                href={`/blog?cat=${key}`}
                className="reveal group flex flex-col items-center gap-3 p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all duration-200"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-surface-300 group-hover:text-teal-400 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10 reveal">
          <p className="label-uppercase mb-2">Herramientas</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mb-2">
            Herramientas y Recursos
          </h2>
          <p className="text-surface-500 max-w-xl mx-auto">
            Calculadoras online, plantillas y scripts para agilizar tu trabajo diario
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="reveal group p-5 bg-white border border-surface-100 rounded-xl hover:border-teal-400 hover:shadow-lg transition-all card-hover"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                <tool.icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-display font-semibold text-surface-900 mb-1 group-hover:text-teal-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-surface-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <div className="reveal">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
