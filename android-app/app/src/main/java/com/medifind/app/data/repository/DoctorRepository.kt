package com.medifind.app.data.repository

import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.models.DoctorRequest
import com.medifind.app.data.api.models.DoctorResponse
import com.medifind.app.data.local.AnalysisDao
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Wraps POST /api/find-doctor (see backend/routes/findDoctor.js +
 * backend/utils/ranking.js). When an analysisId is supplied, the backend
 * links the match onto that Analysis row server-side; this repository mirrors
 * the same match fields onto the local Room cache so History shows the
 * doctor result offline too.
 */
@Singleton
class DoctorRepository @Inject constructor(
    private val api: MediFindApi,
    private val executor: ApiCallExecutor,
    private val analysisDao: AnalysisDao,
) {
    suspend fun findBestDoctor(
        lat: Double,
        lng: Double,
        specialty: String,
        analysisId: String? = null,
    ): ApiResult<DoctorResponse> {
        val result = executor.execute {
            api.findDoctor(DoctorRequest(lat = lat, lng = lng, specialty = specialty, analysisId = analysisId))
        }

        val bestMatch = (result as? ApiResult.Success)?.data?.bestMatch
        if (bestMatch != null && analysisId != null) {
            runCatching {
                val cached = analysisDao.getById(analysisId) ?: return@runCatching
                analysisDao.upsert(
                    cached.copy(
                        matchName = bestMatch.name,
                        matchAddress = bestMatch.address,
                        matchPhone = bestMatch.phone,
                        matchWebsite = bestMatch.website,
                        matchType = bestMatch.type,
                        matchDistanceKm = bestMatch.distanceKm,
                        matchLat = bestMatch.lat,
                        matchLng = bestMatch.lng,
                        matchOsmMapUrl = bestMatch.osmMapUrl,
                        matchDirectionsUrl = bestMatch.directionsUrl,
                        matchScore = bestMatch.matchScore,
                        locationLat = lat,
                        locationLng = lng,
                    ),
                )
            }
        }

        return result
    }
}
