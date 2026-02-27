import { getCategories, getAdminPosts } from '@/lib/supabase'
import CategoriesClientTable from './CategoriesClientTable'

import { cookies } from 'next/headers'

export const metadata = {
    title: 'Categorías | FreeCloud Admin',
}

export default async function AdminCategoriesPage() {
    await cookies() // Force dynamic render
    const categories = await getCategories()
    // Fetch posts to count how many posts per category.
    // In a large app, you'd do a grouped query, but here getting all posts is fine for this scale.
    const posts = await getAdminPosts()

    const categoriesWithCount = categories.map(cat => ({
        ...cat,
        postsCount: posts.filter(p => p.category_id === cat.id).length
    }))

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-grotesk text-white">Categorías</h1>
                <p className="text-neutral-400 mt-1">Administra las etiquetas y temáticas de tu blog.</p>
            </div>

            <CategoriesClientTable initialCategories={categoriesWithCount} />
        </div>
    )
}
