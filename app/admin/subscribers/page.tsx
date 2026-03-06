'use client'

import { useState, useEffect } from 'react'
import { getSubscribers, deleteSubscriber, Subscriber } from '@/lib/supabase'
import { Users, Search, Trash2, Download, Mail, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const data = await getSubscribers()
                setSubscribers(data)
            } catch (e) { console.error(e) }
            setLoading(false)
        }
        load()
    }, [])

    const filtered = subscribers.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.name || '').toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Eliminar este suscriptor permanentemente?')) return
        try {
            await deleteSubscriber(id)
            setSubscribers(prev => prev.filter(s => s.id !== id))
        } catch (e) {
            alert('Error al eliminar')
        }
    }

    const handleExportCSV = () => {
        const header = 'Email,Nombre,Fuente,Fecha\n'
        const rows = subscribers.map(s =>
            `${s.email},"${s.name || ''}",${s.source},${s.created_at}`
        ).join('\n')
        const blob = new Blob([header + rows], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `suscriptores-freecloud-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Stats
    const thisMonth = subscribers.filter(s => {
        const d = new Date(s.created_at)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Suscriptores</h1>
                        <p className="text-xs text-white/40 mt-0.5">Lista de emails del newsletter</p>
                    </div>
                </div>
                <Button onClick={handleExportCSV} disabled={subscribers.length === 0} className="bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white border-0 min-h-11 w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/10">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] text-white/50 font-medium">Total Suscriptores</h3>
                            <Users className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-bold text-white font-grotesk">{subscribers.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/10">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] text-white/50 font-medium">Este Mes</h3>
                            <Calendar className="w-4 h-4 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-white font-grotesk">+{thisMonth}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/10 col-span-2 lg:col-span-1">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] text-white/50 font-medium">Fuente Principal</h3>
                            <Mail className="w-4 h-4 text-violet-400" />
                        </div>
                        <p className="text-lg font-bold text-white font-grotesk capitalize">
                            {subscribers.length > 0
                                ? Object.entries(subscribers.reduce((acc, s) => { acc[s.source] = (acc[s.source] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'blog'
                                : '-'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-white/[0.06]">
                    <div className="relative">
                        <Search className="w-4 h-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 h-10 text-sm"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-fc-blue border-t-transparent" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-white/30 text-sm">
                            {search ? 'Sin resultados' : 'No hay suscriptores'}
                        </div>
                    ) : (
                        <>
                            {/* Mobile card layout */}
                            <div className="lg:hidden divide-y divide-white/[0.04]">
                                {filtered.map(sub => (
                                    <div key={sub.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
                                                {sub.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-white/80 truncate">{sub.email}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-white/25 mt-0.5">
                                                    <span>{new Date(sub.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                                    <Badge variant="secondary" className="bg-white/[0.04] text-white/40 border-0 text-[9px]">{sub.source}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-400/30 hover:text-red-400 transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden lg:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/[0.04]">
                                            <th className="text-left text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3">Email</th>
                                            <th className="text-left text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3">Nombre</th>
                                            <th className="text-left text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3">Fuente</th>
                                            <th className="text-left text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3">Fecha</th>
                                            <th className="text-right text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {filtered.map(sub => (
                                            <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-3 text-sm text-white/80">{sub.email}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{sub.name || '-'}</td>
                                                <td className="px-5 py-3">
                                                    <Badge variant="secondary" className="bg-white/[0.04] text-white/50 border-0 text-[10px]">{sub.source}</Badge>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-white/40">
                                                    {new Date(sub.created_at).toLocaleDateString('es-PE')}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-400/30 hover:text-red-400 transition-colors rounded-md hover:bg-red-400/[0.06]">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
