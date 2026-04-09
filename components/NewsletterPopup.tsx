'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Send } from 'lucide-react';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('newsletter_dismissed', 'true');
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={dismiss}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1 text-surface-400 hover:text-surface-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-surface-900 mb-2">¡Suscrito!</h3>
            <p className="text-surface-600">Recibirás contenido nuevo cada semana. Sin spam, lo prometo.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-fc-navy to-fc-blue p-8 pb-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Contenido BIM gratuito cada semana
              </h3>
              <p className="text-white/80 text-sm">
                Tutoriales, tips y recursos para ingenieros civiles en Perú. Sin spam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
              <div>
                <label htmlFor="popup-email" className="sr-only">Email</label>
                <input
                  id="popup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fc-blue/30 focus:border-fc-blue"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-fc-blue text-white font-semibold rounded-xl hover:bg-fc-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Suscribiendo...' : 'Suscribirme Gratis'}
              </button>
              <p className="text-xs text-center text-surface-400">
                +500 ingenieros ya reciben contenido semanal
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
