import React from 'react';
import { Cpu, Github, ExternalLink, Download } from 'lucide-react';
import { Language } from '../types/index.ts';
import { downloadFullProjectZip } from '../services/zipExporter.ts';

interface FooterProps {
  lang: Language;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const isAr = lang === 'ar';

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & info */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">VulkanCore Pro</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>GAMA Next-Gen v2.0</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('simulator')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'المحاكي' : 'Simulator'}
          </button>
          <button
            onClick={() => onNavigate('commands')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'الأوامر' : 'Commands'}
          </button>
          <button
            onClick={() => onNavigate('codebase')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'الكود المصدري' : 'Codebase'}
          </button>
          <button
            onClick={() => downloadFullProjectZip()}
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تحميل المشروع (ZIP)' : 'Download ZIP'}</span>
          </button>
        </div>

        {/* Quiet copyright */}
        <div className="font-mono text-slate-500 text-[11px]">
          Open Source Apache 2.0 · Shizuku Binder IPC
        </div>

      </div>
    </footer>
  );
};
