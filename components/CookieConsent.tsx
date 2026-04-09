'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (stored === 'accepted') {
      setConsent(true);
      return;
    }
    if (stored === 'rejected') {
      setConsent(false);
      return;
    }
    // No consent stored yet — show banner
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setConsent(true);
    setVisible(false);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('cookie_consent', { detail: true }));
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setConsent(false);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie_consent', { detail: false }));
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
                  Puedes aceptar o rechazar las cookies no esenciales.
                  Más info en nuestra{' '}
                  <a href="/politica-de-privacidad#cookies" className="text-fc-cyan hover:underline">
                    Política de Privacidad y Cookies
                  </a>.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={reject}
                className="px-4 py-2 text-xs text-white/50 hover:text-white/70 border border-white/10 rounded-full transition-colors"
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
