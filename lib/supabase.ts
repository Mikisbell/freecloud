import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;

// Export base client only for server environments
export const supabase = typeof window === 'undefined' && supabaseUrl && supabaseAnonKey
  ? (serverClient = serverClient || createClient(supabaseUrl, supabaseAnonKey))
  : null;

export function getClient() {
  if (typeof window !== 'undefined') {
    if (!browserClient) {
      browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return browserClient;
  }

  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

// ==========================================
// Tracking & Analytics
// ==========================================

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  source: string;
}

export interface Download {
  id: string;
  product_slug: string;
  email: string;
  created_at: string;
}

export interface PageView {
  id: string;
  path: string;
  referrer?: string;
  created_at: string;
}

export async function subscribeNewsletter(email: string, source: string = 'blog') {
  const { data, error } = await getClient()
    .from('subscribers')
    .upsert({ email, source }, { onConflict: 'email' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function trackDownload(productSlug: string, email: string) {
  const { error } = await getClient()
    .from('downloads')
    .insert({ product_slug: productSlug, email });
  if (error) throw error;
}

export async function trackPageView(path: string, referrer?: string) {
  try {
    const { error } = await getClient()
      .from('page_views')
      .insert({ path, referrer });
    if (error) throw error;
  } catch (err: any) {
    console.warn('⚠️ Fallo silenciado en Analytics (ignorar si es high-traffic o adblocker):', err.message);
  }
}

// ==========================================
// Leads & Contacts
// ==========================================

export interface Lead {
  id: string;
  email: string;
  name?: string;
  interest?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
}

export async function createLead(leadData: Partial<Lead>) {
  const { data, error } = await getClient()
    .from('leads')
    .insert([leadData])
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  service?: string;
  read?: boolean;
  created_at?: string;
}

export async function submitContact(name: string, email: string, message: string, service?: string) {
  return createContact({ name, email, message, service });
}

export async function createContact(contactData: Partial<Contact>) {
  const { data, error } = await getClient()
    .from('contacts')
    .insert([contactData])
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function getContacts() {
  const { data, error } = await getClient()
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Contact[];
}

export async function markContactAsRead(id: string) {
  const { error } = await getClient()
    .from('contacts')
    .update({ read: true })
    .eq('id', id);
  if (error) throw error;
}

// ==========================================
// CMS (Blog) Functions
// ==========================================

import { Post, Category } from '@/types/supabase';

export async function getCategories() {
  const { data, error } = await getClient()
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data as Category[];
}

export async function createCategory(catData: Partial<Category>) {
  const { data, error } = await getClient()
    .from('categories')
    .insert([catData])
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, catData: Partial<Category>) {
  const { data, error } = await getClient()
    .from('categories')
    .update(catData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string) {
  const { count, error: countError } = await getClient()
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);
  if (countError) throw countError;
  if (count && count > 0) throw new Error('No se puede eliminar una categoría que tiene posts.');

  const { error } = await getClient()
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  category?: string; // backwards compatibility
  tag?: string;
  featured?: boolean;
}

export async function getPosts(options?: GetPostsOptions) {
  let query = getClient()
    .from('posts')
    .select('*, categories!inner(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const catSlug = options?.categorySlug || options?.category;
  if (catSlug) {
    query = query.eq('categories.slug', catSlug);
  }

  if (options?.tag) {
    query = query.contains('tags', [options.tag]);
  }

  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }

  if (options?.limit) {
    const page = options.page || 1;
    const from = (page - 1) * options.limit;
    const to = from + options.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: data as Post[], count };
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await getClient()
    .from('posts')
    .select('*, categories(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as Post;
}

export async function getRelatedPosts(postId: string, categoryId: string, limit: number = 3) {
  const { data, error } = await getClient()
    .from('posts')
    .select('*, categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data as Post[];
}

export async function getAdminPosts(filters?: { status?: string, category_id?: string }) {
  let query = getClient()
    .from('posts')
    .select('*, categories(*)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}

export async function createPost(postData: Partial<Post>) {
  const { data, error } = await getClient()
    .from('posts')
    .insert([postData])
    .select()
    .single();
  if (error) throw error;
  return data as Post;
}

export async function updatePost(id: string, postData: Partial<Post>) {
  postData.updated_at = new Date().toISOString();
  const { data, error } = await getClient()
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string) {
  const { error } = await getClient()
    .from('posts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ==========================================
// Storage
// ==========================================

export async function uploadImage(file: File) {
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten imágenes (jpg, png, gif, webp).');
  }
  if (file.size > 5_000_000) {
    throw new Error('La imagen no puede pesar más de 5MB.');
  }

  const fileExt = file.name.split('.').pop();
  // Fix: removed accidental spaces in filename template literal
  const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;

  const { data, error } = await getClient()
    .storage
    .from('blog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = getClient()
    .storage
    .from('blog-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
