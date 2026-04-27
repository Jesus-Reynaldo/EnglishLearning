'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { useAssessmentStore } from '@/features/assessment/store/useAssessmentStore';
import { useGamificationStore } from '@/features/gamification/store/useGamificationStore';

interface Props {
  nodeId: string;
  fillColor: string;
  onAddXP: (amount: number) => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 260 } },
};

export default function ResultsScreen({ nodeId: _nodeId, fillColor, onAddXP }: Props) {
  const router = useRouter();
  const { score, qbank, reset } = useAssessmentStore();
  const { xp, streak } = useGamificationStore();

  const total = qbank.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const gained = score * 10;

  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '💪';
  const msg   = pct >= 80 ? 'Desempeño excelente'  : pct >= 60 ? 'Buen progreso'        : 'Sigue practicando';
  const sub   = pct >= 80 ? 'Estás listo para el examen'   : pct >= 60 ? 'Vas en la dirección correcta' : 'Cada intento cuenta';

  const xpAdded = useRef(false);
  useEffect(() => {
    if (!xpAdded.current) { onAddXP(gained); xpAdded.current = true; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { label: 'Correctas',  value: `${score}/${total}`, color: 'var(--ok-text)' },
    { label: 'XP total',   value: (xp + gained).toLocaleString(), color: fillColor },
    { label: 'Racha',      value: `🔥 ${streak}`,   color: 'var(--text-primary)' },
    { label: 'Nivel',      value: 'B2+',             color: 'var(--text-primary)' },
  ];

  return (
    <motion.div
      className="px-5 py-8 max-w-[480px] mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero */}
      <motion.div variants={item} className="text-center mb-6">
        <div className="text-[60px] mb-3 leading-none">{emoji}</div>
        <div
          className="font-display mb-1 font-bold"
          style={{ fontSize: 'clamp(52px, 14vw, 72px)', lineHeight: 1, color: fillColor }}
        >
          {pct}%
        </div>
        <div className="text-[17px] font-semibold text-[var(--text-primary)] mb-0.5">{msg}</div>
        <div className="text-sm text-[var(--text-muted)]">{sub}</div>
      </motion.div>

      {/* XP badge */}
      <motion.div variants={item} className="flex justify-center mb-6">
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border"
          style={{
            background: 'var(--xp-bg)',
            color: 'var(--xp-text)',
            borderColor: 'rgba(26,74,148,0.18)',
          }}
        >
          <span className="font-display text-[15px]">✦</span>
          +{gained} XP ganados esta sesión
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-2.5 mb-7">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              {label}
            </div>
            <div className="font-display text-[20px] font-bold" style={{ color }}>
              {value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${fillColor}EE, ${fillColor})`,
            boxShadow: `0 4px 20px ${fillColor}45`,
          }}
          onClick={() => { reset(); router.push('/'); }}
        >
          Volver al mapa
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
