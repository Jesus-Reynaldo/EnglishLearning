'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  addXP: (amount: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  incrementStreak: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      xp: 1259,
      streak: 130,
      hearts: 3,
      gems: 925,
      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
      loseHeart: () => set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),
      resetHearts: () => set({ hearts: 5 }),
      incrementStreak: () => set((s) => ({ streak: s.streak + 1 })),
    }),
    { name: 'toefl-gamification' }
  )
);
