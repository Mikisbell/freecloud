import { getAdminPosts, getCategories } from '@/lib/supabase'
import PostsClientTable from './PostsClientTable'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export const metadata = {
    title: 'Posts | FreeCloud Admin',
}

export default async function AdminPostsPage() {
    const posts = await getAdminPosts()
    const categories = await getCategories()

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-grotesk text-white">Posts</h1>
                    <p className="text-neutral-400 mt-1">Gestiona todos los artículos de tu blog.</p>
                </div>

                <Link
                    href="/admin/posts/new"
                    className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                    <PlusCircle className="w-5 h-5" />
                    Nuevo Post
                </Link>
            </div>

            <PostsClientTable initialPosts={posts} categories={categories} />
        </div>
    )
}
