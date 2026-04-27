'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import { useGamificationStore } from '@/features/gamification/store/useGamificationStore';
import { SKILL_NODES } from '@/features/learning/data/nodes';
import { getQuestionsForNode } from '@/features/assessment/data/questions';
import { NODE_COLORS } from '@/features/shared/types';
import ProgressBar from '@/features/shared/components/ProgressBar';
import MultipleChoiceQ from './MultipleChoiceQ';
import WritingQ from './WritingQ';
import SpeakingQ from './SpeakingQ';
import ResultsScreen from '@/features/gamification/components/ResultsScreen';

interface Props {
  nodeId: string;
}

export default function QuizEngine({ nodeId }: Props) {
  const router = useRouter();
  const { phase, qbank, currentQ, startSession, reset } = useAssessmentStore();
  const { addXP } = useGamificationStore();

  const node = SKILL_NODES.find((n) => n.id === nodeId);

  useEffect(() => {
    if (!node) return;
    const questions = getQuestionsForNode(node.id, node.type);
    startSession(questions);
    return () => reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  if (!node) {
    return (
      <div className="px-4 py-10 max-w-[480px] mx-auto text-center">
        <p className="text-[var(--text-muted)] mb-4 text-sm">Sección no encontrada.</p>
        <Link href="/" className="text-[var(--listening)] underline text-sm">Volver al mapa</Link>
      </div>
    );
  }

  const fillColor = NODE_COLORS[node.type];
  const total = qbank.length;

  if (phase === 'results') {
    return <ResultsScreen nodeId={nodeId} fillColor={fillColor} onAddXP={addXP} />;
  }

  if (phase === 'idle' || total === 0) {
    return (
      <div className="px-4 py-10 max-w-[480px] mx-auto text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  const question = qbank[currentQ];
  if (!question) return null;

  return (
    <motion.div
      className="px-4 py-6 max-w-[480px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Quiz header */}
      <div className="flex items-center gap-3 mb-7">
        <button
          className="w-8 h-8 rounded-xl border border-[var(--border)] bg-white flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-raised)] transition-colors cursor-pointer text-sm"
          onClick={() => { reset(); router.push('/'); }}
          aria-label="Salir"
        >
          ✕
        </button>
        <ProgressBar current={currentQ} total={total} color={fillColor} />
        <span
          className="font-display text-[13px] font-semibold min-w-[32px] text-right"
          style={{ color: fillColor }}
        >
          {currentQ + 1}<span className="text-[var(--text-muted)] font-normal">/{total}</span>
        </span>
      </div>

      {/* Polymorphic question renderer */}
      {question.kind === 'multiple-choice' && (
        <MultipleChoiceQ question={question} fillColor={fillColor} total={total} />
      )}
      {question.kind === 'writing' && (
        <WritingQ question={question} fillColor={fillColor} total={total} />
      )}
      {question.kind === 'speaking' && (
        <SpeakingQ question={question} fillColor={fillColor} total={total} />
      )}
    </motion.div>
  );
}
