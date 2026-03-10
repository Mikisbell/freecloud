'use client';

export default function HeroCountdown() {
  const bimDaysLeft = Math.max(
    0,
    Math.ceil((new Date('2026-08-01T00:00:00-05:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div
      className="inline-flex items-center gap-[6px] rounded-full animate-fade-in-down bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2"
      style={{ animationDuration: '0.8s' }}
    >
      <div className="w-2 h-2 rounded-full animate-pulse-yellow bg-amber-500"></div>
      <span className="text-[13px] text-white/70">
        BIM obligatorio en
      </span>
      <span className="font-bold text-white text-[13px]" suppressHydrationWarning>
        {bimDaysLeft > 0 ? `${bimDaysLeft} días` : '¡Ya es obligatorio!'}
      </span>
    </div>
  );
}

