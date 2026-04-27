import Header from '@/features/shared/components/Header';
import SkillMap from '@/features/learning/components/SkillMap';

export default function HomePage() {
  const today = new Date();
  const day = today.getDate();
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  return (
    <main className="px-4 pt-6 pb-16 max-w-[480px] mx-auto w-full animate-fade-up">
      <Header />

      {/* Daily Challenge Banner */}
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-4 mb-7 cursor-pointer group transition-all duration-200 hover:brightness-105 active:scale-[0.99]"
        style={{
          background: 'linear-gradient(130deg, #5C7424 0%, #7A9E2E 100%)',
          boxShadow: '0 4px 20px rgba(92,116,36,0.35)',
        }}
      >
        {/* Subtle inner texture */}
        <div className="absolute inset-0 opacity-10 node-texture-mixed pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.12em] mb-1">
                {day} de {months[today.getMonth()]} · Práctica diaria
              </div>
              <div className="font-display text-[18px] font-semibold text-white leading-tight">
                ¡Listo para el TOEFL ITP?
              </div>
              <div className="text-[13px] text-white/70 mt-1">Continúa tu racha de hoy</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-xl flex-shrink-0 ml-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">
          Mapa de secciones
        </div>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Skill Map */}
      <SkillMap />
    </main>
  );
}
