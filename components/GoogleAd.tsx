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
        if (!adClient || !adSlot || adSlot === 'XXXXXXXXXX') return;
        try {
            if (typeof window !== 'undefined') {
                ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
                    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error('AdSense initialization error:', e);
        }
    }, [adClient, adSlot]);

    // No renderizar si faltan datos críticos
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
        // Reserva espacio desde el servidor para prevenir CLS
        <div
            className="w-full relative overflow-hidden my-6"
            style={{ minHeight: `${reservedHeight}px` }}
        >
            {/* Contenedor transparente para CLS, sin texto visible que penalice AdSense */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true" />
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
