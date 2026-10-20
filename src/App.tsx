/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { InteractiveSimulator } from './components/InteractiveSimulator.tsx';
import { CommandStudio } from './components/CommandStudio.tsx';
import { PerAppManager } from './components/PerAppManager.tsx';
import { GpuInspector } from './components/GpuInspector.tsx';
import { CodebaseViewer } from './components/CodebaseViewer.tsx';
import { FailsafeGuide } from './components/FailsafeGuide.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeSection, setActiveSection] = useState<string>('simulator');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-[#070a12] text-slate-100 flex flex-col ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Navigation Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Hero Section with GPU Architecture Asset */}
        <HeroSection
          lang={lang}
          onNavigate={handleNavigate}
          onOpenQuickSwitch={() => handleNavigate('simulator')}
        />

        {/* 1. Live Interactive Phone Simulator & Watchdog Testbench */}
        <InteractiveSimulator lang={lang} />

        {/* 2. Shizuku & ADB Command Studio with Instant .sh Generation */}
        <CommandStudio lang={lang} />

        {/* 3. Per-App Graphics & ANGLE Layer Rules */}
        <PerAppManager lang={lang} />

        {/* 4. GPU Compatibility & Diagnostic Inspector */}
        <GpuInspector lang={lang} />

        {/* 5. Production Android Project Explorer (Kotlin & Compose) */}
        <CodebaseViewer lang={lang} />

        {/* 6. Hardware Protection & Failsafe Rescue Guide */}
        <FailsafeGuide lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
}
