package com.medifind.app.data.repository

import android.content.Context
import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.models.AnalysisRecord
import com.medifind.app.data.api.models.HistoryListResponse
import com.medifind.app.data.local.AnalysisDao
import com.medifind.app.data.local.entities.AnalysisEntity
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.io.FileOutputStream
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow

/**
 * Wraps every /api/history* endpoint (backend/routes/history.js) and keeps
 * the Room cache in sync so the History list/detail screens work offline —
 * the same dual-write (server + local) behaviour the web app achieves with
 * historyService.js's localStorage cache.
 */
@Singleton
class HistoryRepository @Inject constructor(
    private val api: MediFindApi,
    private val executor: ApiCallExecutor,
    private val analysisDao: AnalysisDao,
    @ApplicationContext private val appContext: Context,
) {
    /** Local cache stream — always available, even fully offline. */
    fun observeLocalHistory(): Flow<List<AnalysisEntity>> = analysisDao.observeAll()

    /**
     * Fetches one page from the server and upserts every row into Room.
     * Pass the previous page's `nextCursor` to load subsequent pages.
     */
    suspend fun refreshHistory(cursor: String? = null, limit: Int = 20): ApiResult<HistoryListResponse> {
        val result = executor.execute { api.getHistory(cursor = cursor, limit = limit) }
        if (result is ApiResult.Success) {
            val entities = result.data.analyses.map(AnalysisEntity::fromAnalysisRecord)
            runCatching { analysisDao.upsertAll(entities) }
        }
        return result
    }

    /**
     * Network-first with local fallback: tries the server for the freshest
     * copy (and refreshes the cache), but falls back to the Room row when
     * offline so a previously viewed analysis still opens.
     */
    suspend fun getAnalysis(id: String): ApiResult<AnalysisRecord> {
        val result = executor.execute { api.getAnalysis(id) }
        return when (result) {
            is ApiResult.Success -> {
                runCatching { analysisDao.upsert(AnalysisEntity.fromAnalysisRecord(result.data)) }
                result
            }
            is ApiResult.Error -> {
                val cached = analysisDao.getById(id)
                if (cached != null) {
                    ApiResult.Success(cached.toAnalysisRecord())
                } else {
                    result
                }
            }
        }
    }

    suspend fun deleteAnalysis(id: String): ApiResult<Unit> {
        val result = executor.execute { api.deleteAnalysis(id) }
        return when (result) {
            is ApiResult.Success -> {
                runCatching { analysisDao.deleteById(id) }
                ApiResult.Success(Unit)
            }
            is ApiResult.Error -> result
        }
    }

    /**
     * Downloads the server-generated PDF (GET /api/history/:id/pdf, rendered
     * by backend/utils/pdfReport.js) to the app cache dir so the caller can
     * hand it to Android's share sheet or the print framework.
     */
    suspend fun downloadReportPdf(id: String): ApiResult<File> {
        return try {
            val response = api.downloadReportPdf(id)
            if (!response.isSuccessful || response.body() == null) {
                ApiResult.Error("Could not download the PDF report (status ${response.code()}).", httpStatus = response.code())
            } else {
                val cacheDir = File(appContext.cacheDir, "reports").apply { mkdirs() }
                val outFile = File(cacheDir, "MediFind-Report-${id.take(8)}.pdf")
                response.body()!!.byteStream().use { input ->
                    FileOutputStream(outFile).use { output -> input.copyTo(output) }
                }
                ApiResult.Success(outFile)
            }
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Could not download the PDF report.", code = "PDF_DOWNLOAD_FAILED")
        }
    }
}

private fun AnalysisEntity.toAnalysisRecord(): AnalysisRecord = AnalysisRecord(
    id = id,
    userId = userId,
    symptoms = symptoms,
    disease = disease,
    specialty = specialty,
    severity = severity,
    urgency = urgency,
    description = description,
    recommendations = recommendations,
    redFlags = redFlags,
    matchName = matchName,
    matchAddress = matchAddress,
    matchPhone = matchPhone,
    matchWebsite = matchWebsite,
    matchType = matchType,
    matchDistanceKm = matchDistanceKm,
    matchLat = matchLat,
    matchLng = matchLng,
    matchOsmMapUrl = matchOsmMapUrl,
    matchDirectionsUrl = matchDirectionsUrl,
    matchScore = matchScore,
    locationLat = locationLat,
    locationLng = locationLng,
    createdAt = createdAt,
)
