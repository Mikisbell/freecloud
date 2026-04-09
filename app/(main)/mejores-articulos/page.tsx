import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { getPosts, getCategories } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Mejores Artículos por Categoría — Guía Curada',
  description: 'Los mejores artículos de FreeCloud organizados por categoría. Contenido curado para ingenieros civiles en Perú.',
};

const CATEGORY_ICONS: Record<string, string> = {
  'bim-peru': '🏗️',
  'analisis-estructural': '📐',
  'normativa': '📜',
  'revit': '🏢',
  'python': '🐍',
  'dynamo': '⚡',
  'excel': '📊',
  'civil-3d': '🛣️',
  'robot-structural': '🤖',
  'sap2000': '🏛️',
  'hp-prime': '🧮',
  'concreto-armado': '🧱',
};

export default async function BestPostsPage() {
  const [dbCategories, { posts: allPosts }] = await Promise.all([
    getCategories(),
    getPosts({ limit: 100 }),
  ]);

  // Group posts by category
  const postsByCategory: Record<string, typeof allPosts> = {};
  allPosts.forEach(post => {
    const catSlug = (post as any).categories?.slug || 'general';
    if (!postsByCategory[catSlug]) postsByCategory[catSlug] = [];
    postsByCategory[catSlug].push(post);
  });

  // Sort each category by reading time (longer = more comprehensive)
  Object.keys(postsByCategory).forEach(cat => {
    postsByCategory[cat].sort((a, b) => (b.reading_time || 0) - (a.reading_time || 0));
  });

  return (
    <>
      <PageHeader
        badge="LO MEJOR DEL BLOG"
        badgeEmoji="⭐"
        title={<>Los Artículos <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light block md:inline">Más Útiles</span></>}
        description="Contenido curado por categoría. Empieza por los más largos — son los que tienen más datos de proyectos reales."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-16 py-12">
          {dbCategories.map((cat) => {
            const catPosts = postsByCategory[cat.slug] || [];
            if (catPosts.length === 0) return null;

            const topPosts = catPosts.slice(0, 5);
            const icon = CATEGORY_ICONS[cat.slug] || '📄';

            return (
              <section key={cat.id} className="border-t border-surface-100 pt-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">{cat.name}</h2>
                    <p className="text-surface-500 text-sm">{cat.description}</p>
                  </div>
                  <div className="ml-auto">
                    <Link
                      href={`/blog?cat=${cat.slug}`}
                      className="text-sm text-fc-blue hover:underline flex items-center gap-1"
                    >
                      Ver todos ({catPosts.length})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topPosts.map((post, i) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white border border-surface-200 rounded-2xl p-6 hover:shadow-lg hover:border-fc-blue/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-fc-blue/10 text-fc-blue rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        {i === 0 && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                            <TrendingUp className="w-3 h-3" /> Recomendado
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-surface-900 mb-2 group-hover:text-fc-blue transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm text-surface-500 line-clamp-2 mb-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time || 5} min
                        </span>
                        <span>
                          {new Date(post.published_at || post.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <section className="py-16 mb-12">
          <div className="bg-surface-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
              <div className="w-96 h-96 bg-fc-blue/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-surface-300 text-lg max-w-2xl mx-auto mb-8">
                Publicamos contenido nuevo cada semana. Si no encuentras un tema específico, contáctame y lo cubro en el próximo artículo.
              </p>
              <Link
                href="/sobre-mi#contacto"
                className="inline-flex items-center gap-2 bg-fc-blue hover:bg-fc-navy text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-fc-blue/30"
              >
                Solicitar un Tema
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
