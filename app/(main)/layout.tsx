import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/ScrollRevealProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-1">
                <ScrollRevealProvider>
                    {children}
                </ScrollRevealProvider>
            </main>
            <Footer />
        </>
    )
}
