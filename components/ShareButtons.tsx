'use client';

import { Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-surface-500 mr-1">Compartir:</span>
            <a
                href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-50 text-surface-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
                <Twitter className="w-4 h-4" />
            </a>
            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-50 text-surface-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
                <Linkedin className="w-4 h-4" />
            </a>
            <button
                onClick={handleCopy}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-50 text-surface-600 hover:bg-surface-200 transition-colors relative"
                title="Copiar enlace"
            >
                <LinkIcon className="w-4 h-4" />
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-[10px] py-1 px-2 rounded font-medium">
                        ¡Copiado!
                    </span>
                )}
            </button>
        </div>
    );
}
