'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';

// E.030 Peru parameters
const ZONES = [
  { value: 0.45, label: 'Zona 4 (Z=0.45)', desc: 'Lima, Callao, costa sur' },
  { value: 0.35, label: 'Zona 3 (Z=0.35)', desc: 'Costa norte, sierra sur' },
  { value: 0.25, label: 'Zona 2 (Z=0.25)', desc: 'Sierra central' },
  { value: 0.10, label: 'Zona 1 (Z=0.10)', desc: 'Selva, sierra norte' },
];

const SOIL_TYPES = [
  { value: 'S0', label: 'S0 - Roca dura', S: 0.80, Tp: 0.3, Tl: 3.0 },
  { value: 'S1', label: 'S1 - Roca o suelos muy rígidos', S: 1.00, Tp: 0.4, Tl: 2.5 },
  { value: 'S2', label: 'S2 - Suelos intermedios', S: 1.05, Tp: 0.6, Tl: 2.0 },
  { value: 'S3', label: 'S3 - Suelos blandos', S: 1.10, Tp: 1.0, Tl: 1.6 },
];

const USAGE = [
  { value: 1.5, label: 'A1 - Esencial (U=1.5)', desc: 'Hospitales, bomberos' },
  { value: 1.3, label: 'A2 - Importante (U=1.3)', desc: 'Educación, estadios' },
  { value: 1.0, label: 'B - Común (U=1.0)', desc: 'Viviendas, oficinas' },
  { value: 0.5, label: 'C - Temporal (U=*)', desc: 'Depósitos temporales' },
];

const SYSTEMS = [
  { value: 8.0, label: 'Pórticos (R₀=8)', material: 'Concreto armado' },
  { value: 7.0, label: 'Dual (R₀=7)', material: 'Concreto armado' },
  { value: 6.0, label: 'Muros estructurales (R₀=6)', material: 'Concreto armado' },
  { value: 3.0, label: 'Muros de ductilidad limitada (R₀=3)', material: 'Concreto armado' },
  { value: 9.5, label: 'Pórticos SMF (R₀=9.5)', material: 'Acero' },
  { value: 7.0, label: 'Arriostrados concéntricos (R₀=7)', material: 'Acero' },
  { value: 3.0, label: 'Albañilería confinada (R₀=3)', material: 'Albañilería' },
];

export default function SeismicCalculator() {
  const [Z, setZ] = useState(0.45);
  const [soilType, setSoilType] = useState('S2');
  const [U, setU] = useState(1.0);
  const [R0, setR0] = useState(8.0);
  const [Ia, setIa] = useState(1.0);
  const [Ip, setIp] = useState(1.0);
  const [T, setT] = useState(0.5);
  const [P, setP] = useState(1000);

  const result = useMemo(() => {
    const soil = SOIL_TYPES.find(s => s.value === soilType)!;
    const S = soil.S;
    const Tp = soil.Tp;
    const Tl = soil.Tl;

    // Coeficiente de amplificación sísmica C
    let C: number;
    if (T < Tp) {
      C = 2.5;
    } else if (T < Tl) {
      C = 2.5 * (Tp / T);
    } else {
      C = 2.5 * (Tp * Tl) / (T * T);
    }

    // R = R0 * Ia * Ip
    const R = R0 * Ia * Ip;

    // C/R no menor que:
    const CR = C / R;

    // ZUCS/R
    const coef = (Z * U * C * S) / R;

    // Fuerza cortante basal
    const V = coef * P;

    return { C: C.toFixed(4), S, Tp, Tl, R: R.toFixed(2), CR: CR.toFixed(4), coef: coef.toFixed(6), V: V.toFixed(2) };
  }, [Z, soilType, U, R0, Ia, Ip, T, P]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-5">
        <h2 className="font-display font-bold text-surface-900 text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5 text-brand-600" />
          Parámetros de entrada
        </h2>

        {/* Zone */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Factor de Zona (Z)</label>
          <select value={Z} onChange={e => setZ(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
            {ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
          </select>
        </div>

        {/* Soil */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Tipo de Suelo</label>
          <select value={soilType} onChange={e => setSoilType(e.target.value)}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
            {SOIL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Usage */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Categoría de Uso (U)</label>
          <select value={U} onChange={e => setU(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
            {USAGE.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>

        {/* Structural system */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Sistema Estructural (R₀)</label>
          <select value={R0} onChange={e => setR0(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
            {SYSTEMS.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Irregularities */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Ia (Irregularidad altura)</label>
            <input type="number" value={Ia} onChange={e => setIa(Number(e.target.value))}
              min={0.5} max={1} step={0.05}
              className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Ip (Irregularidad planta)</label>
            <input type="number" value={Ip} onChange={e => setIp(Number(e.target.value))}
              min={0.5} max={1} step={0.05}
              className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        {/* Period */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Periodo fundamental T (seg)</label>
          <input type="number" value={T} onChange={e => setT(Number(e.target.value))}
            min={0.05} max={5} step={0.01}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1.5">Peso total P (tonf)</label>
          <input type="number" value={P} onChange={e => setP(Number(e.target.value))}
            min={0} step={10}
            className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>

      {/* Results */}
      <div>
        <h2 className="font-display font-bold text-surface-900 text-lg mb-5 flex items-center gap-2">
          📊 Resultados
        </h2>

        {/* Main result */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 mb-6 text-white">
          <p className="text-brand-200 text-sm mb-1">Fuerza Cortante Basal (V)</p>
          <p className="text-4xl font-display font-bold">{result.V} <span className="text-lg font-normal text-brand-200">tonf</span></p>
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-brand-200 text-sm mb-1">Coeficiente sísmico (ZUCS/R)</p>
            <p className="text-2xl font-display font-bold">{result.coef}</p>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-surface-50 rounded-xl p-5 space-y-3">
          <h3 className="font-display font-semibold text-surface-800 text-sm mb-3">Parámetros calculados</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">Z (zona)</p>
              <p className="font-bold text-surface-900">{Z}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">U (uso)</p>
              <p className="font-bold text-surface-900">{U}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">C (amplificación)</p>
              <p className="font-bold text-surface-900">{result.C}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">S (suelo)</p>
              <p className="font-bold text-surface-900">{result.S}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">R (reducción)</p>
              <p className="font-bold text-surface-900">{result.R}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">C/R</p>
              <p className="font-bold text-surface-900">{result.CR}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">Tp (seg)</p>
              <p className="font-bold text-surface-900">{result.Tp}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-surface-100">
              <p className="text-surface-400 text-xs">TL (seg)</p>
              <p className="font-bold text-surface-900">{result.Tl}</p>
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="mt-4 p-4 bg-surface-900 text-surface-100 rounded-xl text-sm font-mono">
          <p className="text-surface-400 text-xs mb-2">Fórmula E.030:</p>
          <p>V = (Z × U × C × S / R) × P</p>
          <p className="mt-1 text-surface-400">
            V = ({Z} × {U} × {result.C} × {result.S} / {result.R}) × {P}
          </p>
          <p className="mt-1 text-brand-400 font-bold">V = {result.V} tonf</p>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-surface-400">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Norma E.030 Diseño Sismorresistente - Reglamento Nacional de Edificaciones, Perú.
            Esta herramienta es de referencia. Consulta siempre la norma vigente.
          </p>
        </div>
      </div>
    </div>
  );
}
