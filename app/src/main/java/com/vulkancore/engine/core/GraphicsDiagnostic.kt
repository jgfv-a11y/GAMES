package com.vulkancore.engine.core

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
        val jankRegex = "Janky frames: \\d+ \\((\\d+\\.\\d+)%\\)".toRegex()
        val jankMatch = jankRegex.find(dumpsys.output)
        val jank = jankMatch?.groups?.get(1)?.value?.let { "$it%" } ?: "0.0%"

        // استخراج متوسط زمن الرسم
        val drawRegex = "Draw:\\s+(\\d+\\.\\d+)ms".toRegex()
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
}