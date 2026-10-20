package com.vulkancore.engine.service

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
}