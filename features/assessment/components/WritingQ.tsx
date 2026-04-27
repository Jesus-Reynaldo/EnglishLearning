'use client';

import { motion } from 'framer-motion';
import { type WritingQuestion } from '@/features/shared/types';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import { getWritingFeedback } from '@/actions/writing-feedback';

interface Props {
  question: WritingQuestion;
  fillColor: string;
  total: number;
}

export default function WritingQ({ question, fillColor, total }: Props) {
  const { writingText, answered, showFeedback, aiFeedback, loading, currentQ, updateWritingText, setLoading, setAIFeedback, nextQuestion } = useAssessmentStore();

  const words = writingText.trim().split(/\s+/).filter(Boolean).length;
  const minWords = question.minWords ?? 80;
  const canSubmit = words >= minWords;
  const wordPct = Math.min(100, Math.round((words / minWords) * 100));

  const handleSubmit = async () => {
    setLoading(true);
    const feedback = await getWritingFeedback(question.prompt, writingText);
    setLoading(false);
    setAIFeedback(feedback);
  };

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-[var(--border)] bg-white mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{question.type}</span>
      </div>

      <p className="font-display text-[17px] font-semibold text-[var(--text-primary)] leading-snug mb-5">
        {question.prompt}
      </p>

      {!answered ? (
        <>
          <textarea
            className="w-full min-h-[150px] p-4 rounded-2xl text-[14px] text-[var(--text-primary)] leading-relaxed resize-none outline-none transition-all duration-150"
            style={{
              border: `1.5px solid ${canSubmit ? fillColor + '60' : 'var(--border)'}`,
              background: 'var(--bg-surface)',
              fontFamily: 'var(--font-sans)',
              boxShadow: canSubmit ? `0 0 0 3px ${fillColor}15` : 'none',
            }}
            placeholder="Escribe tu ensayo aquí..."
            value={writingText}
            onChange={(e) => updateWritingText(e.target.value)}
          />
          {/* Word count progress */}
          <div className="mt-2 mb-4">
            <div className="flex justify-between text-[11px] font-medium mb-1.5">
              <span style={{ color: canSubmit ? fillColor : 'var(--text-muted)' }}>
                {canSubmit ? '✓ Mínimo alcanzado' : `${minWords - words} palabras más`}
              </span>
              <span className="text-[var(--text-muted)]">{words} / {minWords}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--border-soft)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${wordPct}%`,
                  background: canSubmit ? fillColor : 'var(--text-muted)',
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          className="rounded-2xl px-4 py-3.5 mb-5 text-[13px] text-[var(--text-secondary)] leading-relaxed max-h-40 overflow-y-auto italic"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-soft)',
            borderLeft: `3px solid ${fillColor}`,
          }}
        >
          {writingText}
        </div>
      )}

      {showFeedback && aiFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="rounded-2xl mb-4 overflow-hidden"
          style={{ background: 'var(--ok-bg)', border: '1px solid var(--ok-border)' }}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-sm font-bold" style={{ background: 'var(--ok-text)' }}>
              ✦
            </div>
            <div>
              <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--ok-text)' }}>Retroalimentación Gemini</div>
              <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{aiFeedback}</div>
            </div>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center gap-2.5 py-3 mb-3 text-[13px] text-[var(--text-muted)]">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-transparent animate-spin flex-shrink-0" />
          Analizando tu ensayo…
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${fillColor}EE, ${fillColor})`,
          boxShadow: (answered || canSubmit) ? `0 4px 16px ${fillColor}40` : 'none',
        }}
        disabled={(!answered && !canSubmit) || loading}
        onClick={answered ? nextQuestion : handleSubmit}
      >
        {answered ? (currentQ < total - 1 ? 'Siguiente →' : 'Ver resultados') : 'Enviar ensayo'}
      </motion.button>
    </motion.div>
  );
}
