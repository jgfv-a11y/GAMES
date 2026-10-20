package com.vulkancore.engine.service

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
}