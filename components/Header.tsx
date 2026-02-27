'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

const NAV_ITEMS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Categorías', href: '#', hasMegaMenu: true },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Apps', href: '/apps' },
  { label: 'Sobre Mí', href: '/sobre-mi' },
];

const MEGA_MENU = {
  columns: [
    {
      title: 'BIM & Construcción',
      description: 'Normativa, implementación y flujos BIM en Perú',
      links: [
        { label: 'BIM Perú', href: '/blog?cat=bim-peru', icon: '🏗️' },
        { label: 'Análisis Estructural', href: '/blog?cat=analisis-estructural', icon: '🏛️' },
        { label: 'Normativa', href: '/blog?cat=normativa', icon: '📋' },
      ],
    },
    {
      title: 'Software & Herramientas',
      description: 'Tutoriales de las herramientas que usamos a diario',
      links: [
        { label: 'Autodesk Revit', href: '/blog?cat=revit', icon: '🖥️' },
        { label: 'Robot Structural', href: '/blog?cat=robot-structural', icon: '🔧' },
        { label: 'Civil 3D', href: '/blog?cat=civil-3d', icon: '🛣️' },
      ],
    },
    {
      title: 'Automatización',
      description: 'Programa y automatiza tu flujo de trabajo',
      links: [
        { label: 'Dynamo', href: '/blog?cat=dynamo', icon: '⚡' },
        { label: 'Python + BIM', href: '/blog?cat=python', icon: '🐍' },
        { label: 'Excel / Plantillas', href: '/blog?cat=excel', icon: '📊' },
      ],
    },
  ],
  featured: {
    image: '/images/blog/bim-peru-2026.svg',
    title: 'BIM obligatorio en Perú desde 2026',
    description: 'Todo lo que necesitas saber sobre la implementación BIM obligatoria.',
    href: siteConfig.megaMenuFeaturedPost.url,
    cta: 'LEER ARTÍCULO',
  },
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b transition-all duration-200 ${scrolled ? 'border-surface-200 shadow-sm' : 'border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="FreeCloud logo"
              width={56}
              height={56}
              className="object-contain"
              priority
              fetchPriority="high"
            />
            <div className="flex flex-col">
              <span className="font-brand font-black text-lg text-fc-navy leading-tight">
                <span style={{ color: '#D4940A', fontFamily: 'var(--font-logo-free)', fontWeight: 300, letterSpacing: '0.04em' }}>FREE</span><span style={{ color: '#1565C0', fontFamily: 'var(--font-logo-cloud)', fontWeight: 800 }}>CLOUD</span>
              </span>
              <span className="text-[10px] text-fc-text-muted font-slogan tracking-[0.18em] uppercase leading-none">
                BIM &amp; Ingeniería
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              item.hasMegaMenu ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${megaOpen
                      ? 'text-fc-blue bg-fc-cyan/10'
                      : 'text-surface-600 hover:text-fc-blue hover:bg-fc-cyan/10'
                      }`}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-fc-blue rounded-lg hover:bg-fc-cyan/10 transition-all duration-200"
                >
                  {item.label}
                </Link>
              )
            ))}
            {/* CTA */}
            <Link
              href="/recursos"
              className="ml-3 px-5 py-2 bg-fc-navy text-white text-sm font-semibold rounded-full hover:bg-fc-navy-deep transition-all duration-200 shadow-sm shadow-fc-navy/25"
            >
              Descargar Gratis
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-surface-600 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú principal'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mega Menu — Dataiku style */}
      {megaOpen && (
        <div
          className="hidden md:block absolute top-full left-0 right-0 bg-surface-50 border-b border-surface-200 shadow-xl animate-fade-in"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Columns */}
            <div className="grid grid-cols-3 gap-10">
              {MEGA_MENU.columns.map(col => (
                <div key={col.title}>
                  <h3 className="font-display font-bold text-surface-900 text-base mb-1">
                    {col.title}
                  </h3>
                  <p className="text-xs text-surface-400 mb-4">
                    {col.description}
                  </p>
                  <ul className="space-y-1">
                    {col.links.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-sm text-surface-600 hover:text-fc-blue hover:bg-white transition-all duration-150"
                          onClick={() => setMegaOpen(false)}
                        >
                          <span className="text-base">{link.icon}</span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-surface-200 mt-8 pt-6">
              {/* Featured section — like Dataiku's bottom CTA */}
              <Link
                href={MEGA_MENU.featured.href}
                className="flex items-center gap-6 group"
                onClick={() => setMegaOpen(false)}
              >
                <div className="w-24 h-16 bg-white rounded-lg border border-surface-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <span className="text-3xl">🏗️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-surface-500 mb-0.5">
                    {MEGA_MENU.featured.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fc-gold uppercase tracking-wider group-hover:gap-2.5 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                    {MEGA_MENU.featured.cta}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden py-4 border-t border-surface-100 animate-fade-in bg-white">
          {NAV_ITEMS.map(item => (
            item.hasMegaMenu ? (
              <div key={item.label}>
                <p className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Categorías
                </p>
                {MEGA_MENU.columns.map(col => (
                  <div key={col.title} className="mb-2">
                    <p className="px-3 py-1 text-xs font-bold text-surface-700">
                      {col.title}
                    </p>
                    {col.links.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-6 py-2 text-sm text-surface-600 hover:text-fc-blue"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.icon} {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:text-fc-blue"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          <div className="px-3 pt-3">
            <Link
              href="/recursos"
              className="block w-full text-center px-4 py-2.5 bg-fc-navy text-white text-sm font-semibold rounded-full hover:bg-fc-navy-deep transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Descargar Gratis
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
