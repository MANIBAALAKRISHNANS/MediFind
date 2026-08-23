package com.medifind.app.data.api.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Response body for POST /api/analyze (also returned verbatim on a cache hit).
 * See backend/routes/analyze.js — the diagnosis object is spread with `analysisId`
 * appended after being persisted to the `Analysis` table.
 */
@JsonClass(generateAdapter = true)
data class AnalysisResponse(
    val disease: String,
    val confidence: Int,
    val differentialDiagnosis: List<DifferentialDiagnosis> = emptyList(),
    val specialty: String,
    val severity: String,
    val urgency: String,
    val description: String,
    val recommendations: List<String> = emptyList(),
    val redFlags: List<String> = emptyList(),
    val homeCare: List<String> = emptyList(),
    val whenToSeekHelp: String? = null,
    // "gemini" | "local-ai"
    val source: String? = null,
    val analysisId: String? = null,
    // Present only when the India-pattern cross-check overrode the specialty.
    @Json(name = "_adjustedBy") val adjustedBy: String? = null,
    // Present (true) only when the local rule-based fallback engine was used.
    @Json(name = "_localEngine") val localEngine: Boolean? = null,
)

@JsonClass(generateAdapter = true)
data class DifferentialDiagnosis(
    val name: String,
    val probability: Int,
)
