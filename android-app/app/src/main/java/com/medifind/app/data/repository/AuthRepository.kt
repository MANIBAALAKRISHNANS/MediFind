package com.medifind.app.data.repository

import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.TokenManager
import com.medifind.app.data.api.models.ForgotPasswordRequest
import com.medifind.app.data.api.models.LoginRequest
import com.medifind.app.data.api.models.ResetPasswordRequest
import com.medifind.app.data.api.models.SignupRequest
import com.medifind.app.data.api.models.UpdateProfileRequest
import com.medifind.app.data.api.models.UserResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Mirrors frontend-web/src/store/authStore.js — owns the session (token +
 * current user) and every auth API call. ViewModels never touch
 * MediFindApi or TokenManager directly.
 */
@Singleton
class AuthRepository @Inject constructor(
    private val api: MediFindApi,
    private val tokenManager: TokenManager,
    private val executor: ApiCallExecutor,
) {
    val isLoggedIn: StateFlow<Boolean> = tokenManager.isLoggedInFlow

    private val _currentUser = MutableStateFlow<UserResponse?>(null)
    val currentUser: StateFlow<UserResponse?> = _currentUser.asStateFlow()

    suspend fun signup(name: String, email: String, password: String): ApiResult<UserResponse> {
        val result = executor.execute { api.signup(SignupRequest(name, email, password)) }
        return when (result) {
            is ApiResult.Success -> {
                tokenManager.saveToken(result.data.token)
                _currentUser.value = result.data.user
                ApiResult.Success(result.data.user)
            }
            is ApiResult.Error -> result
        }
    }

    suspend fun login(email: String, password: String): ApiResult<UserResponse> {
        val result = executor.execute { api.login(LoginRequest(email, password)) }
        return when (result) {
            is ApiResult.Success -> {
                tokenManager.saveToken(result.data.token)
                _currentUser.value = result.data.user
                ApiResult.Success(result.data.user)
            }
            is ApiResult.Error -> result
        }
    }

    suspend fun forgotPassword(email: String): ApiResult<String> {
        val result = executor.execute { api.forgotPassword(ForgotPasswordRequest(email)) }
        return when (result) {
            is ApiResult.Success -> ApiResult.Success(result.data.message)
            is ApiResult.Error -> result
        }
    }

    suspend fun resetPassword(email: String, token: String, newPassword: String): ApiResult<String> {
        val result = executor.execute { api.resetPassword(ResetPasswordRequest(email, token, newPassword)) }
        return when (result) {
            is ApiResult.Success -> ApiResult.Success(result.data.message)
            is ApiResult.Error -> result
        }
    }

    suspend fun updateProfile(name: String, email: String): ApiResult<UserResponse> {
        val result = executor.execute { api.updateProfile(UpdateProfileRequest(name, email)) }
        if (result is ApiResult.Success) {
            _currentUser.value = result.data
        }
        return result
    }

    /**
     * Bootstraps the session on app start — equivalent to authStore.loadUser().
     * If a token is stored but /api/auth/me rejects it (expired/invalid), the
     * token is cleared so the nav graph routes to Login.
     */
    suspend fun loadUser(): ApiResult<UserResponse>? {
        if (!tokenManager.isLoggedIn()) return null

        val result = executor.execute { api.getCurrentUser() }
        when (result) {
            is ApiResult.Success -> _currentUser.value = result.data
            is ApiResult.Error -> {
                tokenManager.clearToken()
                _currentUser.value = null
            }
        }
        return result
    }

    /** Tells the server to clear the HttpOnly cookie side (harmless no-op for Bearer clients),
     * then always clears local session state — network failure here must never block logout. */
    suspend fun logout() {
        try {
            executor.execute { api.logout() }
        } finally {
            tokenManager.clearToken()
            _currentUser.value = null
        }
    }
}
