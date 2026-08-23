package com.medifind.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.BestMatch
import com.medifind.app.data.repository.CityGeocoder
import com.medifind.app.data.repository.DoctorRepository
import com.medifind.app.data.repository.LocationProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DoctorUiState(
    val isLoading: Boolean = false,
    val bestMatch: BestMatch? = null,
    val note: String? = null,
    val facilities: List<BestMatch>? = null,
    val alternativesCount: Int = 0,
    val errorMessage: String? = null,
    val hasSearched: Boolean = false,
)

private const val NO_RESULTS_MESSAGE =
    "No nearby facilities found. Try entering a different location or searching for a broader specialty."

@HiltViewModel
class DoctorViewModel @Inject constructor(
    private val doctorRepository: DoctorRepository,
    private val locationProvider: LocationProvider,
    private val cityGeocoder: CityGeocoder,
) : ViewModel() {

    private val _uiState = MutableStateFlow(DoctorUiState())
    val uiState: StateFlow<DoctorUiState> = _uiState.asStateFlow()

    /**
     * Acquires the device's current location, then calls POST /api/find-doctor.
     * The caller (DoctorResultScreen) must already hold ACCESS_FINE_LOCATION —
     * this only handles the network/location-fetch failure states, not the
     * permission prompt itself.
     */
    fun searchDoctor(specialty: String, analysisId: String? = null) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val location = try {
                locationProvider.getCurrentLocation()
            } catch (e: SecurityException) {
                _uiState.update {
                    it.copy(isLoading = false, errorMessage = e.message ?: "Location permission denied.")
                }
                return@launch
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, errorMessage = e.message ?: "Could not get your location. Please try again.")
                }
                return@launch
            }

            runSearch(location.lat, location.lng, specialty, analysisId)
        }
    }

    /**
     * Fallback path when location permission is denied — geocodes a
     * user-entered city name (mirrors frontend-web's "Use My City Instead").
     */
    fun searchDoctorInCity(cityName: String, specialty: String, analysisId: String? = null) {
        if (cityName.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Enter a city name.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val location = try {
                cityGeocoder.geocodeCity(cityName.trim())
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, errorMessage = e.message ?: "City lookup failed. Please try again.")
                }
                return@launch
            }

            runSearch(location.lat, location.lng, specialty, analysisId)
        }
    }

    private suspend fun runSearch(lat: Double, lng: Double, specialty: String, analysisId: String?) {
        when (
            val result = doctorRepository.findBestDoctor(
                lat = lat,
                lng = lng,
                specialty = specialty,
                analysisId = analysisId,
            )
        ) {
            is ApiResult.Success -> _uiState.update {
                it.copy(
                    isLoading = false,
                    bestMatch = result.data.bestMatch,
                    note = result.data.note,
                    facilities = result.data.facilities,
                    alternativesCount = result.data.alternativesCount,
                    hasSearched = true,
                    errorMessage = if (result.data.bestMatch == null) NO_RESULTS_MESSAGE else null,
                )
            }
            is ApiResult.Error -> _uiState.update {
                it.copy(isLoading = false, errorMessage = result.message, hasSearched = true)
            }
        }
    }

    fun consumeError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    fun reset() {
        _uiState.value = DoctorUiState()
    }
}
