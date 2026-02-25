'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TABS = [
  {
    id: 'bim-revit',
    label: 'BIM & REVIT',
    title: 'BIM & Revit',
    description:
      'Implementa BIM en tus proyectos con Revit. Desde modelado 3D hasta documentación automatizada, aprende flujos de trabajo reales con normativa peruana E.030 y la Guía Nacional BIM.',
    href: '/blog?cat=revit',
    cta: 'EXPLORAR',
    emoji: '🖥️',
    color: '#2ab1ac',
  },
  {
    id: 'automatizacion',
    label: 'AUTOMATIZACIÓN',
    title: 'Dynamo & Python',
    description:
      'Automatiza tareas repetitivas en Revit con Dynamo y Python. Scripts para renombrar elementos, extraer datos a Excel, generar vistas automáticas y verificar parámetros — todo con ejemplos reales.',
    href: '/blog?cat=python',
    cta: 'EXPLORAR',
    emoji: '⚡',
    color: '#ff7a0d',
  },
  {
    id: 'estructural',
    label: 'ANÁLISIS ESTRUCTURAL',
    title: 'Análisis Estructural',
    description:
      'Robot Structural, ETABS, SAP2000 y cálculo manual. Desde análisis sísmico E.030 hasta métodos matriciales, todo enfocado en la práctica profesional del ingeniero estructural peruano.',
    href: '/blog?cat=analisis-estructural',
    cta: 'EXPLORAR',
    emoji: '🏛️',
    color: '#1a6df5',
  },
  {
    id: 'recursos',
    label: 'RECURSOS & APPS',
    title: 'Recursos & Apps',
    description:
      'Plantillas Excel de diseño sísmico y metrados, programas HP Prime, familias Revit adaptadas a Perú, y web apps gratuitas como la calculadora sísmica E.030 — todo listo para usar.',
    href: '/recursos',
    cta: 'EXPLORAR',
    emoji: '📦',
    color: '#217346',
  },
];

export default function TabShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];

  return (
    <section className="py-24 bg-surface-50 border-t border-b border-dataiku-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center mb-12 reveal">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold text-surface-900 text-balance">
            BIM, Cálculo y Automatización en un Solo Lugar
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="reveal flex border-b border-surface-200 mb-0 overflow-x-auto no-scrollbar">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              className={`relative px-6 py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap transition-colors duration-200 ${activeTab === i
                ? 'text-surface-900'
                : 'text-surface-400 hover:text-surface-600'
                }`}
            >
              {t.label}
              {/* Active indicator */}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-surface-900 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white border text-left border-dataiku-border overflow-hidden dataiku-card mt-[-1px]">
          <div
            className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 lg:p-16"
            key={tab.id}
            style={{ animation: 'fadeIn 0.4s ease-out' }}
          >
            {/* Left — Text */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-surface-900 mb-4">
                {tab.title}
              </h3>
              <p className="text-surface-600 leading-relaxed mb-8 text-base md:text-lg">
                {tab.description}
              </p>
              <div>
                <Link
                  href={tab.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-500 text-white text-sm font-bold tracking-wider uppercase rounded-full hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
                >
                  {tab.cta}
                </Link>
              </div>
            </div>

            {/* Right — Visual card with sharp edges */}
            <div className="flex items-center justify-center">
              <div
                className="relative w-full max-w-md aspect-[4/3] overflow-hidden shadow-dataiku-hover border border-dataiku-border bg-white"
              >
                {/* Colored border glow */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${tab.color}15, ${tab.color}05)`,
                    border: `2px solid ${tab.color}30`,
                  }}
                />
                {/* Content card */}
                <div className="relative h-full bg-dataiku-background flex flex-col items-center justify-center p-8">
                  {/* Top bar mimicking a rigid enterprise app UI */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-dataiku-navy flex items-center px-4 gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-500" />
                    <span className="ml-3 text-[10px] text-surface-400 font-mono">freecloud.pe</span>
                  </div>
                  {/* Main icon/visual */}
                  <div className="mt-4">
                    <span className="text-7xl md:text-8xl block mb-4">{tab.emoji}</span>
                    <p
                      className="text-center font-display font-bold text-lg"
                      style={{ color: tab.color }}
                    >
                      {tab.title}
                    </p>
                    <div className="flex items-center gap-2 justify-center mt-3">
                      {[1, 2, 3].map(n => (
                        <div
                          key={n}
                          className="h-1.5 rounded-full"
                          style={{
                            width: n === 1 ? '40px' : n === 2 ? '30px' : '20px',
                            backgroundColor: `${tab.color}${n === 1 ? '60' : n === 2 ? '40' : '20'}`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-5 w-full max-w-[200px] mx-auto">
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          className="h-8 rounded-lg"
                          style={{
                            backgroundColor: `${tab.color}${10 + n * 5}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}
