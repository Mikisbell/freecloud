'use client'

import { useState, useMemo } from 'react'
import { deleteSubscriber, Subscriber } from '@/lib/supabase'
import { Users, Search, Trash2, Download, Mail, Calendar, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const PAGE_SIZE_OPTIONS = [10, 25, 50]
type SortField = 'email' | 'name' | 'source' | 'created_at'
type SortDir = 'asc' | 'desc'

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
    if (field !== current) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30 inline ml-1" />
    return dir === 'asc'
        ? <ChevronUp className="w-3.5 h-3.5 inline ml-1 text-fc-cyan" />
        : <ChevronDown className="w-3.5 h-3.5 inline ml-1 text-fc-cyan" />
}

export default function SubscribersClientView({
    initialSubscribers,
}: {
    initialSubscribers: Subscriber[]
}) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
    const [searchTerm, setSearchTerm] = useState('')

    // Sorting
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    // Pagination
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

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
        let result = subscribers.filter(s => {
            const q = searchTerm.toLowerCase()
            return s.email.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q)
        })

        result = [...result].sort((a, b) => {
            let aVal = ''
            let bVal = ''
            if (sortField === 'email') { aVal = a.email.toLowerCase(); bVal = b.email.toLowerCase() }
            else if (sortField === 'name') { aVal = (a.name || '').toLowerCase(); bVal = (b.name || '').toLowerCase() }
            else if (sortField === 'source') { aVal = a.source.toLowerCase(); bVal = b.source.toLowerCase() }
            else if (sortField === 'created_at') { aVal = a.created_at; bVal = b.created_at }
            return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        })

        return result
    }, [subscribers, searchTerm, sortField, sortDir])

    const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize))

    const handleDelete = async (id: string) => {
        if (!confirm('Eliminar este suscriptor permanentemente?')) return
        try {
            await deleteSubscriber(id)
            setSubscribers(prev => prev.filter(s => s.id !== id))
        } catch {
            alert('Error al eliminar')
        }
    }

    const handleExportCSV = () => {
        const header = 'Email,Nombre,Fuente,Fecha\n'
        const rows = filteredAndSorted.map(s =>
            `${s.email},"${(s.name || '').replace(/"/g, '""')}","${s.source}",${new Date(s.created_at).toLocaleString('es-PE')}`
        ).join('\n')
        const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' })
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white">Suscriptores</h1>
                        <p className="text-xs text-white/40 mt-0.5">Lista de emails del newsletter</p>
                    </div>
                </div>
                <Button onClick={handleExportCSV} disabled={filteredAndSorted.length === 0} className="bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white border-0 min-h-11 w-full sm:w-auto">
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
                <div className="p-3 sm:p-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
                            className="pl-9 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 h-10 text-sm"
                        />
                    </div>
                    {/* Page size selector */}
                    <div className="flex items-center gap-2 text-sm text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-md px-3 h-10">
                        <span className="hidden sm:inline">Mostrar</span>
                        <select
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                            className="bg-transparent text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-fc-blue/50 outline-none"
                        >
                            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s} className="bg-[var(--color-admin-surface)]">{s}</option>)}
                        </select>
                        <span className="hidden sm:inline">por página</span>
                    </div>
                </div>

                <CardContent className="p-0">
                    {filteredAndSorted.length === 0 ? (
                        <div className="p-8 text-center text-white/30 text-sm">
                            {searchTerm ? 'Sin resultados' : 'No hay suscriptores'}
                        </div>
                    ) : (
                        <>
                            {/* Mobile list */}
                            <div className="lg:hidden divide-y divide-white/[0.04]">
                                {paginated.map(sub => (
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
                                        <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                            <th className="text-left py-3 px-5">
                                                <button onClick={() => handleSort('email')} className="text-[11px] uppercase tracking-wider text-white/40 font-semibold hover:text-white transition-colors flex items-center group w-full text-left">
                                                    Email <SortIcon field="email" current={sortField} dir={sortDir} />
                                                </button>
                                            </th>
                                            <th className="text-left py-3 px-5">
                                                <button onClick={() => handleSort('name')} className="text-[11px] uppercase tracking-wider text-white/40 font-semibold hover:text-white transition-colors flex items-center group w-full text-left">
                                                    Nombre <SortIcon field="name" current={sortField} dir={sortDir} />
                                                </button>
                                            </th>
                                            <th className="text-left py-3 px-5">
                                                <button onClick={() => handleSort('source')} className="text-[11px] uppercase tracking-wider text-white/40 font-semibold hover:text-white transition-colors flex items-center group w-full text-left">
                                                    Fuente <SortIcon field="source" current={sortField} dir={sortDir} />
                                                </button>
                                            </th>
                                            <th className="text-left py-3 px-5">
                                                <button onClick={() => handleSort('created_at')} className="text-[11px] uppercase tracking-wider text-white/40 font-semibold hover:text-white transition-colors flex items-center group w-full text-left">
                                                    Fecha <SortIcon field="created_at" current={sortField} dir={sortDir} />
                                                </button>
                                            </th>
                                            <th className="text-right text-[11px] uppercase tracking-wider text-white/30 font-medium px-5 py-3 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {paginated.map(sub => (
                                            <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-3 text-sm text-white/80">{sub.email}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{sub.name || '-'}</td>
                                                <td className="px-5 py-3">
                                                    <Badge variant="secondary" className="bg-white/[0.04] text-white/50 border-0 text-[10px] uppercase tracking-wider">{sub.source}</Badge>
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

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="p-3 sm:p-4 border-t border-white/[0.06] flex items-center justify-between">
                                    <span className="text-xs text-white/40">
                                        Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredAndSorted.length)} de {filteredAndSorted.length}
                                    </span>
                                    <div className="flex gap-1 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="h-8 bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.06]"
                                        >
                                            Anterior
                                        </Button>
                                        <div className="hidden sm:flex items-center gap-1 px-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                                .map((p, i, arr) => (
                                                    <div key={p} className="flex items-center">
                                                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-white/20 select-none">...</span>}
                                                        <button
                                                            onClick={() => setPage(p)}
                                                            className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${page === p ? 'bg-fc-cyan/10 text-fc-cyan' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="h-8 bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.06]"
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
