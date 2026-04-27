'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { type SpeakingQuestion } from '@/features/shared/types';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import { useTimer } from '@/features/shared/hooks/useTimer';
import { getSpeakingFeedback } from '@/actions/speaking-feedback';

interface Props {
  question: SpeakingQuestion;
  fillColor: string;
  total: number;
}

/* Deterministic native-speaker bar heights via sine composition */
const NATIVE_BARS = Array.from({ length: 30 }, (_, i) =>
  Math.min(100, 25 + 45 * Math.abs(Math.sin(i * 0.7 + 0.5)) + 20 * Math.abs(Math.sin(i * 1.9 + 0.8)))
);

function ShadowingWaveform({
  userBars,
  playheadPct,
  recording,
}: {
  userBars: number[];
  playheadPct: number;
  recording: boolean;
}) {
  const MAX_H = 44;
  return (
    <div
      className="rounded-2xl overflow-hidden mb-5"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      {/* Native speaker waveform */}
      <div className="px-3 pt-3 pb-1.5">
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-2 font-semibold">
          Native Speaker
        </div>
        <div className="relative flex items-end justify-center gap-[3px] h-12">
          {NATIVE_BARS.map((h, i) => {
            const pct = (i / NATIVE_BARS.length) * 100;
            const passed = recording && pct < playheadPct;
            return (
              <div
                key={i}
                className="w-[5px] rounded-full flex-shrink-0"
                style={{
                  height: (h / 100) * MAX_H + 3,
                  background: passed ? '#5522E2' : '#C4B5FD',
                  transition: 'background 0.1s',
                }}
              />
            );
          })}
          {/* Moving playhead */}
          {recording && (
            <div
              className="absolute inset-y-0 w-[2px] rounded-full"
              style={{
                left: `${playheadPct}%`,
                background: 'linear-gradient(to bottom, #5522E2, #7C3AED)',
                opacity: 0.85,
                transition: 'left 0.5s linear',
              }}
            />
          )}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '0 12px' }} />

      {/* User recording waveform (mirrored — grows from top) */}
      <div className="px-3 pb-3 pt-1.5">
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-2 font-semibold">
          Your Voice
        </div>
        <div className="flex items-start justify-center gap-[3px] h-12">
          {userBars.map((h, i) => (
            <div
              key={i}
              className="w-[5px] rounded-full flex-shrink-0"
              style={{
                height: (h / 100) * MAX_H + 3,
                background: recording ? '#059669' : '#D4D4D8',
                transition: 'height 0.1s, background 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpeakingQ({ question, fillColor, total }: Props) {
  const {
    answered, showFeedback, aiFeedback, loading, currentQ,
    speakingRecording, setRecording, setTimer, setLoading, setAIFeedback, nextQuestion,
  } = useAssessmentStore();

  const [displayTime, setDisplayTime] = useState(question.time);
  const [userBars, setUserBars] = useState(() => Array(30).fill(10));
  const [ipaVisible, setIpaVisible] = useState<number | null>(null);
  const [activePill, setActivePill] = useState<number | null>(null);
  const longPressTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  /* Animate user bars while recording */
  useEffect(() => {
    if (!speakingRecording) {
      setUserBars(Array(30).fill(10));
      return;
    }
    const interval = setInterval(() => {
      setUserBars(Array.from({ length: 30 }, () => 10 + Math.random() * 85));
    }, 140);
    return () => clearInterval(interval);
  }, [speakingRecording]);

  /* Advance active pill as time runs down */
  useEffect(() => {
    if (!speakingRecording) { setActivePill(null); return; }
    const idx = Math.min(
      question.chunks.length - 1,
      Math.floor(((question.time - displayTime) / question.time) * question.chunks.length)
    );
    setActivePill(idx);
  }, [displayTime, speakingRecording, question.time, question.chunks.length]);

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

  const playheadPct = ((question.time - displayTime) / question.time) * 100;
  const timerPct = (displayTime / question.time) * 100;

  const handlePillPointerDown = (index: number) => {
    const timer = setTimeout(() => setIpaVisible(index), 500);
    longPressTimers.current.set(index, timer);
  };

  const handlePillPointerUp = (index: number) => {
    const timer = longPressTimers.current.get(index);
    if (timer) { clearTimeout(timer); longPressTimers.current.delete(index); }
    if (ipaVisible === index) setIpaVisible(null);
  };

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-[var(--border)] bg-white mb-4">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {question.type}
        </span>
      </div>

      <p className="font-serif text-[17px] font-semibold text-[var(--text-primary)] leading-snug mb-5">
        {question.prompt}
      </p>

      {/* Dual waveform */}
      <ShadowingWaveform
        userBars={userBars}
        playheadPct={playheadPct}
        recording={speakingRecording}
      />

      {/* Recording panel */}
      <div
        className="rounded-2xl p-5 mb-5 text-center"
        style={{
          border: `1.5px solid ${speakingRecording ? fillColor + '50' : 'var(--border)'}`,
          background: speakingRecording ? `${fillColor}08` : 'var(--bg-surface)',
          boxShadow: speakingRecording ? `0 0 0 4px ${fillColor}15` : 'none',
          transition: 'all 0.25s',
        }}
      >
        {/* Circular timer */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-soft)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={fillColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - timerPct / 100)}`}
              className="transition-all duration-1000"
              opacity={speakingRecording ? 1 : 0.3}
            />
          </svg>
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-xl transition-all duration-150 ${answered ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 cursor-pointer'}`}
            style={{ background: speakingRecording ? '#E11D48' : fillColor }}
            onClick={answered ? undefined : toggle}
            aria-label={speakingRecording ? 'Stop recording' : 'Start recording'}
          >
            {speakingRecording ? '⏹' : '🎤'}
          </motion.button>
        </div>

        <div className="font-display text-[26px] font-bold mb-0.5" style={{ color: speakingRecording ? fillColor : 'var(--text-secondary)' }}>
          {displayTime}s
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">
          {speakingRecording
            ? 'Recording… tap to stop'
            : answered
            ? 'Practice complete'
            : 'Tap the mic to speak'}
        </div>
      </div>

      {/* Interactive phrase pills */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
          Useful Phrases — long-press for pronunciation
        </div>
        <div className="flex flex-wrap gap-2">
          {question.chunks.map((chunk, idx) => {
            const isActive = activePill === idx;
            const showIpa = ipaVisible === idx;
            return (
              <div key={chunk} className="relative">
                <button
                  onPointerDown={() => handlePillPointerDown(idx)}
                  onPointerUp={() => handlePillPointerUp(idx)}
                  onPointerLeave={() => handlePillPointerUp(idx)}
                  className="text-[12px] px-3 py-1.5 rounded-full border transition-all duration-150 select-none"
                  style={{
                    background: isActive ? '#5522E2' : 'var(--bg-surface)',
                    borderColor: isActive ? '#5522E2' : 'var(--border)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 2px 8px rgba(85,34,226,0.3)' : 'none',
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {chunk}
                </button>
                {/* IPA tooltip on long-press */}
                {showIpa && question.ipa?.[idx] && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-20 bg-[var(--text-primary)] text-white rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg"
                  >
                    <span className="font-mono-ipa">{question.ipa[idx]}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[var(--text-primary)]" />
                  </motion.div>
                )}
              </div>
            );
          })}
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
              <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--ok-text)' }}>
                Gemini Feedback
              </div>
              <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{aiFeedback}</div>
            </div>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center gap-2.5 py-3 mb-3 text-[13px] text-[var(--text-muted)]">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-transparent animate-spin flex-shrink-0" />
          Generating pronunciation tips…
        </div>
      )}

      {answered && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${fillColor}EE, ${fillColor})`,
            boxShadow: `0 4px 16px ${fillColor}40`,
          }}
          onClick={nextQuestion}
        >
          {currentQ < total - 1 ? 'Next →' : 'See results'}
        </motion.button>
      )}
    </motion.div>
  );
}
