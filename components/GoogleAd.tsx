'use client';

import React, { useEffect, useRef } from 'react';

interface GoogleAdProps {
    adClient?: string;
    adSlot: string;
    adStyle?: React.CSSProperties;
    adFormat?: string;
    fullWidthResponsive?: boolean;
}

export default function GoogleAd({
    adClient = process.env.NEXT_PUBLIC_ADSENSE_ID || '',
    adSlot,
    adStyle = { display: 'block', minHeight: '250px' },
    adFormat = 'auto',
    fullWidthResponsive = true,
}: GoogleAdProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && !(window as any).adsbygoogle?.loaded) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error('AdSense initialization error:', e);
        }
    }, []);

    if (!adClient) return null;

    return (
        <div className="w-full relative min-h-[250px] bg-neutral-100/50 dark:bg-neutral-800/20 overflow-hidden flex items-center justify-center my-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
            {/* Skeletons/Fallback in case AD fails to load or Adblock is active */}
            <span className="text-xs text-neutral-400 absolute z-0 select-none uppercase tracking-wider font-mono">Espacio Publicitario</span>
            <ins
                ref={adRef}
                className="adsbygoogle relative z-10 w-full"
                style={adStyle}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
}
