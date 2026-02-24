'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, FolderTree, PlusCircle, LogOut, MessageSquare, ChevronRight, Menu, X } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Nueva Publicación', href: '/admin/posts/new', icon: PlusCircle },
    { name: 'Categorías', href: '/admin/categories', icon: FolderTree },
    { name: 'Contactos', href: '/admin/contacts', icon: MessageSquare },
]

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
    return (
        <>
            {/* Logo */}
            <div className="p-5 mb-2">
                <Link href="/admin" className="flex items-center gap-3 group" onClick={onNavigate}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300 shrink-0">
                        <span className="text-white font-bold text-sm font-grotesk">FC</span>
                    </div>
                    <div>
                        <h1 className="text-[15px] font-bold font-grotesk text-white leading-tight">FreeCloud</h1>
                        <p className="text-[10px] text-teal-400/70 font-medium tracking-widest uppercase">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-0.5">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">Menú</p>
                {navItems.map((item) => {
                    // Find the best match by checking which matching href is the longest
                    const isBestMatch = navItems.reduce((best, curr) => {
                        return pathname.startsWith(curr.href) && curr.href.length > best.href.length ? curr : best
                    }, { href: '' }).href === item.href

                    const isActive = item.href === '/admin' ? pathname === '/admin' : isBestMatch

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative min-h-11 ${isActive
                                ? 'bg-gradient-to-r from-teal-500/15 to-transparent text-teal-400 shadow-sm'
                                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-400 rounded-r-full" />
                            )}
                            <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-white/30 group-hover:text-white/60'}`} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-400/50" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom - User & Logout */}
            <div className="p-3 mt-auto">
                <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white/80 truncate">Administrador</p>
                            <p className="text-[10px] text-white/30 truncate">admin@freecloud.pe</p>
                        </div>
                    </div>
                </div>
                <form action={logout}>
                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 min-h-11">
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </form>
            </div>
        </>
    )
}

export function MobileHeader({ pathname }: { pathname: string }) {
    const [open, setOpen] = useState(false)

    return (
        <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-[#0f0f1a]/95 backdrop-blur-md border-b border-white/[0.06]">
            <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs font-grotesk">FC</span>
                </div>
                <span className="text-sm font-bold font-grotesk text-white">FreeCloud</span>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/[0.06] min-h-11 min-w-11">
                        <Menu className="w-5 h-5" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-[#0f0f1a] via-[#111127] to-[#0a0a18] border-r border-white/[0.06] flex flex-col">
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                    <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>
        </header>
    )
}

export default function AdminSidebar() {
    const pathname = usePathname()

    if (pathname === '/admin/login') return null

    return (
        <>
            {/* Mobile Header with Drawer */}
            <MobileHeader pathname={pathname} />

            {/* Desktop Sidebar - hidden on mobile, visible on lg+ */}
            <aside className="hidden lg:flex w-64 min-h-screen flex-col fixed left-0 top-0 z-40 bg-gradient-to-b from-[#0f0f1a] via-[#111127] to-[#0a0a18] border-r border-white/[0.06]">
                <SidebarContent pathname={pathname} />
            </aside>
        </>
    )
}
