'use client'

import { useState, useEffect } from 'react'
import { getPageViewStats, getTopPages, getDownloads } from '@/lib/supabase'
import { BarChart3, TrendingUp, Eye, Download, Globe, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DailyCount { date: string; count: number }
interface TopPage { path: string; count: number }

function groupByDay(items: { created_at: string }[], days: number): DailyCount[] {
    const counts: Record<string, number> = {}
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        counts[d.toISOString().split('T')[0]] = 0
    }
    for (const item of items) {
        const day = item.created_at.split('T')[0]
        if (counts[day] !== undefined) counts[day]++
    }
    return Object.entries(counts).map(([date, count]) => ({ date, count }))
}

function MiniBarChart({ data, color = 'bg-fc-cyan' }: { data: DailyCount[]; color?: string }) {
    const max = Math.max(...data.map(d => d.count), 1)
    return (
        <div className="flex items-end gap-[2px] h-20 w-full">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div
                        className={`w-full ${color} rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity min-h-[2px]`}
                        style={{ height: `${Math.max((d.count / max) * 100, 3)}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {d.date.slice(5)}: {d.count}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function StatsPage() {
    const [period, setPeriod] = useState<7 | 30 | 90>(30)
    const [views, setViews] = useState<{ created_at: string; path: string }[]>([])
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [downloads, setDownloads] = useState<{ created_at: string; product_slug: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [v, tp, dl] = await Promise.all([
                    getPageViewStats(period),
                    getTopPages(period),
                    getDownloads()
                ])
                setViews(v)
                setTopPages(tp)
                setDownloads(dl)
            } catch (e) { console.error(e) }
            setLoading(false)
        }
        load()
    }, [period])

    const dailyViews = groupByDay(views, period)
    const dailyDownloads = groupByDay(downloads, period)
    const totalViews = views.length
    const totalDownloads = downloads.filter(d => {
        const since = new Date()
        since.setDate(since.getDate() - period)
        return new Date(d.created_at) >= since
    }).length

    // Top referrers
    const referrers: Record<string, number> = {}
    for (const v of views as any[]) {
        const ref = v.referrer || 'Directo'
        try {
            const host = ref === 'Directo' ? 'Directo' : new URL(ref).hostname
            referrers[host] = (referrers[host] || 0) + 1
        } catch {
            referrers[ref] = (referrers[ref] || 0) + 1
        }
    }
    const topReferrers = Object.entries(referrers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Estadisticas</h1>
                        <p className="text-xs text-white/40 mt-0.5">Trafico y rendimiento de tu sitio</p>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
                    {([7, 30, 90] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? 'bg-fc-blue/20 text-fc-cyan' : 'text-white/40 hover:text-white/70'}`}
                        >
                            {p}d
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-fc-blue border-t-transparent" />
                </div>
            ) : (
                <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/10">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[11px] text-white/50 font-medium">Visitas Totales</h3>
                                    <Eye className="w-4 h-4 text-blue-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white font-grotesk">{totalViews.toLocaleString()}</p>
                                <p className="text-[10px] text-white/30 mt-1">Ultimos {period} dias</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/10">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[11px] text-white/50 font-medium">Descargas</h3>
                                    <Download className="w-4 h-4 text-emerald-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white font-grotesk">{totalDownloads}</p>
                                <p className="text-[10px] text-white/30 mt-1">Productos vendidos</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/10 col-span-2 lg:col-span-1">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[11px] text-white/50 font-medium">Promedio Diario</h3>
                                    <TrendingUp className="w-4 h-4 text-violet-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white font-grotesk">{Math.round(totalViews / period)}</p>
                                <p className="text-[10px] text-white/30 mt-1">visitas/dia</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                        {/* Page Views Chart */}
                        <Card className="bg-white/[0.02] border-white/[0.06]">
                            <CardHeader className="px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-blue-400" /> Visitas por Dia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-5">
                                <MiniBarChart data={dailyViews} color="bg-blue-400" />
                                <div className="flex justify-between mt-2 text-[10px] text-white/20">
                                    <span>{dailyViews[0]?.date.slice(5)}</span>
                                    <span>Hoy</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Downloads Chart */}
                        <Card className="bg-white/[0.02] border-white/[0.06]">
                            <CardHeader className="px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Download className="w-4 h-4 text-emerald-400" /> Descargas por Dia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-5">
                                <MiniBarChart data={dailyDownloads} color="bg-emerald-400" />
                                <div className="flex justify-between mt-2 text-[10px] text-white/20">
                                    <span>{dailyDownloads[0]?.date.slice(5)}</span>
                                    <span>Hoy</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                        {/* Top Pages */}
                        <Card className="bg-white/[0.02] border-white/[0.06]">
                            <CardHeader className="px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-fc-cyan" /> Paginas Mas Visitadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/[0.04]">
                                    {topPages.length === 0 ? (
                                        <div className="p-8 text-center text-white/30 text-sm">Sin datos en este periodo</div>
                                    ) : topPages.map((page, i) => (
                                        <div key={page.path} className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-[10px] text-white/20 font-mono w-5 text-right shrink-0">{i + 1}</span>
                                                <span className="text-sm text-white/70 truncate">{page.path}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-white/[0.04] text-white/50 border-0 text-[10px] font-mono shrink-0 ml-2">
                                                {page.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Referrers */}
                        <Card className="bg-white/[0.02] border-white/[0.06]">
                            <CardHeader className="px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-400" /> Fuentes de Trafico
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/[0.04]">
                                    {topReferrers.length === 0 ? (
                                        <div className="p-8 text-center text-white/30 text-sm">Sin datos en este periodo</div>
                                    ) : topReferrers.map(([ref, count], i) => (
                                        <div key={ref} className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-[10px] text-white/20 font-mono w-5 text-right shrink-0">{i + 1}</span>
                                                <span className="text-sm text-white/70 truncate">{ref}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-white/[0.04] text-white/50 border-0 text-[10px] font-mono shrink-0 ml-2">
                                                {count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}
