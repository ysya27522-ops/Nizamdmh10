package com.example.nizam.data.repository

import com.example.nizam.data.local.DriveFileDao
import com.example.nizam.data.local.DriveFileEntity
import com.example.nizam.data.local.InitialSeedData
import com.example.nizam.data.model.DatePreset
import com.example.nizam.data.model.DriveAbout
import com.example.nizam.data.model.DriveFile
import com.example.nizam.data.model.DriveViewSection
import com.example.nizam.data.model.FileFilterType
import com.example.nizam.data.model.OwnerFilter
import com.example.nizam.data.model.SearchFilters
import com.example.nizam.data.model.SortField
import com.example.nizam.data.model.SortOrder
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class DriveRepository(private val dao: DriveFileDao) {

    suspend fun checkAndSeedDatabase() {
        if (dao.countFiles() == 0) {
            dao.insertAll(InitialSeedData.getInitialFiles())
        }
    }

    fun getFilesStream(
        currentFolderId: String,
        section: DriveViewSection,
        filterType: FileFilterType,
        searchFilters: SearchFilters,
        sortField: SortField,
        sortOrder: SortOrder
    ): Flow<List<DriveFile>> {
        return dao.getAllFiles().map { entities ->
            var list = entities.map { it.toDomain() }

            // 1. Section filtering
            list = when (section) {
                DriveViewSection.TRASH -> list.filter { it.trashed }
                DriveViewSection.STARRED -> list.filter { !it.trashed && it.starred }
                DriveViewSection.SHARED_WITH_ME -> list.filter { !it.trashed && it.shared }
                DriveViewSection.MY_DRIVE -> {
                    if (searchFilters.isActive) {
                        list.filter { !it.trashed }
                    } else {
                        list.filter { !it.trashed && it.parentId == currentFolderId }
                    }
                }
                DriveViewSection.SEARCH -> list.filter { !it.trashed }
                DriveViewSection.NIZAM_REPORT -> list.filter { !it.trashed }
            }

            // 2. Search / Advanced filters
            if (searchFilters.query.isNotBlank()) {
                val q = searchFilters.query.trim().lowercase()
                list = list.filter {
                    it.name.lowercase().contains(q) ||
                    it.description.lowercase().contains(q) ||
                    it.content.lowercase().contains(q)
                }
            }

            // 3. File type filtering
            val effectiveType = if (searchFilters.fileType != FileFilterType.ALL) searchFilters.fileType else filterType
            if (effectiveType != FileFilterType.ALL) {
                list = list.filter { file ->
                    when (effectiveType) {
                        FileFilterType.FOLDERS -> file.isFolder
                        FileFilterType.DOCUMENTS -> file.mimeType.contains("document") || file.mimeType.contains("text")
                        FileFilterType.SPREADSHEETS -> file.mimeType.contains("spreadsheet")
                        FileFilterType.PRESENTATIONS -> file.mimeType.contains("presentation")
                        FileFilterType.PDFS -> file.mimeType.contains("pdf")
                        FileFilterType.IMAGES -> file.mimeType.contains("image")
                        FileFilterType.ALL -> true
                    }
                }
            }

            // 4. Date Preset
            if (searchFilters.datePreset != DatePreset.ANY) {
                val now = System.currentTimeMillis()
                val oneDay = 86_400_000L
                val cutoff = when (searchFilters.datePreset) {
                    DatePreset.TODAY -> now - oneDay
                    DatePreset.PAST_7_DAYS -> now - (oneDay * 7)
                    DatePreset.PAST_30_DAYS -> now - (oneDay * 30)
                    DatePreset.THIS_YEAR -> now - (oneDay * 365)
                    DatePreset.ANY -> 0L
                }
                list = list.filter { it.modifiedTime >= cutoff }
            }

            // 5. Owner filter
            if (searchFilters.ownerType != OwnerFilter.ANY) {
                list = when (searchFilters.ownerType) {
                    OwnerFilter.ME -> list.filter { it.owners.any { o -> o.me } }
                    OwnerFilter.NOT_ME -> list.filter { it.owners.none { o -> o.me } }
                    OwnerFilter.ANY -> list
                }
            }

            // 6. Sorting
            list.sortedWith { a, b ->
                // Folders always at top unless sorted by size
                if (sortField != SortField.SIZE) {
                    if (a.isFolder && !b.isFolder) return@sortedWith -1
                    if (!a.isFolder && b.isFolder) return@sortedWith 1
                }

                val result = when (sortField) {
                    SortField.NAME -> a.name.compareTo(b.name, ignoreCase = true)
                    SortField.MODIFIED_TIME -> a.modifiedTime.compareTo(b.modifiedTime)
                    SortField.SIZE -> a.size.compareTo(b.size)
                }
                if (sortOrder == SortOrder.ASC) result else -result
            }
        }
    }

    suspend fun createFolder(name: String, parentId: String): DriveFile {
        val folder = DriveFile(
            id = "folder_${System.currentTimeMillis()}",
            name = name,
            mimeType = DriveFile.MIME_FOLDER,
            parentId = parentId,
            modifiedTime = System.currentTimeMillis()
        )
        dao.insertFile(DriveFileEntity.fromDomain(folder))
        return folder
    }

    suspend fun createDocument(title: String, content: String, parentId: String, asGoogleDoc: Boolean): DriveFile {
        val ext = if (asGoogleDoc) ".gdoc" else ".txt"
        val cleanTitle = if (title.endsWith(".gdoc") || title.endsWith(".txt")) title else "$title$ext"
        val doc = DriveFile(
            id = "doc_${System.currentTimeMillis()}",
            name = cleanTitle,
            mimeType = if (asGoogleDoc) DriveFile.MIME_DOCUMENT else DriveFile.MIME_TEXT,
            size = content.toByteArray().size.toLong(),
            parentId = parentId,
            modifiedTime = System.currentTimeMillis(),
            content = content,
            webViewLink = "https://docs.google.com/document/d/${System.currentTimeMillis()}/edit"
        )
        dao.insertFile(DriveFileEntity.fromDomain(doc))
        return doc
    }

    suspend fun toggleStar(fileId: String, currentStarred: Boolean) {
        dao.updateStarred(fileId, !currentStarred)
    }

    suspend fun moveToTrash(fileId: String) {
        dao.updateTrashed(fileId, true)
    }

    suspend fun restoreFile(fileId: String) {
        dao.updateTrashed(fileId, false)
    }

    suspend fun renameFile(fileId: String, newName: String) {
        dao.renameFile(fileId, newName)
    }

    suspend fun deletePermanently(fileId: String) {
        dao.deleteFilePermanently(fileId)
    }

    suspend fun emptyTrash() {
        dao.emptyTrash()
    }

    fun getAboutInfo(): DriveAbout {
        return DriveAbout()
    }
}
