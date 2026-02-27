'use client';

import { useState, useEffect } from 'react';

export default function HeroCountdown() {
    const [mounted, setMounted] = useState(false);
    const [days, setDays] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
        const targetDate = new Date('2026-08-01T00:00:00-05:00').getTime();

        // Calculate days immediately and set interval to update (though daily update is rare on one session)
        const updateDays = () => {
            const now = new Date().getTime();
            const diffTime = targetDate - now;
            if (diffTime > 0) {
                setDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            } else {
                setDays(0);
            }
        };

        updateDays();
        const timer = setInterval(updateDays, 1000 * 60 * 60); // Update every hour just in case
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="inline-flex items-center gap-[6px] rounded-full animate-fade-in-down"
            style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '8px 18px',
                animationDuration: '0.8s',
            }}
        >
            <div
                className="w-2 h-2 rounded-full animate-pulse-yellow"
                style={{ background: '#f59e0b' }}
            ></div>
            <span className="text-[13px] text-white/70">
                BIM obligatorio en
            </span>
            <span className="font-bold text-white text-[13px]">
                {mounted && days !== null ? `${days} días` : '--- días'}
            </span>
        </div>
    );
}
