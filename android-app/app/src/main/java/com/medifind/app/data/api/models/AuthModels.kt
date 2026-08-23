package com.medifind.app.data.api.models

import com.squareup.moshi.JsonClass

/** POST /api/auth/signup body. See backend/routes/auth.js signupSchema. */
@JsonClass(generateAdapter = true)
data class SignupRequest(
    val name: String,
    val email: String,
    val password: String,
)

/** POST /api/auth/login body. */
@JsonClass(generateAdapter = true)
data class LoginRequest(
    val email: String,
    val password: String,
)

/** POST /api/auth/forgot-password body. */
@JsonClass(generateAdapter = true)
data class ForgotPasswordRequest(
    val email: String,
)

/**
 * POST /api/auth/reset-password body. `token` is the raw (unhashed) token
 * emailed to the user — the backend hashes it and matches against the
 * hashed value stored on the User row. A reset is rejected without it.
 */
@JsonClass(generateAdapter = true)
data class ResetPasswordRequest(
    val email: String,
    val token: String,
    val newPassword: String,
)

/** PUT /api/auth/profile body. */
@JsonClass(generateAdapter = true)
data class UpdateProfileRequest(
    val name: String,
    val email: String,
)

/**
 * The "safe user" shape returned by backend/utils/userSafe.js — password,
 * resetToken and resetTokenExpires are stripped server-side before this is sent.
 */
@JsonClass(generateAdapter = true)
data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val createdAt: String? = null,
    val updatedAt: String? = null,
)

/** Response body for signup/login: { user, token }. */
@JsonClass(generateAdapter = true)
data class TokenResponse(
    val user: UserResponse,
    val token: String,
)

/** Generic { message } response — forgot-password, reset-password, logout. */
@JsonClass(generateAdapter = true)
data class MessageResponse(
    val message: String,
)
