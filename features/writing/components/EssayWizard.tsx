'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWritingStore, type WizardStep } from '@/features/writing/store/useWritingStore';

const STEPS = [
  {
    title: 'Introduction',
    placeholder: 'Write your hook and thesis statement here…',
    topicHint: 'Open with a hook. State your position clearly in the thesis.',
  },
  {
    title: 'Body Paragraph 1 — First Reason',
    placeholder: 'First argument + supporting details…',
    topicHint: 'Topic sentence: state your first main argument directly.',
  },
  {
    title: 'Body Paragraph 2 — Second Reason',
    placeholder: 'Second argument + supporting details…',
    topicHint: 'Topic sentence: introduce contrasting or additional evidence.',
  },
  {
    title: 'Body Paragraph 3 — Third Reason',
    placeholder: 'Third argument + supporting details…',
    topicHint: 'Topic sentence: present your strongest supporting point.',
  },
  {
    title: 'Conclusion',
    placeholder: 'Synthesise your arguments and close the essay…',
    topicHint: 'Restate your thesis, summarise key points, and close strongly.',
  },
] as const;

const CONNECTORS = [
  'Furthermore',
  'Conversely',
  'Consequently',
  'Nevertheless',
  'In addition',
  'On the other hand',
] as const;

export default function EssayWizard() {
  const { paragraphs, currentStep, prompt, updateParagraph, setStep, reset } = useWritingStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFinal, setShowFinal] = useState(false);

  const currentText = paragraphs[currentStep];

  /* Final document view */
  if (showFinal) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
            Complete Essay
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFinal(false)}
              className="px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              ← Edit
            </button>
            <button
              onClick={() => { reset(); setShowFinal(false); }}
              className="px-4 py-2 rounded-xl text-sm text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Start over
            </button>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {STEPS.map((step, i) => (
            <motion.section
              key={i}
              layoutId={`para-block-${i}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-5"
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                {step.title}
              </h3>
              <p className="font-serif text-[15px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {paragraphs[i] || (
                  <span className="italic text-[var(--text-muted)]">(empty)</span>
                )}
              </p>
            </motion.section>
          ))}
        </motion.article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="md:hidden mb-3 flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <span>{sidebarOpen ? '▲' : '▼'}</span>
        {sidebarOpen ? 'Hide hints' : 'Show hints'}
      </button>

      <div className="flex flex-col md:flex-row gap-4">

        {/* ── Smart Sidebar ───────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:w-72 md:flex-shrink-0 overflow-hidden md:overflow-visible md:!h-auto"
            >
              <div
                className="rounded-2xl border border-[var(--border)] bg-white p-4 space-y-5 md:sticky md:top-4"
                style={{ background: 'var(--bg-surface)' }}
              >
                {/* Essay Prompt */}
                {prompt && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                      Essay Prompt
                    </div>
                    <p className="font-serif text-[13px] italic text-[var(--text-body,#52525B)] leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                )}

                {/* Topic sentence hint */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    Topic Sentence
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {STEPS[currentStep].topicHint}
                  </p>
                </div>

                {/* B2–C1 Connectors */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    B2–C1 Connectors
                  </div>
                  <div className="space-y-1.5">
                    {CONNECTORS.map((c) => {
                      const used = currentText.toLowerCase().includes(c.toLowerCase());
                      return (
                        <div
                          key={c}
                          className="flex items-center gap-2 text-[13px] transition-colors duration-200"
                          style={{ color: used ? 'var(--success)' : 'var(--text-muted)' }}
                        >
                          <span className="text-[10px] flex-shrink-0">
                            {used ? '✓' : '○'}
                          </span>
                          <span className={used ? 'font-semibold' : ''}>{c}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Editor Area ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i as WizardStep)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? 24 : 14,
                    background: i <= currentStep ? 'var(--primary)' : 'var(--border)',
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-[12px] text-[var(--text-muted)]">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>

          {/* All 5 paragraph blocks — focus mode */}
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            return (
              <motion.div
                key={i}
                layoutId={`para-block-${i}`}
                onClick={() => !isActive && setStep(i as WizardStep)}
                className="rounded-2xl border p-4 transition-all duration-300"
                style={{
                  opacity: isActive ? 1 : 0.3,
                  cursor: isActive ? 'default' : 'pointer',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                  background: 'var(--bg-surface)',
                  boxShadow: isActive ? '0 0 0 3px rgba(85,34,226,0.08)' : 'none',
                  pointerEvents: isActive ? 'auto' : 'auto',
                }}
                whileHover={!isActive ? { opacity: 0.5 } : {}}
              >
                <h3
                  className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                >
                  {step.title}
                </h3>

                {isActive ? (
                  <textarea
                    className="w-full bg-transparent outline-none resize-none leading-relaxed font-serif"
                    style={{
                      minHeight: 110,
                      fontSize: 14,
                      color: 'var(--text-primary)',
                    }}
                    placeholder={step.placeholder}
                    value={paragraphs[i]}
                    onChange={(e) => updateParagraph(i as WizardStep, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p
                    className="font-serif leading-relaxed min-h-[40px]"
                    style={{ fontSize: 14, color: 'var(--text-secondary)' }}
                  >
                    {paragraphs[i] || (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {step.placeholder}
                      </span>
                    )}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* Navigation */}
          <div className="flex gap-2 pt-2">
            {currentStep > 0 && (
              <button
                onClick={() => setStep((currentStep - 1) as WizardStep)}
                className="px-5 py-3 rounded-xl border border-[var(--border)] text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                ← Back
              </button>
            )}

            {currentStep < 4 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setStep((currentStep + 1) as WizardStep)}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Continue →
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setShowFinal(true)}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                View complete essay →
              </motion.button>
            )}

            <button
              onClick={reset}
              className="px-4 py-3 rounded-xl border border-[var(--border)] text-[13px] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
