import React from 'react';
import { Download, Globe, Cpu } from 'lucide-react';
import { Language } from '../types/index.ts';
import { downloadFullProjectZip } from '../services/zipExporter.ts';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeSection,
  onNavigate,
}) => {
  const isAr = lang === 'ar';

  const navLinks = [
    { id: 'simulator', label: isAr ? 'المحاكي التفاعلي' : 'Simulator' },
    { id: 'commands', label: isAr ? 'أوامر Shizuku & ADB' : 'Command Studio' },
    { id: 'perapp', label: isAr ? 'تخصيص ANGLE لكل تطبيق' : 'Per-App Rules' },
    { id: 'gpu', label: isAr ? 'فحص العتاد والـ GPU' : 'GPU Inspector' },
    { id: 'codebase', label: isAr ? 'كود أندرويد المصدري' : 'Codebase' },
    { id: 'failsafe', label: isAr ? 'نظام الأمان' : 'Failsafe' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/40 text-white font-black text-base border border-rose-500/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Vulkan<span className="text-rose-500">Core</span> <span className="text-xs font-mono text-slate-400 font-normal">v2.0</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
                  isActive
                    ? 'text-rose-400 font-semibold border-b-2 border-rose-500'
                    : 'text-slate-400'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Language Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{isAr ? 'EN' : 'العربية'}</span>
          </button>

          <button
            onClick={() => downloadFullProjectZip()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-md shadow-rose-950/40 border border-rose-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تحميل مشروع أندرويد (ZIP)' : 'Download Project (ZIP)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
