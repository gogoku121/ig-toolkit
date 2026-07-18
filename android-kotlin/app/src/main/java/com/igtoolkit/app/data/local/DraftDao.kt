package com.igtoolkit.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface DraftDao {
    @Insert
    suspend fun insert(draft: DraftEntity): Long

    @Query("SELECT * FROM drafts ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<DraftEntity>>

    @Query("SELECT * FROM drafts ORDER BY createdAt DESC LIMIT :limit")
    suspend fun getRecent(limit: Int = 50): List<DraftEntity>

    @Delete
    suspend fun delete(draft: DraftEntity)

    @Query("DELETE FROM drafts")
    suspend fun clearAll()
}
