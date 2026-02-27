import { Metadata } from 'next';
import { Fragment } from 'react';
import { getPosts, getCategories } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import ClientGoogleAd from '@/components/ClientGoogleAd';

export const metadata: Metadata = {
  title: 'Blog - Tutoriales BIM e Ingeniería Civil',
  description: 'Tutoriales de Revit, Dynamo, Python, Robot Structural, análisis estructural y normativa BIM en Perú.',
};

interface Props {
  searchParams: Promise<{ cat?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  "use cache";
  const { cat: categorySlug } = await searchParams;

  // Parallel fetch — evita waterfall de 2 round-trips seguidos a Supabase
  const [dbCategories, { posts: allPosts }] = await Promise.all([
    getCategories(),
    getPosts({ category: categorySlug }),
  ]);

  const activeCat = categorySlug ? dbCategories.find(c => c.slug === categorySlug) : null;

  const featuredPost = !categorySlug ? allPosts.find(p => p.featured) || allPosts[0] : null;
  const posts = featuredPost ? allPosts.filter(p => p.slug !== featuredPost.slug) : allPosts;

  return (
    <>
      {/* Hero header */}
      <section className="bg-gradient-to-b from-surface-50 to-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <p className="label-uppercase mb-4">
            {activeCat ? activeCat.emoji : '📖'} {activeCat ? activeCat.name : 'Blog'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-surface-900 mb-4 text-balance max-w-3xl mx-auto">
            {activeCat
              ? activeCat.name
              : <>De BIM a <span className="gradient-text">Impacto</span></>
            }
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            {activeCat
              ? activeCat.description || `Todos los artículos sobre ${activeCat.name.toLowerCase()}`
              : 'Tutoriales, guías y recursos sobre BIM, ingeniería civil y tecnología para ingenieros en Perú y Latinoamérica.'
            }
          </p>
        </div>
      </section>

      {/* Category filters */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <Link
              href="/blog"
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${!categorySlug
                ? 'bg-surface-900 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
            >
              Todos
            </Link>
            {dbCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/blog?cat=${cat.slug}`}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${categorySlug === cat.slug
                  ? 'bg-surface-900 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
              >
                {cat.emoji} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Featured post */}
        {featuredPost && (
          <section className="py-12 md:py-16">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-surface-100 card-hover">
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-surface-100 to-surface-50 overflow-hidden relative">
                  {featuredPost.featured_image ? (
                    <Image
                      src={featuredPost.featured_image}
                      alt={featuredPost.image_alt || featuredPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fc-cyan/10 to-fc-blue/20 flex items-center justify-center">
                      <span className="text-7xl opacity-40">
                        {featuredPost.categories?.emoji || '📝'}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-fc-gold text-white text-xs font-semibold rounded-full">
                      Destacado
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: `${featuredPost.categories?.color || '#64748b'}15`,
                        color: featuredPost.categories?.color || '#64748b',
                      }}
                    >
                      {featuredPost.categories?.emoji} {featuredPost.categories?.name}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-surface-900 mb-4 group-hover:text-fc-blue transition-colors text-balance">
                    {featuredPost.title}
                  </h2>
                  <p className="text-surface-500 mb-6 line-clamp-3 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-surface-400">
                      <span>{new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.reading_time || 5} min
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-fc-blue font-medium group-hover:gap-3 transition-all">
                      Leer <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Posts grid */}
        {posts.length > 0 ? (
          <section className={featuredPost ? 'pb-16' : 'py-12'}>
            {featuredPost && (
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-bold text-surface-900">
                  Artículos recientes
                </h2>
                <span className="text-sm text-surface-400">
                  {allPosts.length} artículo{allPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                const catConfig = post.categories;
                return (
                  <Fragment key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <article className="h-full flex flex-col">
                        <div className="aspect-[16/10] bg-surface-100 rounded-xl overflow-hidden relative mb-4">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.image_alt || post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
                              <span className="text-5xl opacity-30">
                                {catConfig?.emoji || '📝'}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="mb-2">
                          <span
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: catConfig?.color || '#64748b' }}
                          >
                            {catConfig?.emoji} {catConfig?.name}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-surface-900 text-lg mb-2 group-hover:text-fc-blue transition-colors line-clamp-2 text-balance flex-1">
                          {post.title}
                        </h3>

                        <p className="text-sm text-surface-400">
                          {new Date(post.published_at || post.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </article>
                    </Link>

                    {/* Inyectamos In-Feed Ad en la grilla después de cada 4 posts (o cada 5ta posición) */}
                    {(index + 1) % 4 === 0 && (
                      <div className="h-full min-h-[350px] bg-gradient-to-b from-surface-50 to-white rounded-xl border border-surface-100 overflow-hidden flex flex-col">
                        <div className="bg-surface-100 px-3 py-1.5 border-b border-surface-200">
                          <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest text-center">Espacio Patrocinado</p>
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center">
                          <ClientGoogleAd
                            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED || ''}
                            adFormat="fluid"
                            adLayoutKey="-69+dp-1a-bl+i7"
                            reservedHeight={300}
                          />
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>

            {/* In-feed Ads ya están integrados en el grid usando la Inyección Dinámica */}
          </section>
        ) : (
          <div className="text-center py-20">
            <p className="text-surface-400 text-lg mb-4">
              No hay artículos en esta categoría aún.
            </p>
            <Link href="/blog" className="text-fc-blue font-medium hover:underline">
              Ver todos los artículos
            </Link>
          </div>
        )}

        {/* Recommended section */}
        {!categorySlug && (
          <section className="py-16 border-t border-surface-100">
            <div className="text-center mb-10">
              <p className="label-uppercase mb-3">Explorar más</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                Recomendado para ti
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/recursos" className="group block p-6 bg-gradient-to-br from-fc-cyan/5 to-white border border-fc-cyan/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
                <span className="text-3xl mb-3 block">📦</span>
                <h3 className="font-display font-bold text-surface-900 mb-1 group-hover:text-fc-blue transition-colors">
                  Recursos y Plantillas
                </h3>
                <p className="text-sm text-surface-500 mb-3">
                  Plantillas Excel, scripts Python y familias Revit para tu día a día.
                </p>
                <span className="text-sm text-fc-blue font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorar <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/apps" className="group block p-6 bg-gradient-to-br from-surface-50 to-white border border-surface-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
                <span className="text-3xl mb-3 block">🧮</span>
                <h3 className="font-display font-bold text-surface-900 mb-1 group-hover:text-fc-blue transition-colors">
                  Web Apps Gratis
                </h3>
                <p className="text-sm text-surface-500 mb-3">
                  Calculadora sísmica E.030, predimensionamiento y más herramientas online.
                </p>
                <span className="text-sm text-fc-blue font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Usar ahora <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/sobre-mi" className="group block p-6 bg-gradient-to-br from-surface-50 to-white border border-surface-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
                <span className="text-3xl mb-3 block">👨‍💻</span>
                <h3 className="font-display font-bold text-surface-900 mb-1 group-hover:text-fc-blue transition-colors">
                  Sobre el Autor
                </h3>
                <p className="text-sm text-surface-500 mb-3">
                  Conoce a Miguel Angel Rivera — Ing. Civil & Sistemas, Huancayo.
                </p>
                <span className="text-sm text-fc-blue font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Conocer más <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </section>
        )}

        <section className="pb-16">
          <Newsletter />
        </section>
      </div>
    </>
  );
}
