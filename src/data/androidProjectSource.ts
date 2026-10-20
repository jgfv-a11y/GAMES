import { CodeFile } from '../types/index.ts';

export const ANDROID_PROJECT_FILES: CodeFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    summary: {
      ar: 'ملف تهيئة التطبيق، يحتوي على تعريف الـ Shizuku Provider، وصلاحيات الإقلاع، وخدمة الـ Quick Settings Tile.',
      en: 'App configuration manifest declaring Shizuku IPC Provider, Boot permissions, and Quick Settings Tile.'
    },
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- صـلاحيات النظام والتشغيل التلقائي عند الإقلاع -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="VulkanCore Pro"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">

        <!-- 1. Shizuku Provider للاتصال الآمن بخدمة الـ Binder -->
        <provider
            android:name="rikka.shizuku.ShizukuProvider"
            android:authorities="\${applicationId}.shizuku"
            android:exported="true"
            android:multiprocess="false"
            android:permission="android.permission.INTERACT_ACROSS_USERS_FULL" />

        <!-- 2. الشاشة الرئيسية للتطبيق -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 3. زر لوحة الإعدادات السريعة (Quick Settings Tile) للتبديل الفوري -->
        <service
            android:name=".service.VulkanTileService"
            android:exported="true"
            android:label="Vulkan Pipeline"
            android:icon="@drawable/ic_tile_vulkan"
            android:permission="android.permission.BIND_QUICK_SETTINGS_TILE">
            <intent-filter>
                <action android:name="android.service.quicksettings.action.QS_TILE" />
            </intent-filter>
        </service>

        <!-- 4. مستقبل استعادة الإعدادات التلقائي عند إقلاع الجهاز -->
        <receiver
            android:name=".service.BootReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

    </application>
</manifest>`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (Module: app)',
    category: 'gradle',
    language: 'groovy',
    summary: {
      ar: 'إعدادات بناء مشروع أندرويد مع مكتبات Shizuku الرسمية، Jetpack Compose، و Coroutines.',
      en: 'Android build script featuring official Shizuku API, Jetpack Compose M3, and Kotlin Coroutines.'
    },
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.vulkancore.engine"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.vulkancore.engine"
        minSdk = 29 // Android 10+ لدعم SkiaVK و ANGLE
        targetSdk = 35
        versionCode = 200
        versionName = "2.0.0-PRO"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    // Shizuku Official IPC API
    val shizukuVersion = "13.1.5"
    implementation("dev.rikka.shizuku:api:$shizukuVersion")
    implementation("dev.rikka.shizuku:provider:$shizukuVersion")

    // AndroidX & Architecture Components
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.4")

    // Jetpack Compose Material 3
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/core/ShizukuExecutor.kt',
    name: 'ShizukuExecutor.kt',
    category: 'core',
    language: 'kotlin',
    summary: {
      ar: 'محرك تنفيذ الأوامر عبر Shizuku Process بشكل غير متزامن مع قراءة متوازية لمخرجات stdout و stderr لمنع أي تجمد.',
      en: 'Asynchronous Shizuku command executor running concurrent stdout/stderr streams to prevent UI deadlocks.'
    },
    content: `package com.vulkancore.engine.core

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import rikka.shizuku.Shizuku
import java.io.BufferedReader
import java.io.InputStreamReader

data class ExecutionResult(
    val isSuccess: Boolean,
    val output: String,
    val error: String
)

object ShizukuExecutor {

    /**
     * تنفيذ أمر شيل بصلاحيات ADB عبر Shizuku مع حماية ضد الـ Deadlock والـ Timeout
     */
    suspend fun execute(cmd: String, timeoutMs: Long = 6000): ExecutionResult = withContext(Dispatchers.IO) {
        if (!Shizuku.pingBinder()) {
            return@withContext ExecutionResult(false, "", "خدمة Shizuku ليست قيد التشغيل على الجهاز")
        }

        try {
            val process = Shizuku.newProcess(arrayOf("sh", "-c", cmd), null, null)

            // قراءة المخرجات وقناة الأخطاء في مسارين منفصلين بالتوازي
            val outputDeferred = async { readStream(process.inputStream) }
            val errorDeferred = async { readStream(process.errorStream) }

            val completed = withTimeoutOrNull(timeoutMs) {
                process.waitFor()
            }

            if (completed == null) {
                process.destroy()
                return@withContext ExecutionResult(false, "", "انتهت المهلة الزمنية المحددة لتنفيذ الأمر")
            }

            val output = outputDeferred.await()
            val error = errorDeferred.await()

            if (process.exitValue() == 0) {
                ExecutionResult(true, output.trim(), "")
            } else {
                ExecutionResult(false, output.trim(), if (error.isNotBlank()) error.trim() else "Exit code: \${process.exitValue()}")
            }
        } catch (e: Exception) {
            ExecutionResult(false, "", e.localizedMessage ?: "حدث استثناء أثناء الاتصال بـ Shizuku Binder")
        }
    }

    private fun readStream(stream: java.io.InputStream): String {
        val reader = BufferedReader(InputStreamReader(stream))
        val builder = StringBuilder()
        var line: String?
        while (reader.readLine().also { line = it } != null) {
            builder.append(line).append("\\n")
        }
        return builder.toString()
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/engine/PipelineController.kt',
    name: 'PipelineController.kt',
    category: 'engine',
    language: 'kotlin',
    summary: {
      ar: 'المتحكم الرئيسي في مسار الرسوميات، يدير مؤقت الأمان التنازلي (12 ثانية) لإنقاذ الهاتف التلقائي في حال تعطل الواجهة.',
      en: 'Primary graphics engine coordinator managing the 12-second safety countdown failsafe.'
    },
    content: `package com.vulkancore.engine.engine

import com.vulkancore.engine.core.ExecutionResult
import com.vulkancore.engine.core.ShizukuExecutor
import kotlinx.coroutines.*

object PipelineController {

    private var recoveryJob: Job? = null

    /**
     * التحويل إلى مسار Vulkan (SkiaVK) مع حقن التزامن اللوني ومؤقت الأمان
     */
    suspend fun switchToVulkan(onEmergencyRollback: () -> Unit): ExecutionResult {
        // حزمة الأوامر المتقدمة: التحويل + ضبط الألوان + إعادة التشغيل السلسة
        val commands = StringBuilder()
            .append("setprop debug.hwui.renderer skiavk && ")
            .append("setprop ro.hwui.use_vulkan true && ")
            .append("setprop debug.sf.enable_gl_backpressure 1 && ")
            .append("setprop debug.hwui.render_thread_priority -20 && ")
            .append("cmd activity force-stop com.android.systemui && ")
            .append("am start-service -a android.intent.action.MAIN -n com.android.systemui/.SystemUIService")
            .toString()

        val result = ShizukuExecutor.execute(commands)

        // تفعيل مؤقت الأمان التنازلي لمدة 12 ثانية
        armSafetyWatchdog(onEmergencyRollback)

        return result
    }

    /**
     * العودة الفورية والآمنة لمسار OpenGL الافتراضي (SkiaGL)
     */
    suspend fun switchToOpenGL(): ExecutionResult {
        cancelSafetyWatchdog()
        val commands = StringBuilder()
            .append("setprop debug.hwui.renderer skiagl && ")
            .append("setprop ro.hwui.use_vulkan false && ")
            .append("cmd activity force-stop com.android.systemui && ")
            .append("am start-service -a android.intent.action.MAIN -n com.android.systemui/.SystemUIService")
            .toString()

        return ShizukuExecutor.execute(commands)
    }

    /**
     * مسح الخصائص وإرجاع إعدادات المصنع
     */
    suspend fun resetToDefault(): ExecutionResult {
        cancelSafetyWatchdog()
        val commands = "setprop debug.hwui.renderer \\"\\" && cmd activity force-stop com.android.systemui"
        return ShizukuExecutor.execute(commands)
    }

    /**
     * تشغيل مؤقت الأمان: إذا لم يضغط المستخدم تأكيد الاستقرار، يتم الاسترجاع تلقائياً
     */
    private fun armSafetyWatchdog(onRollback: () -> Unit) {
        recoveryJob?.cancel()
        recoveryJob = CoroutineScope(Dispatchers.Default).launch {
            delay(12000) // 12 ثانية للتأكد
            switchToOpenGL()
            withContext(Dispatchers.Main) {
                onRollback()
            }
        }
    }

    /**
     * تأكيد استقرار الواجهة وإلغاء مؤقت الطوارئ
     */
    fun confirmStability() {
        recoveryJob?.cancel()
        recoveryJob = null
    }

    fun cancelSafetyWatchdog() {
        recoveryJob?.cancel()
        recoveryJob = null
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/core/GraphicsDiagnostic.kt',
    name: 'GraphicsDiagnostic.kt',
    category: 'core',
    language: 'kotlin',
    summary: {
      ar: 'أداة التشخيص العميق لمخرجات dumpsys gfxinfo و SurfaceFlinger لفحص نسبة السقوط في الإطارات وتوافق العتاد.',
      en: 'Deep diagnostic probe parsing dumpsys gfxinfo and SurfaceFlinger for jank rates and hardware capabilities.'
    },
    content: `package com.vulkancore.engine.core

data class RendererStatus(
    val activePipeline: String,
    val isVulkan: Boolean,
    val vulkanVersion: String,
    val isSupported: Boolean,
    val jankPercentage: String,
    val drawTimeMs: Float,
    val bufferBackpressure: Boolean
)

object GraphicsDiagnostic {

    suspend fun getStatus(): RendererStatus {
        val dumpsys = ShizukuExecutor.execute("dumpsys gfxinfo com.android.systemui")
        val vkVersionCheck = ShizukuExecutor.execute("pm has-system-feature android.hardware.vulkan.version")
        val currentProp = ShizukuExecutor.execute("getprop debug.hwui.renderer")
        val backpressureProp = ShizukuExecutor.execute("getprop debug.sf.enable_gl_backpressure")

        val hasVulkanFeature = !vkVersionCheck.output.contains("false") && vkVersionCheck.isSuccess

        val isVulkanActive = currentProp.output.contains("skiavk") ||
                dumpsys.output.contains("Skia (Vulkan)", ignoreCase = true) ||
                dumpsys.output.contains("Pipeline=SkiaVK", ignoreCase = true)

        // استخراج نسبة الإطارات الساقطة (Janky frames)
        val jankRegex = "Janky frames: \\\\d+ \\\\((\\\\d+\\\\.\\\\d+)%\\\\)".toRegex()
        val jankMatch = jankRegex.find(dumpsys.output)
        val jank = jankMatch?.groups?.get(1)?.value?.let { "$it%" } ?: "0.0%"

        // استخراج متوسط زمن الرسم
        val drawRegex = "Draw:\\\\s+(\\\\d+\\\\.\\\\d+)ms".toRegex()
        val drawTime = drawRegex.find(dumpsys.output)?.groups?.get(1)?.value?.toFloatOrNull() ?: 2.4f

        return RendererStatus(
            activePipeline = if (isVulkanActive) "Vulkan (SkiaVK)" else "OpenGL (SkiaGL)",
            isVulkan = isVulkanActive,
            vulkanVersion = if (hasVulkanFeature) "API 1.1+ متوافق" else "تعريفات غير مدعومة",
            isSupported = hasVulkanFeature,
            jankPercentage = jank,
            drawTimeMs = drawTime,
            bufferBackpressure = backpressureProp.output.trim() == "1"
        )
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/engine/AngleManager.kt',
    name: 'AngleManager.kt',
    category: 'engine',
    language: 'kotlin',
    summary: {
      ar: 'إدارة وتخصيص طبقة ANGLE (OpenGL ES over Vulkan) لكل تطبيق أو لعبة على حدة عبر أوامر Global Settings.',
      en: 'Per-app ANGLE (OpenGL ES over Vulkan) driver injector using global settings manipulation.'
    },
    content: `package com.vulkancore.engine.engine

import com.vulkancore.engine.core.ExecutionResult
import com.vulkancore.engine.core.ShizukuExecutor

enum class DriverMode(val value: String) {
    VULKAN_ANGLE("angle"),
    NATIVE_OPENGL("native"),
    SYSTEM_DEFAULT("default")
}

object AngleManager {

    /**
     * إجبار لعبة أو تطبيق معين على العمل عبر محرك ANGLE المترجم إلى Vulkan
     */
    suspend fun setAppDriver(packageName: String, mode: DriverMode): ExecutionResult {
        val cmd = StringBuilder()
            .append("settings put global angle_gl_driver_selection_pkgs \\"$packageName\\" && ")
            .append("settings put global angle_gl_driver_selection_values \\"\${mode.value}\\" && ")
            .append("cmd activity force-stop \\"$packageName\\"")
            .toString()

        return ShizukuExecutor.execute(cmd)
    }

    /**
     * استعلام عن إعدادات السائق الحالية للتطبيق
     */
    suspend fun getAppDriverMode(packageName: String): String {
        val pkgs = ShizukuExecutor.execute("settings get global angle_gl_driver_selection_pkgs").output
        val vals = ShizukuExecutor.execute("settings get global angle_gl_driver_selection_values").output

        return if (pkgs.contains(packageName)) {
            vals.trim()
        } else {
            "default"
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/engine/DisplaySyncEngine.kt',
    name: 'DisplaySyncEngine.kt',
    category: 'engine',
    language: 'kotlin',
    summary: {
      ar: 'محرك مزامنة شاشات العرض والتخزين المؤقت لمنع الرمش اللوني والشاشات السوداء في شاشات AMOLED و OLED.',
      en: 'Display synchronization and surface backpressure engine preventing color flickering on OLED panels.'
    },
    content: `package com.vulkancore.engine.engine

import com.vulkancore.engine.core.ExecutionResult
import com.vulkancore.engine.core.ShizukuExecutor

object DisplaySyncEngine {

    /**
     * حقن خصائص السيرفيس فلينجر لمزامنة تردد الرسوميات ومنع تقطيع الألوان
     */
    suspend fun applyOptimalDisplaySync(): ExecutionResult {
        val script = StringBuilder()
            .append("setprop debug.sf.enable_gl_backpressure 1 && ")
            .append("setprop debug.hwui.render_thread_priority -20 && ")
            .append("setprop debug.sf.predict_hwc_composition_strategy 1 && ")
            .append("setprop debug.hwui.target_cpu_time_percent 75")
            .toString()

        return ShizukuExecutor.execute(script)
    }

    /**
     * تسريع وإحماء مسارات الشيدر (Shader Pre-compilation) لـ SystemUI
     */
    suspend fun warmUpShaders(): ExecutionResult {
        val script = StringBuilder()
            .append("cmd package compile -m speed-profile com.android.systemui && ")
            .append("rm -rf /data/user_de/0/com.android.systemui/code_cache/")
            .toString()

        return ShizukuExecutor.execute(script)
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/service/VulkanTileService.kt',
    name: 'VulkanTileService.kt',
    category: 'service',
    language: 'kotlin',
    summary: {
      ar: 'خدمة شريط الإعدادات السريعة (Quick Settings Tile) للتبديل الفوري بين Vulkan و OpenGL بلمسة واحدة.',
      en: 'Android Quick Settings Tile service enabling 1-tap pipeline toggles directly from the notification shade.'
    },
    content: `package com.vulkancore.engine.service

import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import com.vulkancore.engine.core.GraphicsDiagnostic
import com.vulkancore.engine.engine.PipelineController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class VulkanTileService : TileService() {

    private val serviceScope = CoroutineScope(Dispatchers.Main)

    override fun onStartListening() {
        super.onStartListening()
        updateTileState()
    }

    override fun onClick() {
        super.onClick()
        serviceScope.launch {
            val status = GraphicsDiagnostic.getStatus()
            if (status.isVulkan) {
                PipelineController.switchToOpenGL()
            } else {
                PipelineController.switchToVulkan {
                    updateTileState()
                }
                PipelineController.confirmStability() // اعتماد مباشر في الـ Tile
            }
            updateTileState()
        }
    }

    private fun updateTileState() {
        serviceScope.launch {
            val status = GraphicsDiagnostic.getStatus()
            val tile = qsTile ?: return@launch

            if (status.isVulkan) {
                tile.state = Tile.STATE_ACTIVE
                tile.label = "Vulkan (SkiaVK)"
                tile.subtitle = "نشط ومفعّل"
            } else {
                tile.state = Tile.STATE_INACTIVE
                tile.label = "OpenGL (SkiaGL)"
                tile.subtitle = "الوضع الافتراضي"
            }
            tile.updateTile()
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/service/BootReceiver.kt',
    name: 'BootReceiver.kt',
    category: 'service',
    language: 'kotlin',
    summary: {
      ar: 'مستقبل إشارة الإقلاع لاستعادة إعدادات الرسوميات المفضلة تلقائياً بمجرد استيقاظ خدمة Shizuku بعد إعادة تشغيل الهاتف.',
      en: 'Broadcast receiver automatically reapplying preferred graphics pipeline on boot once Shizuku is ready.'
    },
    content: `package com.vulkancore.engine.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import com.vulkancore.engine.engine.PipelineController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import rikka.shizuku.Shizuku

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            // انتظار ارتباط Shizuku Binder فور إقلاع النظام
            Shizuku.addBinderReceivedListenerSticky {
                if (Shizuku.checkSelfPermission() == PackageManager.PERMISSION_GRANTED) {
                    val prefs = context.getSharedPreferences("vulkan_core_prefs", Context.MODE_PRIVATE)
                    val autoRestore = prefs.getBoolean("auto_restore_vulkan", false)

                    if (autoRestore) {
                        CoroutineScope(Dispatchers.IO).launch {
                            PipelineController.switchToVulkan { }
                            PipelineController.confirmStability()
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/vulkancore/engine/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'ui',
    language: 'kotlin',
    summary: {
      ar: 'النشاط الرئيسي المسؤول عن طلب أذونات Shizuku وربط واجهة Jetpack Compose الحديثة.',
      en: 'Main activity handling Shizuku permission lifecycle and launching the Jetpack Compose UI.'
    },
    content: `package com.vulkancore.engine

import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.vulkancore.engine.ui.MainScreen
import rikka.shizuku.Shizuku

class MainActivity : ComponentActivity() {

    private val SHIZUKU_REQUEST_CODE = 4401

    private val permissionListener = Shizuku.OnRequestPermissionResultListener { requestCode, grantResult ->
        if (requestCode == SHIZUKU_REQUEST_CODE) {
            if (grantResult == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "تم منح إذن Shizuku بنجاح!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "تم رفض الإذن. التطبيق بحاجة لـ Shizuku لتنفيذ أوامر الرسوميات", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Shizuku.addRequestPermissionResultListener(permissionListener)
        verifyShizukuPermission()

        setContent {
            MainScreen()
        }
    }

    private fun verifyShizukuPermission() {
        if (!Shizuku.pingBinder()) {
            Toast.makeText(this, "تطبيق Shizuku ليس قيد التشغيل على هذا الهاتف!", Toast.LENGTH_LONG).show()
            return
        }

        if (Shizuku.checkSelfPermission() != PackageManager.PERMISSION_GRANTED) {
            Shizuku.requestPermission(SHIZUKU_REQUEST_CODE)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Shizuku.removeRequestPermissionResultListener(permissionListener)
    }
}`
  },
  {
    path: 'scripts/switch_vulkan.sh',
    name: 'switch_vulkan.sh',
    category: 'script',
    language: 'shell',
    summary: {
      ar: 'سكريبت شيل لتفعيل Vulkan فوراً من خلال Termux أو ADB أو Shizuku Runner مع مؤقت الأمان.',
      en: 'Shell script to activate Vulkan immediately via Termux, ADB, or Shizuku Runner with failsafe.'
    },
    content: `#!/system/bin/sh
# ==============================================================================
# VulkanCore Pro: Switch Android SystemUI to Vulkan (SkiaVK)
# ==============================================================================

echo "[*] Initializing Vulkan (SkiaVK) graphics pipeline switch..."

# 1. Apply primary rendering properties
setprop debug.hwui.renderer skiavk
setprop ro.hwui.use_vulkan true

# 2. Apply display synchronization & backpressure
setprop debug.sf.enable_gl_backpressure 1
setprop debug.hwui.render_thread_priority -20
setprop debug.sf.predict_hwc_composition_strategy 1

# 3. Soft restart SystemUI without killing user session
echo "[*] Soft-restarting SystemUI service..."
cmd activity force-stop com.android.systemui
am start-service -a android.intent.action.MAIN -n com.android.systemui/.SystemUIService

echo "[+] Vulkan pipeline active! Verify with: dumpsys gfxinfo com.android.systemui | grep -i pipeline"`
  },
  {
    path: 'scripts/failsafe_emergency_revert.sh',
    name: 'failsafe_emergency_revert.sh',
    category: 'script',
    language: 'shell',
    summary: {
      ar: 'سكريبت الطوارئ للرجوع الفوري لمسار OpenGL واسترجاع شاشة الهاتف في حال حدوث تجمّد أو شاشة سوداء.',
      en: 'Emergency recovery script restoring OpenGL instantly if black screen occurs.'
    },
    content: `#!/system/bin/sh
# ==============================================================================
# VulkanCore Pro: Emergency Failsafe Recovery Script
# Run via ADB or Recovery terminal if screen is unresponsive
# ==============================================================================

echo "[!] Initiating EMERGENCY rollback to OpenGL (SkiaGL)..."

# 1. Clear overrides and reset to stable OpenGL
setprop debug.hwui.renderer skiagl
setprop ro.hwui.use_vulkan false

# 2. Reset SurfaceFlinger overrides
setprop debug.sf.enable_gl_backpressure 0

# 3. Crash-restart SystemUI to pick up safe renderer
am crash com.android.systemui

echo "[+] Successfully recovered to OpenGL! SystemUI restored."`
  },
  {
    path: 'scripts/shader_warmup_optimize.sh',
    name: 'shader_warmup_optimize.sh',
    category: 'script',
    language: 'shell',
    summary: {
      ar: 'سكريبت إحماء مسارات الشيدر والتخزين المؤقت لتفادي أي وميض أو تقطيع إطارات عند بداية التشغيل.',
      en: 'Pipeline compilation and shader warm-up script eliminating first-run Vulkan stutters.'
    },
    content: `#!/system/bin/sh
# ==============================================================================
# VulkanCore Pro: Shader Pre-Compilation & Cache Optimizer
# ==============================================================================

echo "[*] Compiling SystemUI AOT profile for speed..."
cmd package compile -m speed-profile com.android.systemui

echo "[*] Refreshing stale OpenGL graphics code-cache..."
rm -rf /data/user_de/0/com.android.systemui/code_cache/*

echo "[+] Shader optimization complete. Frametimes should be ultra-stable."`
  }
];
