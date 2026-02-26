'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Componente AdSense con altura reservada para prevenir CLS
 * 
 * Uso:
 * <AdSense slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE!} format="auto" responsive />
 */
export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = '',
}: AdSenseProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (!clientId || !slot) {
    return null;
  }

  // Altura mínima reservada según formato para prevenir CLS
  const minHeights: Record<string, string> = {
    auto: '250px',
    fluid: '100px',
    rectangle: '250px',
    vertical: '600px',
    horizontal: '90px',
  };

  const containerStyle: React.CSSProperties = {
    minHeight: minHeights[format] || '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <div className={`adsense-container ${className}`} style={containerStyle}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: minHeights[format] || '250px',
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
