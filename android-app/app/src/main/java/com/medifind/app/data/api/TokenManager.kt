package com.medifind.app.data.api

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Stores the JWT in EncryptedSharedPreferences (AES-256-GCM, key held in the
 * Android Keystore). Mirrors the web app's localStorage token cache
 * (frontend-web/src/api/client.js) but backed by hardware-secured storage
 * instead, since there is no HttpOnly-cookie option on native Android.
 */
@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext context: Context,
) {
    private val prefs: SharedPreferences by lazy {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        EncryptedSharedPreferences.create(
            context,
            PREFS_NAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    }

    // In-memory cache mirrors the web client's `_cachedToken` pattern — avoids
    // hitting encrypted prefs (which does real crypto work) on every request.
    @Volatile
    private var cachedToken: String? = null
    private var isLoaded = false

    // Observed by NavGraph/AuthViewModel so the UI reacts immediately to
    // login/logout/session-expiry (e.g. a 401 clearing the token mid-session)
    // without every screen having to poll getToken() itself.
    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedInFlow: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    @Synchronized
    fun getToken(): String? {
        if (!isLoaded) {
            cachedToken = prefs.getString(KEY_TOKEN, null)
            isLoaded = true
            _isLoggedIn.value = !cachedToken.isNullOrBlank()
        }
        return cachedToken
    }

    @Synchronized
    fun saveToken(token: String) {
        cachedToken = token
        isLoaded = true
        prefs.edit().putString(KEY_TOKEN, token).apply()
        _isLoggedIn.value = true
    }

    @Synchronized
    fun clearToken() {
        cachedToken = null
        isLoaded = true
        prefs.edit().remove(KEY_TOKEN).apply()
        _isLoggedIn.value = false
    }

    fun isLoggedIn(): Boolean = !getToken().isNullOrBlank()

    private companion object {
        const val PREFS_NAME = "medifind_secure_prefs"
        const val KEY_TOKEN = "auth_token"
    }
}
