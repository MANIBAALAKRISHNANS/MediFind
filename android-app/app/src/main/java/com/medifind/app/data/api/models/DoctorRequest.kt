package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/**
 * Request body for POST /api/find-doctor.
 * See backend/routes/findDoctor.js findDoctorSchema — lat/lng/specialty required,
 * analysisId optional (links the match back onto an existing Analysis row).
 */
@JsonClass(generateAdapter = true)
data class DoctorRequest(
    val lat: Double,
    val lng: Double,
    val specialty: String,
    val analysisId: String? = null,
)
