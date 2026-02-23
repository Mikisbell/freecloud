import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase tables
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

// Newsletter subscription
export async function subscribeNewsletter(email: string, source: string = 'blog') {
  const { data, error } = await supabase
    .from('subscribers')
    .upsert({ email, source }, { onConflict: 'email' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Track downloads
export async function trackDownload(productSlug: string, email: string) {
  const { error } = await supabase
    .from('downloads')
    .insert({ product_slug: productSlug, email });

  if (error) throw error;
}

// Simple analytics
export async function trackPageView(path: string, referrer?: string) {
  await supabase
    .from('page_views')
    .insert({ path, referrer })
    .then(() => {});
}
