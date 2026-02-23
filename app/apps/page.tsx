import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Ruler, Layers, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Web Apps - Herramientas Online para Ingenieros',
  description: 'Calculadoras y herramientas online gratuitas para ingeniería civil: sísmica E.030, predimensionamiento, combinaciones de carga.',
};

const APPS = [
  {
    title: 'Calculadora Sísmica E.030',
    description: 'Calcula la fuerza cortante basal según la norma E.030 de diseño sismorresistente del Perú.',
    href: '/apps/calculadora-sismica',
    icon: Calculator,
    status: 'live',
  },
  {
    title: 'Predimensionamiento Estructural',
    description: 'Calcula dimensiones iniciales de vigas, columnas y losas según norma peruana.',
    href: '#',
    icon: Ruler,
    status: 'pronto',
  },
  {
    title: 'Combinaciones de Carga',
    description: 'Genera tabla de combinaciones de carga según norma E.020 y E.030.',
    href: '#',
    icon: Layers,
    status: 'pronto',
  },
  {
    title: 'Conversor de Unidades',
    description: 'Convierte unidades de ingeniería: fuerzas, presiones, momentos, áreas.',
    href: '#',
    icon: Zap,
    status: 'pronto',
  },
];

export default function AppsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-3">
          🧮 Web Apps
        </h1>
        <p className="text-surface-500 max-w-2xl">
          Herramientas online gratuitas para agilizar tu trabajo como ingeniero. Todas funcionan directamente en tu navegador.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {APPS.map(app => (
          <Link
            key={app.title}
            href={app.href}
            className={`group block p-6 bg-white border rounded-xl transition-all ${
              app.status === 'live'
                ? 'border-surface-100 hover:border-brand-300 hover:shadow-lg card-hover'
                : 'border-dashed border-surface-200 opacity-60 pointer-events-none'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors flex-shrink-0">
                <app.icon className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                    {app.title}
                  </h2>
                  {app.status === 'pronto' && (
                    <span className="px-2 py-0.5 bg-surface-100 text-surface-500 text-xs rounded-full">
                      Próximamente
                    </span>
                  )}
                </div>
                <p className="text-sm text-surface-500">{app.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
