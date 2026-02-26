'use client';

import AdSense from './AdSense';

/**
 * AdSense optimizado para artículos de blog
 * Formato: Auto responsive
 * Posición: Dentro del contenido del artículo
 */
export default function AdSenseArticle() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE;

  if (!slot) return null;

  return (
    <div className="my-12">
      <p className="text-xs text-surface-400 text-center mb-2 uppercase tracking-wider">
        Publicidad
      </p>
      <AdSense
        slot={slot}
        format="auto"
        responsive
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
