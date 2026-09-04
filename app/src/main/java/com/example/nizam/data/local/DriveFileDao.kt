package com.example.nizam.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface DriveFileDao {
    @Query("SELECT * FROM drive_files ORDER BY mimeType = 'application/vnd.google-apps.folder' DESC, modifiedTime DESC")
    fun getAllFiles(): Flow<List<DriveFileEntity>>

    @Query("SELECT * FROM drive_files WHERE id = :id")
    suspend fun getFileById(id: String): DriveFileEntity?

    @Query("SELECT COUNT(*) FROM drive_files")
    suspend fun countFiles(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFile(file: DriveFileEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(files: List<DriveFileEntity>)

    @Update
    suspend fun updateFile(file: DriveFileEntity)

    @Query("UPDATE drive_files SET starred = :starred WHERE id = :id")
    suspend fun updateStarred(id: String, starred: Boolean)

    @Query("UPDATE drive_files SET trashed = :trashed WHERE id = :id")
    suspend fun updateTrashed(id: String, trashed: Boolean)

    @Query("UPDATE drive_files SET name = :newName, modifiedTime = :time WHERE id = :id")
    suspend fun renameFile(id: String, newName: String, time: Long = System.currentTimeMillis())

    @Query("DELETE FROM drive_files WHERE id = :id")
    suspend fun deleteFilePermanently(id: String)

    @Query("DELETE FROM drive_files WHERE trashed = 1")
    suspend fun emptyTrash()
}
