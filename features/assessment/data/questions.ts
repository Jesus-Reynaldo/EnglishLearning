import { type Question } from '@/features/shared/types';

const listeningQuestions: Question[] = [
  {
    kind: 'multiple-choice',
    type: 'Listening — Part A',
    context: 'M: "I can\'t believe how much the rent has gone up this year."\nW: "Tell me about it. My landlord wants 20% more next month."',
    q: 'What are these people talking about?',
    options: ['A job promotion', 'Increasing housing costs', 'A new neighborhood', 'Their monthly bills'],
    answer: 1,
    exp: 'The conversation is about rising rent — a classic TOEFL indirect complaint.',
  },
  {
    kind: 'multiple-choice',
    type: 'Listening — Negation',
    context: 'W: "Did you finish the assignment before class?"\nM: "I wish I had, but I didn\'t quite manage it."',
    q: 'What does the man mean?',
    options: ['He finished the assignment', 'He did not finish the assignment', 'He was in class', 'He forgot about the assignment'],
    answer: 1,
    exp: '"I didn\'t quite manage it" = negative result despite trying (Skill 7 — negation).',
  },
];

const structureQuestions: Question[] = [
  {
    kind: 'multiple-choice',
    type: 'Structure',
    q: 'Choose the correct sentence:',
    options: [
      'Seldom we have seen such a result.',
      'Seldom have we seen such a result.',
      'Seldom we did see such a result.',
      'Seldom seen have we such a result.',
    ],
    answer: 1,
    exp: 'After "Seldom" (negative adverb) the auxiliary verb comes before the subject — inversion structure.',
  },
  {
    kind: 'multiple-choice',
    type: 'Structure',
    q: 'Choose the word that best completes the sentence: "The professor\'s lecture was so ______ that many students fell asleep."',
    options: ['stimulating', 'engaging', 'monotonous', 'challenging'],
    answer: 2,
    exp: '"Monotonous" fits: a boring lecture → students fell asleep. Cause-and-effect logic.',
  },
];

const readingQuestions: Question[] = [
  {
    kind: 'multiple-choice',
    type: 'Reading — Main Idea',
    context: 'Urban heat islands occur when cities experience higher temperatures than surrounding rural areas. This effect is caused by dark surfaces, lack of vegetation, and waste heat from vehicles and buildings. The phenomenon worsens air quality and increases energy consumption.',
    q: 'What is the main idea of this passage?',
    options: [
      'Cities are always hotter than rural areas',
      'Urban heat islands are caused by human activity and have negative effects',
      'Trees reduce temperatures in cities',
      'Energy use is the main cause of pollution',
    ],
    answer: 1,
    exp: 'Main idea = the cause and impact of urban heat islands. Option B covers both aspects.',
  },
];

const writingQuestions: Question[] = [
  {
    kind: 'writing',
    type: 'Writing — TWE',
    prompt: 'Some people believe that technology has made life easier. Others argue it has made life more complicated. Which view do you agree with? Use specific reasons and examples.',
    minWords: 80,
  },
];

const speakingQuestions: Question[] = [
  {
    kind: 'speaking',
    type: 'Speaking — TSE Stage 1',
    prompt: 'Talk about a person who has had a significant influence on your life. Describe who they are and explain how they influenced you.',
    chunks: [
      "I'd like to talk about...",
      'The reason I chose this person is...',
      'One way they influenced me was...',
      'For example, ...',
      'As a result, ...',
      'In conclusion, this person...',
    ],
    time: 45,
  },
];

export const QUESTION_BANK: Record<string, Question[]> = {
  listening: listeningQuestions,
  structure: structureQuestions,
  reading: readingQuestions,
  writing: writingQuestions,
  speaking: speakingQuestions,
  mixed: [...listeningQuestions, ...structureQuestions, ...readingQuestions],
};

export function getQuestionsForNode(nodeId: string, nodeType: string): Question[] {
  return QUESTION_BANK[nodeType] ?? QUESTION_BANK['mixed'];
}
