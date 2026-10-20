import React from 'react';
import { ShieldCheck, AlertOctagon, HelpCircle, Terminal, RefreshCw, Zap } from 'lucide-react';
import { Language } from '../types/index.ts';

interface FailsafeGuideProps {
  lang: Language;
}

export const FailsafeGuide: React.FC<FailsafeGuideProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const recoverySteps = [
    {
      title: isAr ? '1. مؤقت الأمان التلقائي (12 ثانية)' : '1. Automatic 12s Watchdog Timer',
      desc: isAr
        ? 'بمجرد الضغط على تفعيل Vulkan داخل التطبيق، يبدأ عداد أمان تنازلي لمدة 12 ثانية. إذا كانت الشاشة غير مستجيبة ولم تضغط "تأكيد"، يقوم التطبيق في الخلفية فوراً باسترجاع OpenGL وإعادة تشغيل الواجهة بدون أي تدخل منك.'
        : 'Once you trigger Vulkan, a 12-second countdown begins. If the screen is black or frozen and you do not confirm stability, the watchdog automatically executes a rollback to OpenGL.',
      badge: isAr ? 'تلقائي بالكامل' : 'Fully Automated'
    },
    {
      title: isAr ? '2. إعادة تشغيل الهاتف العادية (Hard Reboot)' : '2. Normal Device Reboot',
      desc: isAr
        ? 'أمر setprop في نظام أندرويد هو تعديل مؤقت في الذاكرة العشوائية (RAM) ولا يُكتب أبداً على قسم النظام المشفر. بمجرد إطفاء الهاتف وإعادة تشغيله (Power + Volume Down)، يعود كل شيء 100% إلى وضع المصنع دون أي ضرر.'
        : 'setprop writes to ephemeral volatile RAM, never modifying /system read-only partitions. A standard hardware restart completely clears custom properties back to OEM default.',
      badge: isAr ? 'آمن بنسبة 100%' : '100% Risk-Free'
    },
    {
      title: isAr ? '3. أمر الإنقاذ السريع عبر ADB' : '3. Quick Rescue Command via ADB',
      desc: isAr
        ? 'إذا كان الهاتف متصلاً بالكمبيوتر أو عبر جهاز آخر بشبكة Wi-Fi، يمكنك تنفيذ أمر الإنقاذ الفوري بضغطة زر:'
        : 'If connected to a PC or another device on local network, run the instant rescue command in terminal:',
      badge: isAr ? 'إنقاذ فوري' : 'Instant Rescue',
      code: 'adb shell "setprop debug.hwui.renderer skiagl && am crash com.android.systemui"'
    }
  ];

  return (
    <section id="failsafe" className="py-12 border-b border-slate-800/80 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-emerald-400 font-semibold">{isAr ? 'نظام الحماية والأمان' : 'Hardware Protection'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'صفر مخاطرة على الهاتف' : 'Zero Bootloop Risk'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAr ? 'دليل الأمان وآلية الإنقاذ الذاتي (Failsafe Engine)' : 'Failsafe Architecture & Emergency Recovery Guide'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'تم تصميم هذا المشروع مع وضع سلامة أجهزة المستخدمين على رأس الأولويات. إليك كيف تضمن المعمارية الجديدة عدم حدوث أي انهيار أو شاشة سوداء دائمة.'
              : 'Engineered with defense-in-depth safety protocols ensuring you never soft-brick or lock yourself out.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recoverySteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {step.badge}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{step.desc}</p>
              </div>

              {step.code && (
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300 break-all">
                  {step.code}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Quick Accordion Style */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>{isAr ? 'الأسئلة الشائعة والمفاهيم الخاطئة:' : 'Frequently Asked Questions & Clarifications:'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="font-bold text-rose-400 block mb-1">
                {isAr ? 'هل يتطلب التطبيق صلاحيات الروت (Root)؟' : 'Does this require Root access?'}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'كلا! التطبيق يعمل بنسبة 100% بصلاحيات ADB Shell عبر تطبيق Shizuku اللاسلكي. لا حاجة لفتح البوتلودر ولا عمل روت.'
                  : 'No! It operates 100% through standard ADB Shell privileges mediated by Shizuku. No unlocked bootloader or Magisk required.'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="font-bold text-rose-400 block mb-1">
                {isAr ? 'هل يستهلك Vulkan بطارية أكثر؟' : 'Does Vulkan consume more battery?'}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'في معالجات الرسوميات الحديثة، Vulkan يخفف عبء المعالجة المركزية (CPU Overhead) بنسبة تصل إلى 25%، مما يقلل استهلاك الطاقة وسخونة الهاتف أثناء التصفح والتمرير السريع.'
                  : 'On modern chipsets, Vulkan reduces CPU rendering overhead by up to 25%, resulting in cooler device thermals and longer battery during fast scrolling.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
