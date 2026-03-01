'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn exists, else fallback to simple template literals, but checking first. Let's use standard template literals to be safe.

interface ToCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    items: ToCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (!items || items.length === 0) return;

        // Configurar Intersection Observer para el Scroll-Spy
        const callback: IntersectionObserverCallback = (entries) => {
            // Buscamos las entradas que estén intersectando la pantalla
            const visibleEntries = entries.filter(entry => entry.isIntersecting);

            if (visibleEntries.length > 0) {
                // Si hay varios visibles, tomamos el que está más cerca del borde superior (posición Y)
                // O mas simple, tomamos el primero de la lista de visibles que suele ser el de arriba
                setActiveId(visibleEntries[0].target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: '0px 0px -80% 0px', // Activa el highlight cuando el titulo pasa el 20% superior de la pantalla
            threshold: 1.0 // Debe ser visible
        });

        // Observamos los elementos del DOM correspondientes a los IDs que nos pasaron
        items.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [items]);

    if (!items || items.length < 2) return null;

    const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL hash without jumping
            history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <nav className="my-8 p-6 bg-surface-50 border border-surface-200 rounded-xl shadow-sm max-w-2xl text-sm">
            <h3 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                📋 Tabla de Contenidos
            </h3>
            <ul className="space-y-2.5">
                {items.map((heading) => (
                    <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => scrollToHeading(e, heading.id)}
                            className={`block leading-snug transition-colors border-l-2 pl-3 py-1 ${activeId === heading.id
                                ? 'border-fc-blue text-fc-blue font-semibold'
                                : 'border-transparent text-surface-600 hover:text-surface-900 hover:border-surface-300'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
