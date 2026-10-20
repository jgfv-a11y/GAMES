import React, { useState } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, CheckCircle, Search, SlidersHorizontal, Info } from 'lucide-react';
import { Language, GpuSpec } from '../types/index.ts';
import { GPU_DATABASE } from '../data/gpuDatabase.ts';

interface GpuInspectorProps {
  lang: Language;
}

export const GpuInspector: React.FC<GpuInspectorProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [activeGpu, setActiveGpu] = useState<GpuSpec>(GPU_DATABASE[0]);

  const filteredGpus = GPU_DATABASE.filter((gpu) => {
    const matchesSearch =
      gpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.vulkanApiVersion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendor === 'all' || gpu.vendor.toLowerCase() === selectedVendor.toLowerCase();
    return matchesSearch && matchesVendor;
  });

  return (
    <section id="gpu" className="py-12 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-emerald-400 font-semibold">{isAr ? 'فحص العتاد والـ GPU' : 'Hardware & GPU Probe'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'توافق المعالجات مع SkiaVK' : 'SkiaVK Processor Compatibility Matrix'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAr ? 'فاحص توافق كروت الشاشة والمعالجات' : 'GPU Hardware Compatibility & Diagnostic Probe'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'قبل تفعيل Vulkan على مستوى واجهة النظام، تأكد من توافق معالج هاتفك الرسومي (Adreno, Mali, Immortalis, Xclipse) لتجنب أي عدم استقرار.'
              : 'Audit your chipset architecture (Snapdragon Adreno, MediaTek Mali/Immortalis, Exynos Xclipse, Google Tensor) before switching pipelines.'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم المعالج أو كرت الشاشة...' : 'Search processor or GPU name...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {['all', 'Qualcomm', 'MediaTek', 'Samsung', 'Google'].map((vendor) => {
              const label = vendor === 'all' ? (isAr ? 'الكل' : 'All') : vendor;
              const isSelected = selectedVendor === vendor;
              return (
                <button
                  key={vendor}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GPU Detail & List Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* GPU Selection List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredGpus.map((gpu) => {
              const isSelected = activeGpu.id === gpu.id;
              const isRockSolid = gpu.skiaVkStability === 'Rock-Solid';
              const isGood = gpu.skiaVkStability === 'Good';

              return (
                <div
                  key={gpu.id}
                  onClick={() => setActiveGpu(gpu)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500 shadow-md shadow-rose-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{gpu.name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{gpu.vulkanApiVersion}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap shrink-0 ${
                        isRockSolid
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : isGood
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {gpu.skiaVkStability}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredGpus.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                {isAr ? 'لم يتم العثور على معالجات مطابقة' : 'No matching GPU architectures found'}
              </div>
            )}
          </div>

          {/* Active GPU Inspector Detailed View (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold">{activeGpu.vendor} Architecture</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeGpu.name}</h3>
                <span className="text-xs font-mono text-slate-400">{activeGpu.vulkanApiVersion}</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">{isAr ? 'المحرك الموصى به:' : 'Recommended:'}</span>
                <span className="text-sm font-extrabold font-mono text-white">
                  {activeGpu.recommendedRenderer === 'skiavk' ? 'Vulkan (SkiaVK)' : 'OpenGL (SkiaGL)'}
                </span>
              </div>
            </div>

            {/* Assessment Notes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-white block mb-1">
                {isAr ? 'تقرير الاستقرار والتوصيات الهندسية:' : 'Engineering Stability Verdict:'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeGpu.notes[lang]}
              </p>
            </div>

            {/* Hardware Features Checklist */}
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-3">
                {isAr ? 'الميزات والامتدادات المدعومة في التعريف:' : 'Supported Hardware Features & Extensions:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {activeGpu.driverFeatures.map((feat, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Technical Explanation: Display-P3 & Surface Sync */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <SlidersHorizontal className="w-4 h-4" />
                <span>{isAr ? 'معادلة التزامن اللوني لشاشات AMOLED الحديثة:' : 'AMOLED Display Synchronization Formula:'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {isAr
                  ? 'عند التحويل إلى SkiaVK، يقوم السيرفيس فلينجر أحياناً بإنتاج إطارات أسرع من تردد تحديث الشاشة، مما يسبب Tear أو Flickering في شاشات سامسونج وشاومي. أمر setprop debug.sf.enable_gl_backpressure 1 يفرض ضغطاً خلفياً ينظم تدفق الإطارات بسلاسة 100% وبدون أي رمش.'
                  : 'When switching to SkiaVK, SurfaceFlinger can produce buffers faster than the hardware composer refresh rate, leading to flickering. Setting debug.sf.enable_gl_backpressure 1 regulates the pipeline pacing for tear-free delivery.'}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
