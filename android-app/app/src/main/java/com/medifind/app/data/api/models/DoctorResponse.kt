package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/**
 * Response body for POST /api/find-doctor.
 * See backend/routes/findDoctor.js + backend/utils/ranking.js findBestMatch().
 */
@JsonClass(generateAdapter = true)
data class DoctorResponse(
    val bestMatch: BestMatch?,
    // Set when no facility matched the requested specialty — `facilities` then
    // lists ALL nearby (non-disqualified) facilities, closest first, and
    // `bestMatch` is just facilities[0].
    val note: String? = null,
    val facilities: List<BestMatch>? = null,
    val alternativesCount: Int,
    val source: String,
)

@JsonClass(generateAdapter = true)
data class BestMatch(
    val name: String,
    val address: String?,
    val phone: String?,
    val website: String?,
    val type: String,
    val distanceKm: Double,
    val openingHours: String?,
    val lat: Double,
    val lng: Double,
    val osmId: String? = null,
    val osmMapUrl: String,
    val directionsUrl: String,
    val matchScore: Int,
    val scoreBreakdown: ScoreBreakdown,
    val recommendedSpecialty: String,
    val source: String,
)

@JsonClass(generateAdapter = true)
data class ScoreBreakdown(
    val specialtyScore: Double,
    val distanceScore: Double,
    val typeScore: Double,
    val completenessScore: Double,
)
