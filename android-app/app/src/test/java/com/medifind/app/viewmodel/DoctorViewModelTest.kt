package com.medifind.app.viewmodel

import com.google.common.truth.Truth.assertThat
import com.medifind.app.MainDispatcherRule
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.BestMatch
import com.medifind.app.data.api.models.DoctorResponse
import com.medifind.app.data.api.models.ScoreBreakdown
import com.medifind.app.data.repository.CityGeocoder
import com.medifind.app.data.repository.DoctorRepository
import com.medifind.app.data.repository.LatLng
import com.medifind.app.data.repository.LocationProvider
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class DoctorViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val doctorRepository: DoctorRepository = mockk()
    private val locationProvider: LocationProvider = mockk()
    private val cityGeocoder: CityGeocoder = mockk()
    private lateinit var viewModel: DoctorViewModel

    private val fakeMatch = BestMatch(
        name = "Apollo Hospital",
        address = "123 MG Road, Bengaluru",
        phone = "+91-80-12345678",
        website = null,
        type = "hospital",
        distanceKm = 2.4,
        openingHours = "24/7",
        lat = 12.9716,
        lng = 77.5946,
        osmId = "node/1",
        osmMapUrl = "https://www.openstreetmap.org/node/1",
        directionsUrl = "https://www.openstreetmap.org/directions?from=0,0&to=12.9716,77.5946",
        matchScore = 88,
        scoreBreakdown = ScoreBreakdown(35.0, 38.0, 15.0, 10.0),
        recommendedSpecialty = "cardiologist",
        source = "OpenStreetMap",
    )

    @Before
    fun setup() {
        viewModel = DoctorViewModel(doctorRepository, locationProvider, cityGeocoder)
    }

    @Test
    fun `successful search populates the best match`() = runTest {
        coEvery { locationProvider.getCurrentLocation() } returns LatLng(12.9716, 77.5946)
        coEvery { doctorRepository.findBestDoctor(12.9716, 77.5946, "cardiologist", "analysis-1") } returns
            ApiResult.Success(DoctorResponse(bestMatch = fakeMatch, alternativesCount = 4, source = "OpenStreetMap"))

        viewModel.searchDoctor("cardiologist", "analysis-1")
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.isLoading).isFalse()
        assertThat(state.bestMatch).isEqualTo(fakeMatch)
        assertThat(state.alternativesCount).isEqualTo(4)
        assertThat(state.hasSearched).isTrue()
        assertThat(state.errorMessage).isNull()
    }

    @Test
    fun `location permission denial surfaces its message without marking hasSearched`() = runTest {
        coEvery { locationProvider.getCurrentLocation() } throws SecurityException("Location permission denied.")

        viewModel.searchDoctor("cardiologist")
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.isLoading).isFalse()
        assertThat(state.errorMessage).isEqualTo("Location permission denied.")
        assertThat(state.hasSearched).isFalse()
    }

    @Test
    fun `no facilities found surfaces a not-found message`() = runTest {
        coEvery { locationProvider.getCurrentLocation() } returns LatLng(12.9716, 77.5946)
        coEvery { doctorRepository.findBestDoctor(any(), any(), any(), any()) } returns
            ApiResult.Success(DoctorResponse(bestMatch = null, alternativesCount = 0, source = "OpenStreetMap"))

        viewModel.searchDoctor("cardiologist")
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.bestMatch).isNull()
        assertThat(state.errorMessage).isEqualTo(
            "No nearby facilities found. Try entering a different location or searching for a broader specialty.",
        )
        assertThat(state.hasSearched).isTrue()
    }

    @Test
    fun `backend error is surfaced verbatim`() = runTest {
        coEvery { locationProvider.getCurrentLocation() } returns LatLng(12.9716, 77.5946)
        coEvery { doctorRepository.findBestDoctor(any(), any(), any(), any()) } returns
            ApiResult.Error("Overpass API timed out. Please try again.", code = "OVERPASS_TIMEOUT")

        viewModel.searchDoctor("cardiologist")
        advanceUntilIdle()

        assertThat(viewModel.uiState.value.errorMessage).isEqualTo("Overpass API timed out. Please try again.")
    }
}
