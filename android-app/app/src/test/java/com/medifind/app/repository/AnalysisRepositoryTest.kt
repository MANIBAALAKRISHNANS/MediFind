package com.medifind.app.repository

import com.google.common.truth.Truth.assertThat
import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.data.api.models.UserResponse
import com.medifind.app.data.local.AnalysisDao
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.data.repository.AnalysisRepository
import com.medifind.app.data.repository.AuthRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Test

class AnalysisRepositoryTest {

    private val api: MediFindApi = mockk()
    private val executor: ApiCallExecutor = mockk()
    private val analysisDao: AnalysisDao = mockk(relaxUnitFun = true)
    private val authRepository: AuthRepository = mockk()

    private lateinit var repository: AnalysisRepository

    private val fakeUser = UserResponse(id = "u1", name = "Asha Rao", email = "asha@example.com")

    private val fakeDiagnosis = AnalysisResponse(
        disease = "Viral Fever",
        confidence = 65,
        differentialDiagnosis = emptyList(),
        specialty = "general physician",
        severity = "mild",
        urgency = "self-care",
        description = "A common viral illness.",
        recommendations = listOf("Rest", "Hydrate"),
        redFlags = emptyList(),
        homeCare = emptyList(),
        whenToSeekHelp = "If it persists beyond 3 days.",
        source = "local-ai",
        analysisId = "analysis-1",
    )

    @Before
    fun setup() {
        every { authRepository.currentUser } returns MutableStateFlow(fakeUser)
        repository = AnalysisRepository(api, executor, analysisDao, authRepository)
    }

    @Test
    fun `analyzeSymptoms on success caches the result in Room keyed by analysisId`() = runTest {
        coEvery { executor.execute<AnalysisResponse>(any()) } returns ApiResult.Success(fakeDiagnosis)
        val captured = slot<AnalysisEntity>()
        coEvery { analysisDao.upsert(capture(captured)) } returns Unit

        val result = repository.analyzeSymptoms("fever, chills, and body ache for two days")

        assertThat(result).isInstanceOf(ApiResult.Success::class.java)
        coVerify(exactly = 1) { analysisDao.upsert(any()) }
        assertThat(captured.captured.id).isEqualTo("analysis-1")
        assertThat(captured.captured.userId).isEqualTo("u1")
        assertThat(captured.captured.disease).isEqualTo("Viral Fever")
        assertThat(captured.captured.recommendations).containsExactly("Rest", "Hydrate")
    }

    @Test
    fun `analyzeSymptoms on failure does not write to Room and surfaces the error`() = runTest {
        coEvery { executor.execute<AnalysisResponse>(any()) } returns
            ApiResult.Error("Symptoms must be between 3 and 2000 characters.", code = "INVALID_INPUT")

        val result = repository.analyzeSymptoms("too short")

        assertThat(result).isInstanceOf(ApiResult.Error::class.java)
        assertThat((result as ApiResult.Error).message).isEqualTo("Symptoms must be between 3 and 2000 characters.")
        coVerify(exactly = 0) { analysisDao.upsert(any()) }
    }
}
