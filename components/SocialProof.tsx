'use client';

// SocialProof.tsx
// Barra horizontal de métricas animadas — Elemento 5 del framework de 11 elementos
// Se inserta bajo el Hero de la homepage para validación social inmediata

const STATS = [
    { value: '13', label: 'Artículos técnicos', suffix: '+' },
    { value: '500', label: 'Lectores/mes', suffix: '+' },
    { value: '3', label: 'Herramientas gratis', suffix: '' },
    { value: '100', label: 'Enfoque en Perú', suffix: '%', flag: '🇵🇪' },
];

export default function SocialProof() {
    return (
        <div className="relative overflow-hidden bg-white border-b border-surface-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-surface-100">
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="flex-1 min-w-[140px] flex flex-col items-center text-center py-2 md:py-0 animate-fade-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="text-2xl font-display font-black text-teal-600 leading-none">
                                {stat.value}
                                <span className="text-lg">{stat.suffix}</span>
                                {stat.flag && <span className="ml-1 text-lg">{stat.flag}</span>}
                            </div>
                            <p className="text-xs text-surface-400 mt-0.5 font-medium uppercase tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
