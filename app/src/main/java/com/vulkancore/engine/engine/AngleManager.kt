package com.vulkancore.engine.engine

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
            .append("settings put global angle_gl_driver_selection_pkgs \"$packageName\" && ")
            .append("settings put global angle_gl_driver_selection_values \"${mode.value}\" && ")
            .append("cmd activity force-stop \"$packageName\"")
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
}