import { getPosts, getPostBySlug, getRelatedPosts } from '@/lib/supabase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { generatePostMetadata, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';
import { AdInArticle, AdSidebar, AdBanner } from '@/components/AdSense';

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
      info: 'bg-teal-50 border-teal-400 text-teal-800',
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
      className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-colors my-4"
      target="_blank"
      rel="noopener"
    >
      ⬇️ {label}
    </a>
  ),
  YouTube: ({ id }: { id: string }) => (
    <div className="video-container flex justify-center my-6">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full max-w-3xl aspect-video rounded-xl shadow-lg border border-surface-200"
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
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = post.category_id ? await getRelatedPosts(post.id, post.category_id, 3) : [];
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
          <Link href="/" className="hover:text-teal-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
          <span>/</span>
          {categoryConfig && (
            <>
              <Link href={`/blog?cat=${categoryConfig.slug}`} className="hover:text-teal-600 transition-colors">
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
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-surface-100">
                <Tag className="w-4 h-4 text-surface-400" />
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
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
                    } as any} dbCategory={rp.categories} />
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
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  MR
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

            {/* Sidebar Ad */}
            <div className="sticky top-20">
              <AdSidebar slot="XXXXXXXXXX" />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
