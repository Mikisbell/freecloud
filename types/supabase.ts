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

    // SEO & Meta
    meta_title?: string;
    meta_description?: string;
    featured_image?: string;
    published_at?: string;
    tags?: string[];
    updated_at?: string;
    author?: string;
    image_alt?: string;
    canonicalUrl?: string;

    // UI view model fields (populated by callers for BlogCard etc.)
    description?: string;
    image?: string;
    date?: string;
    readingTime?: string;
}
