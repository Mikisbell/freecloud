'use client';

import AdSense from './AdSense';

/**
 * AdSense optimizado para sidebar
 * Formato: Vertical (300x600 o 160x600)
 * Posición: Sidebar sticky
 */
export default function AdSenseSidebar() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;

  if (!slot) return null;

  return (
    <div className="sticky top-24">
      <p className="text-xs text-surface-400 text-center mb-2 uppercase tracking-wider">
        Publicidad
      </p>
      <AdSense
        slot={slot}
        format="vertical"
        responsive={false}
        style={{ maxWidth: '300px', margin: '0 auto' }}
      />
    </div>
  );
}
