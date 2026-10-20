package com.vulkancore.engine

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
}