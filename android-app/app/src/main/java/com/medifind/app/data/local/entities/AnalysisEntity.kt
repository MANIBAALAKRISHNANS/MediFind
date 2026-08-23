package com.medifind.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.medifind.app.data.api.models.AnalysisRecord
import com.medifind.app.data.api.models.AnalysisResponse

/**
 * Offline cache row for one symptom analysis, mirroring the Prisma `Analysis`
 * table (backend/prisma/schema.prisma). Populated by AnalysisRepository on
 * every successful /api/analyze or /api/history call so History is browsable
 * offline, matching the web app's dual local+server persistence pattern
 * (frontend-web/src/services/historyService.js).
 */
@Entity(tableName = "analyses")
data class AnalysisEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val symptoms: String,
    val disease: String?,
    val specialty: String?,
    val severity: String?,
    val urgency: String?,
    val description: String?,
    val recommendations: List<String>,
    val redFlags: List<String>,

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

    val locationLat: Double? = null,
    val locationLng: Double? = null,

    val createdAt: String,

    // True for rows created locally (e.g. while offline) that haven't been
    // confirmed against the server's /api/analyze response yet.
    val isPendingSync: Boolean = false,
) {
    companion object {
        /** Builds a full cache row from a fresh /api/analyze response. */
        fun fromAnalysisResponse(
            response: AnalysisResponse,
            symptoms: String,
            userId: String,
            createdAtIso: String,
        ): AnalysisEntity = AnalysisEntity(
            id = response.analysisId ?: java.util.UUID.randomUUID().toString(),
            userId = userId,
            symptoms = symptoms,
            disease = response.disease,
            specialty = response.specialty,
            severity = response.severity,
            urgency = response.urgency,
            description = response.description,
            recommendations = response.recommendations,
            redFlags = response.redFlags,
            createdAt = createdAtIso,
            isPendingSync = response.analysisId == null,
        )

        /** Builds a cache row from a GET /api/history(/:id) record. */
        fun fromAnalysisRecord(record: AnalysisRecord): AnalysisEntity = AnalysisEntity(
            id = record.id,
            userId = record.userId,
            symptoms = record.symptoms,
            disease = record.disease,
            specialty = record.specialty,
            severity = record.severity,
            urgency = record.urgency,
            description = record.description,
            recommendations = record.recommendations,
            redFlags = record.redFlags,
            matchName = record.matchName,
            matchAddress = record.matchAddress,
            matchPhone = record.matchPhone,
            matchWebsite = record.matchWebsite,
            matchType = record.matchType,
            matchDistanceKm = record.matchDistanceKm,
            matchLat = record.matchLat,
            matchLng = record.matchLng,
            matchOsmMapUrl = record.matchOsmMapUrl,
            matchDirectionsUrl = record.matchDirectionsUrl,
            matchScore = record.matchScore,
            locationLat = record.locationLat,
            locationLng = record.locationLng,
            createdAt = record.createdAt,
            isPendingSync = false,
        )
    }
}
