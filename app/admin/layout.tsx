import React, { Suspense } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import { getContacts } from '@/lib/supabase';

export const metadata = {
    title: 'FreeCloud CMS Admin',
}

export default async function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    // Fetch unread contacts count (silently fail if auth not yet set up)
    let unreadContacts = 0;
    try {
        const contacts = await getContacts();
        unreadContacts = contacts.filter(c => !c.read).length;
    } catch {
        // Not authenticated or contacts table unavailable; badge stays at 0
    }

    return (
        <div className="min-h-screen bg-admin-bg text-white">
            {/* Subtle grid pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            {/* Glow effects */}
            <div className="fixed top-0 left-64 w-96 h-96 bg-fc-blue/[0.03] rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-violet-500/[0.02] rounded-full blur-[128px] pointer-events-none" />

            <Suspense fallback={<div className="lg:w-64" />}>
                <AdminSidebar unreadContacts={unreadContacts} />
            </Suspense>
            {/* Mobile: full width, no margin. Desktop (lg+): margin for fixed sidebar */}
            <main className="relative z-10 p-4 sm:p-6 lg:ml-64 lg:p-8">
                {children}
            </main>
        </div>
    )
}
