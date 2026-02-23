'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Code, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Blog', href: '/blog' },
  {
    label: 'Categorías',
    href: '#',
    children: [
      { label: '🏗️ BIM Perú', href: '/blog?cat=bim-peru' },
      { label: '🖥️ Revit', href: '/blog?cat=revit' },
      { label: '⚡ Dynamo', href: '/blog?cat=dynamo' },
      { label: '🐍 Python', href: '/blog?cat=python' },
      { label: '🔧 Robot Structural', href: '/blog?cat=robot-structural' },
      { label: '📊 Excel/Plantillas', href: '/blog?cat=excel' },
      { label: '🏛️ Análisis Estructural', href: '/blog?cat=analisis-estructural' },
    ],
  },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Apps', href: '/apps' },
  { label: 'Sobre Mí', href: '/sobre-mi' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-surface-900 leading-tight">
                FreeCloud
              </span>
              <span className="text-[10px] text-surface-400 font-medium tracking-wider uppercase leading-none">
                BIM &amp; Ingeniería
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-surface-100 py-2 animate-fade-in">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
            {/* CTA */}
            <Link
              href="/recursos"
              className="ml-3 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
            >
              Descargar Gratis
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-surface-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-surface-100 animate-fade-in">
            {NAV_ITEMS.map(item => (
              item.children ? (
                <div key={item.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-6 py-2 text-sm text-surface-600 hover:text-brand-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:text-brand-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <div className="px-3 pt-3">
              <Link
                href="/recursos"
                className="block w-full text-center px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Descargar Gratis
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
