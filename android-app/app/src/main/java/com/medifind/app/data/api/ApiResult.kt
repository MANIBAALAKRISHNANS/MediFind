package com.medifind.app.data.api

import com.medifind.app.data.api.models.ApiError
import com.squareup.moshi.Moshi
import java.io.IOException
import java.net.SocketTimeoutException
import javax.inject.Inject
import javax.inject.Singleton
import retrofit2.Response

/** Uniform outcome type for every repository call — mirrors the web app's normalizeError(). */
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val message: String, val code: String? = null, val httpStatus: Int? = null) : ApiResult<Nothing>()
}

inline fun <T, R> ApiResult<T>.map(transform: (T) -> R): ApiResult<R> = when (this) {
    is ApiResult.Success -> ApiResult.Success(transform(data))
    is ApiResult.Error -> this
}

/**
 * Executes a Retrofit call and converts it into an [ApiResult], extracting the
 * REAL backend error message (`{ "error": "...", "code": "..." }` — see every
 * handler under backend/routes) rather than a generic "Something went wrong".
 * This is the Kotlin equivalent of normalizeError() in
 * frontend-web/src/api/client.js.
 */
@Singleton
class ApiCallExecutor @Inject constructor(private val moshi: Moshi) {

    private val errorAdapter = moshi.adapter(ApiError::class.java)

    suspend fun <T> execute(call: suspend () -> Response<T>): ApiResult<T> {
        return try {
            val response = call()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error("Empty response from server.", httpStatus = response.code())
                }
            } else {
                val errorBodyString = response.errorBody()?.string()
                val parsed = errorBodyString?.let {
                    try { errorAdapter.fromJson(it) } catch (_: Exception) { null }
                }
                ApiResult.Error(
                    message = parsed?.error ?: "Request failed with status ${response.code()}",
                    code = parsed?.code ?: "REQUEST_ERROR",
                    httpStatus = response.code(),
                )
            }
        } catch (e: SocketTimeoutException) {
            ApiResult.Error(
                message = "The request timed out. The server may be busy — please try again.",
                code = "TIMEOUT",
            )
        } catch (e: IOException) {
            ApiResult.Error(
                message = "Unable to connect to the server. Please check your internet connection and try again.",
                code = "NETWORK_ERROR",
            )
        } catch (e: Exception) {
            ApiResult.Error(
                message = e.message ?: "Something went wrong. Please try again.",
                code = "UNKNOWN_ERROR",
            )
        }
    }
}
