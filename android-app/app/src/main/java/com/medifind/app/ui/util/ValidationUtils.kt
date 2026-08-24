package com.medifind.app.ui.util

/**
 * Shared client-side validation rules — kept pure Kotlin (no Android/Compose
 * dependency) so they're trivially unit-testable and reusable across every
 * auth screen, mirroring the small per-file helpers in frontend-web's auth
 * pages (LoginPage.jsx / SignupPage.jsx / ForgotPasswordPage.jsx /
 * ResetPasswordPage.jsx) but centralised instead of duplicated four times.
 */
private val EMAIL_REGEX = Regex("""^[^\s@]+@[^\s@]+\.[^\s@]+$""")

/** Mirrors frontend-web's `EMAIL_RE` — used to validate every email field before submit. */
fun isValidEmail(email: String): Boolean = EMAIL_REGEX.matches(email.trim())

/**
 * 0–4 password strength score — mirrors frontend-web's `calcStrength()`
 * (SignupPage.jsx, reused verbatim by ResetPasswordPage.jsx): +1 each for
 * length >= 8, contains a letter, contains a digit, contains a
 * non-alphanumeric character.
 */
fun passwordStrength(password: String): Int {
    var score = 0
    if (password.length >= 8) score++
    if (password.any { it.isLetter() }) score++
    if (password.any { it.isDigit() }) score++
    if (password.any { !it.isLetterOrDigit() }) score++
    return score
}

/**
 * True once the password meets the app-wide minimum (score >= 2) — the same
 * threshold frontend-web enforces before allowing Signup / Reset Password to
 * submit ("at least 8 chars, 1 letter, 1 number" reliably scores >= 2).
 */
fun isPasswordStrongEnough(password: String): Boolean = passwordStrength(password) >= 2

/** "" / "Weak" / "Medium" / "Strong" / "Strong" for score 0..4 — matches SignupPage.jsx's STRENGTH_LABEL. */
fun passwordStrengthLabel(score: Int): String = when (score) {
    1 -> "Weak"
    2 -> "Medium"
    3, 4 -> "Strong"
    else -> ""
}
