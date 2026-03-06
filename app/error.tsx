'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-display font-black text-fc-navy-deep mb-4">Error</h1>
        <h2 className="text-2xl font-display font-bold text-surface-900 mb-4">
          Algo salió mal
        </h2>
        <p className="text-surface-500 mb-8 leading-relaxed">
          Ocurrió un error inesperado. Intenta recargar la página.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-fc-blue text-white font-bold rounded-xl hover:bg-fc-navy transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
