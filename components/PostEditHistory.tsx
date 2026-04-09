'use client';

import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

interface EditEntry {
  date: string;
  description: string;
}

const EDIT_HISTORY: Record<string, EditEntry[]> = {
  'bim-obligatorio-peru-2026': [
    { date: '2026-03-22', description: 'Artículo publicado' },
  ],
  'modelamiento-bim-estructural-revit-etabs-guia': [
    { date: '2026-03-26', description: 'Artículo publicado' },
  ],
  'etabs-analisis-sismico-norma-e030-guia-practica': [
    { date: '2026-03-10', description: 'Artículo publicado' },
    { date: '2026-04-05', description: 'Agregados datos de comparación con SAP2000' },
  ],
  'cortante-basal-formula-e030-calculo-paso-a-paso': [
    { date: '2025-10-22', description: 'Artículo publicado' },
    { date: '2026-02-15', description: 'Corregido ejemplo numérico con datos reales de proyecto' },
  ],
  'python-librerias-esenciales-ingenieros-civiles': [
    { date: '2026-02-21', description: 'Artículo publicado' },
    { date: '2026-03-28', description: 'Agregada sección de pandas con ejemplo de metrados' },
  ],
};

export default function PostEditHistory({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const history = EDIT_HISTORY[slug];

  if (!history || history.length === 0) return null;

  const lastUpdated = history[history.length - 1];
  const hasEdits = history.length > 1;

  return (
    <div className="mt-8 pt-6 border-t border-surface-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-600 transition-colors"
      >
        <Clock className="w-4 h-4" />
        {hasEdits
          ? `Última actualización: ${new Date(lastUpdated.date).toLocaleDateString('es-PE')}`
          : `Publicado: ${new Date(lastUpdated.date).toLocaleDateString('es-PE')}`
        }
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 pl-6">
          {[...history].reverse().map((entry, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Pencil className="w-3.5 h-3.5 text-surface-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-surface-600 font-medium">
                  {new Date(entry.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-surface-500 ml-2">— {entry.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
