package com.medifind.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.data.repository.HistoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class HomeDashboardUiState(
    val total: Int = 0,
    val recent: List<AnalysisEntity> = emptyList(),
)

/**
 * Backs HomeScreen's dashboard stage (greeting + stats + recent analyses) —
 * matches frontend-web's HomePage.jsx Dashboard component, which shows a
 * local count immediately and then overwrites it with a small
 * `GET /api/history?limit=3` once the network responds. Kept separate from
 * HistoryViewModel (which paginates the full list at limit=20) so Home's
 * small "last 3" refresh never interferes with History's own pagination
 * cursor.
 */
@HiltViewModel
class HomeDashboardViewModel @Inject constructor(
    private val historyRepository: HistoryRepository,
) : ViewModel() {

    // Room is the single source of truth for the UI, same pattern as
    // HistoryViewModel — refresh() below just keeps it populated/fresh.
    val uiState: StateFlow<HomeDashboardUiState> = historyRepository.observeLocalHistory()
        .map { HomeDashboardUiState(total = it.size, recent = it.take(3)) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HomeDashboardUiState())

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            // Best-effort — Room's already-cached rows (if any) still render
            // via `uiState` above even if this call fails offline.
            historyRepository.refreshHistory(cursor = null, limit = 3)
        }
    }
}
