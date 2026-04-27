'use client';

interface Props {
  current: number;
  total: number;
  color: string;
}

export default function ProgressBar({ current, total, color }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex-1 h-[6px] bg-[var(--border-soft)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}CC, ${color})`,
        }}
      />
    </div>
  );
}
