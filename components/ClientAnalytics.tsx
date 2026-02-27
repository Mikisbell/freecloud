'use client';

import dynamic from 'next/dynamic';

// Defer Vercel Analytics after hydration — no bloquea el bundle inicial del servidor
// Regla: bundle-defer-third-party (vercel-react-best-practices)
const Analytics = dynamic(
    () => import('@vercel/analytics/next').then(m => m.Analytics),
    { ssr: false }
);

const SpeedInsights = dynamic(
    () => import('@vercel/speed-insights/next').then(m => m.SpeedInsights),
    { ssr: false }
);

export default function ClientAnalytics() {
    return (
        <>
            <Analytics mode="auto" />
            <SpeedInsights sampleRate={0.3} />
        </>
    );
}
