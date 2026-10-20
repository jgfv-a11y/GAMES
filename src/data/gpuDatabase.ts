import { GpuSpec, PerAppPackage } from '../types/index.ts';

export const GPU_DATABASE: GpuSpec[] = [
  {
    id: 'adreno-7xx',
    name: 'Qualcomm Adreno 730 / 740 / 750 (Snapdragon 8 Gen 1/2/3)',
    vendor: 'Qualcomm',
    vulkanApiVersion: 'Vulkan 1.3.280',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Rock-Solid',
    notes: {
      ar: 'أفضل معالجات تدعم مسار SkiaVK على أندرويد. سلاسة فائقة مع توفير ممتاز لطاقة وحدة المعالجة المركزية (CPU overhead reduction).',
      en: 'Top-tier support for SkiaVK. Flawless frame pacing with ~25% lower CPU overhead in SystemUI render threads.'
    },
    angleSupport: true,
    driverFeatures: ['Vulkan 1.3 Core', 'Turnip compatible', 'Subgroup Quad', 'VK_KHR_shader_float16_int8', 'Descriptor Indexing']
  },
  {
    id: 'adreno-6xx',
    name: 'Qualcomm Adreno 640 / 650 / 660 (Snapdragon 855 / 865 / 888)',
    vendor: 'Qualcomm',
    vulkanApiVersion: 'Vulkan 1.1 / 1.2',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Good',
    notes: {
      ar: 'أداء ممتاز مع SkiaVK على أندرويد 12 فما فوق. يُنصح بتفعيل سكريبت تجميع الشيدر المسبق (Shader Warm-up) لتفادي أي وميض.',
      en: 'Great stability on Android 12+. Recommended to run shader warm-up script to prevent initial micro-stutters.'
    },
    angleSupport: true,
    driverFeatures: ['Vulkan 1.1 / 1.2', 'Buffer Backpressure support', 'VK_KHR_maintenance3']
  },
  {
    id: 'adreno-5xx',
    name: 'Qualcomm Adreno 506 / 512 / 540 (Snapdragon 625 / 660 / 835)',
    vendor: 'Qualcomm',
    vulkanApiVersion: 'Vulkan 1.0.3 (Legacy)',
    recommendedRenderer: 'skiagl',
    skiaVkStability: 'Experimental',
    notes: {
      ar: 'غير مستحسن لنظام SystemUI بالكامل بسبب قدم تعريفات الفولكان، قد تظهر شاشة سوداء. احتفظ بـ OpenGL للنظام واستخدم ANGLE للألعاب.',
      en: 'Not recommended for global SystemUI due to legacy Vulkan drivers. Keep OpenGL for OS and use ANGLE selectively for games.'
    },
    angleSupport: false,
    driverFeatures: ['Vulkan 1.0 (Limited Extensions)']
  },
  {
    id: 'mali-immortalis',
    name: 'ARM Immortalis-G715 / G720 / G925 (Dimensity 9200 / 9300 / 9400)',
    vendor: 'MediaTek',
    vulkanApiVersion: 'Vulkan 1.3',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Rock-Solid',
    notes: {
      ar: 'معمارية متطورة للغاية تدعم تتبع الأشعة وSkiaVK المباشر. استجابة لمسية ورسم إطارات أسرع بـ 15% مقارنة بـ OpenGL.',
      en: 'Modern hardware with full Ray Tracing and SkiaVK pipeline. Up to 15% lower touch-to-render latency.'
    },
    angleSupport: true,
    driverFeatures: ['Vulkan 1.3', 'Hardware Ray Tracing', 'ASTC HDR', 'Fragment Shading Rate']
  },
  {
    id: 'mali-valhall',
    name: 'ARM Mali-G77 / G78 / G610 (Dimensity 1200 / 8100 / 9000)',
    vendor: 'MediaTek',
    vulkanApiVersion: 'Vulkan 1.2 / 1.3',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Good',
    notes: {
      ar: 'تعمل بسلاسة عالية، خاصة على هواتف شاومي وريلمي ووان بلس. يجب التأكد من عدم استخدام وضع توفير الطاقة الفائق.',
      en: 'Smooth performance across HyperOS and ColorOS. Do not enable aggressive power-saver while using SkiaVK.'
    },
    angleSupport: true,
    driverFeatures: ['Vulkan 1.2', 'WCG Display-P3 Sync', 'Tile-based rendering optimizations']
  },
  {
    id: 'xclipse-rdna',
    name: 'Samsung Xclipse 920 / 940 (AMD RDNA2/3 - Exynos 2200 / 2400)',
    vendor: 'Samsung',
    vulkanApiVersion: 'Vulkan 1.3',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Rock-Solid',
    notes: {
      ar: 'معمارية AMD RDNA مصممة بالأساس لمسار Vulkan الأصلي، وتقدم أداءً أعلى بكثير مع SkiaVK مقارنة بمحاكي OpenGL.',
      en: 'Native AMD RDNA ISA architecture excels in Vulkan pipeline, giving significantly better frame consistency than legacy GL.'
    },
    angleSupport: true,
    driverFeatures: ['AMD RDNA2/3 Core', 'Vulkan 1.3', 'Hardware VRS', 'Mesh Shading']
  },
  {
    id: 'google-tensor',
    name: 'Google Tensor G1 / G2 / G3 / G4 (Mali-G78 / G710 / G715)',
    vendor: 'Google',
    vulkanApiVersion: 'Vulkan 1.3',
    recommendedRenderer: 'skiavk',
    skiaVkStability: 'Rock-Solid',
    notes: {
      ar: 'توافق كامل بنسبة 100% مع واجهة Google Pixel، مع دعم المزامنة اللونية المباشرة لشاشات Actua OLED.',
      en: '100% native compatibility on Google Pixel firmware with direct hardware color space synchronization.'
    },
    angleSupport: true,
    driverFeatures: ['Pixel HWUI tuned', 'Wide Color Gamut P3', 'Zero-buffer jitter sync']
  }
];

export const POPULAR_PACKAGES: PerAppPackage[] = [
  {
    packageName: 'com.miHoYo.GenshinImpact',
    displayName: 'Genshin Impact',
    category: 'game',
    icon: 'Sword',
    currentMode: 'default',
    recommended: 'angle',
    description: {
      ar: 'لعبة ثقيلة تستفيد جداً من طبقة ترجمة ANGLE لتقليل عنق زجاجة المعالج.',
      en: 'Heavy 3D game that benefits noticeably from ANGLE translating GLES to Vulkan.'
    }
  },
  {
    packageName: 'com.tencent.ig',
    displayName: 'PUBG Mobile',
    category: 'game',
    icon: 'Crosshair',
    currentMode: 'default',
    recommended: 'native',
    description: {
      ar: 'محرك Unreal Engine مخصص يفضل OpenGL الأصلي مع معدل 90/120 إطار.',
      en: 'Unreal Engine title optimized for native GLES pipeline at 90/120 FPS.'
    }
  },
  {
    packageName: 'org.yuzu.yuzu_emu',
    displayName: 'Yuzu / Suyu Emulator',
    category: 'emulator',
    icon: 'Gamepad2',
    currentMode: 'angle',
    recommended: 'angle',
    description: {
      ar: 'محاكي ألعاب كونسول يحقق أداءً استثنائياً عند تمرير مسار Vulkan المباشر.',
      en: 'Console emulator achieving optimal draw throughput when routed via Vulkan drivers.'
    }
  },
  {
    packageName: 'org.citra.citra_emu',
    displayName: 'Citra 3DS Emulator',
    category: 'emulator',
    icon: 'Layers',
    currentMode: 'default',
    recommended: 'angle',
    description: {
      ar: 'ترجمة مسار OpenGL القديم إلى Vulkan عبر ANGLE لحل مشكلة التقطيع في الصوت.',
      en: 'Translating legacy GL to Vulkan via ANGLE solves audio stutter and cache misses.'
    }
  },
  {
    packageName: 'com.android.chrome',
    displayName: 'Google Chrome Browser',
    category: 'browser',
    icon: 'Globe',
    currentMode: 'default',
    recommended: 'angle',
    description: {
      ar: 'تسريع معالجة WebGL وصفحات الويب ثلاثية الأبعاد عبر طبقة Vulkan ANGLE.',
      en: 'Accelerates WebGL canvas rendering and complex CSS 3D transforms via Vulkan.'
    }
  },
  {
    packageName: 'com.android.systemui',
    displayName: 'System UI & Notification Shade',
    category: 'system',
    icon: 'Cpu',
    currentMode: 'default',
    recommended: 'angle',
    description: {
      ar: 'واجهة النظام الأساسية (شريط الحالة، الإشعارات، القفل، وتأثيرات البلور).',
      en: 'Core OS interface responsible for notification shade, status bar, and blur shaders.'
    }
  }
];
