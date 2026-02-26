'use client';

import AdSense from './AdSense';

/**
 * AdSense In-Feed para listados de blog
 * Formato: Fluid (se adapta al contenido)
 * Posición: Entre cards de blog posts
 */
export default function AdSenseInFeed() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED;

  if (!slot) return null;

  return (
    <div className="my-6">
      <p className="text-xs text-surface-400 text-center mb-2 uppercase tracking-wider">
        Publicidad
      </p>
      <AdSense
        slot={slot}
        format="fluid"
        responsive
        className="w-full"
        style={{ minHeight: '150px' }}
      />
    </div>
  );
}
