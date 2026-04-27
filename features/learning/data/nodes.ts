import { type SkillNode } from '@/features/shared/types';

export const SKILL_NODES: SkillNode[] = [
  { id: 'l1',  type: 'listening', label: 'Short Talks', icon: '🎧', tooltip: 'Part A — Short Dialogues',    unlocked: true,  progress: 0.85 },
  { id: 's1',  type: 'structure', label: 'Grammar',     icon: '🔷', tooltip: 'Structure & Written Expr.',   unlocked: true,  progress: 0.6  },
  { id: 'r1',  type: 'reading',   label: 'Reading',     icon: '📖', tooltip: 'Reading Comprehension',       unlocked: true,  progress: 0.4  },
  { id: 'w1',  type: 'writing',   label: 'Writing',     icon: '✍️', tooltip: 'TWE — Essay writing',         unlocked: true,  progress: 0.5  },
  { id: 'sp1', type: 'speaking',  label: 'Speaking',    icon: '🎤', tooltip: 'TSE — Stage 1',               unlocked: true,  progress: 0.3  },
  { id: 'l2',  type: 'listening', label: 'Long Talks',  icon: '🎧', tooltip: 'Part B — Conversations',      unlocked: false, progress: 0    },
  { id: 'm1',  type: 'mixed',     label: 'Full Drill',  icon: '⚡', tooltip: 'Mixed practice',              unlocked: false, progress: 0    },
];

export const NODE_BG: Record<string, string> = {
  listening: 'bg-[#378ADD]',
  structure:  'bg-[#7F77DD]',
  reading:    'bg-[#D85A30]',
  writing:    'bg-[#1D9E75]',
  speaking:   'bg-[#D4537E]',
  mixed:      'bg-[#BA7517]',
};
