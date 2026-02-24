import { getCategories } from '@/lib/supabase'
import PostEditor from '@/components/admin/PostEditor'

export const metadata = {
    title: 'Nuevo Post | FreeCloud Admin',
}

export default async function NewPostPage() {
    const categories = await getCategories()

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold font-grotesk text-white mb-6">Nuevo Post</h1>
            <PostEditor categories={categories} />
        </div>
    )
}
