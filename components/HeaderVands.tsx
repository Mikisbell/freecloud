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

export default function HeaderVands() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          (mounted && scrolled) ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-black/5' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-6 md:px-12 lg:px-16 py-2 md:py-3">
        {/* Logo */}
        <Link href="/" aria-label="FreeCloud">
          <Image
            src="/logo.png"
            alt="FreeCloud"
            width={300}
            height={50}
            sizes="(max-width: 768px) 110px, 140px"
            quality={85}
            loading="eager"
            priority
            className="w-[100px] md:w-[135px] h-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium text-surface-700 hover:text-fc-blue hover:opacity-80 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sobre-mi#contacto"
            className="ml-2 px-5 py-2.5 bg-fc-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 shadow-sm"
          >
            Solicitar Cotización
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Menú"
          className="md:hidden p-2 text-black hover:opacity-60 focus:outline-none"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        </div>
      </header>

      {/* Mobile Nav fullscreen negro */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-8 text-white hover:opacity-60"
            aria-label="Cerrar menú"
          >
            <X size={28} />
          </button>
          <nav className="flex flex-col items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold uppercase tracking-widest text-white hover:opacity-60 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
