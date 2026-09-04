package com.example.nizam.data.model

data class SearchFilters(
    val query: String = "",
    val fileType: FileFilterType = FileFilterType.ALL,
    val ownerType: OwnerFilter = OwnerFilter.ANY,
    val datePreset: DatePreset = DatePreset.ANY
) {
    val isActive: Boolean
        get() = query.isNotBlank() || fileType != FileFilterType.ALL || ownerType != OwnerFilter.ANY || datePreset != DatePreset.ANY
}

enum class OwnerFilter(val labelArabic: String) {
    ANY("أي مالك"),
    ME("مملوكة لي"),
    NOT_ME("ليست مملوكة لي")
}

enum class DatePreset(val labelArabic: String) {
    ANY("أي وقت"),
    TODAY("اليوم"),
    PAST_7_DAYS("آخر 7 أيام"),
    PAST_30_DAYS("آخر 30 يوماً"),
    THIS_YEAR("هذا العام")
}
