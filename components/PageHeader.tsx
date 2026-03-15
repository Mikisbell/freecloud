import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  description: React.ReactNode;
  badge?: string;
  badgeEmoji?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, badge, badgeEmoji, children }: PageHeaderProps) {
  return (
    <section className="bg-dataiku-navy text-white relative overflow-hidden pt-28 pb-12 border-b-4 border-fc-gold min-h-[360px] md:min-h-[400px] lg:min-h-[440px] flex flex-col items-center justify-center">
      {/* Fondo Arquitectónico Homogéneo */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dataiku-navy/50 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        {badge && (
          <p className="text-fc-cyan font-bold tracking-wider text-sm mb-4 uppercase">
            {badgeEmoji ? `${badgeEmoji} ` : ''}{badge}
          </p>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight max-w-4xl mx-auto">
          {title}
        </h1>
        
        <div className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
          {description}
        </div>

        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
