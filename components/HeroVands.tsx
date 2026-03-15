'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import lottieData from '../public/lottie/vandslab-icons-loop.json';

/* Lottie se carga solo en cliente (no SSR) */
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/* ──────────────────────────────────────────────
   HeroVands — Brutalista con animación Lottie
   extraída directamente de VandsLab.com
────────────────────────────────────────────── */

/* Clip para slide-up: wrapper overflow-hidden + motion.div desde y=110% */
function SlideUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function HeroVands() {
  const fs = 'clamp(2.5rem, min(8vw, 15vh), 12rem)'; // Más chico para encajar los íconos junto con INGENIERIA sin forzar overlap horizontal
  const lh = 0.85; // Interlineado brutalist
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    // Forzamos play en caso de que Lottie se quede congelado
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <section
      className="relative w-full min-h-[85vh] md:min-h-[80vh] xl:min-h-[75vh] max-h-[900px] overflow-hidden flex flex-col justify-center pt-[100px] lg:pt-[130px] pb-10"
      style={{ backgroundColor: '#CFCFCA' }}
    >
      {/* ── Textura grain analógica ── */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
        aria-hidden
      />

      {/* ── Labels flotantes (aparecen con delay) respetando HeaderVands ── */}
      {/* Ocultamos en lg, se ven mejor solo flotando si no molestan el content masivo */}
      {[
        { pos: 'top-32 left-8 md:left-12 lg:left-16', text: 'AUTOMATIZACIÓN\nBIM' },
        { pos: 'top-32 right-8 md:right-12 lg:right-16', text: 'CONSULTORÍA\n& CAPACITACIÓN', right: true },
        { pos: 'bottom-20 left-8 md:left-12 lg:left-16', text: 'RECURSOS\nTÉCNICOS' },
        { pos: 'bottom-20 right-8 md:right-12 lg:right-16', text: 'DESARROLLO\nWEB BIM', right: true },
      ].map(({ pos, text, right }, i) => (
        <motion.div
          key={i}
          className={`absolute z-0 ${pos} pointer-events-none hidden xl:block`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 + i * 0.08, duration: 0.8 }}
          style={{ textAlign: right ? 'right' : 'left' }}
          aria-hidden
        >
          {text.split('\n').map((line, j) => (
            <div
              key={j}
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest leading-tight"
              style={{ color: 'rgba(10,10,15,0.38)' }}
            >
              {line}
            </div>
          ))}
        </motion.div>
      ))}

      {/* ── Tipografía masiva con slide-up staggered ── */}
      {/* Alineación idéntica al HeaderVands: px-8 md:px-12 lg:px-16 */}
      <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 select-none mt-auto mb-auto flex justify-center items-center">
        
        {/* Contenedor central monolítico: mantiene el bloque de texto alineado a la izquierda consigo mismo, pero centrado globalmente respecto a la página */}
        <div className="flex flex-col items-start justify-center">

          {/* Línea 1: INGENIERÍA + Lottie */}
          <SlideUp delay={0.05}>
            <div className="flex items-center justify-start gap-2 sm:gap-4 md:gap-5" style={{ lineHeight: lh }}>
              <h1
                className="uppercase m-0 p-0 text-white tracking-[-0.02em] whitespace-nowrap"
                style={{ fontSize: fs, lineHeight: lh, fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.1)', transformOrigin: 'bottom' }}
              >
                INGENIERÍA
              </h1>
              {/* Lottie — animación real extraída de VandsLab */}
              <div
                className="shrink-0"
                style={{
                  width: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                  height: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                }}
                aria-hidden
              >
                <Lottie
                  lottieRef={lottieRef}
                  animationData={lottieData}
                  loop
                  autoplay
                  onDOMLoaded={() => lottieRef.current?.play()}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </SlideUp>

          {/* Línea 2: CIVIL + 4 octógonos */}
          <SlideUp delay={0.17}>
            <div className="flex items-center justify-start gap-2 sm:gap-4 md:gap-5" style={{ lineHeight: lh, marginTop: 'clamp(0.2rem, 1vw, 1rem)' }}>
              <h1
                className="uppercase m-0 p-0 text-white tracking-[-0.02em] whitespace-nowrap"
                style={{ fontSize: fs, lineHeight: lh, fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.1)', transformOrigin: 'bottom' }}
              >
                CIVIL
              </h1>
              <div
                className="shrink-0 grid grid-cols-2"
                style={{
                  width: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                  height: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                  gap: 'clamp(2px, 0.4vw, 6px)',
                }}
                aria-hidden
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      clipPath: 'polygon(29% 0%,71% 0%,100% 29%,100% 71%,71% 100%,29% 100%,0% 71%,0% 29%)',
                      backgroundColor: '#0a0a0f',
                    }}
                  />
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Línea 3: ESCRITA + octógono con flecha + CTA */}
          <SlideUp delay={0.29}>
            <div className="flex items-center justify-start gap-2 sm:gap-4 lg:gap-5" style={{ lineHeight: lh, marginTop: 'clamp(0.2rem, 1vw, 1rem)' }}>
              <h1
                className="uppercase m-0 p-0 tracking-[-0.02em] whitespace-nowrap"
                style={{ fontSize: fs, lineHeight: lh, color: '#EFFF84', fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.1)', transformOrigin: 'bottom' }}
              >
                ESCRITA
              </h1>
              <motion.div
                className="shrink-0 flex items-center justify-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                  height: 'clamp(2.5rem, min(7vw, 13.5vh), 8rem)',
                  clipPath: 'polygon(29% 0%,71% 0%,100% 29%,100% 71%,71% 100%,29% 100%,0% 71%,0% 29%)',
                  backgroundColor: '#0a0a0f',
                }}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: '42%', height: '42%' }}
                  fill="none"
                  stroke="#EFFF84"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </motion.div>

              {/* CTA desktop (alineado al finalizar la línea 3) */}
              <motion.div
                className="hidden lg:block shrink-0 ml-4 md:ml-8"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
              >
                <Link href="/blog">
                  <motion.div
                    className="flex items-center gap-4 font-bold tracking-wide cursor-pointer text-[15px] whitespace-nowrap"
                    style={{
                      backgroundColor: '#0a0a0f',
                      color: '#fff',
                      borderRadius: '9999px',
                      padding: '1.2rem 2.8rem',
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: '#EFFF84', color: '#000' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                  >
                    Explorar ahora
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </SlideUp>

          {/* Línea 4: EN CÓDIGO */}
          <SlideUp delay={0.41}>
            <div className="flex justify-start" style={{ lineHeight: lh, marginTop: 'clamp(0.2rem, 1vw, 1rem)' }}>
              <h1
                className="uppercase m-0 p-0 tracking-[-0.02em] whitespace-nowrap"
                style={{ fontSize: fs, lineHeight: lh, color: '#EFFF84', fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.1)', transformOrigin: 'bottom' }}
              >
                EN CÓDIGO.
              </h1>
            </div>
          </SlideUp>

        </div>
      </div>

      {/* ── CTA mobile ── */}
      <motion.div
        className="lg:hidden relative z-10 flex justify-center mt-10 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        <Link href="/blog">
          <motion.div
            className="flex items-center gap-3 font-bold text-base tracking-wide"
            style={{
              backgroundColor: '#0a0a0f',
              color: '#fff',
              borderRadius: '9999px',
              padding: '1rem 2.5rem',
            }}
            whileHover={{ scale: 1.05, backgroundColor: '#EFFF84', color: '#000' }}
            whileTap={{ scale: 0.96 }}
          >
            Explorar ahora
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '6px', backgroundColor: '#EFFF84' }}
        aria-hidden
      />
    </section>
  );
}
