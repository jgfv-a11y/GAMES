package com.vulkancore.engine.engine

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
}