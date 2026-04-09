'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

/**
 * AdSense script that only loads when the user has accepted cookie consent.
 * GDPR/AdSense compliant.
 */
export default function CookieConsentAwareAdSense() {
    const [consent, setConsent] = useState<boolean | null>(null);
    const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

    useEffect(() => {
        const stored = localStorage.getItem('cookie_consent');
        if (stored === 'accepted') setConsent(true);
        else if (stored === 'rejected') setConsent(false);
        else setConsent(null);

        const handler = (e: Event) => {
            setConsent((e as CustomEvent).detail);
        };

        window.addEventListener('cookie_consent', handler);
        return () => window.removeEventListener('cookie_consent', handler);
    }, []);

    // Only load AdSense when consent is explicitly accepted
    if (consent !== true || !adsenseId) return null;

    return (
        <Script
            id="adsense-init"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
        />
    );
}
