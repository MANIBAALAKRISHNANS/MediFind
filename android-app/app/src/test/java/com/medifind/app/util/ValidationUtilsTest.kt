package com.medifind.app.util

import com.google.common.truth.Truth.assertThat
import com.medifind.app.ui.util.isPasswordStrongEnough
import com.medifind.app.ui.util.isValidEmail
import com.medifind.app.ui.util.passwordStrength
import com.medifind.app.ui.util.passwordStrengthLabel
import org.junit.Test

/**
 * Mirrors the assertions frontend-web makes about its own EMAIL_RE /
 * calcStrength() (SignupPage.jsx, ResetPasswordPage.jsx) — same inputs,
 * same expected scores, so the two clients agree on what counts as valid.
 */
class ValidationUtilsTest {

    @Test
    fun `valid emails pass`() {
        assertThat(isValidEmail("asha@example.com")).isTrue()
        assertThat(isValidEmail("  asha@example.com  ")).isTrue()
        assertThat(isValidEmail("a.b+c@sub.example.co.in")).isTrue()
    }

    @Test
    fun `invalid emails fail`() {
        assertThat(isValidEmail("")).isFalse()
        assertThat(isValidEmail("asha")).isFalse()
        assertThat(isValidEmail("asha@")).isFalse()
        assertThat(isValidEmail("asha@example")).isFalse()
        assertThat(isValidEmail("asha example@example.com")).isFalse()
    }

    @Test
    fun `password strength scores each criterion independently`() {
        assertThat(passwordStrength("")).isEqualTo(0)
        assertThat(passwordStrength("abcdefg")).isEqualTo(1) // letters only, < 8 chars
        assertThat(passwordStrength("abcdefgh")).isEqualTo(2) // >=8 chars + letters, no digit
        assertThat(passwordStrength("abcdefg1")).isEqualTo(3) // >=8 chars + letter + digit
        assertThat(passwordStrength("abcdefg1!")).isEqualTo(4) // all four criteria
    }

    @Test
    fun `strong-enough threshold matches the web app's minimum (score greater than or equal to 2)`() {
        assertThat(isPasswordStrongEnough("abcdefgh")).isTrue() // score 2
        assertThat(isPasswordStrongEnough("abcdefg")).isFalse() // score 1
        assertThat(isPasswordStrongEnough("")).isFalse()
    }

    @Test
    fun `strength labels match SignupPage's STRENGTH_LABEL`() {
        assertThat(passwordStrengthLabel(0)).isEqualTo("")
        assertThat(passwordStrengthLabel(1)).isEqualTo("Weak")
        assertThat(passwordStrengthLabel(2)).isEqualTo("Medium")
        assertThat(passwordStrengthLabel(3)).isEqualTo("Strong")
        assertThat(passwordStrengthLabel(4)).isEqualTo("Strong")
    }
}
