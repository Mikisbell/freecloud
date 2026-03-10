import { Software } from '@/types/supabase';
import Image from 'next/image';

interface SoftwareCompareHeroProps {
  a: Software;
  b: Software;
}

export function SoftwareCompareHero({ a, b }: SoftwareCompareHeroProps) {
  return (
    <div className="relative isolate overflow-hidden bg-background pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 border-b">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
            {a.name} <span className="text-muted-foreground font-light">vs</span> {b.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
            Comparativa técnica detallada para que elijas la mejor herramienta BIM en 2026.
          </p>
        </div>
        
        {/* Logos/Boxes Area */}
        <div className="mt-16 flex justify-center items-center gap-4 sm:gap-12">
          {/* Software A */}
          <div className="flex flex-col items-center gap-4 p-6 sm:p-10 rounded-2xl bg-card border shadow-sm flex-1 max-w-sm">
            {a.logo_url ? (
              <Image src={a.logo_url} alt={`Logo de ${a.name}`} width={80} height={80} className="h-20 w-auto object-contain" />
            ) : (
              <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                {a.name.charAt(0)}
              </div>
            )}
            <h2 className="text-2xl font-bold">{a.name}</h2>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {a.category}
            </span>
          </div>

          <div className="hidden sm:flex text-6xl font-black text-muted-foreground/30">VS</div>

          {/* Software B */}
          <div className="flex flex-col items-center gap-4 p-6 sm:p-10 rounded-2xl bg-card border shadow-sm flex-1 max-w-sm">
            {b.logo_url ? (
              <Image src={b.logo_url} alt={`Logo de ${b.name}`} width={80} height={80} className="h-20 w-auto object-contain" />
            ) : (
              <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                {b.name.charAt(0)}
              </div>
            )}
            <h2 className="text-2xl font-bold">{b.name}</h2>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {b.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
