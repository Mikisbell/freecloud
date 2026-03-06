import { siteConfig } from '@/config/site'
import { PRODUCTS } from '@/config/products'
import { Settings, Globe, User, ShoppingBag, Link as LinkIcon, Database, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata = {
    title: 'Configuracion | FreeCloud Admin',
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
    return (
        <div className="flex items-start justify-between py-2.5 border-b border-white/[0.04] last:border-0 gap-4">
            <span className="text-xs text-white/40 shrink-0">{label}</span>
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-fc-cyan hover:underline truncate flex items-center gap-1">
                    {value} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
            ) : (
                <span className="text-xs text-white/80 text-right truncate">{value}</span>
            )}
        </div>
    )
}

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white/60" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Configuracion</h1>
                    <p className="text-xs text-white/40 mt-0.5">Informacion general del sitio</p>
                </div>
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
                        <InfoRow label="Nombre" value={siteConfig.name} />
                        <InfoRow label="URL" value={siteConfig.url} href={siteConfig.url} />
                        <InfoRow label="Descripcion" value={siteConfig.description} />
                    </CardContent>
                </Card>

                {/* Author */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-violet-400" /> Autor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <InfoRow label="Nombre" value={siteConfig.author} />
                        <InfoRow label="Cargo" value={siteConfig.authorTitle} />
                        <InfoRow label="Email" value="admin@freecloud.pe" />
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
                        <InfoRow label="YouTube" value="@mikisbell" href={siteConfig.links.youtube} />
                        <InfoRow label="LinkedIn" value="mikisbell" href={siteConfig.links.linkedin} />
                        <InfoRow label="GitHub" value="mikisbell" href={siteConfig.links.github} />
                        {siteConfig.links.facebook && <InfoRow label="Facebook" value="FreeCloud" href={siteConfig.links.facebook} />}
                    </CardContent>
                </Card>

                {/* Products */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-emerald-400" /> Productos ({PRODUCTS.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/[0.04]">
                            {PRODUCTS.map(p => (
                                <div key={p.slug} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm text-white/80 truncate">{p.title}</p>
                                        <p className="text-[10px] text-white/30 mt-0.5">Gumroad</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">{p.priceDisplay}</Badge>
                                        <a href={p.href} target="_blank" rel="noopener noreferrer" className="p-1 text-white/20 hover:text-fc-cyan transition-colors">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="bg-white/[0.02] border-white/[0.06] lg:col-span-2">
                    <CardHeader className="px-5 py-3 border-b border-white/[0.06]">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Database className="w-4 h-4 text-amber-400" /> Stack Tecnico
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="flex flex-wrap gap-2">
                            {['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel', 'Gumroad', 'MDX'].map(tech => (
                                <Badge key={tech} variant="secondary" className="bg-white/[0.04] text-white/60 border-0 text-xs px-3 py-1">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-[10px] text-white/20 mt-4">
                            Para cambiar la configuracion, edita <code className="text-fc-cyan/60">config/site.ts</code> y <code className="text-fc-cyan/60">config/products.ts</code>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
