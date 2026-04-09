'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Analytics = dynamic(
    () => import('@vercel/analytics/next').then(m => m.Analytics),
    { ssr: false }
);

const SpeedInsights = dynamic(
    () => import('@vercel/speed-insights/next').then(m => m.SpeedInsights),
    { ssr: false }
);

export default function ClientAnalytics() {
    const [consent, setConsent] = useState<boolean | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('cookie_consent');
        if (stored === 'accepted') setConsent(true);
        else if (stored === 'rejected') setConsent(false);
        else setConsent(null); // pending user decision

        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setConsent(detail);
        };

        window.addEventListener('cookie_consent', handler);
        return () => window.removeEventListener('cookie_consent', handler);
    }, []);

    // Don't load analytics until consent is explicitly accepted
    if (consent !== true) return null;

    return (
        <>
            <Analytics mode="auto" />
            <SpeedInsights sampleRate={0.3} />
        </>
    );
}
