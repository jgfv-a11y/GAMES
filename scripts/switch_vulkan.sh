#!/system/bin/sh
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

echo "[+] Vulkan pipeline active! Verify with: dumpsys gfxinfo com.android.systemui | grep -i pipeline"