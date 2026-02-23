export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { getPostBySlug, getAllPosts, getRelatedPosts, CATEGORIES } from '@/lib/blog';
import { generatePostMetadata, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';
import { AdInArticle } from '@/components/AdSense';

interface Props {
  params: Promise<{ slug: string }>;
}

const mdxComponents = {
  Callout: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) => {
    const styles = {
      info: 'bg-brand-50 border-brand-400 text-brand-800',
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
      className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors my-4"
      target="_blank"
      rel="noopener"
    >
      ⬇️ {label}
    </a>
  ),
  YouTube: ({ id }: { id: string }) => (
    <div className="video-container">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  ),
};
// ...existing imports eliminados...
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);
  const categoryConfig = CATEGORIES[post.category as keyof typeof CATEGORIES];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';

  const breadcrumbs = [
    { name: 'Inicio', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-surface-400 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-600 transition-colors">Blog</Link>
          <span>/</span>
          {categoryConfig && (
            <>
              <Link href={`/blog?cat=${post.category}`} className="hover:text-brand-600 transition-colors">
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
                  href={`/blog?cat=${post.category}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-4"
                  style={{
                    backgroundColor: `${categoryConfig.color}15`,
                    color: categoryConfig.color,
                  }}
                >
                  {categoryConfig.icon} {categoryConfig.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4 text-balance">
                {post.title}
              </h1>
              <p className="text-lg text-surface-500 mb-5">
                {post.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-surface-400 pb-6 border-b border-surface-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </span>
                <span>Por {post.author}</span>
              </div>
            </header>

            {/* YouTube video if exists */}
            {post.youtubeId && (
              <div className="mb-8">
                <div className="video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${post.youtubeId}`}
                    title={post.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Post content */}
            <div className="prose-blog">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, rehypeHighlight],
                  },
                }}
              />
            </div>

            {/* Ad in article */}
            <AdInArticle slot="XXXXXXXXXX" />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-surface-100">
                <Tag className="w-4 h-4 text-surface-400" />
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Related product CTA */}
            {post.relatedProduct && (
              <div className="mt-8 p-6 bg-gradient-to-r from-accent-50 to-accent-100/50 border border-accent-200 rounded-2xl">
                <h3 className="font-display font-bold text-surface-900 mb-2">
                  📦 Recurso relacionado
                </h3>
                <p className="text-surface-600 text-sm mb-3">{post.relatedProduct}</p>
                <a
                  href={post.relatedProductUrl || '/recursos'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white font-semibold text-sm rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Descargar recurso
                </a>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="mt-10">
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
                    <BlogCard key={rp.slug} post={rp} />
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
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  MR
                </div>
                <div>
                  <p className="font-display font-semibold text-surface-900 text-sm">Miguel Angel Rivera</p>
                  <p className="text-xs text-surface-500">Ing. Civil &amp; Sistemas</p>
                </div>
              </div>
              <p className="text-xs text-surface-500">
                Ingeniero civil y de sistemas. Especialista en BIM, desarrollo de software y análisis estructural.
              </p>
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

            {/* Sidebar Ad */}
            <div className="sticky top-20">
              <AdInArticle slot="XXXXXXXXXX" />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

