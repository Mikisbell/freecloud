'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SERVICES = [
  'Consultoría BIM',
  'Desarrollo de herramientas',
  'Capacitación BIM',
  'Otro',
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, message }),
      });

      if (!res.ok) throw new Error('Error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-fc-blue focus:border-transparent transition-all';

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle className="w-12 h-12 text-fc-cyan mb-4" />
        <h3 className="text-white font-display font-bold text-xl mb-2">
          ¡Mensaje recibido!
        </h3>
        <p className="text-surface-400 text-sm max-w-xs">
          Te respondo en menos de 48 horas. Mientras tanto, revisa el blog para más recursos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
          Servicio (opcional)
        </label>
        <select
          value={service}
          onChange={e => setService(e.target.value)}
          className={inputClass}
        >
          <option value="">¿En qué puedo ayudarte?</option>
          {SERVICES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
          Mensaje
        </label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Cuéntame sobre tu proyecto o consulta..."
          rows={4}
          className={inputClass + ' resize-none'}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Ocurrió un error. Intenta de nuevo o escribe a contacto@freecloud.pe</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto px-8 py-3 bg-fc-blue text-white font-semibold text-sm rounded-full hover:bg-fc-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-fc-blue/20"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje →'}
      </button>
    </form>
  );
}
