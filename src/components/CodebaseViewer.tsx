import React, { useState } from 'react';
import { 
  FolderTree, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Code2,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language, CodeFile } from '../types/index.ts';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectSource.ts';
import { downloadFile, downloadFullProjectZip } from '../services/zipExporter.ts';

interface CodebaseViewerProps {
  lang: Language;
}

export const CodebaseViewer: React.FC<CodebaseViewerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_PROJECT_FILES[3]); // PipelineController by default
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadFullProjectZip();
    } finally {
      setIsZipping(false);
    }
  };

  // Group files by category
  const categories = [
    { id: 'engine', label: isAr ? 'محرك الرسوميات (Engine)' : 'Engine Core' },
    { id: 'core', label: isAr ? 'نواة Shizuku والتشخيص' : 'Shizuku & Diagnostics' },
    { id: 'service', label: isAr ? 'الخدمات والإعدادات السريعة' : 'Services & Quick Tile' },
    { id: 'ui', label: isAr ? 'واجهة المستخدم (Compose)' : 'Compose UI' },
    { id: 'manifest', label: isAr ? 'ملف التهيئة (Manifest)' : 'Manifest' },
    { id: 'gradle', label: isAr ? 'إعدادات البناء (Gradle)' : 'Gradle Scripts' },
    { id: 'script', label: isAr ? 'سكريبتات الشيل المباشرة' : 'Standalone Scripts' },
  ];

  return (
    <section id="codebase" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <span className="text-rose-400 font-semibold">{isAr ? 'الكود المصدري الكامل' : 'Full Source Code'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'مشروع أندرويد ستوديو جاهز للبناء (APK)' : 'Production Android Studio Project'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isAr ? 'مستكشف كود تطبيق أندرويد (Kotlin & Compose)' : 'Android Source Codebase & Project Exporter'}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isAr
                ? 'استعرض جميع ملفات المشروع المكتوبة بـ Kotlin الحديثة و Jetpack Compose، أو قم بتحميل الحزمة كاملة كملف ZIP وفتحها مباشرة في Android Studio.'
                : 'Browse the production-ready Kotlin & Jetpack Compose codebase, or download the full bundle to build directly in Android Studio.'}
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl shadow-lg shadow-rose-950/40 border border-rose-400/20 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>
              {isZipping
                ? (isAr ? 'جاري ضغط الملفات...' : 'Generating ZIP...')
                : (isAr ? 'تحميل المشروع كاملاً (ZIP)' : 'Download Full Project (ZIP)')}
            </span>
          </button>
        </div>

        {/* Codebase Viewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* File Tree Left Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/70 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 max-h-[580px] overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              <FolderTree className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'شجرة ملفات المشروع' : 'Project Files Tree'}</span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const filesInCat = ANDROID_PROJECT_FILES.filter((f) => f.category === cat.id);
                if (filesInCat.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 px-2 block">
                      {cat.label}
                    </span>
                    {filesInCat.map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 font-bold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-600 uppercase ml-2">{file.language}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active File Code Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#070a12]">
            
            {/* File Header Bar */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {selectedFile.summary[lang]}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => downloadFile(selectedFile.name, selectedFile.content)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'تحميل الملف' : 'Download'}</span>
                </button>
              </div>
            </div>

            {/* Code Body with Line Numbers */}
            <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed">
              <pre>
                <code>
                  {selectedFile.content.split('\n').map((line, idx) => (
                    <div key={idx} className="table-row hover:bg-slate-900/40">
                      <span className="table-cell pr-5 text-slate-600 select-none text-right w-10">
                        {idx + 1}
                      </span>
                      <span className="table-cell text-slate-200 whitespace-pre">
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Footer Status */}
            <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Lines: {selectedFile.content.split('\n').length}</span>
              <span>UTF-8 · Kotlin 1.9 / AGP 8.3</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
