package com.medifind.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.data.repository.AnalysisRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

private const val MIN_SYMPTOM_LENGTH = 10

// The backend accepts up to 2000 chars (see backend/routes/analyze.js), but
// frontend-web's SymptomInput.jsx hard-caps the textarea at 1000 — matched
// here (and in ui/components/SymptomInputField.kt's live counter) so the two
// clients enforce the same limit rather than Android silently allowing twice
// as much text through.
private const val MAX_SYMPTOM_LENGTH = 1000

data class AnalysisUiState(
    val symptoms: String = "",
    val isLoading: Boolean = false,
    val diagnosis: AnalysisResponse? = null,
    // The real backend error.message (see backend/routes/analyze.js) — never a
    // generic "AI busy" placeholder.
    val errorMessage: String? = null,
)

@HiltViewModel
class AnalysisViewModel @Inject constructor(
    private val analysisRepository: AnalysisRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AnalysisUiState())
    val uiState: StateFlow<AnalysisUiState> = _uiState.asStateFlow()

    fun onSymptomsChanged(text: String) {
        _uiState.update { it.copy(symptoms = text, errorMessage = null) }
    }

    fun analyzeSymptoms(age: Int? = null, gender: String? = null) {
        val trimmed = _uiState.value.symptoms.trim()

        if (trimmed.length < MIN_SYMPTOM_LENGTH || trimmed.length > MAX_SYMPTOM_LENGTH) {
            _uiState.update {
                it.copy(errorMessage = "Symptoms must be between $MIN_SYMPTOM_LENGTH and $MAX_SYMPTOM_LENGTH characters.")
            }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, diagnosis = null) }
            when (val result = analysisRepository.analyzeSymptoms(trimmed, age, gender)) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, diagnosis = result.data) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    /** Resets diagnosis + symptoms so the user can start a fresh analysis. */
    fun resetForNewAnalysis() {
        _uiState.value = AnalysisUiState()
    }

    fun consumeError() {
        _uiState.update { it.copy(errorMessage = null) }
    }
}
