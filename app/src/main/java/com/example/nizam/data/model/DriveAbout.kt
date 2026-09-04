package com.example.nizam.data.model

data class StorageQuota(
    val usageBytes: Long = 2_450_000_000L, // ~2.45 GB
    val limitBytes: Long = 15_000_000_000L  // 15 GB
) {
    val usagePercentage: Float
        get() = if (limitBytes > 0) (usageBytes.toFloat() / limitBytes.toFloat()).coerceIn(0f, 1f) else 0f

    val formattedUsage: String
        get() = formatBytes(usageBytes)

    val formattedLimit: String
        get() = formatBytes(limitBytes)

    companion object {
        fun formatBytes(bytes: Long): String {
            val gb = bytes.toDouble() / (1024 * 1024 * 1024)
            return if (gb >= 1.0) {
                String.format("%.1f جيجابايت", gb)
            } else {
                val mb = bytes.toDouble() / (1024 * 1024)
                String.format("%.0f ميجابايت", mb)
            }
        }
    }
}

data class DriveAbout(
    val userDisplayName: String = "مسؤول النظام الدستوري",
    val userEmail: String = "ysy1411775@gmail.com",
    val storageQuota: StorageQuota = StorageQuota()
)
