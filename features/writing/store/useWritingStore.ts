'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WizardStep = 0 | 1 | 2 | 3 | 4;

interface WritingState {
  paragraphs: [string, string, string, string, string];
  currentStep: WizardStep;
  prompt: string;
  setPrompt: (prompt: string) => void;
  updateParagraph: (step: WizardStep, text: string) => void;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const emptyParagraphs: [string, string, string, string, string] = ['', '', '', '', ''];

export const useWritingStore = create<WritingState>()(
  persist(
    (set) => ({
      paragraphs: emptyParagraphs,
      currentStep: 0,
      prompt: '',
      setPrompt: (prompt) => set({ prompt }),
      updateParagraph: (step, text) =>
        set((s) => {
          const updated = [...s.paragraphs] as [string, string, string, string, string];
          updated[step] = text;
          return { paragraphs: updated };
        }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((s) => ({ currentStep: Math.min(4, s.currentStep + 1) as WizardStep })),
      prevStep: () =>
        set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) as WizardStep })),
      reset: () => set({ paragraphs: emptyParagraphs, currentStep: 0, prompt: '' }),
    }),
    { name: 'toefl-writing' }
  )
);
