export interface PostCategory {
    name: string;
    color: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    emoji?: string;
    color?: string;
    created_at?: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    published: boolean;
    created_at: string;
    categories?: Category;
    category?: string; // Legacy
    category_id?: string;
    status?: 'draft' | 'published';
    featured?: boolean;
    key_question?: string | null;
    key_answer?: string | null;
    reading_time?: number;
    cta_product_name?: string | null;
    cta_product_price?: string | null;
    cta_product_url?: string | null;

    // SEO & Meta (Optional extensions used by meta generators)
    meta_title?: string;
    metaTitle?: string;
    meta_description?: string;
    metaDescription?: string;
    featured_image?: string;
    image?: string;
    published_at?: string;
    date?: string;
    tags?: string[];
    updated_at?: string;
    updated?: string;
    author?: string;
    image_alt?: string;
    imageAlt?: string;
    canonicalUrl?: string;

    // UI Virtual fields
    description?: string;
    readingTime?: string;
}
