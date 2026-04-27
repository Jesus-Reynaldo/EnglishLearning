'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LearningState {
  nodeProgress: Record<string, number>;
  updateNodeProgress: (nodeId: string, progress: number) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      nodeProgress: {
        l1: 0.85,
        s1: 0.6,
        r1: 0.4,
        w1: 0.5,
        sp1: 0.3,
        l2: 0,
        m1: 0,
      },
      updateNodeProgress: (nodeId, progress) =>
        set((s) => ({ nodeProgress: { ...s.nodeProgress, [nodeId]: progress } })),
    }),
    { name: 'toefl-learning' }
  )
);
