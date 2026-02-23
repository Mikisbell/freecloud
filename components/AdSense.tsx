'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId || !adRef.current) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [adsenseId]);

  if (!adsenseId) return null;

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Pre-configured ad components
export function AdInArticle({ slot }: { slot: string }) {
  return <AdSense slot={slot} format="auto" className="my-8" />;
}

export function AdSidebar({ slot }: { slot: string }) {
  return <AdSense slot={slot} format="rectangle" className="sticky top-20" />;
}

export function AdBanner({ slot }: { slot: string }) {
  return <AdSense slot={slot} format="horizontal" className="my-4" />;
}
