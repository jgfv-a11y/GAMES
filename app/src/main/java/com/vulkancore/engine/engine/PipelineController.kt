package com.vulkancore.engine.engine

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
        val commands = "setprop debug.hwui.renderer \"\" && cmd activity force-stop com.android.systemui"
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
}