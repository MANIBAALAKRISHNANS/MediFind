package com.medifind.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.medifind.app.data.local.entities.AnalysisEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AnalysisDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: AnalysisEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(entities: List<AnalysisEntity>)

    /** Newest-first, matching GET /api/history's `orderBy: { createdAt: 'desc' }`. */
    @Query("SELECT * FROM analyses ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<AnalysisEntity>>

    @Query("SELECT * FROM analyses ORDER BY createdAt DESC")
    suspend fun getAll(): List<AnalysisEntity>

    @Query("SELECT * FROM analyses WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): AnalysisEntity?

    @Query("SELECT * FROM analyses WHERE id = :id LIMIT 1")
    fun observeById(id: String): Flow<AnalysisEntity?>

    @Query("DELETE FROM analyses WHERE id = :id")
    suspend fun deleteById(id: String)

    @Delete
    suspend fun delete(entity: AnalysisEntity)

    @Query("DELETE FROM analyses")
    suspend fun clearAll()

    @Query("SELECT COUNT(*) FROM analyses")
    suspend fun count(): Int
}
