'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { createPost, updatePost, uploadImage } from '@/lib/supabase'
import { Post, Category } from '@/types/supabase'
import { Save, Eye, ArrowLeft, Image as ImageIcon, Sparkles, Check, X, Settings2, PenLine, Loader2, Upload, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PostEditorProps {
    post?: Post
    categories: Category[]
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // divide characters and their accents
        .replace(/[\u0300-\u036f]/g, '') // remove the accents
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/[^\w-]+/g, '') // remove non-word chars
        .replace(/--+/g, '-') // collapse multiple hyphens
        .replace(/^-+/, '') // trim starting hyphens
        .replace(/-+$/, ''); // trim ending hyphens
}

function calculateReadingTime(text: string) {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
}

function getTitleColor(length: number) {
    if (length === 0) return 'text-neutral-500';
    if (length < 50) return 'text-emerald-500';
    if (length <= 60) return 'text-amber-500';
    return 'text-red-500';
}

function getDescColor(length: number) {
    if (length === 0) return 'text-neutral-500';
    if (length < 140) return 'text-emerald-500';
    if (length <= 155) return 'text-amber-500';
    return 'text-red-500';
}

export default function PostEditor({ post, categories }: PostEditorProps) {
    const router = useRouter()
    const isEditing = !!post
    const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null)

    const [formData, setFormData] = useState<Partial<Post>>({
        title: post?.title || '',
        slug: post?.slug || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        category_id: post?.category_id || '',
        tags: post?.tags || [],
        featured_image: post?.featured_image || '',
        image_alt: post?.image_alt || '',
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        key_question: post?.key_question || '',
        key_answer: post?.key_answer || '',
        status: post?.status || 'draft',
        featured: post?.featured || false,
        author: post?.author || 'Miguel Angel Rivera',
        cta_product_name: post?.cta_product_name || '',
        cta_product_url: post?.cta_product_url || '',
        cta_product_price: post?.cta_product_price || '',
    })

    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [dirty, setDirty] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const [toastMsg, setToastMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMsg({ text, type });
        setTimeout(() => setToastMsg(null), 3000);
    }

    const handleImageUpload = async (file: File, target: 'content' | 'featured') => {
        setUploadingImage(true);
        try {
            const url = await uploadImage(file);
            if (target === 'content') {
                insertText(`![${file.name}](${url})`);
            } else {
                setFormData(prev => ({ ...prev, featured_image: url }));
                setDirty(true);
            }
            showToast('Imagen subida con éxito', 'success');
        } catch (error) {
            console.error(error);
            showToast('Error al subir imagen (asegúrate de que el bucket "blog-images" exista en Supabase)', 'error');
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        if (!isEditing && formData.title && !formData.slug) {
            setFormData(prev => ({ ...prev, slug: slugify(prev.title!) }))
        }
    }, [formData.title, isEditing])

    const readingTime = calculateReadingTime(formData.content || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        setDirty(true)
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !(formData.tags || []).includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag]
                }))
                setTagInput('');
                setDirty(true);
            }
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
        }))
        setDirty(true);
    }

    const insertText = (before: string, after: string = '') => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const selectedText = text.substring(start, end)

        const newVal = text.substring(0, start) + before + selectedText + after + text.substring(end)
        setFormData(prev => ({ ...prev, content: newVal }))
        setDirty(true)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, end + before.length)
        }, 0)
    }

    const handleSave = async (forceStatus?: 'draft' | 'published') => {
        if (!formData.title || !formData.slug || !formData.content || !formData.category_id) {
            showToast('Faltan campos obligatorios (*)', 'error');
            return;
        }

        setSaving(true)
        try {
            const status = forceStatus || formData.status
            setFormData(prev => ({ ...prev, status }))

            const payload: any = {
                ...formData,
                status,
                reading_time: readingTime,
                ...(status === 'published' && !post?.published_at ? { published_at: new Date().toISOString() } : {})
            }

            if (!payload.category_id) {
                payload.category_id = null;
            }

            if (isEditing) {
                await updatePost(post!.id, payload)
                setLastSaved(new Date())
                setDirty(false)
                showToast('Guardado correctamente', 'success')
            } else {
                const newPost = await createPost(payload)
                router.push(`/admin/posts/${newPost.id}/edit`)
            }
        } catch (error) {
            console.error(error)
            showToast('Error al guardar. Revisa que el Slug sea único.', 'error')
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        if (dirty && isEditing) {
            if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)
            autoSaveTimeout.current = setTimeout(() => {
                handleSave(formData.status)
            }, 30000)
        }
        return () => {
            if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current)
        }
    }, [formData, dirty, isEditing])

    const activeMetaTitle = formData.meta_title || formData.title || 'Título del Post';
    const activeMetaDesc = formData.meta_description || formData.excerpt || 'Descripción de la página que aparecerá en los resultados de búsqueda de Google...';
    const activeSlug = formData.slug || 'ejemplo-de-url';

    const renderEditorContent = () => (
        <div className="space-y-4 sm:space-y-6 flex-1 min-w-0">
            <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
                <div className="p-4 sm:p-5 border-b border-white/[0.06] shrink-0 space-y-4">
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Título del post *..."
                        className="w-full bg-transparent border-0 text-xl sm:text-3xl font-bold font-grotesk text-white placeholder:text-white/20 focus-visible:ring-0 p-0 h-auto"
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-white/30 text-xs sm:text-sm shrink-0">freecloud.pe/blog/</span>
                        <Input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="url-del-post"
                            className="flex-1 bg-transparent border-0 text-fc-cyan text-xs sm:text-sm focus-visible:ring-0 p-0 h-auto font-mono"
                        />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white/[0.01] border-b border-white/[0.06] p-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => insertText('**', '**')} className="h-8 px-2 text-white/50 hover:text-white font-bold">B</Button>
                    <Button variant="ghost" size="sm" onClick={() => insertText('*', '*')} className="h-8 px-2 text-white/50 hover:text-white italic">I</Button>
                    <div className="w-px h-4 bg-white/[0.06] mx-1 shrink-0"></div>
                    <Button variant="ghost" size="sm" onClick={() => insertText('## ')} className="h-8 px-2 text-white/50 hover:text-white font-bold text-xs" title="Título 2">H2</Button>
                    <Button variant="ghost" size="sm" onClick={() => insertText('### ')} className="h-8 px-2 text-white/50 hover:text-white font-bold text-xs" title="Título 3">H3</Button>
                    <div className="w-px h-4 bg-white/[0.06] mx-1 shrink-0"></div>
                    <Button variant="ghost" size="sm" onClick={() => insertText('- ')} className="h-8 px-2 text-white/50 hover:text-white text-xs">• List</Button>
                    <Button variant="ghost" size="sm" onClick={() => insertText('1. ')} className="h-8 px-2 text-white/50 hover:text-white text-xs">1. List</Button>
                    <div className="w-px h-4 bg-white/[0.06] mx-1 shrink-0"></div>
                    <Button variant="ghost" size="sm" onClick={() => insertText('[Texto](url)')} className="h-8 px-2 text-white/50 hover:text-white text-xs">Link</Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleImageUpload(file, 'content');
                        };
                        input.click();
                    }} className="h-8 px-2 text-white/50 hover:text-white" disabled={uploadingImage}>
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    </Button>
                    <div className="w-px h-4 bg-white/[0.06] mx-1 shrink-0"></div>
                    <Button variant="ghost" size="sm" onClick={() => insertText('`', '`')} className="h-8 px-2 text-white/50 hover:text-white text-xs">`code`</Button>
                    <Button variant="ghost" size="sm" onClick={() => insertText('```\n', '\n```')} className="h-8 px-2 text-white/50 hover:text-white text-xs">Block</Button>
                    <Button variant="ghost" size="sm" onClick={() => insertText('> ')} className="h-8 px-2 text-white/50 hover:text-white text-xs">Quote</Button>

                    <div className="flex-1 min-w-[20px]"></div>

                    <Button
                        size="sm"
                        variant={showPreview ? "default" : "secondary"}
                        onClick={() => setShowPreview(!showPreview)}
                        className={`h-8 text-xs shrink-0 ${showPreview ? 'bg-fc-blue/20 text-fc-cyan hover:bg-fc-blue/30' : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'}`}
                    >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        {showPreview ? 'Editando' : 'Preview'}
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden relative bg-[#08080f]/50">
                    {showPreview ? (
                        <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-fc-cyan prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.06] max-w-none custom-scrollbar">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {formData.content || '*Aún no hay contenido... Escribe algo para ver la previsualización.*'}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <Textarea
                            id="content-editor"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Escribe el contenido en Markdown aquí *..."
                            className="absolute inset-0 w-full h-full bg-transparent border-0 rounded-none p-4 sm:p-6 font-mono text-sm leading-relaxed text-white/80 placeholder:text-white/20 focus-visible:ring-0 resize-none custom-scrollbar"
                        />
                    )}
                </div>
            </Card>
        </div>
    )

    const renderSettingsContent = () => (
        <div className="w-full lg:w-80 xl:w-96 space-y-4 sm:space-y-6 shrink-0">
            {/* 1. Publicación */}
            <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-white/[0.06]">
                    <CardTitle className="text-base text-white">Publicación</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 sm:space-y-5">
                    <div className="flex items-center justify-between">
                        <Label className="text-white/50 text-xs">Estado Actual</Label>
                        <Badge variant="secondary" className={`text-[10px] border-0 ${formData.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {formData.status === 'published' ? 'PUBLICADO' : 'BORRADOR'}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        {formData.status === 'published' ? (
                            <>
                                <Button
                                    onClick={() => handleSave('published')}
                                    disabled={saving || (isEditing && !dirty)}
                                    className={`w-full h-11 transition-all ${isEditing && !dirty ? 'bg-white/[0.04] text-white/30' : 'bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white shadow-lg shadow-fc-blue/20'}`}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Actualizando...' : 'Actualizar Publicación'}
                                </Button>
                                <Button
                                    onClick={() => handleSave('draft')}
                                    disabled={saving}
                                    variant="outline"
                                    className="w-full h-11 border-white/[0.08] bg-transparent hover:bg-white/[0.04] text-white/60 hover:text-white"
                                >
                                    Despublicar a Borrador
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleSave('published')}
                                    disabled={saving}
                                    className="w-full h-11 transition-all bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white shadow-lg shadow-fc-blue/20"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {saving ? 'Publicando...' : '¡Publicar Ahora!'}
                                </Button>
                                <Button
                                    onClick={() => handleSave('draft')}
                                    disabled={saving || (isEditing && !dirty)}
                                    variant="outline"
                                    className="w-full h-11 border-white/[0.08] bg-transparent hover:bg-white/[0.04] text-white/60 hover:text-white"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Guardando...' : 'Guardar como Borrador'}
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="pt-4 border-t border-white/[0.06] text-xs space-y-2">
                        <div className="flex justify-between text-white/40">
                            <span>Lectura estimada:</span>
                            <span className="text-white/80">{readingTime} min</span>
                        </div>
                        {post?.published_at && (
                            <div className="flex justify-between text-white/40">
                                <span>Publicado:</span>
                                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                            </div>
                        )}
                        {lastSaved && (
                            <div className="flex justify-between text-fc-cyan/80 mt-2">
                                <span>Autoguardado:</span>
                                <span>{lastSaved.toLocaleTimeString()}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 2. SEO y CTR */}
            <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-white/[0.06]">
                    <CardTitle className="text-base text-white">SEO y CTR</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <Label className="text-white/50">Meta Título</Label>
                            <span className={`font-mono ${getTitleColor((formData.meta_title || '').length)}`}>
                                {(formData.meta_title || '').length}/60
                            </span>
                        </div>
                        <Input
                            type="text"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleChange}
                            placeholder="Ej: Probé [X] por 30 días"
                            className="bg-white/[0.04] border-white/[0.08] text-white text-sm h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <Label className="text-white/50">Meta Descripción</Label>
                            <span className={`font-mono ${getDescColor((formData.meta_description || '').length)}`}>
                                {(formData.meta_description || '').length}/155
                            </span>
                        </div>
                        <Textarea
                            name="meta_description"
                            value={formData.meta_description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Engancha al lector aquí..."
                            className="bg-white/[0.04] border-white/[0.08] text-white text-sm resize-y min-h-[80px]"
                        />
                    </div>

                    {/* SERP Preview */}
                    <div className="pt-2">
                        <Label className="text-[10px] text-white/30 uppercase tracking-wider mb-2 block">Preview en Google (SERP)</Label>
                        <div className="bg-[#1f1f1f] p-3 sm:p-4 rounded-lg font-sans border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px]">🌍</div>
                                <div>
                                    <p className="text-[11px] text-white/80 leading-none">FreeCloud</p>
                                    <p className="text-[11px] text-emerald-400 leading-none mt-0.5 truncate max-w-[200px] sm:max-w-[250px]">https://freecloud.pe/blog/{activeSlug}</p>
                                </div>
                            </div>
                            <h3 className="text-[16px] sm:text-[18px] text-[#8ab4f8] tracking-tight hover:underline cursor-pointer truncate mt-2 leading-tight">
                                {activeMetaTitle.length > 60 ? activeMetaTitle.substring(0, 57) + '...' : activeMetaTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#bdc1c6] mt-1 line-clamp-2 leading-snug">
                                {activeMetaDesc}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className="text-white/50 text-xs">Excerpt Fallback</Label>
                        <Textarea
                            name="excerpt"
                            value={formData.excerpt || ''}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Para listados del blog"
                            className="bg-white/[0.02] border-white/[0.04] border-dashed text-white text-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 3. AEO (IA) */}
            <Card className="bg-[#1A1A2E]/50 border-blue-500/20 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles className="w-24 h-24 text-blue-400" />
                </div>
                <CardHeader className="pb-3 border-b border-blue-500/10">
                    <CardTitle className="text-base text-blue-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Formato AEO (IA)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 relative z-10">
                    <div className="space-y-2">
                        <Label className="text-blue-200/70 text-xs">Pregunta Central (Key Question)</Label>
                        <Input
                            type="text"
                            name="key_question"
                            value={formData.key_question || ''}
                            onChange={handleChange}
                            placeholder="Ej: ¿Cómo prepararte para BIM en Perú?"
                            className="bg-black/20 border-blue-500/20 text-white text-sm h-10 focus-visible:ring-blue-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <Label className="text-blue-200/70">Respuesta Corta (Key Answer)</Label>
                            <span className={`font-mono text-xs ${getDescColor((formData.key_answer || '').length)}`}>
                                {(formData.key_answer || '').length}/160
                            </span>
                        </div>
                        <Textarea
                            name="key_answer"
                            value={formData.key_answer || ''}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Respuesta directa en 1-2 oraciones..."
                            className="bg-black/20 border-blue-500/20 text-white text-sm focus-visible:ring-blue-500/50"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 4. Clasificación e Imagen */}
            <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-white/[0.06]">
                    <CardTitle className="text-base text-white">Clasificación y Multimedia</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-white/50 text-xs">Categoría *</Label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-fc-blue/50 min-h-10 cursor-pointer appearance-none"
                        >
                            <option value="" className="bg-[#08080f]">Selecciona Categoría...</option>
                            {categories.map(c => <option key={c.id} value={c.id} className="bg-[#08080f]">{c.emoji} {c.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/50 text-xs">Etiquetas (Tags)</Label>
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-md p-1.5 min-h-[44px] flex flex-wrap gap-1.5 focus-within:ring-1 focus-within:ring-fc-blue/50 transition-colors">
                            {(formData.tags || []).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-white/[0.06] text-white/80 hover:bg-white/[0.1] border-0 text-[11px] px-2 py-0.5 font-normal">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-white/40 hover:text-red-400 focus:outline-none"><X className="w-3 h-3" /></button>
                                </Badge>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Escribe y Enter..."
                                className="flex-1 min-w-[100px] bg-transparent text-[13px] text-white focus:outline-none px-1 py-1"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 bg-white/10 border-white/20 rounded text-fc-blue focus:ring-fc-blue/50" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white/90">Destacado (Hero)</span>
                            <span className="text-[10px] text-white/40">Aparecerá grande al inicio del blog</span>
                        </div>
                    </label>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-white/50 text-xs">Imagen Principal *</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] text-fc-cyan hover:text-fc-cyan-light hover:bg-fc-blue/10 px-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = async (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) handleImageUpload(file, 'featured');
                                    };
                                    input.click();
                                }}
                                disabled={uploadingImage}
                            >
                                {uploadingImage ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                                Subir
                            </Button>
                        </div>
                        {formData.featured_image ? (
                            <img src={formData.featured_image} alt={formData.image_alt || 'Preview'} className="w-full h-36 object-cover rounded-lg border border-white/[0.06]" />
                        ) : (
                            <div className="w-full h-36 bg-white/[0.02] border border-white/[0.06] border-dashed rounded-lg flex flex-col items-center justify-center text-white/20 text-xs">
                                <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                                Sin imagen
                            </div>
                        )}
                        <Input
                            type="text"
                            name="featured_image"
                            value={formData.featured_image || ''}
                            onChange={handleChange}
                            placeholder="/images/blog/mi-imagen.jpg"
                            className="bg-white/[0.04] border-white/[0.08] text-white text-xs font-mono h-9"
                        />
                        <Input
                            type="text"
                            name="image_alt"
                            value={formData.image_alt || ''}
                            onChange={handleChange}
                            placeholder="Texto Alt (Accesibilidad/SEO)"
                            className="bg-white/[0.04] border-white/[0.08] text-white text-xs h-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 5. Producto CTA (Hotmart / Gumroad) */}
            <Card className="bg-[#1A2E1A]/50 border-emerald-500/20 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <ShoppingCart className="w-24 h-24 text-emerald-400" />
                </div>
                <CardHeader className="pb-3 border-b border-emerald-500/10">
                    <CardTitle className="text-base text-emerald-300 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Producto a Vender
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 relative z-10">
                    <p className="text-[11px] text-emerald-200/50">Si rellenas estos campos, aparecerá automáticamente un bloque de compra al final del post.</p>
                    <div className="space-y-2">
                        <Label className="text-emerald-200/70 text-xs">Nombre del Producto</Label>
                        <Input
                            type="text"
                            name="cta_product_name"
                            value={formData.cta_product_name || ''}
                            onChange={handleChange}
                            placeholder="Ej: Plantilla Excel E.030"
                            className="bg-black/20 border-emerald-500/20 text-white text-sm h-10 focus-visible:ring-emerald-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-emerald-200/70 text-xs">Precio (texto libre)</Label>
                        <Input
                            type="text"
                            name="cta_product_price"
                            value={formData.cta_product_price || ''}
                            onChange={handleChange}
                            placeholder="Ej: $7 USD"
                            className="bg-black/20 border-emerald-500/20 text-white text-sm h-10 focus-visible:ring-emerald-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-emerald-200/70 text-xs">URL de Compra (Hotmart)</Label>
                        <Input
                            type="text"
                            name="cta_product_url"
                            value={formData.cta_product_url || ''}
                            onChange={handleChange}
                            placeholder="https://pay.hotmart.com/..."
                            className="bg-black/20 border-emerald-500/20 text-white text-sm h-10 font-mono focus-visible:ring-emerald-500/50"
                        />
                    </div>
                    {formData.cta_product_url && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-[11px] text-emerald-300 font-medium mb-1">Vista previa del CTA:</p>
                            <p className="text-xs text-white/70">👉 <span className="text-emerald-300 underline">{formData.cta_product_name || 'Tu Producto'} — {formData.cta_product_price || 'Precio'}</span></p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in relative z-10 pb-20 lg:pb-8">
            {/* Toast */}
            {toastMsg && (
                <div className={`fixed top-4 right-4 sm:top-6 sm:right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-white z-50 animate-fade-in backdrop-blur-md border ${toastMsg.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' : 'bg-red-500/20 border-red-500/30 text-red-100'}`}>
                    {toastMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="font-medium text-sm">{toastMsg.text}</span>
                </div>
            )}

            {/* Header / Actions Row */}
            <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/posts" className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white rounded-lg transition-colors border border-white/[0.04]">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                    <h2 className="text-lg sm:text-xl font-bold font-grotesk text-white">
                        {isEditing ? 'Editar Post' : 'Nuevo Post'}
                    </h2>
                </div>

                {/* Mobile fast-save / publish button */}
                <Button
                    onClick={() => handleSave(formData.status === 'published' ? 'published' : 'draft')}
                    disabled={saving || (isEditing && !dirty)}
                    size="sm"
                    className={`lg:hidden h-9 ${isEditing && !dirty ? 'bg-white/[0.04] text-white/30' : 'bg-gradient-to-r from-fc-blue to-fc-navy text-white border-0'}`}
                >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {saving ? '...' : (formData.status === 'published' ? 'Actualizar' : 'Borrador')}
                </Button>
            </div>

            {/* === DESKTOP LAYOUT (lg+) === */}
            <div className="hidden lg:flex gap-6 items-start">
                {renderEditorContent()}
                {renderSettingsContent()}
            </div>

            {/* === MOBILE LAYOUT (<lg) - Tabs === */}
            <div className="lg:hidden">
                <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/[0.04] p-1 border border-white/[0.06] mb-4">
                        <TabsTrigger value="editor" className="data-[state=active]:bg-fc-blue/20 data-[state=active]:text-fc-cyan text-white/60">
                            <PenLine className="w-4 h-4 mr-2" /> Editor
                        </TabsTrigger>
                        <TabsTrigger value="config" className="data-[state=active]:bg-fc-blue/20 data-[state=active]:text-fc-cyan text-white/60">
                            <Settings2 className="w-4 h-4 mr-2" /> Config
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="m-0 focus-visible:ring-0">
                        {renderEditorContent()}
                    </TabsContent>

                    <TabsContent value="config" className="m-0 focus-visible:ring-0">
                        {renderSettingsContent()}
                    </TabsContent>
                </Tabs>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
