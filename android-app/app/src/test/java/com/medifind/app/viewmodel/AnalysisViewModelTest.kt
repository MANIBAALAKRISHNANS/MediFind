package com.medifind.app.viewmodel

import com.google.common.truth.Truth.assertThat
import com.medifind.app.MainDispatcherRule
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.data.repository.AnalysisRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AnalysisViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val analysisRepository: AnalysisRepository = mockk()
    private lateinit var viewModel: AnalysisViewModel

    private val fakeDiagnosis = AnalysisResponse(
        disease = "Dengue Fever",
        confidence = 72,
        differentialDiagnosis = emptyList(),
        specialty = "general physician",
        severity = "moderate",
        urgency = "see-doctor-today",
        description = "A mosquito-borne viral illness.",
        recommendations = listOf("Get a blood test today"),
        redFlags = listOf("Bleeding from nose or gums"),
        homeCare = emptyList(),
        whenToSeekHelp = "If bleeding occurs.",
        source = "gemini",
        analysisId = "analysis-42",
    )

    @Before
    fun setup() {
        viewModel = AnalysisViewModel(analysisRepository)
    }

    @Test
    fun `symptoms shorter than 10 characters are rejected without calling the repository`() = runTest {
        viewModel.onSymptomsChanged("fever")
        viewModel.analyzeSymptoms()
        advanceUntilIdle()

        assertThat(viewModel.uiState.value.errorMessage)
            .isEqualTo("Symptoms must be between 10 and 2000 characters.")
        io.mockk.coVerify(exactly = 0) { analysisRepository.analyzeSymptoms(any(), any(), any()) }
    }

    @Test
    fun `successful analysis populates the diagnosis and clears loading`() = runTest {
        coEvery { analysisRepository.analyzeSymptoms(any(), any(), any()) } returns ApiResult.Success(fakeDiagnosis)

        viewModel.onSymptomsChanged("fever, chills, and severe body ache for two days")
        viewModel.analyzeSymptoms()
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.isLoading).isFalse()
        assertThat(state.diagnosis).isEqualTo(fakeDiagnosis)
        assertThat(state.errorMessage).isNull()
    }

    @Test
    fun `failed analysis surfaces the real backend error, not a generic message`() = runTest {
        coEvery { analysisRepository.analyzeSymptoms(any(), any(), any()) } returns
            ApiResult.Error("AI service API key is invalid or expired. Please contact support.", code = "AI_KEY_INVALID")

        viewModel.onSymptomsChanged("fever, chills, and severe body ache for two days")
        viewModel.analyzeSymptoms()
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.isLoading).isFalse()
        assertThat(state.diagnosis).isNull()
        assertThat(state.errorMessage).isEqualTo("AI service API key is invalid or expired. Please contact support.")
    }

    @Test
    fun `resetForNewAnalysis clears symptoms and diagnosis`() = runTest {
        coEvery { analysisRepository.analyzeSymptoms(any(), any(), any()) } returns ApiResult.Success(fakeDiagnosis)
        viewModel.onSymptomsChanged("fever, chills, and severe body ache for two days")
        viewModel.analyzeSymptoms()
        advanceUntilIdle()

        viewModel.resetForNewAnalysis()

        val state = viewModel.uiState.value
        assertThat(state.symptoms).isEmpty()
        assertThat(state.diagnosis).isNull()
    }
}
