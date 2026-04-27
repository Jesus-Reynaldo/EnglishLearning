'use client';

import { motion } from 'framer-motion';

interface Props {
  correct: boolean;
  explanation: string;
}

export default function FeedbackBar({ correct, explanation }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="rounded-2xl mb-4 overflow-hidden"
      style={{
        background: correct ? 'var(--ok-bg)' : 'var(--err-bg)',
        border: `1px solid ${correct ? 'var(--ok-border)' : 'var(--err-border)'}`,
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-sm font-bold"
          style={{ background: correct ? 'var(--ok-text)' : 'var(--err-text)' }}
        >
          {correct ? '✓' : '✗'}
        </div>
        <div>
          <div
            className="text-[13px] font-semibold mb-1"
            style={{ color: correct ? 'var(--ok-text)' : 'var(--err-text)' }}
          >
            {correct ? '¡Correcto!' : 'Respuesta incorrecta'}
          </div>
          <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            {explanation}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
