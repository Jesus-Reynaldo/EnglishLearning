'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { type SkillNode, NODE_COLORS } from '@/features/shared/types';

interface Props {
  node: SkillNode | null;
  onClose: () => void;
}

const SKILL_DESCRIPTIONS: Record<string, string> = {
  listening: 'Diálogos cortos, inferencia y comprensión auditiva del TOEFL ITP Part A.',
  structure: 'Gramática avanzada: inversión, sujeto-verbo, conectores y expresión escrita.',
  reading:   'Comprensión de textos académicos: idea principal, vocabulario en contexto.',
  writing:   'Ensayo TWE de 5 párrafos. Desde introducción hasta conclusión, asistido por IA.',
  speaking:  'TSE Stage 1: respuestas fluidas usando chunk phrases y patrones de entonación.',
  mixed:     'Simulacro combinado con preguntas de todas las secciones. ¡El reto máximo!',
};

export default function NodeModal({ node, onClose }: Props) {
  const router = useRouter();

  const handleStart = () => {
    if (!node) return;
    onClose();
    router.push(`/practice/${node.id}`);
  };

  const color = node ? NODE_COLORS[node.type] : '#2B72B8';

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 surface rounded-t-[24px] overflow-hidden"
            style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.12)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
          >
            {/* Color accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
            </div>

            <div className="px-6 pt-3 pb-8">
              {/* Node info */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 node-texture-${node.type}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 4px 12px ${color}40`,
                  }}
                >
                  {node.icon}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    {node.tooltip}
                  </div>
                  <h2 className="font-display text-[22px] font-semibold text-[var(--text-primary)] leading-tight">
                    {node.label}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {SKILL_DESCRIPTIONS[node.type] ?? node.tooltip}
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="px-5 py-3.5 rounded-2xl border border-[var(--border)] text-sm text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-raised)] transition-colors active:scale-95"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={handleStart}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3.5 rounded-2xl border-none text-[15px] font-semibold text-white cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                    boxShadow: `0 4px 16px ${color}50`,
                  }}
                >
                  Empezar práctica →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
