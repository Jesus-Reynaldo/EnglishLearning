'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWritingStore, type WizardStep } from '@/features/writing/store/useWritingStore';

const STEPS: { title: string; placeholder: string }[] = [
  { title: 'Introducción', placeholder: 'Escribe tu hook y tesis aquí...' },
  { title: 'Párrafo 1 — Primera razón', placeholder: 'Primera razón + detalles de soporte...' },
  { title: 'Párrafo 2 — Segunda razón', placeholder: 'Segunda razón + detalles de soporte...' },
  { title: 'Párrafo 3 — Tercera razón', placeholder: 'Tercera razón + detalles de soporte...' },
  { title: 'Conclusión', placeholder: 'Síntesis y cierre del ensayo...' },
];

export default function EssayWizard() {
  const { paragraphs, currentStep, prompt, updateParagraph, nextStep, prevStep, reset } = useWritingStore();

  const fullEssay = paragraphs.join('\n\n');
  const isLastStep = currentStep === 4;
  const stepData = STEPS[currentStep];

  return (
    <div className="px-4 py-6 max-w-[480px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">
          Reiniciar
        </button>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStep ? 'bg-[#1D9E75] w-6' : 'bg-gray-200 w-4'}`}
            />
          ))}
        </div>
        <span className="text-[13px] text-gray-400">{currentStep + 1}/5</span>
      </div>

      {prompt && (
        <div className="bg-gray-50 rounded-[10px] px-4 py-3 mb-4 text-sm text-gray-500 italic border-l-[3px] border-[#1D9E75]">
          {prompt}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isLastStep ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">{stepData.title}</h2>
            <textarea
              className="w-full min-h-[160px] p-3.5 rounded-[14px] border-[1.5px] border-gray-200 bg-white text-[15px] text-gray-900 resize-none outline-none leading-relaxed focus:border-[#1D9E75] transition-colors"
              placeholder={stepData.placeholder}
              value={paragraphs[currentStep]}
              onChange={(e) => updateParagraph(currentStep as WizardStep, e.target.value)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-2">Ensayo completo</h2>
            <p className="text-sm text-gray-400 mb-4">Revisa tu ensayo antes de enviarlo.</p>
            <div className="bg-gray-50 rounded-[14px] p-4 text-sm text-gray-700 leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-wrap border-[1.5px] border-gray-200">
              {fullEssay || <span className="text-gray-400">Tu ensayo aparecerá aquí...</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2.5 mt-6">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className="px-5 py-3.5 rounded-[14px] border-[1.5px] border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ← Atrás
          </button>
        )}
        <button
          onClick={isLastStep ? reset : nextStep}
          className="flex-1 py-3.5 rounded-[14px] border-none text-[15px] font-medium text-white bg-[#1D9E75] hover:opacity-90 transition-opacity"
        >
          {isLastStep ? 'Finalizar ✓' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}
