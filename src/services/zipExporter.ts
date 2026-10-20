import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectSource.ts';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'build.gradle.kts',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`
  );

  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "VulkanCore-Pro"
include(":app")
`
  );

  zip.file(
    'gradle/libs.versions.toml',
    `[versions]
agp = "8.3.2"
kotlin = "1.9.23"
coreKtx = "1.13.1"
lifecycleRuntimeKtx = "2.8.4"
composeBom = "2024.06.00"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
`
  );

  // Add all codebase files
  ANDROID_PROJECT_FILES.forEach(file => {
    zip.file(file.path, file.content);
  });

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadFile(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadFullProjectZip() {
  const blob = await generateProjectZip();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'VulkanCore-Pro-Android-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
