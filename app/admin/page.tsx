import { connection } from 'next/server'
import Link from 'next/link'
import { FileText, Eye, Users, MessageSquare, Edit3, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { getAdminPosts, getCategories, getContacts, getSubscribers, getPageViewStats, getDownloads } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
    await connection()

    const [posts, categories, contacts, subscribers, pageViews, downloads] = await Promise.all([
        getAdminPosts(),
        getCategories(),
        getContacts(),
        getSubscribers(),
        getPageViewStats(30),
        getDownloads(),
    ])

    const totalViews = pageViews.length
    const recentPosts = posts.slice(0, 5)
    const recentContacts = contacts.slice(0, 3)

    // 14-day sparkline data
    const sparklineDays = 14
    const dailyCounts: Record<string, number> = {}
    const now = new Date()
    for (let i = sparklineDays - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        dailyCounts[d.toISOString().split('T')[0]] = 0
    }
    for (const v of pageViews) {
        const day = v.created_at.split('T')[0]
        if (dailyCounts[day] !== undefined) dailyCounts[day]++
    }
    const sparkline = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
    const sparklineMax = Math.max(...sparkline.map(d => d.count), 1)

    const stats = [
        {
            label: 'Total Posts',
            value: posts.length,
            icon: FileText,
            gradient: 'from-blue-500/10 to-blue-600/5',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/10',
            href: '/admin/posts',
        },
        {
            label: 'Visitas (30d)',
            value: totalViews.toLocaleString(),
            icon: Eye,
            gradient: 'from-violet-500/10 to-violet-600/5',
            iconColor: 'text-violet-400',
            borderColor: 'border-violet-500/10',
            href: '/admin/stats',
        },
        {
            label: 'Suscriptores',
            value: subscribers.length,
            icon: Users,
            gradient: 'from-emerald-500/10 to-emerald-600/5',
            iconColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/10',
            href: '/admin/subscribers',
        },
        {
            label: 'Mensajes',
            value: contacts.length,
            icon: MessageSquare,
            gradient: 'from-amber-500/10 to-amber-600/5',
            iconColor: 'text-amber-400',
            borderColor: 'border-amber-500/10',
            href: '/admin/contacts',
        },
    ]

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white tracking-tight">Dashboard</h1>
                    <p className="text-xs sm:text-sm text-white/40 mt-0.5">Vision general de FreeCloud</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-fc-blue to-fc-navy hover:from-fc-cyan hover:to-fc-blue text-white shadow-lg shadow-fc-blue/20 hover:shadow-fc-blue/30 border-0 min-h-11 w-full sm:w-auto">
                    <Link href="/admin/posts/new">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Nuevo Post
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card className={`bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer`}>
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[11px] sm:text-[13px] text-white/50 font-medium">{stat.label}</h3>
                                    <stat.icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${stat.iconColor}`} />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white font-grotesk">{stat.value}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Traffic Sparkline */}
            <Card className="bg-white/[0.02] border-white/[0.06]">
                <CardHeader className="px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                            </div>
                            <CardTitle className="text-sm font-semibold text-white">Trafico (14 dias)</CardTitle>
                        </div>
                        <Link href="/admin/stats" className="text-xs text-fc-cyan hover:text-fc-cyan-light transition-colors flex items-center gap-1">
                            Ver mas <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-end gap-[3px] h-16 w-full">
                        {sparkline.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                                <div
                                    className="w-full bg-violet-400 rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity min-h-[2px]"
                                    style={{ height: `${Math.max((d.count / sparklineMax) * 100, 3)}%` }}
                                />
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {d.date.slice(5)}: {d.count}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-white/20">
                        <span>{sparkline[0]?.date.slice(5)}</span>
                        <span>Hoy</span>
                    </div>
                </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Recent Posts */}
                <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm">
                    <CardHeader className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <CardTitle className="text-sm font-semibold text-white">Ultimos Posts</CardTitle>
                            </div>
                            <Link href="/admin/posts" className="text-xs text-fc-cyan hover:text-fc-cyan-light transition-colors flex items-center gap-1">
                                Ver todos <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/[0.04]">
                            {recentPosts.length === 0 ? (
                                <div className="p-8 sm:p-10 text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" />
                                    </div>
                                    <p className="text-sm text-white/30">No hay posts todavia</p>
                                    <Link href="/admin/posts/new" className="text-xs text-fc-cyan mt-2 inline-block hover:underline">
                                        Empieza a escribir
                                    </Link>
                                </div>
                            ) : (
                                recentPosts.map(post => (
                                    <div key={post.id} className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="min-w-0 flex-1 mr-3">
                                            <h3 className="text-sm text-white/80 font-medium leading-snug truncate group-hover:text-white transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-white/30 mt-1">
                                                <span className="truncate">{post.categories?.emoji} {post.categories?.name || 'Sin categoria'}</span>
                                                <span className="hidden sm:inline">&middot;</span>
                                                <span className="hidden sm:inline">{new Date(post.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={`text-[10px] ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'} border-0`}>
                                                {post.status === 'published' ? 'Live' : 'Draft'}
                                            </Badge>
                                            <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-white/25 hover:text-fc-cyan transition-colors hidden sm:inline">
                                                Editar
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Contacts */}
                <Card className="bg-white/[0.02] border-white/[0.06] backdrop-blur-sm">
                    <CardHeader className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                                </div>
                                <CardTitle className="text-sm font-semibold text-white">Ultimos Mensajes</CardTitle>
                            </div>
                            <Link href="/admin/contacts" className="text-xs text-fc-cyan hover:text-fc-cyan-light transition-colors flex items-center gap-1">
                                Ir a Bandeja <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/[0.04]">
                            {recentContacts.length === 0 ? (
                                <div className="p-8 sm:p-10 text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" />
                                    </div>
                                    <p className="text-sm text-white/30">No hay mensajes nuevos</p>
                                    <p className="text-xs text-white/15 mt-1">Los mensajes del formulario de contacto apareceran aqui</p>
                                </div>
                            ) : (
                                recentContacts.map(contact => (
                                    <div key={contact.id} className="px-4 sm:px-5 py-3 sm:py-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${!contact.read ? 'bg-fc-blue/20 text-fc-cyan-light' : 'bg-white/[0.05] text-white/40'}`}>
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className={`text-sm font-medium truncate ${!contact.read ? 'text-white' : 'text-white/60'}`}>{contact.name}</h3>
                                                    <p className="text-[11px] text-white/25 truncate">{contact.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] text-white/20 hidden sm:inline">
                                                    {new Date(contact.created_at!).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                                                </span>
                                                {!contact.read && <span className="w-2 h-2 rounded-full bg-fc-cyan animate-pulse" />}
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/35 line-clamp-2 ml-[42px]">
                                            {contact.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
