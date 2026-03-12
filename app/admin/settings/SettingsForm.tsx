'use client'

import { useState } from 'react'
import { SiteSettings, ProductDB } from '@/types/supabase'
import { updateSiteSettings } from '@/lib/supabase'
import { Settings, Globe, User, ShoppingBag, Link as LinkIcon, Plus, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SettingsFormProps {
    initialSettings: SiteSettings
    initialProducts: ProductDB[]
}

export default function SettingsForm({ initialSettings, initialProducts }: SettingsFormProps) {
    const [settings, setSettings] = useState<SiteSettings>(initialSettings)
    const [products, setProducts] = useState<ProductDB[]>(initialProducts)
    const [savingSettings, setSavingSettings] = useState(false)
    const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSaveSettings = async () => {
        setSavingSettings(true)
        setToastMsg(null)
        try {
            await updateSiteSettings(settings)
            setToastMsg({ type: 'success', text: 'Configuración guardada correctamente.' })
            setTimeout(() => setToastMsg(null), 3000)
        } catch (error) {
            console.error(error)
            setToastMsg({ type: 'error', text: 'Error al guardar la configuración.' })
        } finally {
            setSavingSettings(false)
        }
    }

    const handleChange = (field: keyof SiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const RenderInput = ({ label, field, placeholder }: { label: string, field: keyof SiteSettings, placeholder?: string }) => (
        <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs text-white/60 font-medium">{label}</label>
            <input
                type="text"
                value={(settings[field] as string) || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-fc-cyan/50 focus:bg-white/[0.05] transition-all"
            />
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl relative">
            {toastMsg && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium ${toastMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                    {toastMsg.text}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Configuración</h1>
                        <p className="text-xs text-white/40 mt-0.5">Administra los parámetros globales del sitio</p>
                    </div>
                </div>
                <Button 
                    onClick={handleSaveSettings} 
                    disabled={savingSettings}
                    className="bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white shadow-lg shadow-fc-blue/20 hover:shadow-fc-blue/30 border-0"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {savingSettings ? 'Guardando...' : 'Guardar Globales'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Site Info */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-fc-cyan" /> Sitio Web
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <RenderInput label="Nombre del Sitio" field="name" />
                        <RenderInput label="URL Principal" field="url" />
                        <RenderInput label="Descripción" field="description" />
                    </CardContent>
                </Card>

                {/* Author Info */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-violet-400" /> Autor y Contacto
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <RenderInput label="Nombre del Autor" field="author" />
                        <RenderInput label="Cargo (Title)" field="author_title" />
                        <RenderInput label="Email de Contacto" field="email" />
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-blue-400" /> Redes Sociales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <RenderInput label="YouTube URL" field="social_youtube" />
                        <RenderInput label="LinkedIn URL" field="social_linkedin" />
                        <RenderInput label="GitHub URL" field="social_github" />
                        <RenderInput label="Facebook URL" field="social_facebook" placeholder="Opcional" />
                    </CardContent>
                </Card>

                {/* Products Summary */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06] flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-emerald-400" /> Productos BD ({products.length})
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-fc-cyan hover:text-white hover:bg-white/5">
                            <Plus className="w-3 h-3 mr-1" /> Nuevo
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {products.length === 0 ? (
                            <div className="p-5 text-center text-xs text-white/40">No hay productos en la BD.</div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {products.map(p => (
                                    <div key={p.slug} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="min-w-0">
                                            <p className="text-sm text-white/80 truncate">{p.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[9px] px-1.5 py-0">{p.price_display}</Badge>
                                                <Badge variant="secondary" style={{ backgroundColor: p.tag_bg, opacity: 0.8 }} className="text-white border-0 text-[10px] px-1.5 py-0">{p.tag}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="w-7 h-7 text-white/40 hover:text-white" onClick={() => alert('Edición de producto próximamente - fase v2')}>
                                                <Settings className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
                            <p className="text-[10px] text-white/40 text-center leading-relaxed">
                                Para la V1 del nuevo admin, la edición en masa de productos se reserva para un panel completo. Puedes sincronizarlos manualmente con el archivo config/products.ts en el código.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
