import { getPosts, getContacts, getSubscribers, getPageViewStats, getTopPages } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, MessageSquare, FileText, Eye, TrendingUp, Calendar, Layout } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Estadísticas | FreeCloud Admin' }

export default async function StatsPage() {
    const [postsResponse, contacts, subscribers, views, topPages] = await Promise.all([
        getPosts({}),
        getContacts(),
        getSubscribers(),
        getPageViewStats(30),
        getTopPages(30)
    ])
    const posts = postsResponse.posts

    const publishedPosts = posts.filter(p => p.status === 'published').length
    const unreadContacts = contacts.filter(c => !c.read).length
    
    const now = new Date()
    const thisMonthSubscribers = subscribers.filter(s => {
        const d = new Date(s.created_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    // Agrupar vistas por día para un mini-gráfico manual
    const viewsByDay = views.reduce((acc, v) => {
        const date = new Date(v.created_at).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const dates = Object.keys(viewsByDay).sort()
    const last7Days = dates.slice(-7)
    const maxViewsInDay = Math.max(...Object.values(viewsByDay), 1)

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-fc-blue/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-fc-cyan" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Estadísticas Globales</h1>
                        <p className="text-xs text-white/40 mt-0.5">Visión general del rendimiento y métricas de la plataforma</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-gradient-to-br from-fc-blue/10 to-transparent border-fc-blue/20">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs text-white/60 font-medium">Page Views (30d)</h3>
                            <Eye className="w-4 h-4 text-fc-cyan" />
                        </div>
                        <p className="text-3xl font-bold text-white font-grotesk">{views.length}</p>
                        <p className="text-[10px] text-fc-cyan/80 mt-1 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            ~{Math.round(views.length / 30)} por día
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs text-white/60 font-medium">Suscriptores</h3>
                            <Users className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-3xl font-bold text-white font-grotesk">{subscribers.length}</p>
                        <p className="text-[10px] text-emerald-400/80 mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            +{thisMonthSubscribers} este mes
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs text-white/60 font-medium">Contactos</h3>
                            <MessageSquare className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-3xl font-bold text-white font-grotesk">{contacts.length}</p>
                        <p className="text-[10px] text-amber-400/80 mt-1 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
                            {unreadContacts} no leídos
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs text-white/60 font-medium">Artículos</h3>
                            <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold text-white font-grotesk">{posts.length}</p>
                        <p className="text-[10px] text-purple-400/80 mt-1 flex items-center">
                            <Layout className="w-3 h-3 mr-1" />
                            {publishedPosts} publicados
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Visualización de tráfico (últimos 7 días con actividad) */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="pb-2 border-b border-white/[0.06] p-4">
                        <CardTitle className="text-sm font-medium text-white/80">Tráfico Reciente (Días Activos)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-48 flex items-end justify-between gap-1">
                        {last7Days.length === 0 ? (
                            <div className="w-full text-center text-white/30 text-sm py-10">Sin datos recientes</div>
                        ) : (
                            last7Days.map(date => {
                                const count = viewsByDay[date]
                                const heightPercent = Math.max((count / maxViewsInDay) * 100, 5)
                                return (
                                    <div key={date} className="w-full relative flex flex-col justify-end items-center group h-full">
                                        <div 
                                            className="w-full max-w-[40px] bg-fc-blue/30 group-hover:bg-fc-cyan/50 rounded-t-sm transition-all relative"
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-admin-surface)] border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10">
                                                {count} views
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-white/40 mt-2 block whitespace-nowrap">
                                            {date.split('-').slice(1).join('/')}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Top Páginas */}
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardHeader className="pb-2 border-b border-white/[0.06] p-4">
                        <CardTitle className="text-sm font-medium text-white/80">Páginas Más Visitadas (30d)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {topPages.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-sm">Sin datos suficientes</div>
                        ) : (
                            <ul className="divide-y divide-white/[0.04]">
                                {topPages.slice(0, 5).map((page, i) => (
                                    <li key={page.path} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                                        <div className="flex items-center gap-3 min-w-0 pr-4">
                                            <span className="text-white/20 text-xs font-mono w-4">{i + 1}.</span>
                                            <span className="text-sm text-white/80 truncate">{page.path === '/' ? '/ (Home)' : page.path}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-sm font-medium text-white">{page.count}</span>
                                            <span className="text-[10px] text-white/30 uppercase">vistas</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
