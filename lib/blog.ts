import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  draft?: boolean;
  readingTime: string;
  content: string;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  // Products
  relatedProduct?: string;
  relatedProductUrl?: string;
  // Video
  youtubeId?: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.mdx?$/, '');
    return getPostBySlug(slug);
  }).filter((post): post is BlogPost => post !== null && !post.draft);

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    updated: data.updated,
    author: data.author || 'Miguel Angel Rivera',
    category: data.category || 'General',
    tags: data.tags || [],
    image: data.image,
    imageAlt: data.imageAlt,
    featured: data.featured || false,
    draft: data.draft || false,
    readingTime: stats.text.replace('min read', 'min de lectura'),
    content,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    canonicalUrl: data.canonicalUrl,
    relatedProduct: data.relatedProduct,
    relatedProductUrl: data.relatedProductUrl,
    youtubeId: data.youtubeId,
  };
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map(p => p.category));
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap(p => p.tags));
  return Array.from(tags);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return [];

  const allPosts = getAllPosts().filter(p => p.slug !== currentSlug);

  // Score by shared tags and same category
  const scored = allPosts.map(post => {
    let score = 0;
    if (post.category === current.category) score += 3;
    const sharedTags = post.tags.filter(t => current.tags.includes(t));
    score += sharedTags.length * 2;
    return { post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.post);
}

// Categories config
export const CATEGORIES = {
  'bim-peru': { name: 'BIM Perú', color: '#1a6df5', icon: '🏗️' },
  'revit': { name: 'Revit', color: '#1357e1', icon: '🖥️' },
  'dynamo': { name: 'Dynamo', color: '#ff7a0d', icon: '⚡' },
  'python': { name: 'Python', color: '#3776ab', icon: '🐍' },
  'robot-structural': { name: 'Robot Structural', color: '#c74807', icon: '🔧' },
  'civil-3d': { name: 'Civil 3D', color: '#338dff', icon: '🛣️' },
  'excel': { name: 'Excel/Plantillas', color: '#217346', icon: '📊' },
  'hp-prime': { name: 'HP Prime', color: '#183f8f', icon: '🔢' },
  'analisis-estructural': { name: 'Análisis Estructural', color: '#9e390e', icon: '🏛️' },
  'normativa': { name: 'Normativa', color: '#7f310f', icon: '📋' },
} as const;
