'use client';

import { create } from 'zustand';
import { type Question, type QuizPhase } from '@/features/shared/types';

interface AssessmentState {
  phase: QuizPhase;
  qbank: Question[];
  currentQ: number;
  selectedOption: number | null;
  answered: boolean;
  feedbackCorrect: boolean;
  showFeedback: boolean;
  aiFeedback: string;
  loading: boolean;
  score: number;
  writingText: string;
  speakingRecording: boolean;
  speakingTimer: number;

  startSession: (questions: Question[]) => void;
  selectOption: (index: number) => void;
  submitAnswer: (correct: boolean) => void;
  setAIFeedback: (feedback: string) => void;
  setLoading: (loading: boolean) => void;
  nextQuestion: () => void;
  updateWritingText: (text: string) => void;
  setRecording: (recording: boolean) => void;
  setTimer: (t: number) => void;
  reset: () => void;
}

const initialState = {
  phase: 'idle' as QuizPhase,
  qbank: [] as Question[],
  currentQ: 0,
  selectedOption: null,
  answered: false,
  feedbackCorrect: false,
  showFeedback: false,
  aiFeedback: '',
  loading: false,
  score: 0,
  writingText: '',
  speakingRecording: false,
  speakingTimer: 45,
};

export const useAssessmentStore = create<AssessmentState>()((set, get) => ({
  ...initialState,

  startSession: (questions) =>
    set({ ...initialState, phase: 'answering', qbank: questions }),

  selectOption: (index) =>
    set({ selectedOption: index }),

  submitAnswer: (correct) =>
    set((s) => ({
      answered: true,
      phase: 'answered',
      showFeedback: true,
      feedbackCorrect: correct,
      score: correct ? s.score + 1 : s.score,
    })),

  setAIFeedback: (feedback) =>
    set({ aiFeedback: feedback, answered: true, phase: 'answered', showFeedback: true, score: get().score + 1 }),

  setLoading: (loading) => set({ loading }),

  nextQuestion: () =>
    set((s) => {
      const next = s.currentQ + 1;
      if (next >= s.qbank.length) return { ...s, currentQ: next, phase: 'results' };
      return {
        currentQ: next,
        selectedOption: null,
        answered: false,
        feedbackCorrect: false,
        showFeedback: false,
        aiFeedback: '',
        writingText: '',
        speakingRecording: false,
        speakingTimer: 45,
        phase: 'answering',
      };
    }),

  updateWritingText: (text) => set({ writingText: text }),

  setRecording: (recording) => set({ speakingRecording: recording }),

  setTimer: (t) => set({ speakingTimer: t }),

  reset: () => set(initialState),
}));
