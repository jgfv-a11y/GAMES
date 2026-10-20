export type Language = 'ar' | 'en';

export type RendererMode = 'vulkan' | 'opengl' | 'default' | 'angle';

export interface GpuSpec {
  id: string;
  name: string;
  vendor: 'Qualcomm' | 'MediaTek' | 'Samsung' | 'Google' | 'ARM' | 'Apple';
  vulkanApiVersion: string;
  recommendedRenderer: 'skiavk' | 'skiagl';
  skiaVkStability: 'Rock-Solid' | 'Good' | 'Experimental' | 'Not Recommended';
  notes: {
    ar: string;
    en: string;
  };
  angleSupport: boolean;
  driverFeatures: string[];
}

export interface PerAppPackage {
  packageName: string;
  displayName: string;
  category: 'game' | 'emulator' | 'browser' | 'system';
  icon: string;
  currentMode: 'default' | 'angle' | 'native';
  description: {
    ar: string;
    en: string;
  };
  recommended: 'angle' | 'native' | 'default';
}

export interface CodeFile {
  path: string;
  name: string;
  category: 'core' | 'engine' | 'service' | 'ui' | 'manifest' | 'gradle' | 'script';
  language: 'kotlin' | 'xml' | 'groovy' | 'shell' | 'markdown';
  content: string;
  summary: {
    ar: string;
    en: string;
  };
}

export interface DiagnosticMetrics {
  activePipeline: string;
  pipelineDetail: string;
  jankPercentage: number;
  avgFrameDrawMs: number;
  renderThreadPriority: number;
  hwuiBackpressure: boolean;
  colorGamut: 'sRGB' | 'Display-P3' | 'BT.2020';
  bufferCount: number;
  shaderCacheStatus: 'Optimized' | 'Stale' | 'Warming Up';
  lastRestartMethod: 'Zero-Crash Binder' | 'Force Stop Service' | 'Initial Boot';
}
