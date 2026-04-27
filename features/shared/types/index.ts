export type NodeType = 'listening' | 'structure' | 'reading' | 'writing' | 'speaking' | 'mixed';

export interface SkillNode {
  id: string;
  type: NodeType;
  label: string;
  icon: string;
  tooltip: string;
  unlocked: boolean;
  progress: number;
}

export type MultipleChoiceQuestion = {
  kind: 'multiple-choice';
  type: string;
  context?: string;
  q: string;
  options: string[];
  answer: number;
  exp: string;
};

export type WritingQuestion = {
  kind: 'writing';
  type: string;
  prompt: string;
  minWords: number;
};

export type SpeakingQuestion = {
  kind: 'speaking';
  type: string;
  prompt: string;
  chunks: string[];
  ipa?: string[];
  time: number;
};

export type Question = MultipleChoiceQuestion | WritingQuestion | SpeakingQuestion;

export type QuizPhase = 'idle' | 'answering' | 'answered' | 'results';

export const NODE_COLORS: Record<NodeType, string> = {
  listening: '#2B72B8',
  structure: '#6B4EC4',
  reading:   '#C04828',
  writing:   '#1B8A58',
  speaking:  '#AD3368',
  mixed:     '#A56210',
};
