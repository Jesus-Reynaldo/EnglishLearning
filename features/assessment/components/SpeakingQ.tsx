'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { type SpeakingQuestion } from '@/features/shared/types';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import { useTimer } from '@/features/shared/hooks/useTimer';
import { getSpeakingFeedback } from '@/actions/speaking-feedback';

interface Props {
  question: SpeakingQuestion;
  fillColor: string;
  total: number;
}

export default function SpeakingQ({ question, fillColor, total }: Props) {
  const { answered, showFeedback, aiFeedback, loading, currentQ, speakingRecording, setRecording, setTimer, setLoading, setAIFeedback, nextQuestion } = useAssessmentStore();
  const [displayTime, setDisplayTime] = useState(question.time);

  const handleEnd = async () => {
    setRecording(false);
    await fetchFeedback();
  };

  useTimer(speakingRecording, question.time,
    (t) => { setDisplayTime(t); setTimer(t); },
    handleEnd
  );

  const fetchFeedback = async () => {
    setLoading(true);
    const feedback = await getSpeakingFeedback(question.prompt);
    setLoading(false);
    setAIFeedback(feedback);
  };

  const toggle = async () => {
    if (speakingRecording) {
      setRecording(false);
      await fetchFeedback();
    } else {
      setDisplayTime(question.time);
      setRecording(true);
    }
  };

  const timerPct = ((displayTime) / question.time) * 100;

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

      {/* Recording panel */}
      <div
        className="rounded-2xl p-6 mb-5 text-center"
        style={{
          border: `1.5px solid ${speakingRecording ? fillColor + '50' : 'var(--border)'}`,
          background: speakingRecording ? `${fillColor}08` : 'var(--bg-surface)',
          boxShadow: speakingRecording ? `0 0 0 4px ${fillColor}15` : 'none',
          transition: 'all 0.25s',
        }}
      >
        {/* Circular timer */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="var(--border-soft)" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke={fillColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPct / 100)}`}
              className="transition-all duration-1000"
              opacity={speakingRecording ? 1 : 0.3}
            />
          </svg>
          <button
            className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-150 ${answered ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 active:scale-95 cursor-pointer'}`}
            style={{ background: speakingRecording ? '#D93A3A' : fillColor }}
            onClick={answered ? undefined : toggle}
          >
            {speakingRecording ? '⏹' : '🎤'}
          </button>
        </div>

        {/* Timer display */}
        <div className="font-display text-[28px] font-bold mb-1" style={{ color: speakingRecording ? fillColor : 'var(--text-secondary)' }}>
          {displayTime}s
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">
          {speakingRecording ? 'Grabando… toca para detener' : answered ? 'Práctica completada' : 'Toca el micrófono para hablar'}
        </div>
      </div>

      {/* Chunk tags */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
          Frases útiles
        </div>
        <div className="flex flex-wrap gap-2">
          {question.chunks.map((chunk) => (
            <button
              key={chunk}
              onClick={() => alert(`Chunk: "${chunk}"\n\nÚsalo al inicio de tu respuesta.`)}
              className="text-[12px] px-3 py-1.5 rounded-full border transition-all duration-120 hover:scale-[1.03] active:scale-95"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = fillColor + '80';
                (e.currentTarget as HTMLButtonElement).style.color = fillColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}
            >
              {chunk}
            </button>
          ))}
        </div>
      </div>

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
              <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--ok-text)' }}>Feedback Gemini</div>
              <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{aiFeedback}</div>
            </div>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center gap-2.5 py-3 mb-3 text-[13px] text-[var(--text-muted)]">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-transparent animate-spin flex-shrink-0" />
          Generando tips de pronunciación…
        </div>
      )}

      {answered && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${fillColor}EE, ${fillColor})`,
            boxShadow: `0 4px 16px ${fillColor}40`,
          }}
          onClick={nextQuestion}
        >
          {currentQ < total - 1 ? 'Siguiente →' : 'Ver resultados'}
        </motion.button>
      )}
    </motion.div>
  );
}
