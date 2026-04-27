'use client';

import { motion } from 'framer-motion';
import { type MultipleChoiceQuestion } from '@/features/shared/types';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import FeedbackBar from '@/features/shared/components/FeedbackBar';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface Props {
  question: MultipleChoiceQuestion;
  fillColor: string;
  total: number;
}

export default function MultipleChoiceQ({ question, fillColor, total }: Props) {
  const { selectedOption, answered, feedbackCorrect, showFeedback, currentQ, selectOption, submitAnswer, nextQuestion } = useAssessmentStore();

  const handleSubmitOrNext = () => {
    if (!answered) {
      submitAnswer(selectedOption === question.answer);
    } else {
      nextQuestion();
    }
  };

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Question type chip */}
      <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-[var(--border)] bg-white mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {question.type}
        </span>
      </div>

      {/* Context (dialogue/passage) */}
      {question.context && (
        <div
          className="rounded-2xl px-4 py-3.5 mb-5 relative overflow-hidden"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-soft)',
            borderLeft: `3px solid ${fillColor}`,
          }}
        >
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">
            {question.context.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </p>
        </div>
      )}

      {/* Question text */}
      <p className="font-display text-[18px] font-semibold text-[var(--text-primary)] leading-snug mb-5">
        {question.q}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {question.options.map((opt, i) => {
          const isSelected = i === selectedOption;
          const isCorrect = answered && i === question.answer;
          const isWrong = answered && isSelected && i !== question.answer;
          const isNeutralAnswered = answered && !isCorrect && !isWrong;

          return (
            <motion.button
              key={i}
              whileTap={!answered ? { scale: 0.985 } : {}}
              onClick={() => !answered && selectOption(i)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-150 font-medium text-[14px]"
              style={{
                border: `1.5px solid ${
                  isCorrect ? 'var(--ok-border)' :
                  isWrong   ? 'var(--err-border)' :
                  isSelected ? fillColor + '60' :
                  'var(--border)'
                }`,
                background: isCorrect ? 'var(--ok-bg)' :
                            isWrong   ? 'var(--err-bg)' :
                            isSelected ? `${fillColor}0D` :
                            'var(--bg-surface)',
                color: isCorrect ? 'var(--ok-text)' :
                       isWrong   ? 'var(--err-text)' :
                       isSelected ? fillColor :
                       'var(--text-primary)',
                opacity: isNeutralAnswered ? 0.45 : 1,
              }}
            >
              {/* Option label */}
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: isCorrect ? 'var(--ok-text)' :
                               isWrong   ? 'var(--err-text)' :
                               isSelected ? fillColor : 'var(--bg-raised)',
                  color: isSelected || isCorrect || isWrong ? 'white' : 'var(--text-muted)',
                }}
              >
                {isCorrect ? '✓' : isWrong ? '✗' : OPTION_LABELS[i]}
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {showFeedback && <FeedbackBar correct={feedbackCorrect} explanation={question.exp} />}

      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${fillColor}EE, ${fillColor})`,
          boxShadow: (!answered && selectedOption === null) ? 'none' : `0 4px 16px ${fillColor}40`,
        }}
        disabled={!answered && selectedOption === null}
        onClick={handleSubmitOrNext}
      >
        {answered
          ? currentQ < total - 1 ? 'Siguiente →' : 'Ver resultados'
          : 'Comprobar'}
      </motion.button>
    </motion.div>
  );
}
