'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, ExternalLink, Search, Filter } from 'lucide-react'
import { Post, Category, deletePost, updatePost } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function PostsClientTable({
    initialPosts,
    categories
}: {
    initialPosts: Post[],
    categories: Category[]
}) {
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || post.category_id === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este post de forma permanente?')) {
            try {
                await deletePost(id)
                setPosts(posts.filter(p => p.id !== id))
            } catch (error) {
                alert('Error al eliminar el post')
            }
        }
    }

    const handleToggleStatus = async (post: Post) => {
        const newStatus = post.status === 'published' ? 'draft' : 'published'
        try {
            await updatePost(post.id, {
                status: newStatus,
                ...(newStatus === 'published' && !post.published_at ? { published_at: new Date().toISOString() } : {})
            })
            setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p))
        } catch (error) {
            alert('Error al cambiar el estado')
        }
    }

    return (
        <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {/* Filters */}
            <div className="p-3 sm:p-4 border-b border-white/[0.06]">
                <div className="flex flex-col gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Buscar por título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 h-10 sm:h-9 text-sm"
                        />
                    </div>
                    {/* Filter selects — stacked on mobile, row on sm+ */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Filter className="w-3.5 h-3.5 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-md pl-8 pr-4 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-fc-blue/50 cursor-pointer transition-colors min-h-10 sm:min-h-9"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Borradores</option>
                            </select>
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-fc-blue/50 cursor-pointer transition-colors max-w-full sm:max-w-[200px] truncate min-h-10 sm:min-h-9"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                {filteredPosts.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center text-white/30 text-sm">
                        No se encontraron posts con esos filtros.
                    </div>
                ) : (
                    <>
                        {/* === MOBILE: Card layout (visible below lg) === */}
                        <div className="lg:hidden divide-y divide-white/[0.04]">
                            {filteredPosts.map(post => (
                                <div key={post.id} className="p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-white/80 leading-snug line-clamp-2 hover:text-white transition-colors">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(post)}
                                            className="shrink-0"
                                        >
                                            <Badge variant="secondary" className={`text-[10px] border-0 cursor-pointer ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
                                                {post.status === 'published' ? 'Live' : 'Draft'}
                                            </Badge>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-white/25">
                                            <span>{post.categories?.emoji} {post.categories?.name || '---'}</span>
                                            <span>•</span>
                                            <span>{new Date(post.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</span>
                                            {post.featured && <Badge variant="secondary" className="text-[9px] bg-violet-500/10 text-violet-400 border-0 px-1.5">★</Badge>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-white/20 hover:text-white/60 transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                            <Link href={`/admin/posts/${post.id}/edit`} className="p-2 text-fc-cyan/50 hover:text-fc-cyan transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Link>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 text-red-400/40 hover:text-red-400 transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* === DESKTOP: Table layout (visible at lg+) === */}
                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/[0.04] hover:bg-transparent">
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Título</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Categoría</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Estado</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Fecha</TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.map(post => (
                                        <TableRow key={post.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-medium text-white/80 max-w-[300px] truncate text-sm">
                                                {post.title}
                                            </TableCell>
                                            <TableCell className="text-white/40 whitespace-nowrap text-sm">
                                                {post.categories?.emoji} {post.categories?.name || '---'}
                                            </TableCell>
                                            <TableCell>
                                                <button onClick={() => handleToggleStatus(post)}>
                                                    <Badge variant="secondary" className={`text-[10px] cursor-pointer border-0 ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
                                                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                                                    </Badge>
                                                </button>
                                                {post.featured && (
                                                    <Badge variant="secondary" className="ml-2 text-[10px] bg-violet-500/10 text-violet-400 border-0">★ Destacado</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-white/40 whitespace-nowrap text-sm">
                                                {new Date(post.created_at).toLocaleDateString('es-PE')}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-white/20 hover:text-white/60 transition-colors rounded-md hover:bg-white/[0.04]">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-fc-cyan/50 hover:text-fc-cyan transition-colors rounded-md hover:bg-fc-cyan/[0.06]">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-400/40 hover:text-red-400 transition-colors rounded-md hover:bg-red-400/[0.06]">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
