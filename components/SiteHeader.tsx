'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Apps', href: '/apps' },
  { label: 'Contacto', href: '/sobre-mi#contacto' },
  { label: 'Sobre Mí', href: '/sobre-mi' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Home (HeroVands) tiene fondo claro → header nace transparente, texto oscuro siempre
  // Páginas internas → header nace con glass sólido
  const showGlass = !isHome || scrolled;

  const headerBg = showGlass
    ? 'bg-white/85 backdrop-blur-xl shadow-sm border-b border-black/[0.06]'
    : 'bg-transparent border-b border-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-6 md:px-12 lg:px-16 py-3 md:py-4">

        {/* Logo — siempre con colores originales, aislado de mix-blend-modes globales */}
        <Link href="/" aria-label="FreeCloud" className="flex items-center shrink-0 group">
          <Image
            src="/logo.png"
            alt="FreeCloud"
            width={300}
            height={50}
            sizes="(max-width: 768px) 110px, 140px"
            quality={85}
            loading="eager"
            priority
            className="w-[110px] md:w-[140px] h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] isolate mix-blend-normal"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            // Verificar si estamos en la ruta exacta o si es subruta (ej. /blog/articulo-1)
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-fc-blue bg-fc-cyan/10 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/sobre-mi#contacto"
            className="ml-3 px-5 py-2.5 rounded-xl bg-fc-navy text-white text-sm font-semibold tracking-wide hover:bg-fc-navy-deep hover:shadow-md hover:-translate-y-px transition-all duration-200 shadow-sm shadow-fc-navy/20"
          >
            Solicitar Cotización
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Menú"
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors duration-200"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-fc-cyan/10 text-fc-blue font-bold border-l-4 border-fc-blue'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-700 border-l-4 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-slate-100">
            <Link
              href="/sobre-mi#contacto"
              onClick={() => setMobileOpen(false)}
              className="flex justify-center w-full px-5 py-3 rounded-xl bg-fc-navy text-white text-sm font-semibold tracking-wide shadow-md"
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
