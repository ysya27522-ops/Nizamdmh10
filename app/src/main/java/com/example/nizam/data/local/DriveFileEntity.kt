package com.example.nizam.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.nizam.data.model.DriveFile

@Entity(tableName = "drive_files")
data class DriveFileEntity(
    @PrimaryKey val id: String,
    val name: String,
    val mimeType: String,
    val size: Long,
    val modifiedTime: Long,
    val createdTime: Long,
    val ownerName: String,
    val ownerEmail: String,
    val shared: Boolean,
    val starred: Boolean,
    val trashed: Boolean,
    val parentId: String,
    val description: String,
    val content: String,
    val webViewLink: String
) {
    fun toDomain(): DriveFile {
        return DriveFile(
            id = id,
            name = name,
            mimeType = mimeType,
            size = size,
            modifiedTime = modifiedTime,
            createdTime = createdTime,
            owners = listOf(
                com.example.nizam.data.model.DriveOwner(
                    displayName = ownerName,
                    emailAddress = ownerEmail
                )
            ),
            shared = shared,
            starred = starred,
            trashed = trashed,
            parentId = parentId,
            description = description,
            content = content,
            webViewLink = webViewLink
        )
    }

    companion object {
        fun fromDomain(file: DriveFile): DriveFileEntity {
            val owner = file.owners.firstOrNull() ?: com.example.nizam.data.model.DriveOwner()
            return DriveFileEntity(
                id = file.id,
                name = file.name,
                mimeType = file.mimeType,
                size = file.size,
                modifiedTime = file.modifiedTime,
                createdTime = file.createdTime,
                ownerName = owner.displayName,
                ownerEmail = owner.emailAddress,
                shared = file.shared,
                starred = file.starred,
                trashed = file.trashed,
                parentId = file.parentId,
                description = file.description,
                content = file.content,
                webViewLink = file.webViewLink
            )
        }
    }
}
