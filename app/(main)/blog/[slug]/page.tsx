import { getPosts, getPostBySlug, getRelatedPosts } from '@/lib/supabase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Clock, Calendar, Tag, Share2, ArrowRight } from 'lucide-react';
import { generatePostMetadata, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';
import ShareButtons from '@/components/ShareButtons';
import YouTubeFacade from '@/components/YouTubeFacade';
import ClientGoogleAd from '@/components/ClientGoogleAd';
import TableOfContents from '@/components/TableOfContents';

export async function generateStaticParams() {
  const { posts } = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

const mdxComponents = {
  Callout: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) => {
    const styles = {
      info: 'bg-fc-blue/5 border-fc-cyan text-fc-navy-deep',
      warning: 'bg-amber-50 border-amber-400 text-amber-800',
      tip: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    };
    const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡' };
    return (
      <div className={`border-l-4 rounded-r-xl p-4 my-6 ${styles[type]}`}>
        <span className="mr-2">{icons[type]}</span>
        {children}
      </div>
    );
  },
  DownloadButton: ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-5 py-3 bg-fc-blue text-white font-semibold rounded-full hover:bg-fc-navy transition-colors my-4"
      target="_blank"
      rel="noopener"
    >
      ⬇️ {label}
    </a>
  ),
  // Facade pattern: solo carga el iframe al hacer click, mejora LCP y CLS
  YouTube: ({ id, title }: { id: string; title?: string }) => (
    <YouTubeFacade id={id} title={title} />
  ),
  InArticleAd: () => (
    <div className="my-10">
      <ClientGoogleAd
        adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || ''}
        adFormat="fluid"
        adLayout="in-article"
        reservedHeight={200}
      />
    </div>
  ),
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  // Here we map Supabase post format to legacy for SEO generation
  return generatePostMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    slug: post.slug,
    image: post.featured_image,
    date: post.published_at || post.created_at,
    author: post.author,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Lanzar getPostBySlug primero (necesario para todo lo demás)
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Ahora lanzar en paralelo los datos secundarios que no dependen entre sí
  const [relatedPosts] = await Promise.all([
    post.category_id
      ? getRelatedPosts(post.id, post.category_id, 3)
      : Promise.resolve([]),
  ]);

  const categoryConfig = post.categories;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';

  const breadcrumbs = [
    { name: 'Inicio', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      {/* Article Schema - passes full post for correct @id */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(post))
        }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }}
      />
      {/* FAQPage Schema - uses key_question + key_answer from post */}
      {post.key_question && post.key_answer && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema([
              { question: post.key_question, answer: post.key_answer }
            ]))
          }}
        />
      )}

      <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-fc-navy transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-fc-navy transition-colors">Blog</Link>
          <span>/</span>
          {categoryConfig && (
            <>
              <Link href={`/blog?cat=${categoryConfig.slug}`} className="hover:text-fc-navy transition-colors">
                {categoryConfig.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-surface-600 truncate">{post.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Main content */}
          <div>
            {/* Header */}
            <header className="mb-8">
              {categoryConfig && (
                <Link
                  href={`/blog?cat=${categoryConfig.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-4"
                  style={{
                    backgroundColor: `${categoryConfig.color || '#3b82f6'}15`,
                    color: categoryConfig.color || '#3b82f6',
                  }}
                >
                  {categoryConfig.emoji} {categoryConfig.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4 text-balance">
                {post.title}
              </h1>
              <p className="text-lg text-surface-500 mb-5">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-surface-400 pb-6 border-b border-surface-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.reading_time || 5} min
                </span>
                <span>Por {post.author}</span>
              </div>
            </header>

            {/* Post content */}
            <div className="prose-blog relative">
              <MDXRemote
                source={(() => {
                  let headCount = 0;
                  // Inyectamos ToC antes del primer H2, y AdSense antes de H2 pares
                  return (post.content || '').replace(/\n## /g, (match) => {
                    headCount++;
                    if (headCount === 1) {
                      return '\n\n<TableOfContents />\n\n## ';
                    }
                    if (headCount > 1 && headCount % 2 === 0) {
                      return '\n\n<InArticleAd />\n\n## ';
                    }
                    return match;
                  });
                })()}
                components={{
                  ...mdxComponents,
                  TableOfContents: () => <TableOfContents source={post.content || ''} />,
                }}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkMath],
                    rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeKatex],
                  },
                }}
              />
            </div>

            {/* CTA de Producto (Hotmart/Gato) — Se muestra si está configurado desde el editor */}
            {post.cta_product_url && (
              <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-fc-blue/5 border-2 border-emerald-200">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">🛠 Herramienta relacionada</p>
                <h3 className="text-lg font-bold text-surface-900 mb-2">
                  {post.cta_product_name || 'Descarga la herramienta'}
                </h3>
                <p className="text-sm text-surface-600 mb-4">
                  Automatiza lo que aprendiste en este artículo. Descarga la plantilla/herramienta lista para usar en tu próximo proyecto.
                </p>
                <a
                  href={post.cta_product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  👉 Descargar ahora
                  {post.cta_product_price && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {post.cta_product_price}
                    </span>
                  )}
                </a>
              </div>
            )}

            {/* Ad in article fallback al final del articulo si el contenido fue muy corto (0-1 titulos) */}
            <div className="mt-8 mb-4">
              <ClientGoogleAd
                adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || ''}
                adFormat="fluid"
                adLayout="in-article"
                reservedHeight={200}
              />
            </div>

            {/* Tags, Share & Author Bio */}
            <div className="mt-12 pt-8 border-t border-surface-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                {/* Tags */}
                {post.tags && post.tags.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-surface-400" />
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-surface-100 text-surface-600 text-xs font-semibold rounded-full hover:bg-fc-blue/5 hover:text-fc-navy transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                ) : <div />}

                {/* Share Buttons */}
                <ShareButtons url={`https://freecloud.pe/blog/${post.slug}`} title={post.title} />
              </div>

              {/* Author Bio */}
              <div className="bg-surface-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start mb-12 border border-surface-100">
                <Image
                  src="/me.png"
                  alt={post.author || 'Mateo'}
                  width={96}
                  height={96}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-md border-4 border-white"
                  priority={false}
                />
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-lg font-display font-bold text-surface-900 mb-1">
                    {post.author || "Mateo Code"}
                  </h3>
                  <p className="text-xs text-surface-500 mb-4 font-bold uppercase tracking-wider">
                    Ingeniero Civil & Desarrollador
                  </p>
                  <p className="text-surface-600 text-sm leading-relaxed mb-4 max-w-2xl">
                    Ayudo a ingenieros y empresas a optimizar sus procesos mediante tecnología, plantillas avanzadas y automatización BIM. Fundador de FreeCloud.pe.
                  </p>
                  <Link href="/sobre-mi" className="inline-flex items-center gap-2 text-fc-navy font-semibold text-sm hover:gap-3 transition-all">
                    Trabajemos juntos <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-6">
              <Newsletter />
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-14">
                <h2 className="text-xl font-display font-bold text-surface-900 mb-6">
                  Artículos relacionados
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedPosts.map(rp => (
                    <BlogCard key={rp.slug} post={{
                      title: rp.title,
                      slug: rp.slug,
                      description: rp.excerpt || '',
                      category: rp.categories?.slug || '',
                      date: rp.published_at || rp.created_at,
                      image: rp.featured_image,
                      readingTime: `${rp.reading_time || 5} min`,
                      featured: rp.featured,
                      // We map the category configs from Supabase just for BlogCard compatibility
                    } as Partial<import('@/types/supabase').Post>} dbCategory={rp.categories} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Author */}
            <div className="bg-surface-50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-surface-200">
                  <Image src="/me.png" alt={post.author || 'Autor'} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-display font-semibold text-surface-900 text-sm">{post.author}</p>
                  <p className="text-xs text-surface-500">Autor</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-surface-50 rounded-xl p-5">
              <h3 className="font-display font-semibold text-surface-900 text-sm mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Compartir
              </h3>
              <div className="flex gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 py-2 bg-[#0077b5] text-white text-xs font-medium rounded-lg text-center hover:opacity-90 transition-opacity"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 py-2 bg-[#1877f2] text-white text-xs font-medium rounded-lg text-center hover:opacity-90 transition-opacity"
                >
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + siteUrl + '/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 py-2 bg-[#25d366] text-white text-xs font-medium rounded-lg text-center hover:opacity-90 transition-opacity"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Sidebar Ad — slot configurado en NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR */}
            <div className="sticky top-20">
              <ClientGoogleAd
                adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ''}
                reservedHeight={600}
              />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
