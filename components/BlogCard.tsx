import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost, CATEGORIES } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryConfig = CATEGORIES[post.category as keyof typeof CATEGORIES];
  const categoryName = categoryConfig?.name || post.category;
  const categoryIcon = categoryConfig?.icon || '📝';

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl overflow-hidden card-hover">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {categoryIcon} {categoryName}
              </span>
              <span className="text-brand-200 text-xs">
                ⭐ Destacado
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-brand-100 transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-brand-100 mb-6 line-clamp-2 max-w-2xl">
              {post.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-brand-200">
                <span>{new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm text-white font-medium group-hover:gap-2 transition-all">
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
          <div className="aspect-video bg-surface-100 overflow-hidden">
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${categoryConfig?.color || '#64748b'}15`,
                color: categoryConfig?.color || '#64748b',
              }}
            >
              {categoryIcon} {categoryName}
            </span>
          </div>
          <h3 className="font-display font-bold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 text-balance">
            {post.title}
          </h3>
          <p className="text-sm text-surface-500 mb-4 line-clamp-2 flex-1">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-50">
            <span>{new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
