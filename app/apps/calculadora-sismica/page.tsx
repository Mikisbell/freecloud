import { Metadata } from 'next';
import SeismicCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Calculadora Sísmica E.030 Perú - Fuerza Cortante Basal',
  description: 'Calcula la fuerza cortante basal según la norma E.030 de diseño sismorresistente de Perú. Herramienta gratuita para ingenieros civiles.',
  keywords: ['calculadora sísmica', 'E.030', 'fuerza cortante basal', 'diseño sismorresistente', 'Perú', 'ingeniería civil'],
};

export default function CalculadoraSismicaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full mb-4">
          🧮 Herramienta gratuita
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-3">
          Calculadora Sísmica E.030
        </h1>
        <p className="text-surface-500 max-w-2xl">
          Calcula la fuerza cortante basal y el coeficiente sísmico según la norma E.030
          de diseño sismorresistente del Perú. Ingresa los parámetros de tu proyecto.
        </p>
      </div>

      <SeismicCalculator />

      <div className="mt-12 prose-blog">
        <h2>¿Cómo usar esta calculadora?</h2>
        <p>
          Esta herramienta implementa el cálculo de la fuerza cortante basal V = (ZUCS/R) × P
          según la Norma Técnica E.030 &quot;Diseño Sismorresistente&quot; del Reglamento Nacional
          de Edificaciones del Perú.
        </p>
        <h3>Parámetros</h3>
        <p>
          Z: Factor de zona sísmica. S: Factor de suelo. U: Factor de uso/importancia.
          C: Coeficiente de amplificación sísmica (depende del periodo). R: Coeficiente de
          reducción de fuerza sísmica. P: Peso total de la edificación.
        </p>
      </div>
    </div>
  );
}
