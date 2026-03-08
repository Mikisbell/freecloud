'use client'

import { useState, useEffect } from 'react'
import { listImages, uploadImage, StorageImage } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageIcon, Upload, Loader2, Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MediaLibraryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImageSelect: (url: string, file: StorageImage | File) => void
}

export function MediaLibraryModal({ open, onOpenChange, onImageSelect }: MediaLibraryModalProps) {
    const [images, setImages] = useState<StorageImage[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('library')
    const [selectedImage, setSelectedImage] = useState<StorageImage | null>(null)

    // Load images when modal opens
    useEffect(() => {
        if (open && activeTab === 'library') {
            fetchImages()
        }
    }, [open, activeTab])

    const fetchImages = async () => {
        setLoading(true)
        try {
            const data = await listImages()
            setImages(data || [])
            setSelectedImage(null) // Reset selection on new fetch
        } catch (error) {
            console.error('Error fetching images:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadClick = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            setUploading(true)
            try {
                const url = await uploadImage(file)
                onImageSelect(url, file)
                onOpenChange(false) // Close modal after successful upload & insert
            } catch (error) {
                console.error('Error uploading:', error)
                alert('No se pudo subir la imagen. Verifica su peso o formato.')
            } finally {
                setUploading(false)
            }
        }
        input.click()
    }

    const handleSelectExisting = () => {
        if (selectedImage) {
            onImageSelect(selectedImage.url, selectedImage)
            onOpenChange(false)
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const filteredImages = images.filter(img =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-[#0a0a14] border-white/10 text-white p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-5 pb-4 border-b border-white/[0.06]">
                    <DialogTitle className="text-xl font-grotesk flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-fc-cyan" />
                        Media Library
                    </DialogTitle>
                    <DialogDescription className="text-white/50 text-xs">
                        Selecciona o sube imágenes para insertarlas en tu post.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-[60vh] min-h-[500px]">
                    <div className="px-5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06]">
                        <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1">
                            <TabsTrigger value="library" className="data-[state=active]:bg-fc-blue/20 data-[state=active]:text-fc-cyan text-white/60">
                                Galería
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="data-[state=active]:bg-fc-blue/20 data-[state=active]:text-fc-cyan text-white/60">
                                Subir Nueva
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'library' && (
                            <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <Input
                                    placeholder="Buscar por nombre..."
                                    className="pl-9 h-9 bg-white/[0.02] border-white/[0.08] text-sm focus-visible:ring-fc-blue/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col m-0 data-[state=inactive]:hidden">
                        <ScrollArea className="flex-1 p-5">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/40 pt-20">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-fc-blue" />
                                    <p className="text-sm">Cargando biblioteca...</p>
                                </div>
                            ) : filteredImages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/40 pt-20">
                                    <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm">{searchQuery ? 'No se encontraron imágenes' : 'El bucket está vacío'}</p>
                                    {!searchQuery && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4 border-white/10 bg-white/5 hover:bg-white/10"
                                            onClick={() => setActiveTab('upload')}
                                        >
                                            <Upload className="w-4 h-4 mr-2" /> Sube tu primer imagen
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {filteredImages.map((img) => (
                                        <div
                                            key={img.id || img.name}
                                            className={`relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedImage?.name === img.name ? 'border-fc-cyan shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'border-white/10 hover:border-white/30'}`}
                                            onClick={() => setSelectedImage(img)}
                                            title={img.name}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-full h-full object-cover bg-black/50"
                                                loading="lazy"
                                            />
                                            {/* Overlay info */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                                                <p className="text-[10px] text-white/90 truncate font-medium">{img.name}</p>
                                                {img.metadata?.size && <p className="text-[9px] text-white/50">{formatBytes(img.metadata.size)} • {new Date(img.created_at).toLocaleDateString()}</p>}
                                            </div>

                                            {/* Selection indicator */}
                                            {selectedImage?.name === img.name && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-fc-cyan rounded-full flex items-center justify-center shadow-lg">
                                                    <Check className="w-3 h-3 text-[#0a0a14] font-bold" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Action Bar for Library Tab */}
                        <div className="p-4 border-t border-white/[0.06] bg-black/20 flex justify-between items-center">
                            <div className="text-xs text-white/40">
                                {selectedImage ? (
                                    <span className="text-white/80 font-mono truncate max-w-[200px] inline-block">{selectedImage.name}</span>
                                ) : (
                                    `${images.length} imágenes`
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white">
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSelectExisting}
                                    disabled={!selectedImage}
                                    className="bg-fc-cyan text-[#0a0a14] hover:bg-fc-cyan-light font-medium shadow-[0_0_15px_rgba(45,212,191,0.2)] disabled:opacity-50 disabled:shadow-none"
                                >
                                    Insertar Imagen
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden p-6">
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-white/20 transition-colors rounded-xl bg-white/[0.01]">
                            <div className="w-16 h-16 rounded-2xl bg-fc-blue/10 flex items-center justify-center mb-6 text-fc-cyan shadow-[0_0_30px_rgba(42,138,246,0.1)]">
                                {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Subir desde tu computadora</h3>
                            <p className="text-sm text-white/40 text-center max-w-sm mb-8">
                                Sube imágenes en formato JPG, PNG, WEBP o GIF. Tamaño máximo recomendado: 5MB.
                            </p>
                            <Button
                                onClick={handleUploadClick}
                                disabled={uploading}
                                size="lg"
                                className="bg-white text-black hover:bg-neutral-200"
                            >
                                {uploading ? 'Subiendo e insertando...' : 'Explorar Archivos'}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
