import { getCategories, getPostBySlug } from '@/lib/supabase'
import PostEditor from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

export const metadata = {
    title: 'Editar Post | FreeCloud Admin',
}

// Supabase helper to get strictly by ID isn't in lib, let's create a quick workaround:
import { createClient } from '@/lib/supabase/server'

async function getPostByIdStrict(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('posts').select('*, categories(*)').eq('id', id).single()
    return data
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const categories = await getCategories()
    const post = await getPostByIdStrict(id)

    if (!post) {
        notFound()
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold font-grotesk text-white mb-6">Editar Post</h1>
            <PostEditor categories={categories} post={post} />
        </div>
    )
}
