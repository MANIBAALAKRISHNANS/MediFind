package com.medifind.app.data.repository

import java.io.IOException
import java.net.URLEncoder
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import org.json.JSONArray

data class CityLocation(val lat: Double, val lng: Double, val displayName: String)

/**
 * Converts a city name to coordinates via Nominatim (OpenStreetMap) — the
 * native equivalent of frontend-web/src/services/apiService.js's
 * geocodeCity(), used as the fallback when location permission is denied
 * (see DoctorResultScreen.kt). Deliberately uses its own bare OkHttpClient
 * rather than the app's authenticated Retrofit client (ApiClient.kt) so the
 * user's session Bearer token is never sent to this third-party host.
 */
@Singleton
class CityGeocoder @Inject constructor() {
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    suspend fun geocodeCity(cityName: String): CityLocation = suspendCancellableCoroutine { continuation ->
        val encoded = URLEncoder.encode(cityName, "UTF-8")
        val request = Request.Builder()
            .url("https://nominatim.openstreetmap.org/search?q=$encoded&format=json&limit=1")
            .header("Accept-Language", "en")
            .header("User-Agent", "MediFind/1.0 (medifindofficial@gmail.com)")
            .build()

        val call = client.newCall(request)
        continuation.invokeOnCancellation { call.cancel() }

        call.enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                continuation.resumeWithException(
                    IllegalStateException("Could not reach the location service. Check your connection and try again.", e),
                )
            }

            override fun onResponse(call: Call, response: Response) {
                response.use { resp ->
                    if (!resp.isSuccessful) {
                        continuation.resumeWithException(IllegalStateException("City lookup failed. Please try again."))
                        return
                    }
                    try {
                        val body = resp.body?.string().orEmpty()
                        val results = JSONArray(body)
                        if (results.length() == 0) {
                            continuation.resumeWithException(
                                IllegalStateException("City \"$cityName\" not found. Please check the spelling or try a nearby larger city."),
                            )
                            return
                        }
                        val obj = results.getJSONObject(0)
                        continuation.resume(
                            CityLocation(
                                lat = obj.getString("lat").toDouble(),
                                lng = obj.getString("lon").toDouble(),
                                displayName = obj.optString("display_name", cityName),
                            ),
                        )
                    } catch (e: Exception) {
                        continuation.resumeWithException(IllegalStateException("City lookup failed. Please try again.", e))
                    }
                }
            }
        })
    }
}
