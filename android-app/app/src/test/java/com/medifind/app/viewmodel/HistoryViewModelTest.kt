package com.medifind.app.viewmodel

import com.google.common.truth.Truth.assertThat
import com.medifind.app.MainDispatcherRule
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.HistoryListResponse
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.data.repository.HistoryRepository
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class HistoryViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val historyRepository: HistoryRepository = mockk()
    private lateinit var viewModel: HistoryViewModel

    private val localRows = MutableStateFlow(
        listOf(
            fakeEntity("a1"),
            fakeEntity("a2"),
        ),
    )

    private fun fakeEntity(id: String) = AnalysisEntity(
        id = id,
        userId = "u1",
        symptoms = "fever for two days",
        disease = "Viral Fever",
        specialty = "general physician",
        severity = "mild",
        urgency = "self-care",
        description = "A common viral illness.",
        recommendations = emptyList(),
        redFlags = emptyList(),
        createdAt = "2026-01-01T00:00:00.000Z",
    )

    @Before
    fun setup() {
        every { historyRepository.observeLocalHistory() } returns localRows
        coEvery { historyRepository.refreshHistory(cursor = null, limit = 20) } returns
            ApiResult.Success(HistoryListResponse(analyses = emptyList(), nextCursor = null, hasMore = false))
        viewModel = HistoryViewModel(historyRepository)
    }

    @Test
    fun `deleteFromList removes the row via the repository and reports errors on the list state`() = runTest {
        coEvery { historyRepository.deleteAnalysis("a1") } returns
            ApiResult.Error("Could not delete. Try again.", code = "REQUEST_ERROR")

        viewModel.deleteFromList("a1")
        advanceUntilIdle()

        assertThat(viewModel.listUiState.value.errorMessage).isEqualTo("Could not delete. Try again.")
    }

    @Test
    fun `clearAll passes every currently listed id to the repository`() = runTest {
        val idsSlot = slot<List<String>>()
        coEvery { historyRepository.clearAllHistory(capture(idsSlot)) } returns ApiResult.Success(Unit)

        // historyItems is a WhileSubscribed StateFlow — it only reflects the
        // repository's Flow while something is actively collecting it (exactly
        // like HistoryScreen's collectAsState() does in production). Without a
        // subscriber here it would sit at its initial emptyList() forever, so
        // clearAll() would see zero ids — keep it "hot" for this test the same
        // way the UI does.
        backgroundScope.launch { viewModel.historyItems.collect {} }
        advanceUntilIdle()

        viewModel.clearAll()
        advanceUntilIdle()

        assertThat(idsSlot.captured).containsExactly("a1", "a2")
        assertThat(viewModel.listUiState.value.isClearing).isFalse()
        assertThat(viewModel.listUiState.value.errorMessage).isNull()
    }

    @Test
    fun `clearAll surfaces a partial-failure message without crashing`() = runTest {
        coEvery { historyRepository.clearAllHistory(any()) } returns
            ApiResult.Error("Some analyses could not be deleted from the server, but local history was cleared.")

        viewModel.clearAll()
        advanceUntilIdle()

        assertThat(viewModel.listUiState.value.isClearing).isFalse()
        assertThat(viewModel.listUiState.value.errorMessage).isNotNull()
    }
}
