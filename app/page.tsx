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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-white to-brand-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
              BIM obligatorio en Perú desde agosto 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-surface-900 mb-6 animate-slide-up text-balance">
              BIM, Ingeniería Civil y{' '}
              <span className="gradient-text">Tecnología</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-600 mb-8 max-w-2xl animate-slide-up stagger-1">
              Tutoriales de Revit, Dynamo, Python, Robot Structural y más.
              Plantillas, herramientas y recursos para ingenieros en Perú y Latinoamérica.
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up stagger-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
              >
                <BookOpen className="w-5 h-5" />
                Ver Tutoriales
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-surface-700 font-semibold rounded-xl border border-surface-200 hover:border-brand-300 hover:text-brand-600 transition-all"
              >
                <Download className="w-5 h-5" />
                Recursos Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
          <BlogCard post={featuredPost} featured />
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-surface-900">
              Últimos artículos
            </h2>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm text-brand-600 font-medium hover:gap-2 transition-all"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-surface-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-8 text-center">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/blog?cat=${key}`}
                className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-surface-100 hover:border-brand-300 hover:shadow-md transition-all"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium text-surface-700 group-hover:text-brand-600 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-display font-bold text-surface-900 mb-2 text-center">
          Herramientas y Recursos
        </h2>
        <p className="text-surface-500 text-center mb-8 max-w-xl mx-auto">
          Calculadoras online, plantillas y scripts para agilizar tu trabajo diario
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-5 bg-white border border-surface-100 rounded-xl hover:border-brand-300 hover:shadow-lg transition-all card-hover"
            >
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
                <tool.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-surface-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <Newsletter />
      </section>
    </>
  );
}
