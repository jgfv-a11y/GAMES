import React, { useState } from 'react';
import { Gamepad2, Layers, Globe, Plus, Copy, Check, Info, Trash2 } from 'lucide-react';
import { Language, PerAppPackage } from '../types/index.ts';
import { POPULAR_PACKAGES } from '../data/gpuDatabase.ts';

interface PerAppManagerProps {
  lang: Language;
}

export const PerAppManager: React.FC<PerAppManagerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [packages, setPackages] = useState<PerAppPackage[]>(POPULAR_PACKAGES);
  const [customPkgInput, setCustomPkgInput] = useState('');
  const [customNameInput, setCustomNameInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Update mode for package
  const handleModeChange = (index: number, newMode: 'default' | 'angle' | 'native') => {
    setPackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], currentMode: newMode };
      return updated;
    });
  };

  // Add custom package
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPkgInput.trim()) return;

    const newPkg: PerAppPackage = {
      packageName: customPkgInput.trim(),
      displayName: customNameInput.trim() || customPkgInput.trim(),
      category: 'game',
      icon: 'Gamepad2',
      currentMode: 'angle',
      recommended: 'angle',
      description: {
        ar: 'تطبيق مخصص تم إضافته للتحكم في مسار محرك ANGLE.',
        en: 'Custom app package configured for ANGLE graphics driver injection.'
      }
    };

    setPackages([newPkg, ...packages]);
    setCustomPkgInput('');
    setCustomNameInput('');
  };

  // Remove custom package
  const handleRemove = (index: number) => {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate command for package
  const getCommandForPackage = (pkg: PerAppPackage) => {
    const driverVal = pkg.currentMode === 'angle' ? 'angle' : pkg.currentMode === 'native' ? 'native' : 'default';
    return `settings put global angle_gl_driver_selection_pkgs "${pkg.packageName}" && settings put global angle_gl_driver_selection_values "${driverVal}" && cmd activity force-stop "${pkg.packageName}"`;
  };

  // Generate all configured packages command
  const getAllConfiguredCommand = () => {
    const anglePkgs = packages.filter((p) => p.currentMode !== 'default');
    if (anglePkgs.length === 0) return '# No packages configured. Select ANGLE or Native for at least one app.';

    const pkgList = anglePkgs.map((p) => p.packageName).join(',');
    const valList = anglePkgs.map((p) => p.currentMode).join(',');

    return `settings put global angle_gl_driver_selection_pkgs "${pkgList}" && settings put global angle_gl_driver_selection_values "${valList}"`;
  };

  const handleCopyCmd = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="perapp" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-amber-400 font-semibold">{isAr ? 'طبقة ANGLE الهجينة' : 'ANGLE Layer Overrides'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'OpenGL ES فوق مسار Vulkan العتادي' : 'OpenGL ES over Vulkan Hardware'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAr ? 'تخصيص محرك الرسوميات لكل لعبة وتطبيق' : 'Per-App Graphics Driver & ANGLE Manager'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'هل تواجه لعبة معينة مشاكل مع Vulkan؟ أو تريد تشغيل لعبة OpenGL قديمة عبر معمارية Vulkan المترجمة (ANGLE) لزيادة الإطارات؟ خصص كل تطبيق بشكل منفصل دون لمس نظام الهاتف كاملاً.'
              : 'Direct individual games and emulators to use ANGLE (translates OpenGL ES to Vulkan) without modifying the entire OS SystemUI.'}
          </p>
        </div>

        {/* Global Batch Command Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300">
              {isAr ? 'الأمر الشامل لحقن جميع التطبيقات المحددة:' : 'Global Batch Injection Command:'}
            </span>
            <button
              onClick={() => handleCopyCmd(getAllConfiguredCommand(), -1)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {copiedIndex === -1 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'نسخ أمر الحزمة' : 'Copy Batch'}</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre">
            {getAllConfiguredCommand()}
          </div>
        </div>

        {/* Add Custom Package Bar */}
        <form onSubmit={handleAddCustom} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPkgInput}
            onChange={(e) => setCustomPkgInput(e.target.value)}
            placeholder={isAr ? 'اسم الحزمة (مثال: com.epicgames.fortnite)' : 'Package Name (e.g., com.epicgames.fortnite)'}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 font-mono"
          />
          <input
            type="text"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.target.value)}
            placeholder={isAr ? 'اسم مخصص (اختياري)' : 'Friendly Name (optional)'}
            className="sm:w-56 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة تطبيق للقائمة' : 'Add App'}</span>
          </button>
        </form>

        {/* Package List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg, idx) => {
            const cmd = getCommandForPackage(pkg);
            return (
              <div
                key={pkg.packageName}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {pkg.category === 'game' && <Gamepad2 className="w-4 h-4 text-rose-400" />}
                        {pkg.category === 'emulator' && <Layers className="w-4 h-4 text-amber-400" />}
                        {pkg.category === 'browser' && <Globe className="w-4 h-4 text-blue-400" />}
                        <span>{pkg.displayName}</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 block break-all">
                        {pkg.packageName}
                      </span>
                    </div>

                    {idx >= POPULAR_PACKAGES.length && (
                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {pkg.description[lang]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <span className="text-[11px] text-slate-400">{isAr ? 'محرك التشغيل المختار:' : 'Driver Mode:'}</span>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => handleModeChange(idx, 'angle')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                          pkg.currentMode === 'angle'
                            ? 'bg-rose-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ANGLE (Vulkan)
                      </button>
                      <button
                        onClick={() => handleModeChange(idx, 'native')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                          pkg.currentMode === 'native'
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Native GL
                      </button>
                      <button
                        onClick={() => handleModeChange(idx, 'default')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                          pkg.currentMode === 'default'
                            ? 'bg-slate-800 text-slate-200 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Default
                      </button>
                    </div>
                  </div>

                  {/* Single app quick copy button */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span className="truncate max-w-[200px]">{cmd}</span>
                    <button
                      onClick={() => handleCopyCmd(cmd, idx)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedIndex === idx ? (isAr ? 'تم!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
