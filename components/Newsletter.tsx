'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface NewsletterProps {
  variant?: 'inline' | 'card';
}

export default function Newsletter({ variant = 'card' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [honey, setHoney] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _bot_honey: honey }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('¡Listo! Revisa tu correo.');
        setEmail('');
      } else {
        throw new Error('Error al suscribir');
      }
    } catch {
      setStatus('error');
      setMessage('Error. Intenta de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 ${variant === 'inline' ? 'text-white' : 'text-fc-navy'}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
          required
        />
        {/* Honeypot field invisible to humans */}
        <input
          type="text"
          name="_bot_honey"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 bg-white text-fc-navy-deep font-semibold text-sm rounded-full hover:bg-fc-blue/5 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Suscribir
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-gradient-to-br from-fc-blue/5 to-fc-cyan/10/50 border border-fc-cyan/20 rounded-2xl p-6">
      <h3 className="font-display font-bold text-surface-900 text-lg mb-1">
        📩 Newsletter semanal
      </h3>
      <p className="text-sm text-surface-600 mb-4">
        Tutoriales BIM, plantillas gratis y novedades de normativa peruana.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 px-4 py-2.5 border border-surface-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-fc-blue focus:border-fc-blue"
          required
        />
        {/* Honeypot field invisible to humans */}
        <input
          type="text"
          name="_bot_honey"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 bg-fc-blue text-white font-semibold text-sm rounded-full hover:bg-fc-navy transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Suscribirme
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-2">{message}</p>
      )}
      <p className="text-xs text-surface-400 mt-2">Sin spam. Cancela cuando quieras.</p>
    </div>
  );
}
