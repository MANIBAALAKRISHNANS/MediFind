package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/**
 * Shape of every error body the backend returns, e.g.
 * { "error": "Symptoms must be between 10 and 2000 characters.", "code": "INVALID_INPUT" }
 * (see backend/server.js global error handler and each route's validation).
 */
@JsonClass(generateAdapter = true)
data class ApiError(
    val error: String,
    val code: String? = null,
)
