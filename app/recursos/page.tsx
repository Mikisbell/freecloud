import { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileSpreadsheet, Code, Cpu, Box, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recursos - Plantillas, Scripts y Herramientas para Ingenieros',
  description: 'Descarga plantillas Excel, scripts Python, programas HP Prime y familias Revit para ingeniería civil y BIM en Perú.',
};

const PRODUCTS = [
  {
    title: 'Plantilla Excel - Diseño Sísmico E.030',
    description: 'Hoja de cálculo completa para análisis sísmico según norma E.030. Incluye espectro de diseño, distribución de fuerzas por piso y verificación de derivas.',
    price: 'S/ 25',
    priceUsd: '$7',
    icon: FileSpreadsheet,
    category: 'Excel',
    href: '#',
    tags: ['E.030', 'Sísmica', 'Excel'],
    badge: 'Popular',
  },
  {
    title: 'Pack Programas HP Prime - Análisis Estructural',
    description: 'Hardy Cross, método de rigidez directa, diagrama de momentos. 5 programas listos para tu calculadora.',
    price: 'S/ 35',
    priceUsd: '$10',
    icon: Cpu,
    category: 'HP Prime',
    href: '#',
    tags: ['HP Prime', 'Hardy Cross', 'Estructural'],
    badge: 'Nuevo',
  },
  {
    title: 'Plantilla Excel - Metrados de Obra',
    description: 'Plantilla profesional de metrados con formatos de partidas según normativa peruana. Incluye macros para resumen automático.',
    price: 'S/ 20',
    priceUsd: '$5',
    icon: FileSpreadsheet,
    category: 'Excel',
    href: '#',
    tags: ['Metrados', 'Excel', 'Presupuesto'],
  },
  {
    title: 'Pack Scripts Python para Revit',
    description: 'Automatiza tareas en Revit: renombrar elementos, extraer datos a Excel, generar vistas, verificar parámetros. 10 scripts con documentación.',
    price: 'S/ 50',
    priceUsd: '$15',
    icon: Code,
    category: 'Python',
    href: '#',
    tags: ['Python', 'Revit', 'Automatización'],
  },
  {
    title: 'Familias Revit - Estructural Perú',
    description: 'Pack de familias Revit adaptadas a perfiles y secciones comunes en Perú. Columnas, vigas, zapatas y placas.',
    price: 'S/ 40',
    priceUsd: '$12',
    icon: Box,
    category: 'Revit',
    href: '#',
    tags: ['Revit', 'Familias', 'BIM'],
  },
  {
    title: 'Plantilla Plan de Ejecución BIM (PEB)',
    description: 'Documento Word/PDF editable con la estructura completa del PEB según la Guía Nacional BIM Perú. Listo para tu proyecto.',
    price: 'S/ 60',
    priceUsd: '$18',
    icon: FileText,
    category: 'BIM',
    href: '#',
    tags: ['BIM', 'PEB', 'Normativa'],
    badge: 'Esencial',
  },
];

export default function RecursosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-3">
          📦 Recursos y Herramientas
        </h1>
        <p className="text-surface-500 max-w-2xl">
          Plantillas, scripts y herramientas profesionales para ingeniería civil y BIM.
          Creadas por un ingeniero, para ingenieros.
        </p>
      </div>

      {/* Free tools banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h2 className="font-display font-bold text-emerald-900 text-lg mb-1">
              🆓 ¿Buscas herramientas gratuitas?
            </h2>
            <p className="text-emerald-700 text-sm">
              Nuestras web apps son 100% gratis: calculadora sísmica E.030, predimensionamiento y más.
            </p>
          </div>
          <Link
            href="/apps"
            className="px-5 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            Ver Web Apps Gratis →
          </Link>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map(product => (
          <div
            key={product.title}
            className="bg-white border border-surface-100 rounded-xl overflow-hidden card-hover flex flex-col"
          >
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                    <product.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <span className="text-xs font-medium text-surface-400">{product.category}</span>
                </div>
                {product.badge && (
                  <span className="px-2.5 py-0.5 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-surface-900 mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-surface-500 mb-4 flex-1">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-surface-50 text-surface-500 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-50">
                <div>
                  <span className="text-xl font-display font-bold text-surface-900">{product.price}</span>
                  <span className="text-sm text-surface-400 ml-1.5">({product.priceUsd})</span>
                </div>
                <a
                  href={product.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Obtener
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom request */}
      <div className="mt-12 text-center bg-surface-50 rounded-2xl p-8">
        <h2 className="font-display font-bold text-surface-900 text-xl mb-2">
          ¿Necesitas algo personalizado?
        </h2>
        <p className="text-surface-500 text-sm mb-4 max-w-lg mx-auto">
          Puedo crear plantillas, scripts o herramientas a medida para tu proyecto o empresa.
          Consultoría BIM disponible.
        </p>
        <a
          href="mailto:contacto@freecloud.pe"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-900 text-white font-semibold text-sm rounded-lg hover:bg-surface-800 transition-colors"
        >
          Contactar →
        </a>
      </div>
    </div>
  );
}
