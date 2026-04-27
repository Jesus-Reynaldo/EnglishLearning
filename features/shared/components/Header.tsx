'use client';

import { useGamificationStore } from '@/features/gamification/store/useGamificationStore';

export default function Header() {
  const { xp, streak, hearts } = useGamificationStore();

  return (
    <header className="flex items-center justify-between mb-5 px-1">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-1.5 bg-white rounded-2xl px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[var(--border-soft)]">
          <span className="text-base leading-none">🔥</span>
          <span className="font-display text-[15px] font-semibold text-[var(--text-primary)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {streak}
          </span>
        </div>
      </div>

      {/* XP — center/hero element */}
      <div className="flex items-center gap-1.5 bg-[var(--xp-bg)] rounded-2xl px-4 py-1.5 border border-[rgba(26,74,148,0.15)]">
        <span className="text-[11px] font-semibold text-[var(--xp-text)] tracking-wider uppercase opacity-70">XP</span>
        <span className="font-display text-[17px] font-bold text-[var(--xp-text)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {xp.toLocaleString()}
        </span>
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-1.5 bg-white rounded-2xl px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[var(--border-soft)]">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-[11px] leading-none ${i < hearts ? 'opacity-100' : 'opacity-20'}`}>
              ♥
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
