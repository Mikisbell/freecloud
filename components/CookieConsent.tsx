'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after 1 second
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-admin-surface-2 border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Icon + Text */}
            <div className="flex-1 flex items-start gap-3">
              <div className="w-8 h-8 bg-fc-cyan/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm">🍪</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80 leading-snug">
                  Usamos cookies para mejorar tu experiencia, analizar tráfico y personalizar contenido.
                  Al continuar navegando, aceptas nuestra{' '}
                  <a href="/politica-de-privacidad" className="text-fc-cyan hover:underline">
                    Política de Privacidad
                  </a>
                  {' '}y el uso de cookies según nuestra{' '}
                  <a href="/terminos-de-uso" className="text-fc-cyan hover:underline">
                    Política de Cookies
                  </a>.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={reject}
                className="px-4 py-2 text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={accept}
                className="px-5 py-2 bg-fc-cyan text-fc-navy text-xs font-bold rounded-full hover:bg-fc-cyan-light transition-colors shadow-lg shadow-fc-cyan/20"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
