import { MetadataRoute } from 'next';
import { getPosts, getCategories } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';

  // Fetch posts and categories in parallel
  const [{ posts }, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  // Blog post entries con lastModified real
  const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || post.created_at),
    changeFrequency: 'weekly',
    priority: post.featured ? 0.9 : 0.7,
  }));

  // Category page entries — ayudan al crawl de páginas de categoría
  const categoryEntries: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/blog?cat=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/recursos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/apps`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/apps/calculadora-sismica`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/sobre-mi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...staticPages, ...categoryEntries, ...blogEntries];
}
