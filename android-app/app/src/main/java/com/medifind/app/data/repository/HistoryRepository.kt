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
 * the Room cache in sync so the History list/detail screens work offline.
 *
 * ── DECISION: network-first + Room-as-cache, NOT web's always-write-local-first ──
 * frontend-web/src/services/historyService.js writes every new analysis to
 * localStorage unconditionally — even for a logged-in user, even when the
 * server DB save succeeded — and HistoryPage/AnalysisDetailPage.jsx prefer
 * that local copy over the server whenever `token` is falsy (an unauthenticated
 * "guest" read path). This module deliberately does NOT copy that pattern:
 *
 *   1. Every route in this app sits behind SplashScreen's login gate — same
 *      as the web app's own ProtectedRoute, which guards `/`, `/history`, and
 *      `/history/:id` too. So on the WEB app just as much as here, an
 *      unauthenticated user can never actually reach these screens through
 *      normal navigation; historyService.js's `if (token) … else local`
 *      branches on the web are a defensive fallback for a token going stale
 *      mid-session, not a first-class guest-browsing feature. There's no
 *      supported "guest with local-only history" flow to port.
 *   2. This app already gets the resilience guarantee web's dual-write exists
 *      for — never lose a diagnosis the user is looking at, even if the
 *      server DB write silently failed — via AnalysisRepository, which
 *      caches every *successful* /api/analyze response into Room regardless
 *      of whether the backend returned an `analysisId` (see
 *      AnalysisEntity.fromAnalysisResponse's `isPendingSync` flag). What we
 *      don't do is treat that local cache as authoritative once a network
 *      read succeeds — the read methods below always try the server first
 *      and only fall back to the cached Room row when the request itself
 *      fails (see getAnalysis()), so a stale local row never shadows a fresh
 *      server one for a signed-in user.
 *   3. Room already has no cap and no eviction-notice UX to build (unlike
 *      localStorage's 50-entry MAX_ENTRIES + one-time "archived" toast on the
 *      web) — there is no equivalent overflow scenario to defend against
 *      here, so adopting web's always-write-first model would add
 *      complexity (two sources of truth to reconcile on every read) without
 *      solving a problem this app actually has.
 *
 * In short: network-first with a Room fallback for offline/failure cases —
 * not local-first with a server override — is the deliberate choice here.
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
     * Deletes every given id server-side (best-effort, one id's failure
     * doesn't block the rest — mirrors historyService.js's
     * `Promise.allSettled` on the web) and always clears the local Room
     * cache afterwards, matching HistoryPage.jsx's "Clear All" button.
     */
    suspend fun clearAllHistory(ids: List<String>): ApiResult<Unit> {
        var anyFailure = false
        for (id in ids) {
            when (executor.execute { api.deleteAnalysis(id) }) {
                is ApiResult.Success -> Unit
                is ApiResult.Error -> anyFailure = true
            }
        }
        runCatching { analysisDao.clearAll() }
        return if (anyFailure) {
            ApiResult.Error("Some analyses could not be deleted from the server, but local history was cleared.")
        } else {
            ApiResult.Success(Unit)
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
