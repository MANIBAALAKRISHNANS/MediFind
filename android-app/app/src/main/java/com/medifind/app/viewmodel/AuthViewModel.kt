package com.medifind.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.UserResponse
import com.medifind.app.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AuthUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val infoMessage: String? = null,
    val actionSucceeded: Boolean = false,
    // ── Change-Password (Profile screen) — deliberately separate from the
    // fields above. Profile's "Change Password" row reuses this same
    // forgotPassword() API call but, unlike the standalone Forgot Password
    // screen, it fires inline without navigating away — sharing isLoading/
    // errorMessage/actionSucceeded with it would make an in-flight Change
    // Password request also disable/blank the unrelated Save Changes button
    // and its error banner on the same screen. Mirrors ProfilePage.jsx on
    // the web, which keeps its own local `sendingReset` state completely
    // separate from EditProfilePage's error state (a different route there).
    val isSendingPasswordReset: Boolean = false,
    val passwordResetMessage: String? = null,
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
) : ViewModel() {

    val isLoggedIn: StateFlow<Boolean> = authRepository.isLoggedIn
    val currentUser: StateFlow<UserResponse?> = authRepository.currentUser

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private val _isBootstrapping = MutableStateFlow(true)
    val isBootstrapping: StateFlow<Boolean> = _isBootstrapping.asStateFlow()

    init {
        bootstrapSession()
    }

    /** Runs once on app start — restores the session if a stored token is still valid. */
    private fun bootstrapSession() {
        viewModelScope.launch {
            authRepository.loadUser()
            _isBootstrapping.value = false
        }
    }

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter both email and password.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = authRepository.login(email.trim(), password)) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, actionSucceeded = true) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    fun signup(name: String, email: String, password: String) {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please fill in every field.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = authRepository.signup(name.trim(), email.trim(), password)) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, actionSucceeded = true) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    fun forgotPassword(email: String) {
        if (email.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter your email.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, infoMessage = null) }
            when (val result = authRepository.forgotPassword(email.trim())) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, infoMessage = result.data, actionSucceeded = true) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    fun resetPassword(email: String, token: String, newPassword: String) {
        if (token.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Enter the reset code from your email.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, infoMessage = null) }
            when (val result = authRepository.resetPassword(email.trim(), token.trim(), newPassword)) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, infoMessage = result.data, actionSucceeded = true) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    fun updateProfile(name: String, email: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = authRepository.updateProfile(name.trim(), email.trim())) {
                is ApiResult.Success ->
                    _uiState.update { it.copy(isLoading = false, actionSucceeded = true) }
                is ApiResult.Error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }

    /**
     * "Change Password" on Profile — reuses POST /api/auth/forgot-password
     * with the logged-in user's own email, exactly like ProfilePage.jsx's
     * handleChangePassword(): a single tap, no navigation, no email to type.
     */
    fun sendPasswordResetForCurrentUser() {
        val email = currentUser.value?.email
        if (email.isNullOrBlank()) return
        viewModelScope.launch {
            _uiState.update { it.copy(isSendingPasswordReset = true, passwordResetMessage = null) }
            when (authRepository.forgotPassword(email)) {
                is ApiResult.Success -> _uiState.update {
                    it.copy(isSendingPasswordReset = false, passwordResetMessage = "Password reset link sent to your email!")
                }
                is ApiResult.Error -> _uiState.update {
                    it.copy(isSendingPasswordReset = false, passwordResetMessage = "Could not send reset email. Try again.")
                }
            }
        }
    }

    fun consumePasswordResetMessage() {
        _uiState.update { it.copy(passwordResetMessage = null) }
    }

    fun consumeError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    fun consumeActionSucceeded() {
        _uiState.update { it.copy(actionSucceeded = false) }
    }
}
