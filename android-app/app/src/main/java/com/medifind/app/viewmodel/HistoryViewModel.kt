package com.medifind.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.AnalysisRecord
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.data.repository.HistoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import java.io.File
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class HistoryListUiState(
    val isRefreshing: Boolean = false,
    val isLoadingMore: Boolean = false,
    val hasMore: Boolean = true,
    val errorMessage: String? = null,
)

data class HistoryDetailUiState(
    val isLoading: Boolean = false,
    val analysis: AnalysisRecord? = null,
    val errorMessage: String? = null,
    val isDownloadingPdf: Boolean = false,
    val downloadedPdf: File? = null,
)

@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val historyRepository: HistoryRepository,
) : ViewModel() {

    // Offline-first list: Room is the single source of truth for the UI list;
    // refresh()/loadMore() pull from the server and upsert into Room, which
    // then flows back out through this StateFlow automatically.
    val historyItems: StateFlow<List<AnalysisEntity>> = historyRepository.observeLocalHistory()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    private val _listUiState = MutableStateFlow(HistoryListUiState())
    val listUiState: StateFlow<HistoryListUiState> = _listUiState.asStateFlow()

    private val _detailUiState = MutableStateFlow(HistoryDetailUiState())
    val detailUiState: StateFlow<HistoryDetailUiState> = _detailUiState.asStateFlow()

    private var nextCursor: String? = null

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _listUiState.update { it.copy(isRefreshing = true, errorMessage = null) }
            when (val result = historyRepository.refreshHistory(cursor = null, limit = PAGE_SIZE)) {
                is ApiResult.Success -> {
                    nextCursor = result.data.nextCursor
                    _listUiState.update { it.copy(isRefreshing = false, hasMore = result.data.hasMore) }
                }
                is ApiResult.Error -> _listUiState.update {
                    // Non-fatal — Room's cached rows (via historyItems) are still shown offline.
                    it.copy(isRefreshing = false, errorMessage = result.message)
                }
            }
        }
    }

    fun loadMore() {
        val cursor = nextCursor
        if (cursor == null || _listUiState.value.isLoadingMore || !_listUiState.value.hasMore) return

        viewModelScope.launch {
            _listUiState.update { it.copy(isLoadingMore = true) }
            when (val result = historyRepository.refreshHistory(cursor = cursor, limit = PAGE_SIZE)) {
                is ApiResult.Success -> {
                    nextCursor = result.data.nextCursor
                    _listUiState.update { it.copy(isLoadingMore = false, hasMore = result.data.hasMore) }
                }
                is ApiResult.Error -> _listUiState.update {
                    it.copy(isLoadingMore = false, errorMessage = result.message)
                }
            }
        }
    }

    fun loadAnalysis(id: String) {
        viewModelScope.launch {
            _detailUiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = historyRepository.getAnalysis(id)) {
                is ApiResult.Success -> _detailUiState.update {
                    it.copy(isLoading = false, analysis = result.data)
                }
                is ApiResult.Error -> _detailUiState.update {
                    it.copy(isLoading = false, errorMessage = result.message)
                }
            }
        }
    }

    fun deleteAnalysis(id: String, onDeleted: () -> Unit) {
        viewModelScope.launch {
            when (val result = historyRepository.deleteAnalysis(id)) {
                is ApiResult.Success -> onDeleted()
                is ApiResult.Error -> _detailUiState.update { it.copy(errorMessage = result.message) }
            }
        }
    }

    /** Downloads the server PDF; DoctorResultScreen/HistoryDetailScreen fires a share/print intent once `downloadedPdf` is set. */
    fun downloadPdf(id: String) {
        viewModelScope.launch {
            _detailUiState.update { it.copy(isDownloadingPdf = true, errorMessage = null) }
            when (val result = historyRepository.downloadReportPdf(id)) {
                is ApiResult.Success -> _detailUiState.update {
                    it.copy(isDownloadingPdf = false, downloadedPdf = result.data)
                }
                is ApiResult.Error -> _detailUiState.update {
                    it.copy(isDownloadingPdf = false, errorMessage = result.message)
                }
            }
        }
    }

    fun consumePdfDownload() {
        _detailUiState.update { it.copy(downloadedPdf = null) }
    }

    fun consumeDetailError() {
        _detailUiState.update { it.copy(errorMessage = null) }
    }

    fun consumeListError() {
        _listUiState.update { it.copy(errorMessage = null) }
    }

    private companion object {
        const val PAGE_SIZE = 20
    }
}
