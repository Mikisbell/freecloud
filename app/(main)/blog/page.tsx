import { Metadata } from 'next';
import { Fragment } from 'react';
import { getPosts, getCategories } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import ClientGoogleAd from '@/components/ClientGoogleAd';
import BlogSearch from '@/components/BlogSearch';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Blog - Tutoriales BIM e Ingeniería Civil',
  description: 'Tutoriales de Revit, Dynamo, Python, Robot Structural, análisis estructural y normativa BIM en Perú.',
};

interface Props {
  searchParams: Promise<{ cat?: string; tag?: string; page?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { cat: categorySlug, page: pageStr, q: searchQuery } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || '1') || 1);
  const postsPerPage = 9;

  // Parallel fetch — evita waterfall de 2 round-trips seguidos a Supabase
  const [dbCategories, { posts: fetchedPosts, count: totalPosts }] = await Promise.all([
    getCategories(),
    getPosts({ category: categorySlug, page: currentPage, limit: postsPerPage, search: searchQuery }),
  ]);

  const activeCat = categorySlug ? dbCategories.find(c => c.slug === categorySlug) : null;

  const isFirstPage = currentPage === 1;
  const featuredPost = (isFirstPage && !categorySlug) ? fetchedPosts.find(p => p.featured) || fetchedPosts[0] : null;
  const posts = featuredPost ? fetchedPosts.filter(p => p.slug !== featuredPost.slug) : fetchedPosts;
  
  const totalPages = totalPosts ? Math.ceil(totalPosts / postsPerPage) : 1;

  return (
    <>
      {/* ── HERO ESTANDARIZADO 2026 ── */}
      <PageHeader
        badge={activeCat ? activeCat.name : 'BLOG B2B'}
        badgeEmoji={activeCat ? activeCat.emoji : '📖'}
        title={activeCat
          ? activeCat.name
          : <>De BIM a <span className="text-transparent bg-clip-text bg-gradient-to-r from-fc-cyan to-fc-cyan-light">Impacto</span></>
        }
        description={activeCat
          ? activeCat.description || `Todos los artículos sobre ${activeCat.name.toLowerCase()}`
          : 'Tutoriales, guías y recursos sobre BIM, ingeniería civil y tecnología para ingenieros en Perú y Latinoamérica.'
        }
      />

      {/* Category filters + Search */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 sm:px-6">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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

            {/* Search */}
            <BlogSearch />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search results info */}
        {searchQuery && (
          <div className="py-6">
            <p className="text-surface-600">
              {(totalPosts || 0) > 0
                ? `${totalPosts} resultado${(totalPosts || 0) !== 1 ? 's' : ''} para "${searchQuery}"`
                : `No se encontraron resultados para "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* No results */}
        {!featuredPost && posts.length === 0 && !searchQuery && (
          <div className="py-20 text-center">
            <span className="text-5xl mb-4 block">📭</span>
            <h2 className="text-xl font-display font-bold text-surface-900 mb-2">No hay artículos aún</h2>
            <p className="text-surface-500">Vuelve pronto para nuevo contenido.</p>
          </div>
        )}

        {/* No search results */}
        {searchQuery && posts.length === 0 && (
          <div className="py-20 text-center">
            <span className="text-5xl mb-4 block">🔍</span>
            <h2 className="text-xl font-display font-bold text-surface-900 mb-2">Sin resultados</h2>
            <p className="text-surface-500 mb-4">Intenta con otros términos de búsqueda.</p>
            <Link href="/blog" className="text-fc-blue hover:underline">Ver todos los artículos →</Link>
          </div>
        )}

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

                <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
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
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

                    {/* 
                      [BIM/IMPACT] Inyectamos In-Feed Ad cada 4 posts.
                      Se desactiva la inyección de UI (divs grises) si la cuenta de AdSense no está lista 
                      para evitar retrasar la aprobación de Google.
                    */}
                    {(index + 1) % 4 === 0 && process.env.NEXT_PUBLIC_ADSENSE_APPROVED === 'true' && (
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?${categorySlug ? `cat=${categorySlug}&` : ''}page=${currentPage - 1}`}
                    className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    ← Anterior
                  </Link>
                )}
                
                <div className="hidden sm:flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                      if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) => 
                      p === '...' ? (
                        <span key={`ell-${i}`} className="px-2 text-surface-400">…</span>
                      ) : (
                        <Link
                          key={p}
                          href={`/blog?${categorySlug ? `cat=${categorySlug}&` : ''}page=${p}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === p
                              ? 'bg-fc-blue text-white shadow-md shadow-fc-blue/20'
                              : 'bg-transparent text-surface-500 hover:bg-surface-100'
                          }`}
                        >
                          {p}
                        </Link>
                      )
                  )}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?${categorySlug ? `cat=${categorySlug}&` : ''}page=${currentPage + 1}`}
                    className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    Siguiente →
                  </Link>
                )}
              </div>
            )}
            
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

