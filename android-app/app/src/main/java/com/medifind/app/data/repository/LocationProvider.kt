package com.medifind.app.data.repository

import com.google.android.gms.location.CurrentLocationRequest
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.Granularity
import com.google.android.gms.location.Priority
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.suspendCancellableCoroutine

data class LatLng(val lat: Double, val lng: Double)

/**
 * Bridges Play Services' Task-based FusedLocationProviderClient to coroutines.
 * Equivalent to frontend-web/src/services/locationService.js's GPS path — the
 * ip-fallback branch that file has isn't needed here since native Android
 * can request ACCESS_FINE_LOCATION directly instead of relying on a browser
 * permission prompt.
 */
@Singleton
class LocationProvider @Inject constructor(
    private val fusedLocationClient: FusedLocationProviderClient,
) {
    /**
     * Requests a fresh high-accuracy fix. Callers must have already been
     * granted ACCESS_FINE_LOCATION (see ui/screens/DoctorResultScreen.kt's
     * Accompanist permission gate) — a SecurityException is surfaced as a
     * normal thrown exception for the caller to catch if that invariant is
     * ever violated.
     */
    suspend fun getCurrentLocation(): LatLng = suspendCancellableCoroutine { continuation ->
        val request = CurrentLocationRequest.Builder()
            .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
            .setGranularity(Granularity.GRANULARITY_FINE)
            .setDurationMillis(20_000L)
            .build()

        try {
            val cancellationSource = com.google.android.gms.tasks.CancellationTokenSource()
            continuation.invokeOnCancellation { cancellationSource.cancel() }

            fusedLocationClient.getCurrentLocation(request, cancellationSource.token)
                .addOnSuccessListener { location ->
                    if (location != null) {
                        continuation.resume(LatLng(location.latitude, location.longitude))
                    } else {
                        continuation.resumeWithException(
                            IllegalStateException(
                                "Location unavailable. Make sure GPS or location services are enabled on your device.",
                            ),
                        )
                    }
                }
                .addOnFailureListener { error ->
                    continuation.resumeWithException(error)
                }
        } catch (e: SecurityException) {
            continuation.resumeWithException(
                SecurityException("Location permission denied. Please allow location access in app settings.", e),
            )
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            continuation.resumeWithException(e)
        }
    }
}
