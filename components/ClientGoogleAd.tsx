'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

// GoogleAd es client-only (window.adsbygoogle) — carga deferida para no inflar el bundle SSR
// Regla: bundle-dynamic-imports (vercel-react-best-practices)
const GoogleAdInner = dynamic(() => import('./GoogleAd'), { ssr: false });

type GoogleAdProps = ComponentProps<typeof GoogleAdInner>;

export default function ClientGoogleAd(props: GoogleAdProps) {
    return <GoogleAdInner {...props} />;
}
