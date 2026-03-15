'use client';

import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSaaS() {
  return (
    <section
      className="relative w-full flex flex-col items-center justify-start overflow-hidden px-6 pt-28 pb-16 md:pt-36 md:pb-20 min-h-[90vh]"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Preparados para el Plan BIM Perú 2026
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-extrabold tracking-tight text-5xl md:text-7xl lg:text-8xl flex flex-col items-center leading-[1.1] md:leading-[1.1]"
        >
          <span className="text-white">Ingeniería Civil</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-cyan-600">
            Escrita en Código.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed"
        >
          Automatización BIM, desarrollo a medida y recursos técnicos para que las empresas y profesionales lideren la construcción del futuro.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/blog"
            className="group relative flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-black transition-transform hover:scale-105 w-full sm:w-auto overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            Empezar a Aprender
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="/sobre-mi#contacto"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-8 text-sm font-semibold text-white transition-all hover:bg-white/10 w-full sm:w-auto"
          >
            <Terminal className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            Contactar
          </Link>
        </motion.div>

        {/* Dashboard/Code Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 w-full rounded-2xl border border-white/10 bg-hero-card/80 backdrop-blur-xl p-2 md:p-4 shadow-2xl relative"
        >
          <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="rounded-xl overflow-hidden border border-white/5 bg-hero-dark w-full aspect-[16/9] md:aspect-[21/9] flex flex-col">
            {/* Window Header */}
            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-hero-card">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex items-center justify-center">
                <span className="text-xs text-slate-500 font-mono">automate_bim.py</span>
              </div>
            </div>
            
            {/* Fake Code Content */}
            <div className="p-4 md:p-6 text-left font-mono text-sm md:text-base overflow-hidden relative">
              <div className="text-blue-400">import <span className="text-white">clr</span></div>
              <div className="text-blue-400">clr.<span className="text-purple-400">AddReference</span>(<span className="text-green-400">'RevitAPI'</span>)</div>
              <div className="mt-2 text-slate-500"># Automatizando creación de modelos 3D y reportes...</div>
              <div className="text-purple-400 mt-2">def <span className="text-blue-400">generate_structural_model</span>(data):</div>
              <div className="pl-4 text-white">doc = __revit__.ActiveUIDocument.Document</div>
              <div className="pl-4 text-white">transaction = Transaction(doc, <span className="text-green-400">"Build Specs"</span>)</div>
              <div className="pl-4 mt-2 text-purple-400">try:</div>
              <div className="pl-8 text-white">transaction.Start()</div>
              <div className="pl-8 text-slate-500"># Inicializando generador de alta precisión</div>
              <div className="pl-8 text-white">builder.run_ai_agent(data.specs, context=doc)</div>
              <div className="pl-8 text-white">transaction.Commit()</div>
              <div className="pl-4 text-purple-400">except <span className="text-yellow-400">Exception</span> as e:</div>
              <div className="pl-8 text-white">transaction.RollBack()</div>
              <div className="pl-8 text-blue-400">print(<span className="text-green-400">f"Error: </span>{'{'}e{'}'}<span className="text-green-400">"</span>)</div>
              
              {/* Fade out bottom */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-hero-dark to-transparent" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
