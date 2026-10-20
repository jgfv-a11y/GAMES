package com.vulkancore.engine.core

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import rikka.shizuku.Shizuku
import java.io.BufferedReader
import java.io.InputStreamReader

data class ExecutionResult(
    val isSuccess: Boolean,
    val output: String,
    val error: String
)

object ShizukuExecutor {

    /**
     * تنفيذ أمر شيل بصلاحيات ADB عبر Shizuku مع حماية ضد الـ Deadlock والـ Timeout
     */
    suspend fun execute(cmd: String, timeoutMs: Long = 6000): ExecutionResult = withContext(Dispatchers.IO) {
        if (!Shizuku.pingBinder()) {
            return@withContext ExecutionResult(false, "", "خدمة Shizuku ليست قيد التشغيل على الجهاز")
        }

        try {
            val process = Shizuku.newProcess(arrayOf("sh", "-c", cmd), null, null)

            // قراءة المخرجات وقناة الأخطاء في مسارين منفصلين بالتوازي
            val outputDeferred = async { readStream(process.inputStream) }
            val errorDeferred = async { readStream(process.errorStream) }

            val completed = withTimeoutOrNull(timeoutMs) {
                process.waitFor()
            }

            if (completed == null) {
                process.destroy()
                return@withContext ExecutionResult(false, "", "انتهت المهلة الزمنية المحددة لتنفيذ الأمر")
            }

            val output = outputDeferred.await()
            val error = errorDeferred.await()

            if (process.exitValue() == 0) {
                ExecutionResult(true, output.trim(), "")
            } else {
                ExecutionResult(false, output.trim(), if (error.isNotBlank()) error.trim() else "Exit code: ${process.exitValue()}")
            }
        } catch (e: Exception) {
            ExecutionResult(false, "", e.localizedMessage ?: "حدث استثناء أثناء الاتصال بـ Shizuku Binder")
        }
    }

    private fun readStream(stream: java.io.InputStream): String {
        val reader = BufferedReader(InputStreamReader(stream))
        val builder = StringBuilder()
        var line: String?
        while (reader.readLine().also { line = it } != null) {
            builder.append(line).append("\n")
        }
        return builder.toString()
    }
}