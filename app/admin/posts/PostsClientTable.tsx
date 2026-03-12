'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Edit, Trash2, ExternalLink, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { deletePost, updatePost, deletePosts } from '@/lib/supabase'
import { Post, Category } from '@/types/supabase'
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

const PAGE_SIZE_OPTIONS = [10, 25, 50]
type SortField = 'title' | 'status' | 'created_at'
type SortDir = 'asc' | 'desc'

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
    if (field !== current) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30 inline ml-1" />
    return dir === 'asc'
        ? <ChevronUp className="w-3.5 h-3.5 inline ml-1 text-fc-cyan" />
        : <ChevronDown className="w-3.5 h-3.5 inline ml-1 text-fc-cyan" />
}

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

    // Sorting
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    // Pagination
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Bulk actions
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkActioning, setIsBulkActioning] = useState(false)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
        }
        setPage(1)
    }

    const filteredAndSorted = useMemo(() => {
        let result = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter
            const matchesCategory = categoryFilter === 'all' || (post.category_id ?? '') === categoryFilter
            return matchesSearch && matchesStatus && matchesCategory
        })

        result = [...result].sort((a, b) => {
            let aVal: string = ''
            let bVal: string = ''
            if (sortField === 'title') { aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase() }
            else if (sortField === 'status') { aVal = a.status ?? ''; bVal = b.status ?? '' }
            else if (sortField === 'created_at') { aVal = a.created_at ?? ''; bVal = b.created_at ?? '' }
            return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        })

        return result
    }, [posts, searchTerm, statusFilter, categoryFilter, sortField, sortDir])

    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize))
    const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize)

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este post de forma permanente?')) {
            try {
                await deletePost(id)
                setPosts(posts.filter(p => p.id !== id))
            } catch {
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
        } catch {
            alert('Error al cambiar el estado')
        }
    }

    // --- Bulk Actions Logic ---
    const handleSelectAllOnPage = (checked: boolean) => {
        if (checked) {
            const pageIds = new Set(paginated.map(p => p.id))
            const newSelected = new Set(selectedIds)
            pageIds.forEach(id => newSelected.add(id))
            setSelectedIds(Array.from(newSelected))
        } else {
            const pageIds = new Set(paginated.map(p => p.id))
            setSelectedIds(selectedIds.filter(id => !pageIds.has(id)))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const isAllOnPageSelected = paginated.length > 0 && paginated.every(p => selectedIds.includes(p.id))

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        if (confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} posts permanentemente?`)) {
            setIsBulkActioning(true)
            try {
                await deletePosts(selectedIds)
                setPosts(posts.filter(p => !selectedIds.includes(p.id)))
                setSelectedIds([])
            } catch {
                alert('Error al eliminar posts masivamente')
            } finally {
                setIsBulkActioning(false)
            }
        }
    }

    const handleBulkStatus = async (newStatus: 'published' | 'draft') => {
        if (selectedIds.length === 0) return
        setIsBulkActioning(true)
        try {
            const promises = selectedIds.map(id => {
                const post = posts.find(p => p.id === id);
                if (!post) return Promise.resolve();
                return updatePost(id, {
                    status: newStatus,
                    ...(newStatus === 'published' && !post.published_at ? { published_at: new Date().toISOString() } : {})
                })
            })
            await Promise.all(promises)
            setPosts(posts.map(p => selectedIds.includes(p.id) ? {
                ...p,
                status: newStatus,
                ...(newStatus === 'published' && !p.published_at ? { published_at: new Date().toISOString() } : {})
            } : p))
            setSelectedIds([])
        } catch {
            alert('Error al cambiar estados masivamente')
        } finally {
            setIsBulkActioning(false)
        }
    }
    // -------------------------

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
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
                            className="pl-9 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 h-10 sm:h-9 text-sm"
                        />
                    </div>
                    {/* Filter selects — stacked on mobile, row on sm+ */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Filter className="w-3.5 h-3.5 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'published' | 'draft'); setPage(1) }}
                                className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-md pl-8 pr-4 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-fc-blue/50 cursor-pointer transition-colors min-h-10 sm:min-h-9"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Borradores</option>
                            </select>
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                            className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-fc-blue/50 cursor-pointer transition-colors max-w-full sm:max-w-[200px] truncate min-h-10 sm:min-h-9"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                            ))}
                        </select>
                        {/* Page size selector */}
                        <div className="flex items-center gap-2 sm:ml-auto text-sm text-white/40">
                            <span>Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                                className="bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1 text-sm text-white appearance-none cursor-pointer focus:outline-none"
                            >
                                {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <span>por página</span>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                {filteredAndSorted.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center text-white/30 text-sm">
                        No se encontraron posts con esos filtros.
                    </div>
                ) : (
                    <>
                        {/* Bulk Actions Toolbar */}
                        {selectedIds.length > 0 && (
                            <div className="bg-fc-blue/10 border-b border-fc-blue/20 p-3 px-4 flex items-center justify-between text-sm animate-fade-in flex-wrap gap-3">
                                <span className="text-fc-cyan font-medium w-full sm:w-auto text-center sm:text-left">
                                    {selectedIds.length} post{selectedIds.length !== 1 ? 's' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}
                                </span>
                                <div className="flex gap-2 w-full sm:w-auto justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleBulkStatus('published')}
                                        disabled={isBulkActioning}
                                        className="h-8 border-fc-blue/30 text-white hover:bg-fc-blue/20"
                                    >
                                        Publicar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleBulkStatus('draft')}
                                        disabled={isBulkActioning}
                                        className="h-8 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                                    >
                                        A Borrador
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkDelete}
                                        disabled={isBulkActioning}
                                        className="h-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 border-0"
                                    >
                                        <Trash2 className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Eliminar</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* === MOBILE: Card layout (visible below lg) === */}
                        <div className="lg:hidden divide-y divide-white/[0.04]">
                            {paginated.map(post => (
                                <div key={post.id} className="p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-start gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(post.id)}
                                            onChange={() => toggleSelect(post.id)}
                                            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-fc-cyan shrink-0 cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                                            <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-white/80 leading-snug line-clamp-2 hover:text-white transition-colors">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                        <button
                                            onClick={() => handleToggleStatus(post)}
                                            className="shrink-0"
                                        >
                                            {(() => {
                                                const isPublished = post.status === 'published'
                                                const isScheduled = isPublished && post.published_at && new Date(post.published_at) > new Date()
                                                const badgeClass = isScheduled ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : isPublished ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                const badgeText = isScheduled ? 'Scheduled' : isPublished ? 'Live' : 'Draft'
                                                return (
                                                    <Badge variant="secondary" className={`text-[10px] border-0 cursor-pointer ${badgeClass}`}>
                                                        {badgeText}
                                                    </Badge>
                                                )
                                            })()}
                                        </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pl-7">
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
                                        <TableHead className="w-12 text-center align-middle h-10">
                                            <input
                                                type="checkbox"
                                                checked={isAllOnPageSelected}
                                                onChange={(e) => handleSelectAllOnPage(e.target.checked)}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-fc-cyan cursor-pointer translate-y-[2px]"
                                            />
                                        </TableHead>
                                        <TableHead
                                            className="text-[11px] uppercase tracking-wider text-white/30 font-medium cursor-pointer select-none hover:text-white/60 transition-colors"
                                            onClick={() => handleSort('title')}
                                        >
                                            Título <SortIcon field="title" current={sortField} dir={sortDir} />
                                        </TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Categoría</TableHead>
                                        <TableHead
                                            className="text-[11px] uppercase tracking-wider text-white/30 font-medium cursor-pointer select-none hover:text-white/60 transition-colors"
                                            onClick={() => handleSort('status')}
                                        >
                                            Estado <SortIcon field="status" current={sortField} dir={sortDir} />
                                        </TableHead>
                                        <TableHead
                                            className="text-[11px] uppercase tracking-wider text-white/30 font-medium cursor-pointer select-none hover:text-white/60 transition-colors"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            Fecha <SortIcon field="created_at" current={sortField} dir={sortDir} />
                                        </TableHead>
                                        <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.map(post => (
                                        <TableRow key={post.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(post.id)}
                                                    onChange={() => toggleSelect(post.id)}
                                                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-fc-cyan cursor-pointer"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-white/80 max-w-[300px] truncate text-sm">
                                                {post.title}
                                            </TableCell>
                                            <TableCell className="text-white/40 whitespace-nowrap text-sm">
                                                {post.categories?.emoji} {post.categories?.name || '---'}
                                            </TableCell>
                                            <TableCell>
                                                <button onClick={() => handleToggleStatus(post)}>
                                                    {(() => {
                                                        const isPublished = post.status === 'published'
                                                        const isScheduled = isPublished && post.published_at && new Date(post.published_at) > new Date()
                                                        const badgeClass = isScheduled ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : isPublished ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                        const badgeText = isScheduled ? 'Programado' : isPublished ? 'Publicado' : 'Borrador'
                                                        return (
                                                            <Badge variant="secondary" className={`text-[10px] cursor-pointer border-0 ${badgeClass}`}>
                                                                {badgeText}
                                                            </Badge>
                                                        )
                                                    })()}
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

                        {/* ──── Pagination footer ──── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] text-sm text-white/40">
                                <span>
                                    {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredAndSorted.length)} de {filteredAndSorted.length} posts
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-white/40 hover:text-white disabled:opacity-20"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                        .reduce<(number | '...')[]>((acc, p, i, arr) => {
                                            if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                                            acc.push(p)
                                            return acc
                                        }, [])
                                        .map((p, i) =>
                                            p === '...'
                                                ? <span key={`ellipsis-${i}`} className="px-2">…</span>
                                                : (
                                                    <Button
                                                        key={p}
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 w-8 p-0 transition-colors ${page === p ? 'bg-fc-blue/20 text-fc-cyan' : 'text-white/40 hover:text-white'}`}
                                                        onClick={() => setPage(p as number)}
                                                    >
                                                        {p}
                                                    </Button>
                                                )
                                        )
                                    }
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-white/40 hover:text-white disabled:opacity-20"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
