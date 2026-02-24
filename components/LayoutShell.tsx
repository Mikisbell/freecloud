'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import ScrollRevealProvider from './ScrollRevealProvider'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <ScrollRevealProvider>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </ScrollRevealProvider>
    )
}
