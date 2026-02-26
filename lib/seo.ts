import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'FreeCloud';
const DEFAULT_DESCRIPTION = 'BIM, Ingeniería Civil y Tecnología - Tutoriales, herramientas y recursos para ingenieros en Perú y Latinoamérica';

export function generateSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} - BIM e Ingeniería Civil`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: ['BIM', 'Revit', 'ingeniería civil', 'Perú', 'análisis estructural', 'Dynamo', 'Python', 'tutorial'],
    authors: [{ name: 'Miguel Angel Rivera', url: SITE_URL }],
    creator: 'FreeCloud',
    openGraph: {
      type: 'website',
      locale: 'es_PE',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - BIM e Ingeniería Civil`,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - BIM e Ingeniería Civil`,
      description: DEFAULT_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: { canonical: SITE_URL },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    ...overrides,
  };
}

import { Post } from '@/types/supabase';

export function generatePostMetadata(post: Partial<Post>): Metadata {
  const title = post.meta_title || post.metaTitle || post.title;
  const description = post.meta_description || post.metaDescription || post.description || post.excerpt || undefined;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.featured_image || post.image || `${SITE_URL}/og-default.png`;
  const date = post.published_at || post.created_at || post.date;
  const tags = post.tags || [];

  return {
    title,
    description,
    keywords: tags,
    openGraph: {
      type: 'article',
      locale: 'es_PE',
      url,
      title,
      description,
      siteName: SITE_NAME,
      publishedTime: (date || undefined) as string | undefined,
      modifiedTime: ((post.updated_at || post.updated || date) || undefined) as string | undefined,
      authors: [post.author || 'Miguel Angel Rivera'],
      tags: tags,
      images: [{ url: image || `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: post.image_alt || post.imageAlt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || `${SITE_URL}/og-default.png`],
    },
    alternates: { canonical: post.canonicalUrl || url },
  };
}

export function generateArticleSchema(post: Partial<Post>) {
  const title = post.meta_title || post.metaTitle || post.title;
  const description = post.meta_description || post.metaDescription || post.description || post.excerpt || undefined;
  const image = post.featured_image || post.image || `${SITE_URL}/og-default.png`;
  const date = post.published_at || post.created_at || post.date;
  const tags = post.tags || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    image: image,
    datePublished: date,
    dateModified: post.updated_at || post.updated || date,
    author: {
      '@type': 'Person',
      name: post.author || 'Miguel Angel Rivera',
      url: SITE_URL,
      jobTitle: 'Ingeniero Civil y de Sistemas',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    keywords: tags.join(', '),
    about: {
      '@type': 'Thing',
      name: post.categories?.name || post.category || 'Ingeniería',
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
