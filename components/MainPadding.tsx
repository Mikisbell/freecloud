'use client';

import { usePathname } from 'next/navigation';

/**
 * Agrega pt-20 (80px) en páginas que no son la homepage.
 * La homepage maneja su propio padding dentro del HeroSaaS (pt-32).
 */
export default function MainPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className={`relative ${isHome ? '' : 'pt-20'}`}>
      {!isHome && (
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.1] -z-10 pointer-events-none bg-repeat"></div>
      )}
      {children}
    </div>
  );
}
