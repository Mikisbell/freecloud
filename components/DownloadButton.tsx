import { Download } from 'lucide-react';

interface DownloadButtonProps {
    url: string;
    text?: string;
}

export default function DownloadButton({ url, text = 'Descargar' }: DownloadButtonProps) {
    return (
        <a
            href={url}
            download
            className="my-4 inline-flex items-center gap-2 px-6 py-3 bg-fc-blue text-white font-semibold rounded-xl hover:bg-fc-navy transition-colors shadow-md hover:shadow-lg"
        >
            <Download className="w-5 h-5" />
            {text}
        </a>
    );
}
