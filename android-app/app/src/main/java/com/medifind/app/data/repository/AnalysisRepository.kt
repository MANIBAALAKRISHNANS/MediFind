package com.medifind.app.data.repository

import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.models.AnalysisRequest
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.data.local.AnalysisDao
import com.medifind.app.data.local.entities.AnalysisEntity
import java.time.Instant
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Wraps POST /api/analyze and dual-writes every result into Room, matching the
 * web app's behaviour of persisting each analysis both server-side (Prisma)
 * and to a local cache (frontend-web/src/services/historyService.js), so
 * History is browsable without a network connection.
 */
@Singleton
class AnalysisRepository @Inject constructor(
    private val api: MediFindApi,
    private val executor: ApiCallExecutor,
    private val analysisDao: AnalysisDao,
    private val authRepository: AuthRepository,
) {
    suspend fun analyzeSymptoms(
        symptoms: String,
        age: Int? = null,
        gender: String? = null,
    ): ApiResult<AnalysisResponse> {
        val result = executor.execute {
            api.analyzeSymptoms(AnalysisRequest(symptoms = symptoms, age = age, gender = gender))
        }

        if (result is ApiResult.Success) {
            val userId = authRepository.currentUser.value?.id ?: "unknown"
            val entity = AnalysisEntity.fromAnalysisResponse(
                response = result.data,
                symptoms = symptoms,
                userId = userId,
                createdAtIso = Instant.now().toString(),
            )
            // Local cache write is best-effort — never let a disk error fail
            // an otherwise-successful analysis that the user is waiting on.
            runCatching { analysisDao.upsert(entity) }
        }

        return result
    }
}
