'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Sobre Mí', href: '/sobre-mi' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              width={128}
              height={32}
              sizes="(max-width: 768px) 112px, 128px"
              className="object-contain h-7 w-auto md:h-8"
              priority
              fetchPriority="high"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-fc-blue rounded-lg hover:bg-fc-cyan/10 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
            {/* CTA */}
            <Link
              href="/sobre-mi#contacto"
              className="ml-3 px-5 py-2.5 bg-fc-navy text-white text-sm font-semibold rounded-lg hover:bg-fc-navy-deep transition-all duration-200 shadow-sm shadow-fc-navy/25"
            >
              Solicitar Cotización
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden py-4 border-t border-surface-100 animate-fade-in bg-white shadow-lg absolute w-full left-0">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 hover:text-fc-blue"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-4 pt-4 pb-2">
            <Link
              href="/sobre-mi#contacto"
              className="block w-full text-center px-4 py-3 bg-fc-navy text-white text-sm font-semibold rounded-lg hover:bg-fc-navy-deep transition-colors shadow-sm"
              onClick={() => setMobileOpen(false)}
            >
              Solicitar Cotización
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
