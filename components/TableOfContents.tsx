'use client';

import React, { useEffect, useState } from 'react';

interface ToCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ source }: { source: string }) {
    const [headings, setHeadings] = useState<ToCItem[]>([]);

    useEffect(() => {
        // Extract H2 headings from markdown source
        const regex = /^\s*##\s+(.+)$/gm;
        const items: ToCItem[] = [];
        let match;

        while ((match = regex.exec(source)) !== null) {
            if (match[1]) {
                const text = match[1].trim();
                // Generar el mismo ID que usa rehype-slug (github-slugger)
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                items.push({ id, text, level: 2 });
            }
        }

        setHeadings(items);
    }, [source]);

    if (headings.length < 2) return null;

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
        <div className="my-8 p-6 bg-surface-50 border border-surface-200 rounded-xl shadow-sm max-w-2xl">
            <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span> En este artículo:
            </h3>
            <ul className="space-y-3">
                {headings.map((heading, idx) => (
                    <li key={idx} className="flex">
                        <span className="text-fc-blue font-bold mr-3">{idx + 1}.</span>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => scrollToHeading(e, heading.id)}
                            className="text-surface-700 hover:text-fc-blue hover:underline transition-colors leading-snug"
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
