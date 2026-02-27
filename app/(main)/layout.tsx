import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/ScrollRevealProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
