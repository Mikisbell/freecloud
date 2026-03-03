import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Web Apps - Herramientas Online para Ingenieros',
    description: 'Calculadoras y herramientas online gratuitas para ingeniería civil: sísmica E.030, predimensionamiento, combinaciones de carga.',
    openGraph: {
        type: 'website',
        locale: 'es_PE',
        title: 'FreeCloud Apps - Herramientas de Ingeniería',
        description: 'Calculadoras online interactivas para diseño en ingeniería civil. Software gratuito.',
        siteName: 'FreeCloud.pe',
    },
};

export default function AppsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-surface-50/30">
            {/* Decorative background grid for apps */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
