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

// ==========================================
// BIM-RTINGS Programmatic SEO Entities
// ==========================================

export interface SoftwareMetric {
    id: string;
    software_id: string;
    /** Clave normalizada del atributo: ej. 'learning_curve', 'price_tier', 'os_windows' */
    metric_key: string;
    /** Valor numérico (0-10 score) o null si no aplica */
    value_numeric: number | null;
    /** Valor de texto libre o null si no aplica */
    value_string: string | null;
    /** Valor booleano (ej: soporta BIM Level 2?) o null si no aplica */
    value_boolean: boolean | null;
    created_at: string;
}

export interface SoftwareReview {
    id: string;
    software_id: string;
    overall_score: number;
    verdict: string;
    pros: string[];
    cons: string[];
    created_at: string;
}

export interface Software {
    id: string;
    name: string;
    /** URL slug único para rutas como /comparativas/revit-2026-vs-archicad-27 */
    slug: string;
    description: string | null;
    logo_url: string | null;
    /** Categoría del software: 'BIM Modeling', 'Structural', 'Rendering', 'MEP', 'Coordination' */
    category: string;
    /** Solo los software activos se muestran en la UI pública */
    is_active: boolean;
    created_at: string;
    updated_at: string;
    /** Joined data — presente cuando se llama con select('*, software_metrics(*)') */
    software_metrics?: SoftwareMetric[];
    software_reviews?: SoftwareReview[];
}

// ==========================================
// Settings & Products
// ==========================================

export interface SiteSettings {
    id: string;
    name: string;
    url: string;
    description: string;
    author: string;
    author_title: string;
    email: string;
    social_youtube: string | null;
    social_linkedin: string | null;
    social_github: string | null;
    social_facebook: string | null;
    updated_at: string;
}

export interface ProductDB {
    slug: string;
    tag: string;
    tag_color: string;
    tag_bg: string;
    title: string;
    price: string;
    price_display: string;
    description: string;
    href: string;
    is_gumroad: boolean;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}
