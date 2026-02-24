import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Category } from '@/lib/supabase';

interface BlogCardProps {
  post: any;
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
        <article className="relative bg-gradient-to-br from-surface-900 to-teal-900 rounded-2xl overflow-hidden card-hover">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-teal-500/20 backdrop-blur-sm text-teal-300 text-xs font-semibold rounded-full">
                {categoryIcon} {categoryName}
              </span>
              <span className="text-teal-300 text-xs">
                ⭐ Destacado
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-teal-200 transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-surface-300 mb-6 line-clamp-2 max-w-2xl">
              {post.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-surface-400">
                <span>{new Date(post.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm text-teal-400 font-medium group-hover:gap-2 transition-all">
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
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          <h3 className="font-display font-bold text-surface-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 text-balance">
            {post.title}
          </h3>
          <p className="text-sm text-surface-500 mb-4 line-clamp-2 flex-1">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-100">
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
