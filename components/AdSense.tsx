'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId || !containerRef.current || initialized.current) return;

    const container = containerRef.current;

    const pushAd = () => {
      if (initialized.current) return;

      const insElement = container.querySelector('ins');
      if (!insElement) return;

      // Already filled by AdSense (e.g. HMR reload)
      if (insElement.getAttribute('data-adsbygoogle-status') === 'done') {
        initialized.current = true;
        return;
      }

      // Container must have a real width before pushing
      const width = container.getBoundingClientRect().width;
      if (width === 0) return;

      initialized.current = true;
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e: any) {
        // Suppress harmless dev-mode errors caused by Strict Mode double-invoke / HMR
        if (process.env.NODE_ENV !== 'production') {
          const msg = e?.message || String(e);
          if (msg.includes('No slot size') || msg.includes('already have ads')) return;
        }
        console.error('AdSense error:', e);
      }
    };

    // Use IntersectionObserver so the ad only loads when the element enters the viewport
    // AND has a non-zero size, avoiding the "availableWidth=0" error.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pushAd();
            observer.disconnect();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [adsenseId]);

  if (!adsenseId) return null;

  return (
    <div ref={containerRef} className={`adsense-container ${className}`}>
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
