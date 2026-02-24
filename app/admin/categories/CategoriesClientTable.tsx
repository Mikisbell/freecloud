'use client'

import { useState } from 'react'
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react'
import { Category, createCategory, updateCategory, deleteCategory } from '@/lib/supabase'
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

interface CategoryWithCount extends Category {
    postsCount: number;
}

export default function CategoriesClientTable({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
    const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Category>>({ name: '', slug: '', emoji: '', color: '' })
    const [isCreating, setIsCreating] = useState(false)

    const handleEdit = (cat: CategoryWithCount) => {
        setEditingId(cat.id)
        setFormData({ name: cat.name, slug: cat.slug, emoji: cat.emoji || '', color: cat.color || '' })
        setIsCreating(false)
    }

    const handleCreate = () => {
        setIsCreating(true)
        setEditingId(null)
        setFormData({ name: '', slug: '', emoji: '📁', color: '#1A3C6D' })
    }

    const handleCancel = () => {
        setEditingId(null)
        setIsCreating(false)
    }

    const handleSave = async () => {
        try {
            if (isCreating) {
                const newSlug = formData.slug || formData.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                const newCat = await createCategory({ ...formData, slug: newSlug })
                setCategories([...categories, { ...newCat, postsCount: 0 }])
            } else {
                const updatedCat = await updateCategory(editingId!, formData)
                setCategories(categories.map(c => c.id === editingId ? { ...updatedCat, postsCount: c.postsCount } : c))
            }
            handleCancel()
        } catch (error: any) {
            alert('Error guardando la categoría: ' + error.message)
        }
    }

    const handleDelete = async (id: string, count: number) => {
        if (count > 0) {
            alert('No puedes eliminar una categoría que ya tiene posts asociados.')
            return
        }
        if (confirm('¿Eliminar esta categoría permanentemente?')) {
            try {
                await deleteCategory(id)
                setCategories(categories.filter(c => c.id !== id))
            } catch (error: any) {
                alert(error.message)
            }
        }
    }

    // Inline form for creating/editing (reused across mobile and desktop)
    const InlineForm = ({ layout = 'desktop' }: { layout?: 'mobile' | 'desktop' }) => {
        if (layout === 'mobile') {
            return (
                <div className="p-3.5 bg-white/[0.03] border-b border-teal-500/20">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={formData.emoji}
                                onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                                className="w-14 bg-white/[0.04] border-white/[0.08] text-center text-lg h-10"
                            />
                            <Input
                                type="text"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="flex-1 bg-white/[0.04] border-white/[0.08] text-white text-sm h-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="slug-unico"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 bg-white/[0.04] border-white/[0.08] text-white text-xs font-mono h-10"
                            />
                            <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 shrink-0" />
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave} className="flex-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border-0 h-10">
                                <Check className="w-4 h-4 mr-1" /> Guardar
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel} className="text-white/40 hover:text-white h-10">
                                <X className="w-4 h-4 mr-1" /> Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
        return null // Desktop form handled inline in table row
    }

    return (
        <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-white/[0.06] flex justify-between items-center">
                <p className="text-xs text-white/30">{categories.length} categorías</p>
                <Button
                    onClick={handleCreate}
                    disabled={isCreating}
                    size="sm"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white border-0 min-h-10 sm:min-h-9 text-xs"
                >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Nueva Categoría
                </Button>
            </div>

            <CardContent className="p-0">
                {/* === MOBILE: Card layout (below lg) === */}
                <div className="lg:hidden">
                    {/* Mobile Create Form */}
                    {isCreating && <InlineForm layout="mobile" />}

                    <div className="divide-y divide-white/[0.04]">
                        {categories.map(cat => {
                            const editing = editingId === cat.id

                            if (editing) {
                                return (
                                    <div key={cat.id}>
                                        <InlineForm layout="mobile" />
                                    </div>
                                )
                            }

                            return (
                                <div key={cat.id} className="p-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                                    <div className="text-2xl shrink-0 w-10 text-center">{cat.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-medium text-sm text-white truncate">{cat.name}</span>
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/25">
                                            <span className="font-mono">/{cat.slug}</span>
                                            <span>•</span>
                                            <span>{cat.postsCount} posts</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0">
                                        <button onClick={() => handleEdit(cat)} className="p-2 text-white/20 hover:text-white/60 transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.postsCount)}
                                            disabled={cat.postsCount > 0}
                                            className={`p-2 min-h-9 min-w-9 flex items-center justify-center transition-colors ${cat.postsCount > 0 ? 'text-white/[0.06] cursor-not-allowed' : 'text-red-400/40 hover:text-red-400'}`}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* === DESKTOP: Table layout (lg+) === */}
                <div className="hidden lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/[0.04] hover:bg-transparent">
                                <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium w-16 text-center">Icono</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Nombre & Slug</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium text-center">Color</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium text-center">Posts</TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider text-white/30 font-medium text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isCreating && (
                                <TableRow className="bg-white/[0.02] border-white/[0.04]">
                                    <TableCell className="text-center">
                                        <Input type="text" value={formData.emoji} onChange={e => setFormData({ ...formData, emoji: e.target.value })} className="w-12 bg-white/[0.04] border-white/[0.08] text-center text-lg p-1" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            <Input type="text" placeholder="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white text-sm h-8" />
                                            <Input type="text" placeholder="slug-unico" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white text-xs font-mono h-8" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                                    </TableCell>
                                    <TableCell className="text-center text-white/30 text-sm">0</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <button onClick={handleSave} className="p-1.5 bg-teal-500/15 text-teal-400 rounded-md hover:bg-teal-500/25 transition-colors"><Check className="w-4 h-4" /></button>
                                            <button onClick={handleCancel} className="p-1.5 bg-white/[0.04] text-white/40 rounded-md hover:bg-white/[0.08] transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {categories.map(cat => {
                                const editing = editingId === cat.id
                                return (
                                    <TableRow key={cat.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="text-center text-2xl">
                                            {editing ? (
                                                <Input type="text" value={formData.emoji} onChange={e => setFormData({ ...formData, emoji: e.target.value })} className="w-12 bg-white/[0.04] border-teal-500/30 text-center text-lg p-1" />
                                            ) : cat.emoji}
                                        </TableCell>
                                        <TableCell>
                                            {editing ? (
                                                <div className="space-y-1.5">
                                                    <Input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white/[0.04] border-teal-500/30 text-white text-sm h-8" />
                                                    <Input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-white/[0.04] border-teal-500/30 text-white text-xs font-mono h-8" />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="font-medium text-white text-sm mb-0.5">{cat.name}</div>
                                                    <div className="text-xs font-mono text-white/30">/{cat.slug}</div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {editing ? (
                                                <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full mx-auto ring-2 ring-white/[0.06]" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="text-[10px] bg-white/[0.04] text-white/50 border-0 font-mono">
                                                {cat.postsCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {editing ? (
                                                <div className="flex justify-end gap-1.5">
                                                    <button onClick={handleSave} className="p-1.5 bg-teal-500/15 text-teal-400 rounded-md hover:bg-teal-500/25 transition-colors"><Check className="w-4 h-4" /></button>
                                                    <button onClick={handleCancel} className="p-1.5 bg-white/[0.04] text-white/40 rounded-md hover:bg-white/[0.08] transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1.5">
                                                    <button onClick={() => handleEdit(cat)} className="p-1.5 text-white/20 hover:text-white/60 transition-colors rounded-md hover:bg-white/[0.04]">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, cat.postsCount)}
                                                        disabled={cat.postsCount > 0}
                                                        className={`p-1.5 transition-colors rounded-md ${cat.postsCount > 0 ? 'text-white/[0.06] cursor-not-allowed' : 'text-red-400/40 hover:text-red-400 hover:bg-red-400/[0.06]'}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
