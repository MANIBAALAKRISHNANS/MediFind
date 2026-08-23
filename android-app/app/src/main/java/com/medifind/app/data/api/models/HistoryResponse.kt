package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/**
 * Response body for GET /api/history — cursor-paginated list.
 * See backend/routes/history.js.
 */
@JsonClass(generateAdapter = true)
data class HistoryListResponse(
    val analyses: List<AnalysisRecord>,
    val nextCursor: String?,
    val hasMore: Boolean,
    val total: Int? = null,
)

/**
 * A single row from the Prisma `Analysis` table
 * (see backend/prisma/schema.prisma), as returned by:
 *   - GET /api/history         (list, each item shaped like this)
 *   - GET /api/history/:id     (single record)
 *   - POST /api/analyze        (matchXxx fields are null until a doctor search runs)
 */
@JsonClass(generateAdapter = true)
data class AnalysisRecord(
    val id: String,
    val userId: String,
    val symptoms: String,
    val disease: String?,
    val specialty: String?,
    val severity: String?,
    val urgency: String?,
    val description: String?,
    val recommendations: List<String> = emptyList(),
    val redFlags: List<String> = emptyList(),

    // Best-match fields — null until /api/find-doctor links a result to this analysis
    val matchName: String? = null,
    val matchAddress: String? = null,
    val matchPhone: String? = null,
    val matchWebsite: String? = null,
    val matchType: String? = null,
    val matchDistanceKm: Double? = null,
    val matchLat: Double? = null,
    val matchLng: Double? = null,
    val matchOsmMapUrl: String? = null,
    val matchDirectionsUrl: String? = null,
    val matchScore: Int? = null,
    val matchSpecialtyScore: Double? = null,
    val matchDistanceScore: Double? = null,
    val matchTypeScore: Double? = null,
    val matchCompletenessScore: Double? = null,

    val locationLat: Double? = null,
    val locationLng: Double? = null,

    val createdAt: String,
)

/** Response body for DELETE /api/history/:id. */
@JsonClass(generateAdapter = true)
data class DeleteHistoryResponse(
    val message: String,
)
