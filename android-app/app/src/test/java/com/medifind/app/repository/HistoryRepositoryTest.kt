package com.medifind.app.repository

import android.content.Context
import com.google.common.truth.Truth.assertThat
import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.models.AnalysisRecord
import com.medifind.app.data.api.models.DeleteHistoryResponse
import com.medifind.app.data.local.AnalysisDao
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.data.repository.HistoryRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Test

class HistoryRepositoryTest {

    private val api: MediFindApi = mockk()
    private val executor: ApiCallExecutor = mockk()
    private val analysisDao: AnalysisDao = mockk(relaxUnitFun = true)
    private val context: Context = mockk(relaxed = true)

    private lateinit var repository: HistoryRepository

    private val fakeRecord = AnalysisRecord(
        id = "analysis-1",
        userId = "u1",
        symptoms = "fever and chills for two days",
        disease = "Viral Fever",
        specialty = "general physician",
        severity = "mild",
        urgency = "self-care",
        description = "A common viral illness.",
        createdAt = "2026-01-01T00:00:00.000Z",
    )

    @Before
    fun setup() {
        repository = HistoryRepository(api, executor, analysisDao, context)
    }

    @Test
    fun `clearAllHistory deletes every id and always clears Room even when some deletes fail`() = runTest {
        coEvery { executor.execute<DeleteHistoryResponse>(any()) } returnsMany listOf(
            ApiResult.Success(DeleteHistoryResponse("deleted")),
            ApiResult.Error("Not found.", code = "NOT_FOUND", httpStatus = 404),
        )

        val result = repository.clearAllHistory(listOf("a1", "a2"))

        coVerify(exactly = 2) { executor.execute<DeleteHistoryResponse>(any()) }
        coVerify(exactly = 1) { analysisDao.clearAll() }
        assertThat(result).isInstanceOf(ApiResult.Error::class.java)
    }

    @Test
    fun `clearAllHistory succeeds when every server delete succeeds`() = runTest {
        coEvery { executor.execute<DeleteHistoryResponse>(any()) } returns
            ApiResult.Success(DeleteHistoryResponse("deleted"))

        val result = repository.clearAllHistory(listOf("a1", "a2", "a3"))

        coVerify(exactly = 3) { executor.execute<DeleteHistoryResponse>(any()) }
        coVerify(exactly = 1) { analysisDao.clearAll() }
        assertThat(result).isInstanceOf(ApiResult.Success::class.java)
    }

    @Test
    fun `clearAllHistory with no ids still clears the local cache`() = runTest {
        val result = repository.clearAllHistory(emptyList())

        coVerify(exactly = 0) { executor.execute<DeleteHistoryResponse>(any()) }
        coVerify(exactly = 1) { analysisDao.clearAll() }
        assertThat(result).isInstanceOf(ApiResult.Success::class.java)
    }

    @Test
    fun `getAnalysis falls back to the Room cache when the network call fails`() = runTest {
        coEvery { executor.execute<AnalysisRecord>(any()) } returns
            ApiResult.Error("Unable to connect to the server.", code = "NETWORK_ERROR")
        coEvery { analysisDao.getById("analysis-1") } returns AnalysisEntity.fromAnalysisRecord(fakeRecord)

        val result = repository.getAnalysis("analysis-1")

        assertThat(result).isInstanceOf(ApiResult.Success::class.java)
        assertThat((result as ApiResult.Success).data.disease).isEqualTo("Viral Fever")
    }

    @Test
    fun `getAnalysis surfaces the network error when nothing is cached either`() = runTest {
        coEvery { executor.execute<AnalysisRecord>(any()) } returns
            ApiResult.Error("Unable to connect to the server.", code = "NETWORK_ERROR")
        coEvery { analysisDao.getById("missing-id") } returns null

        val result = repository.getAnalysis("missing-id")

        assertThat(result).isInstanceOf(ApiResult.Error::class.java)
    }
}
