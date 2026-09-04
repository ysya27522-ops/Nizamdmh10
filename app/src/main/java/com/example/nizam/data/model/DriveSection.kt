package com.example.nizam.data.model

enum class DriveViewSection(val titleArabic: String) {
    MY_DRIVE("ملفاتي (My Drive)"),
    SHARED_WITH_ME("المشتركة معي"),
    STARRED("المميزة بنجمة"),
    TRASH("سلة المهملات"),
    SEARCH("البحث المتقدم"),
    NIZAM_REPORT("وثيقة النظام الدستوري")
}

enum class FileFilterType(val titleArabic: String) {
    ALL("الكل"),
    FOLDERS("المجلدات"),
    DOCUMENTS("المستندات"),
    SPREADSHEETS("الجداول"),
    PRESENTATIONS("العروض التقديمية"),
    PDFS("ملفات PDF"),
    IMAGES("الصور")
}

enum class SortField(val titleArabic: String) {
    NAME("الاسم"),
    MODIFIED_TIME("تاريخ التعديل"),
    SIZE("الحجم")
}

enum class SortOrder {
    ASC,
    DESC
}

data class FolderBreadcrumb(
    val id: String,
    val name: String
)
