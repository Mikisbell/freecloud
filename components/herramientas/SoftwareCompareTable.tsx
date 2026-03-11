import { Software, SoftwareMetric } from '@/types/supabase';

interface SoftwareCompareTableProps {
  a: Software;
  b: Software;
}

// Interfaz para representar una fila consolidada
interface MetricRow {
  key: string;
  label: string;
  valA: React.ReactNode;
  valB: React.ReactNode;
}

// Diccionario opcional para humanizar las metric keys
const METRIC_LABELS: Record<string, string> = {
  'learning_curve': 'Curva de Aprendizaje (0-10)',
  'price_tier': 'Nivel de Precio',
  'ifc_support': 'Soporte Nivel IFC',
  'os_windows': 'Disponible en Windows',
  'os_mac': 'Disponible en Mac',
  'cloud_collaboration': 'Colaboración en la Nube',
  'api_automation': 'API / Automatización'
};

function formatMetricValue(m: SoftwareMetric | undefined): React.ReactNode {
  if (!m) return <span className="text-muted-foreground italic">N/D</span>;
  if (m.value_boolean !== null) {
    return m.value_boolean ? (
      <span className="text-green-600 font-bold">✓ Sí</span>
    ) : (
      <span className="text-red-500 font-bold">✗ No</span>
    );
  }
  if (m.value_numeric !== null) {
    return <span className="font-semibold">{m.value_numeric} / 10</span>;
  }
  if (m.value_string !== null) {
    return <span>{m.value_string}</span>;
  }
  return <span className="text-muted-foreground italic">N/D</span>;
}

function humanizeKey(key: string): string {
  if (METRIC_LABELS[key]) return METRIC_LABELS[key];
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function SoftwareCompareTable({ a, b }: SoftwareCompareTableProps) {
  const metricsA = a.software_metrics || [];
  const metricsB = b.software_metrics || [];

  // Extraer todas las llaves únicas de ambas herramientas para construir las filas
  const allKeys = Array.from(new Set([
    ...metricsA.map(m => m.metric_key),
    ...metricsB.map(m => m.metric_key)
  ])).sort();

  const rows: MetricRow[] = allKeys.map(key => {
    const mA = metricsA.find(m => m.metric_key === key);
    const mB = metricsB.find(m => m.metric_key === key);
    return {
      key,
      label: humanizeKey(key),
      valA: formatMetricValue(mA),
      valB: formatMetricValue(mB)
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16">
      <h3 className="text-2xl font-bold mb-8 text-center sm:text-left">Especificaciones Técnicas</h3>
      
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold w-1/3">Característica</th>
              <th className="px-6 py-4 font-semibold w-1/3 border-l border-r text-center sm:text-left">{a.name}</th>
              <th className="px-6 py-4 font-semibold w-1/3 text-center sm:text-left">{b.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.key} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{row.label}</td>
                  <td className="px-6 py-4 border-l border-r text-center sm:text-left">{row.valA}</td>
                  <td className="px-6 py-4 text-center sm:text-left">{row.valB}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  No hay datos técnicos detallados registrados aún para esta comparativa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
