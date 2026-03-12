'use client';

import React, { useState, useMemo } from 'react';
import type { RtingsComparisonPayload } from '@/lib/data/rtingsFetcher';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';

interface InteractiveScoreTableProps {
  initialData: RtingsComparisonPayload;
}

export function InteractiveScoreTable({ initialData }: InteractiveScoreTableProps) {
  // Estado para los pesos de las calculadoras interactivas
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initWeights: Record<string, number> = {};
    initialData.categories.forEach((cat) => {
      initWeights[cat.id] = cat.weight;
    });
    return initWeights;
  });

  // Estado para abrir/cerrar categorías
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initOpen: Record<string, boolean> = {};
    initialData.categories.forEach((cat) => {
      initOpen[cat.id] = true;
    });
    return initOpen;
  });

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cálculo de overall scores en tiempo real.
  const { overallScoreA, overallScoreB } = useMemo(() => {
    let totalWeight = 0;
    let scoreA = 0;
    let scoreB = 0;

    initialData.categories.forEach((cat) => {
      const w = weights[cat.id] || 0;
      totalWeight += w;

      let catScoreA = 0;
      let catScoreB = 0;
      if (cat.tests.length > 0) {
        catScoreA = cat.tests.reduce((acc, t) => acc + t.softwareA.score, 0) / cat.tests.length;
        catScoreB = cat.tests.reduce((acc, t) => acc + t.softwareB.score, 0) / cat.tests.length;
      }

      scoreA += catScoreA * w;
      scoreB += catScoreB * w;
    });

    if (totalWeight === 0) return { overallScoreA: 0, overallScoreB: 0 };

    return {
      overallScoreA: scoreA / totalWeight,
      overallScoreB: scoreB / totalWeight,
    };
  }, [weights, initialData]);

  // Paleta de colores semánticos RTINGS (Verde=Alto, Rojo=Bajo)
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (score >= 6.5) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };



  const formatRawValue = (val: string | number | null, unit: string | null) => {
    if (val === null) return <span className="text-slate-400">-</span>;
    if (val === 'true') return <Check className="w-4 h-4 text-emerald-500" />;
    if (val === 'false') return <Minus className="w-4 h-4 text-slate-400" />;
    return (
      <span>
        {val} <span className="text-slate-400 text-xs">{unit}</span>
      </span>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* HEADER SCOREBOARD INTERACTIVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center justify-center space-y-2 p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
            {initialData.softwareA.releaseName}
          </h3>
          <div className={cn("text-6xl font-black tabular-nums tracking-tighter", getScoreColor(overallScoreA).split(' ')[1])}>
            {overallScoreA.toFixed(1)}
          </div>
          <div className="text-sm font-medium text-slate-500">Puntaje Global</div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2 p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
            {initialData.softwareB.releaseName}
          </h3>
          <div className={cn("text-6xl font-black tabular-nums tracking-tighter", getScoreColor(overallScoreB).split(' ')[1])}>
            {overallScoreB.toFixed(1)}
          </div>
          <div className="text-sm font-medium text-slate-500">Puntaje Global</div>
        </div>
      </div>

      {/* PERSONALIZA TU PRIORIDAD — Sliders de Peso */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-5">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
          <span>⚙️</span> Personaliza tu prioridad
          <span className="text-xs font-normal text-blue-500 dark:text-blue-400">— Ajusta cuánto pesa cada área para tu flujo de trabajo</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {initialData.categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-28 shrink-0 truncate" title={cat.name}>
                {cat.name}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={weights[cat.id] ?? cat.weight}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, [cat.id]: Number(e.target.value) }))
                }
                className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
                aria-label={`Peso de ${cat.name}`}
              />
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 w-8 text-right tabular-nums">
                {weights[cat.id] ?? cat.weight}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setWeights(
              Object.fromEntries(
                initialData.categories.map((c) => [c.id, c.weight])
              )
            )
          }
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          Restablecer pesos predeterminados
        </button>
      </div>

      {/* MATRIZ DE TEST BENCH */}
      <div className="w-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        
        {/* ENCABEZADOS DE COLUMNA */}
        <div className="grid grid-cols-[1fr_120px_120px] bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <div className="p-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">
            Test Bench / Evaluación
          </div>
          <div className="p-4 font-semibold text-sm text-slate-500 text-center uppercase tracking-wider border-l border-slate-200 dark:border-slate-800">
            {initialData.softwareA.name.split(' ')[0]} {/* Ej: Revit */}
          </div>
          <div className="p-4 font-semibold text-sm text-slate-500 text-center uppercase tracking-wider border-l border-slate-200 dark:border-slate-800">
            {initialData.softwareB.name.split(' ')[0]} {/* Ej: Archicad */}
          </div>
        </div>

        {/* LISTADO DE CATEGORÍAS */}
        {initialData.categories.map((cat) => (
          <div key={cat.id} className="border-b border-slate-200 dark:border-slate-800 last:border-0">
            
            {/* CABECERA DE CATEGORÍA */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {openCategories[cat.id] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{cat.name}</span>
              </div>
            </button>

            {/* TESTS DE LA CATEGORÍA */}
            {openCategories[cat.id] && (
              <div className="flex flex-col">
                {cat.tests.map((test) => (
                  <details key={test.id} className="group border-t border-slate-100 dark:border-slate-800/50 first:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors cursor-pointer">
                    
                    {/* FILA DEL TEST (SUMMARY) */}
                    <summary className="grid grid-cols-[1fr_120px_120px] list-none items-center">
                      <div className="p-4 flex items-center gap-2">
                         <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center group-open:bg-blue-500 group-open:border-blue-500 transition-colors">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 group-open:bg-white" />
                         </div>
                         <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                           {test.name}
                         </span>
                      </div>
                      
                      {/* SCORE A */}
                      <div className={cn("p-4 text-center border-l flex flex-col items-center justify-center min-h-[60px]", 
                        test.softwareA.score > test.softwareB.score ? "bg-emerald-50/30 dark:bg-emerald-900/5 border-emerald-100 dark:border-slate-800" : "border-slate-100 dark:border-slate-800")}>
                        <div className="flex items-center gap-1">
                          <span className={cn("font-bold", getScoreColor(test.softwareA.score).split(' ')[1])}>
                            {test.softwareA.score.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {formatRawValue(test.softwareA.rawValue, test.unit)}
                        </div>
                      </div>

                      {/* SCORE B */}
                      <div className={cn("p-4 text-center border-l flex flex-col items-center justify-center min-h-[60px]", 
                        test.softwareB.score > test.softwareA.score ? "bg-emerald-50/30 dark:bg-emerald-900/5 border-emerald-100 dark:border-slate-800" : "border-slate-100 dark:border-slate-800")}>
                        <div className="flex items-center gap-1">
                          <span className={cn("font-bold", getScoreColor(test.softwareB.score).split(' ')[1])}>
                            {test.softwareB.score.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {formatRawValue(test.softwareB.rawValue, test.unit)}
                        </div>
                      </div>
                    </summary>

                    {/* ACORDEÓN EXPANDIDO (CONTENIDO SEO NLG) */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          {initialData.softwareA.releaseName}
                          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getScoreColor(test.softwareA.score))}>{test.softwareA.score.toFixed(1)}</span>
                        </h4>
                        <p className="prose prose-sm dark:prose-invert">
                          {test.softwareA.verdictText}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          {initialData.softwareB.releaseName}
                          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getScoreColor(test.softwareB.score))}>{test.softwareB.score.toFixed(1)}</span>
                        </h4>
                        <p className="prose prose-sm dark:prose-invert">
                          {test.softwareB.verdictText}
                        </p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
