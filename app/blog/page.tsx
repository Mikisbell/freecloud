import { Metadata } from 'next';
import { getAllPosts, getPostsByCategory, CATEGORIES } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Tutoriales BIM e Ingeniería Civil',
  description: 'Tutoriales de Revit, Dynamo, Python, Robot Structural, análisis estructural y normativa BIM en Perú.',
};

interface Props {
  searchParams: Promise<{ cat?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { cat: category } = await searchParams;
  const posts = category ? getPostsByCategory(category) : getAllPosts();
  const activeCat = category && CATEGORIES[category as keyof typeof CATEGORIES];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="label-uppercase mb-3">Blog</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-3">
          {activeCat ? `${activeCat.icon} ${activeCat.name}` : 'Todos los artículos'}
        </h1>
        <p className="text-surface-500 max-w-2xl">
          {activeCat
            ? `Todos los artículos sobre ${activeCat.name.toLowerCase()}`
            : 'Tutoriales, guías y recursos sobre BIM, ingeniería civil y tecnología.'
          }
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            !category
              ? 'bg-teal-500 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-teal-50 hover:text-teal-600'
          }`}
        >
          Todos
        </Link>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <Link
            key={key}
            href={`/blog?cat=${key}`}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              category === key
                ? 'bg-teal-500 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-surface-400 text-lg mb-4">
            No hay artículos en esta categoría aún.
          </p>
          <Link href="/blog" className="text-teal-600 font-medium hover:underline">
            Ver todos los artículos
          </Link>
        </div>
      )}
    </div>
  );
}
