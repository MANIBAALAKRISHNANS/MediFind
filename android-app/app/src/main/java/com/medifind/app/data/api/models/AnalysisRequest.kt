package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/**
 * Request body for POST /api/analyze.
 * See backend/routes/analyze.js — only `symptoms` is required (10–2000 chars);
 * age/gender are optional context passed into the local diagnosis engine.
 */
@JsonClass(generateAdapter = true)
data class AnalysisRequest(
    val symptoms: String,
    val age: Int? = null,
    val gender: String? = null,
)
