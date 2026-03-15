import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/ScrollRevealProvider';
import MainPadding from '@/components/MainPadding';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            <main className="flex-1">
                <ScrollRevealProvider>
                    <MainPadding>
                        {children}
                    </MainPadding>
                </ScrollRevealProvider>
            </main>
            <Footer />
        </>
    )
}
