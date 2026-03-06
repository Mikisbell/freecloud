import { AlertTriangle, Info, Lightbulb } from 'lucide-react';

const VARIANTS = {
    tip: {
        icon: Lightbulb,
        bg: 'bg-green-50 border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-800',
    },
} as const;

interface CalloutProps {
    type?: keyof typeof VARIANTS;
    title?: string;
    children: React.ReactNode;
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
    const variant = VARIANTS[type];
    const Icon = variant.icon;

    return (
        <div className={`my-6 rounded-xl border p-4 ${variant.bg}`}>
            <div className="flex gap-3">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${variant.iconColor}`} />
                <div className="min-w-0">
                    {title && (
                        <p className={`font-semibold mb-1 ${variant.titleColor}`}>{title}</p>
                    )}
                    <div className="text-sm text-surface-700 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
