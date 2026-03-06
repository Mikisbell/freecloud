import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-display font-black text-fc-navy-deep mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-surface-900 mb-4">
          Página no encontrada
        </h2>
        <p className="text-surface-500 mb-8 leading-relaxed">
          La página que buscas no existe o fue movida. Prueba navegando desde el inicio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-fc-blue text-white font-bold rounded-xl hover:bg-fc-navy transition-colors"
          >
            Ir al Inicio
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-surface-200 text-surface-700 font-medium rounded-xl hover:bg-surface-50 transition-colors"
          >
            Ver el Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
