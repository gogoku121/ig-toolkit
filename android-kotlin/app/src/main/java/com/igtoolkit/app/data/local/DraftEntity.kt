package com.igtoolkit.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters

/**
 * A persisted caption draft, so generated captions survive process death and
 * app restarts instead of living only in in-memory StateFlow state.
 */
@Entity(tableName = "drafts")
@TypeConverters(DraftConverters::class)
data class DraftEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val topic: String,
    val personality: String,
    val goal: String,
    val caption: String,
    val hashtags: List<String>,
    val quality: Int,
    val researchUsed: Boolean,
    val aiGenerated: Boolean,
    val createdAt: Long = System.currentTimeMillis()
)

class DraftConverters {
    // Hashtags never contain this delimiter in practice (they're single
    // words), so a simple join/split is fine without pulling in a JSON dep.
    private val delimiter = "|||"

    @TypeConverter
    fun fromHashtagList(hashtags: List<String>): String = hashtags.joinToString(delimiter)

    @TypeConverter
    fun toHashtagList(raw: String): List<String> =
        if (raw.isEmpty()) emptyList() else raw.split(delimiter)
}
