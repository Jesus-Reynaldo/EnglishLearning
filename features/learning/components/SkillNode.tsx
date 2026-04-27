'use client';

import { type SkillNode, NODE_COLORS } from '@/features/shared/types';
import { useLearningStore } from '@/features/learning/store/useLearningStore';

interface Props {
  node: SkillNode;
  isCurrent?: boolean;
  onClick: (node: SkillNode) => void;
}

export default function SkillNodeComponent({ node, isCurrent = false, onClick }: Props) {
  const nodeProgress = useLearningStore((s) => s.nodeProgress);
  const progress = nodeProgress[node.id] ?? node.progress;

  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = progress * circ;
  const color = NODE_COLORS[node.type];

  const pct = Math.round(progress * 100);
  const mastered = progress >= 1.0;

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className={`relative w-[76px] h-[76px] rounded-full flex items-center justify-center flex-col select-none transition-all duration-200 node-texture-${node.type} ${
          node.unlocked
            ? 'cursor-pointer hover:scale-[1.07] hover:brightness-110 active:scale-[0.96]'
            : 'opacity-35 cursor-not-allowed grayscale'
        } ${isCurrent && !mastered ? 'animate-breathe' : ''}`}
        style={{
          backgroundColor: color,
          boxShadow: node.unlocked && !isCurrent
            ? `0 4px 16px ${color}50, 0 1px 3px ${color}30`
            : node.unlocked
            ? undefined
            : 'none',
        }}
        onClick={() => node.unlocked && onClick(node)}
      >
        {/* Progress ring */}
        <svg
          className="absolute -inset-[5px] w-[86px] h-[86px] -rotate-90 pointer-events-none"
          viewBox="0 0 86 86"
        >
          <circle
            cx="43" cy="43" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
          />
          {progress > 0 && (
            <circle
              cx="43" cy="43" r={r}
              fill="none"
              stroke={mastered ? '#059669' : 'rgba(255,255,255,0.82)'}
              strokeWidth="3"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          )}
        </svg>

        {/* Lock icon */}
        {!node.unlocked && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-xl opacity-60">
            🔒
          </span>
        )}

        {node.unlocked && (
          <>
            <span className="text-[24px] leading-none z-10 drop-shadow-sm">{node.icon}</span>
            {progress > 0 && !mastered && (
              <span className="text-[9px] font-semibold text-white/90 z-10 mt-0.5 font-display">
                {pct}%
              </span>
            )}
          </>
        )}

        {/* Mastered checkmark badge */}
        {mastered && (
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold z-20"
            style={{ background: '#059669', boxShadow: '0 1px 4px rgba(5,150,105,0.5)' }}
          >
            ✓
          </div>
        )}

        {/* Tooltip */}
        <div
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 shadow-lg"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {node.tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--text-primary)]" />
        </div>
      </div>

      {/* Label below node */}
      <span
        className={`text-[10px] font-semibold tracking-wide uppercase text-center leading-tight ${node.unlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {node.label}
      </span>
    </div>
  );
}
