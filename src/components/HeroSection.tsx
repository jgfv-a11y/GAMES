import React from 'react';
import { ArrowLeft, ArrowRight, Play, Terminal, ShieldCheck, Flame } from 'lucide-react';
import { Language } from '../types/index.ts';

interface HeroSectionProps {
  lang: Language;
  onNavigate: (section: string) => void;
  onOpenQuickSwitch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onNavigate,
  onOpenQuickSwitch,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800/80">
      {/* Background radial gradient accent */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -z-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 flex-wrap">
              <span className="text-rose-400 font-semibold">Vulkan 1.3 Architecture</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>SkiaVK HWUI Pipeline</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Shizuku IPC Binder</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Android 10 - 15+</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance mb-4">
              {isAr ? (
                <>
                  منظومة تحكم متقدمة لمسار رسوميات أندرويد من{' '}
                  <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                    OpenGL إلى Vulkan
                  </span>
                </>
              ) : (
                <>
                  Next-Gen Android Graphics Pipeline Controller:{' '}
                  <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                    OpenGL to Vulkan
                  </span>
                </>
              )}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-6">
              {isAr
                ? 'تجاوز حدود تطبيق GAMA التقليدي. محرك متكامل مدعوم بـ Shizuku مع مؤقت أمان تلقائي ضد الشاشة السوداء (12s Watchdog)، تحكم فوري بالـ ANGLE لكل لعبة، مزامنة شاشات AMOLED، وتوليد فوري لكود Kotlin وأوامر ADB.'
                : 'Far beyond legacy tools like GAMA. An enterprise-grade graphics engine powered by Shizuku with automated 12s safety watchdog against black screens, per-app ANGLE driver injection, AMOLED display synchronization, and ready-to-build Android Kotlin codebase.'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 flex-wrap mb-8">
              <button
                onClick={() => onNavigate('simulator')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-lg shadow-rose-950/50 border border-rose-400/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isAr ? 'تجربة المحاكي التفاعلي' : 'Launch Interactive Simulator'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('commands')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'أوامر ADB & Shizuku الفورية' : 'Instant ADB & Shizuku Scripts'}</span>
              </button>
            </div>

            {/* High-value feature points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'حماية الإنقاذ الذاتي' : 'Self-Healing Failsafe'}</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {isAr ? 'مؤقت 12 ثانية للتراجع التلقائي' : '12s Auto-Rollback Timer'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'تخصيص الألعاب والتطبيقات' : 'Per-App Driver Injection'}</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {isAr ? 'ANGLE (OpenGL عبر Vulkan)' : 'ANGLE (GLES over Vulkan)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'تزامن الشاشة والألوان' : 'AMOLED Display Sync'}</span>
                <span className="font-semibold text-white font-mono tabular-nums">
                  {isAr ? 'Display-P3 & Backpressure' : 'Display-P3 & Backpressure'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Visual Column (5 cols) */}
          <div className="lg:col-span-5 flex items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              {/* Image Asset with fallback container */}
              <div className="relative aspect-[16/9] w-full bg-slate-950">
                <img
                  src="/src/assets/images/gpu_pipeline_arch_1792491888746.jpg"
                  alt="Mobile GPU Rendering Architecture Diagram"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Graceful fallback container if image fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                          <div class="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                          </div>
                          <span class="text-sm font-semibold text-white">Vulkan HWUI Hardware Pipeline</span>
                          <span class="text-xs text-slate-400 mt-1">SkiaVK Core Architecture</span>
                        </div>
                      `;
                    }
                  }}
                />
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Overlaid caption */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs">
                  <div className="font-mono text-slate-200">
                    <span className="text-rose-400 font-semibold">HWUI SkiaVK</span> · Direct Pipeline
                  </div>
                  <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                    Sub-2.5ms Draw
                  </span>
                </div>
              </div>

              {/* Quick Pipeline Compare Bar */}
              <div className="p-4 bg-slate-900/90 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">{isAr ? 'زمن رسم إطار الواجهة (Draw Time)' : 'Frame Draw Time'}</span>
                  <span className="font-mono text-slate-300">SkiaVK vs SkiaGL</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-rose-400 font-bold">Vulkan</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-slate-200 tabular-nums w-14 text-right">2.1 ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-blue-400 font-medium">OpenGL</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-slate-400 tabular-nums w-14 text-right">5.8 ms</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
