'use client';

import { useState } from 'react';
import Image from 'next/image';

interface YouTubeFacadeProps {
    id: string;
    title?: string;
}

/**
 * YouTube Facade — mejora CLS y LCP cargando solo la thumbnail inicialmente.
 * El iframe se inyecta en el DOM solo cuando el usuario hace click en play.
 * Esto evita:
 *   - CLS causado por el resize del iframe al cargar
 *   - Peticiones de red innecesarias a YouTube en el primer paint
 *   - Penalizaciones de Core Web Vitals por recursos de terceros
 */
export default function YouTubeFacade({ id, title = 'Video de YouTube' }: YouTubeFacadeProps) {
    const [active, setActive] = useState(false);
    const thumbUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    const fallbackThumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    if (active) {
        return (
            <div className="video-container flex justify-center my-8">
                <div className="relative w-full max-w-3xl aspect-video rounded-2xl shadow-2xl border border-surface-200 overflow-hidden bg-surface-900">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="video-container flex justify-center my-8">
            <button
                onClick={() => setActive(true)}
                aria-label={`Reproducir: ${title}`}
                className="group relative w-full max-w-3xl aspect-video rounded-2xl shadow-2xl border border-surface-200 overflow-hidden bg-surface-900 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-fc-cyan/50"
            >
                {/* Thumbnail con next/Image — optimizada a WebP/AVIF */}
                <Image
                    src={thumbUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 896px"
                    onError={(e) => {
                        // Fallback a HQ si maxresdefault no existe
                        (e.target as HTMLImageElement).src = fallbackThumbUrl;
                    }}
                    priority={false}
                />

                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Botón de play centrado */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                        {/* Triángulo play */}
                        <svg
                            className="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Badge FreeCloud */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-fc-navy/90 backdrop-blur-sm text-[10px] text-white font-bold rounded uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                    FreeCloud Tech
                </div>

                {/* Duración / título (opcional) */}
                {title && (
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium line-clamp-1 text-left">{title}</p>
                    </div>
                )}
            </button>
        </div>
    );
}
