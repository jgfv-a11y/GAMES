import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Flame, RotateCcw, Sparkles, Shield, Wrench } from 'lucide-react';
import { Language } from '../types/index.ts';
import { downloadFile } from '../services/zipExporter.ts';

interface CommandStudioProps {
  lang: Language;
}

interface CommandPreset {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  icon: React.ReactNode;
  commands: string;
  fileName: string;
}

export const CommandStudio: React.FC<CommandStudioProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<string>('vulkan-full');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets: CommandPreset[] = [
    {
      id: 'vulkan-full',
      title: {
        ar: 'التحويل الكامل إلى Vulkan (SkiaVK)',
        en: 'Full Vulkan (SkiaVK) Pipeline'
      },
      description: {
        ar: 'تفعيل محرك Vulkan لجميع واجهات النظام مع تزامن شاشات OLED وإعادة تشغيل ناعمة بدون كراش.',
        en: 'Enables Vulkan pipeline with AMOLED backpressure sync and zero-crash soft restart.'
      },
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      fileName: 'apply_vulkan_skiavk.sh',
      commands: `# 1. Set Hardware UI pipeline to Vulkan
setprop debug.hwui.renderer skiavk
setprop ro.hwui.use_vulkan true

# 2. Prevent color flickering & jitter on AMOLED displays
setprop debug.sf.enable_gl_backpressure 1
setprop debug.hwui.render_thread_priority -20
setprop debug.sf.predict_hwc_composition_strategy 1

# 3. Graceful SystemUI Soft-Restart via Activity Manager
cmd activity force-stop com.android.systemui
am start-service -a android.intent.action.MAIN -n com.android.systemui/.SystemUIService`
    },
    {
      id: 'opengl-rollback',
      title: {
        ar: 'استرجاع مسار OpenGL الأصلي (SkiaGL)',
        en: 'Revert to Native OpenGL (SkiaGL)'
      },
      description: {
        ar: 'إلغاء تفعيل Vulkan والعودة إلى محرك OpenGL القياسي المتوافق بنسبة 100% مع جميع الأجهزة.',
        en: 'Disables Vulkan and safely falls back to standard SkiaGL pipeline.'
      },
      icon: <RotateCcw className="w-4 h-4 text-blue-400" />,
      fileName: 'revert_to_opengl.sh',
      commands: `# 1. Restore OpenGL pipeline
setprop debug.hwui.renderer skiagl
setprop ro.hwui.use_vulkan false

# 2. Reset SurfaceFlinger buffer pressure
setprop debug.sf.enable_gl_backpressure 0

# 3. Soft restart SystemUI
cmd activity force-stop com.android.systemui
am start-service -a android.intent.action.MAIN -n com.android.systemui/.SystemUIService`
    },
    {
      id: 'shader-warmup',
      title: {
        ar: 'إحماء الشيدر ومنع التقطيع (Shader Warm-up)',
        en: 'Shader Pre-compilation & Warm-up'
      },
      description: {
        ar: 'تجميع مسارات الشيدر لـ SystemUI وحذف الكاش القديم لتشغيل فائق النعومة من اللحظة الأولى.',
        en: 'Pre-compiles AOT speed profiles and purges old cache to eradicate initial micro-stutters.'
      },
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      fileName: 'shader_warmup_optimize.sh',
      commands: `# 1. AOT Compile SystemUI with speed-profile optimization
cmd package compile -m speed-profile com.android.systemui

# 2. Purge stale OpenGL graphics shader cache
rm -rf /data/user_de/0/com.android.systemui/code_cache/*

# 3. Refresh display window compositor
cmd window dump-visible-window-producers > /dev/null 2>&1`
    },
    {
      id: 'factory-reset',
      title: {
        ar: 'استعادة إعدادات المصنع الافتراضية',
        en: 'Reset to System Default'
      },
      description: {
        ar: 'مسح جميع خصائص debug.hwui يدوياً وترك نظام أندرويد يختار المحرك التلقائي للمصنع.',
        en: 'Clears all custom hwui properties and lets OEM ROM decide the optimal driver.'
      },
      icon: <Wrench className="w-4 h-4 text-slate-400" />,
      fileName: 'reset_system_defaults.sh',
      commands: `# 1. Reset all custom graphics properties to blank
setprop debug.hwui.renderer ""
setprop ro.hwui.use_vulkan ""
setprop debug.sf.enable_gl_backpressure ""
setprop debug.hwui.render_thread_priority ""

# 2. Restart interface
cmd activity force-stop com.android.systemui`
    },
    {
      id: 'verify-dumpsys',
      title: {
        ar: 'التحقق وفحص المحرك الفعلي الحالي',
        en: 'Verify Active Pipeline via dumpsys'
      },
      description: {
        ar: 'فحص خط الأنابيب الفعلي لـ SystemUI لمعرفة هل هو SkiaVulkan أو SkiaOpenGL.',
        en: 'Queries dumpsys gfxinfo to verify whether SkiaVK or SkiaGL is actively handling draws.'
      },
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      fileName: 'check_active_pipeline.sh',
      commands: `# 1. Query SystemUI active graphics pipeline
dumpsys gfxinfo com.android.systemui | grep -i -E "pipeline|vulkan|skiagl|skiavk"

# 2. Check property values directly
getprop debug.hwui.renderer
getprop ro.hwui.use_vulkan`
    }
  ];

  const currentPreset = presets.find((p) => p.id === activeTab) || presets[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="commands" className="py-12 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-rose-400 font-semibold">{isAr ? 'مركز الأوامر' : 'Command Studio'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'جاهزة للتشغيل عبر Shizuku / Rish / ADB' : 'Ready for Shizuku, Rish & ADB'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAr ? 'استوديو أوامر Shizuku & ADB الفورية' : 'Shizuku & ADB Command Studio'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'احصل على الأوامر الدقيقة التي يمكنك لصقها مباشرة في Shizuku Runner، تطبيق Termux عبر rish، أو عبر الكمبيوتر باستخدام كابل USB.'
              : 'Execute directly via Shizuku command runner, Termux using rish shell, or PC USB debugging.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {presets.map((preset) => {
            const isActive = activeTab === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setActiveTab(preset.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50 border border-rose-400/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                {preset.icon}
                <span>{preset.title[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Command Display Terminal Box */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Terminal Window Header */}
          <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                {currentPreset.fileName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentPreset.commands, currentPreset.id)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                {copiedId === currentPreset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'نسخ الأوامر' : 'Copy'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile(currentPreset.fileName, currentPreset.commands, 'application/x-sh')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? 'تحميل .sh' : 'Download .sh'}</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/60 text-xs text-slate-300">
            <span className="font-semibold text-rose-400">{currentPreset.title[lang]}: </span>
            <span>{currentPreset.description[lang]}</span>
          </div>

          {/* Code Body */}
          <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto bg-[#070a12] leading-relaxed">
            <pre>
              <code>
                {currentPreset.commands.split('\n').map((line, idx) => {
                  const isComment = line.trim().startsWith('#');
                  const isCommand = line.trim().startsWith('setprop') || line.trim().startsWith('cmd') || line.trim().startsWith('am') || line.trim().startsWith('dumpsys') || line.trim().startsWith('getprop') || line.trim().startsWith('rm');
                  return (
                    <div key={idx} className="table-row">
                      <span className="table-cell pr-4 text-slate-600 select-none text-right w-8">
                        {idx + 1}
                      </span>
                      <span className={`table-cell ${isComment ? 'text-slate-500 italic' : isCommand ? 'text-rose-300 font-semibold' : 'text-slate-200'}`}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Execution Environment Instructions */}
          <div className="px-5 py-4 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1">
                1. {isAr ? 'عبر Shizuku (داخل الهاتف)' : 'Via Shizuku'}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'ثبت أداة Shizuku Runner أو استخدم rish داخل Termux، والصق الأوامر دفعة واحدة.'
                  : 'Install Shizuku Runner or run via rish inside Termux, paste commands directly.'}
              </p>
            </div>

            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1">
                2. {isAr ? 'عبر الكمبيوتر (ADB Shell)' : 'Via PC (ADB Shell)'}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'اربط الهاتف بوضع تصحيح USB ونفذ الأوامر بكتابة adb shell متبوعاً بالأمر.'
                  : 'Connect device via USB debugging and execute using standard adb shell.'}
              </p>
            </div>

            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1">
                3. {isAr ? 'إعادة التشغيل (Reboot)' : 'Boot Persistence'}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {isAr
                  ? 'أندرويد يمسح setprop عند إعادة التشغيل. حمل مشروع أندرويد لتفعيل ميزة BootReceiver التلقائية.'
                  : 'setprop resets after reboot. Build the included Android project for auto BootReceiver restore.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
