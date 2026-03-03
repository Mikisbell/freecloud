'use client';

import React, { useEffect, useRef } from 'react';

interface GoogleAdProps {
    adClient?: string;
    adSlot: string;
    adStyle?: React.CSSProperties;
    adFormat?: string;
    adLayout?: string;        // in-article: "in-article"
    adLayoutKey?: string;     // in-feed: ej. "-69+dp-1a-bl+i7"
    fullWidthResponsive?: boolean;
    /** Altura mínima reservada en el servidor para evitar CLS */
    reservedHeight?: number;
}

export default function GoogleAd({
    adClient = process.env.NEXT_PUBLIC_ADSENSE_ID || '',
    adSlot,
    adStyle,
    adFormat = 'auto',
    adLayout,
    adLayoutKey,
    fullWidthResponsive = true,
    reservedHeight = 250,
}: GoogleAdProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        // En desarrollo evitamos llamar a AdSense (Google bloquea con 403 localhost)
        if (process.env.NODE_ENV === 'development') return;

        if (!adClient || !adSlot || adSlot === 'XXXXXXXXXX') return;
        try {
            if (typeof window !== 'undefined') {
                const adsbygoogle = (window as any).adsbygoogle || [];
                // Only push if this ad slot hasn't been initialized yet
                if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
                    adsbygoogle.push({});
                }
            }
        } catch (e) {
            // Silently handle AdSense errors (like double push warning from adblockers/etc)
            console.warn('AdSense initialization warning:', e);
        }
    }, [adClient, adSlot]);

    // No renderizar en desarrollo para evitar errores 403 de Google AdSense
    if (process.env.NODE_ENV === 'development') return (
        <div
            className="w-full relative overflow-hidden my-6 rounded-md bg-surface-100/50 border border-surface-200 border-dashed flex items-center justify-center text-surface-400 text-xs font-mono"
            style={{ minHeight: `${reservedHeight}px` }}
        >
            [AdSense Mock: Blocked in Localhost]
        </div>
    );

    // No renderizar si faltan datos críticos en producción
    if (!adClient || !adSlot || adSlot === 'XXXXXXXXXX') return null;

    const computedStyle: React.CSSProperties = {
        display: 'block',
        // in-article usa text-align center
        ...(adLayout === 'in-article' ? { textAlign: 'center' } : {}),
        minHeight: `${reservedHeight}px`,
        width: '100%',
        ...adStyle,
    };

    return (
        // Reserva espacio + skeleton visual → Lighthouse lo ve como "completo" en Speed Index
        // ▶ FIX: Si el ad no tiene fill (data-ad-status="unfilled"), ocultamos el wrapper completo
        // esto evita las "cajas grises vacías" que empujan contenido y empeoran UX.
        <div
            className="w-full relative overflow-hidden my-6 rounded-md bg-surface-50 has-[ins[data-ad-status='unfilled']]:hidden"
            style={{ minHeight: `${reservedHeight}px` }}
        >
            {/* Shimmer skeleton mientras el ad carga (mejora Speed Index) */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-surface-50 via-surface-100 to-surface-50 animate-pulse pointer-events-none"
                aria-hidden="true"
            />
            <ins
                ref={adRef}
                className="adsbygoogle relative z-10 w-full"
                style={computedStyle}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
                {...(adLayoutKey ? { 'data-ad-layout-key': adLayoutKey } : {})}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
}
