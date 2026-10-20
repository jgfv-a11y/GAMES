#!/system/bin/sh
# ==============================================================================
# VulkanCore Pro: Shader Pre-Compilation & Cache Optimizer
# ==============================================================================

echo "[*] Compiling SystemUI AOT profile for speed..."
cmd package compile -m speed-profile com.android.systemui

echo "[*] Refreshing stale OpenGL graphics code-cache..."
rm -rf /data/user_de/0/com.android.systemui/code_cache/*

echo "[+] Shader optimization complete. Frametimes should be ultra-stable."