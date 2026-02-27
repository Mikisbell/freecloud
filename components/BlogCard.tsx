import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { Category } from '@/types/supabase';
import { Post } from '@/types/supabase';

interface BlogCardProps {
  post: Partial<Post>;
  featured?: boolean;
  dbCategory?: Category | null;
}

export default function BlogCard({ post, featured = false, dbCategory }: BlogCardProps) {
  const categoryName = dbCategory?.name || post.category || 'Categoría';
  const categoryIcon = dbCategory?.emoji || '📝';
  const categoryColor = dbCategory?.color || '#64748b';

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative bg-gradient-to-br from-fc-navy to-fc-blue rounded-2xl overflow-hidden card-hover">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/25">
                {categoryIcon} {categoryName}
              </span>
              <span className="text-white/90 text-xs">
                ⭐ Destacado
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-fc-cyan/20 transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-surface-300 mb-6 line-clamp-2 max-w-2xl">
              {post.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-surface-400">
                <time className="flex items-center gap-1.5" dateTime={post.date || post.published_at || post.created_at || new Date().toISOString()}>
                  {new Intl.DateTimeFormat('es-PE', { month: 'short', day: 'numeric' }).format(new Date(post.date || post.published_at || post.created_at || new Date().toISOString()))}
                </time>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm text-white font-semibold group-hover:gap-2 transition-all">
                Leer más <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white border border-surface-100 rounded-xl overflow-hidden card-hover h-full flex flex-col">
        {post.image && (
          <div className="aspect-video bg-surface-100 overflow-hidden relative">
            <Image
              src={post.image}
              alt={post.image_alt || post.imageAlt || post.title || 'Imagen del artículo'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
              }}
            >
              {categoryIcon} {categoryName}
            </span>
          </div>
          <h3 className="font-display font-bold text-surface-900 mb-2 group-hover:text-fc-navy transition-colors line-clamp-2 text-balance">
            {post.title}
          </h3>
          <p className="text-sm text-surface-500 mb-4 line-clamp-2 flex-1">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-100">
            <time dateTime={post.date || post.published_at || post.created_at || new Date().toISOString()}>
              {new Intl.DateTimeFormat('es-PE', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.date || post.published_at || post.created_at || new Date().toISOString()))}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
