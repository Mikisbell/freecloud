'use client';

import { useEffect, useRef } from 'react';

/**
 * Giscus comments — GitHub-based, free, no moderation needed.
 * Uses GitHub Discussions as comment backend.
 * Requires: public GitHub repo with Giscus app installed.
 * See: https://giscus.app
 */
export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Mikisbell/freecloud');
    script.setAttribute('data-repo-id', 'R_kgDOOpq0dg');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOOpq0ds4C6cDt');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'es');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
      }
    };
  }, []);

  // Always show Giscus for now (configured for Mikisbell/freecloud)
  return (
    <section className="mt-16 pt-8 border-t border-surface-100">
      <h2 className="text-2xl font-display font-bold text-surface-900 mb-6">
        💬 Comentarios
      </h2>
      <div ref={containerRef} className="min-h-[200px]" />
    </section>
  );
}
