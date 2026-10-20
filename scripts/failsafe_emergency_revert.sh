#!/system/bin/sh
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

echo "[+] Successfully recovered to OpenGL! SystemUI restored."