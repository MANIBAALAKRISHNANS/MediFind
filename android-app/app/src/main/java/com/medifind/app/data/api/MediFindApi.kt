package com.medifind.app.data.api

import com.medifind.app.data.api.models.AnalysisRequest
import com.medifind.app.data.api.models.AnalysisRecord
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.data.api.models.DeleteHistoryResponse
import com.medifind.app.data.api.models.DoctorRequest
import com.medifind.app.data.api.models.DoctorResponse
import com.medifind.app.data.api.models.ForgotPasswordRequest
import com.medifind.app.data.api.models.HistoryListResponse
import com.medifind.app.data.api.models.LoginRequest
import com.medifind.app.data.api.models.MessageResponse
import com.medifind.app.data.api.models.ResetPasswordRequest
import com.medifind.app.data.api.models.SignupRequest
import com.medifind.app.data.api.models.TokenResponse
import com.medifind.app.data.api.models.UpdateProfileRequest
import com.medifind.app.data.api.models.UserResponse
import com.squareup.moshi.JsonClass
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Streaming

/** GET /api/health response — see backend/routes/health.js. */
@JsonClass(generateAdapter = true)
data class HealthResponse(
    val status: String,
    val timestamp: String,
)

/**
 * Retrofit interface covering every backend endpoint (see backend/server.js
 * for the mount table). Auth is handled transparently by ApiClient's OkHttp
 * interceptor — callers never attach the Bearer token themselves.
 */
interface MediFindApi {

    // ── Health ───────────────────────────────────────────────────────────────

    @GET("api/health")
    suspend fun health(): HealthResponse

    // ── Auth ─────────────────────────────────────────────────────────────────

    @POST("api/auth/signup")
    suspend fun signup(@Body body: SignupRequest): Response<TokenResponse>

    @POST("api/auth/login")
    suspend fun login(@Body body: LoginRequest): Response<TokenResponse>

    @POST("api/auth/forgot-password")
    suspend fun forgotPassword(@Body body: ForgotPasswordRequest): Response<MessageResponse>

    @POST("api/auth/reset-password")
    suspend fun resetPassword(@Body body: ResetPasswordRequest): Response<MessageResponse>

    @GET("api/auth/me")
    suspend fun getCurrentUser(): Response<UserResponse>

    @PUT("api/auth/profile")
    suspend fun updateProfile(@Body body: UpdateProfileRequest): Response<UserResponse>

    @POST("api/auth/logout")
    suspend fun logout(): Response<MessageResponse>

    // ── Symptom analysis ─────────────────────────────────────────────────────

    @POST("api/analyze")
    suspend fun analyzeSymptoms(@Body body: AnalysisRequest): Response<AnalysisResponse>

    // ── Doctor / facility search ─────────────────────────────────────────────

    @POST("api/find-doctor")
    suspend fun findDoctor(@Body body: DoctorRequest): Response<DoctorResponse>

    // ── History ──────────────────────────────────────────────────────────────

    @GET("api/history")
    suspend fun getHistory(
        @Query("cursor") cursor: String? = null,
        @Query("limit") limit: Int = 20,
    ): Response<HistoryListResponse>

    @GET("api/history/{id}")
    suspend fun getAnalysis(@Path("id") id: String): Response<AnalysisRecord>

    @DELETE("api/history/{id}")
    suspend fun deleteAnalysis(@Path("id") id: String): Response<DeleteHistoryResponse>

    @Streaming
    @GET("api/history/{id}/pdf")
    suspend fun downloadReportPdf(@Path("id") id: String): Response<ResponseBody>
}
