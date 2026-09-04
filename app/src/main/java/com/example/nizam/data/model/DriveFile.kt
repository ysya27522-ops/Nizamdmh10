package com.example.nizam.data.model

data class DriveOwner(
    val displayName: String = "المستخدم الحالي",
    val emailAddress: String = "user@example.com",
    val photoLink: String? = null,
    val me: Boolean = true
)

data class DriveFile(
    val id: String,
    val name: String,
    val mimeType: String,
    val size: Long = 0,
    val modifiedTime: Long = System.currentTimeMillis(),
    val createdTime: Long = System.currentTimeMillis(),
    val owners: List<DriveOwner> = listOf(DriveOwner()),
    val shared: Boolean = false,
    val starred: Boolean = false,
    val trashed: Boolean = false,
    val parentId: String = "root",
    val description: String = "",
    val content: String = "",
    val webViewLink: String = ""
) {
    val isFolder: Boolean
        get() = mimeType == MIME_FOLDER

    companion object {
        const val MIME_FOLDER = "application/vnd.google-apps.folder"
        const val MIME_DOCUMENT = "application/vnd.google-apps.document"
        const val MIME_SPREADSHEET = "application/vnd.google-apps.spreadsheet"
        const val MIME_PRESENTATION = "application/vnd.google-apps.presentation"
        const val MIME_PDF = "application/pdf"
        const val MIME_IMAGE = "image/jpeg"
        const val MIME_TEXT = "text/plain"
    }
}
