package com.medifind.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.viewmodel.AuthViewModel

/**
 * Two-step flow against POST /api/auth/forgot-password and
 * POST /api/auth/reset-password (see backend/routes/auth.js). The web app
 * completes the reset by opening the emailed link, which carries the reset
 * token as a URL query param; the app has no deep-link handler for that link
 * (see README for the App Links follow-up), so instead the user pastes
 * either the raw token or the whole emailed link into the "Reset Code" field
 * below — a full link is detected and the token extracted from it. The
 * backend always require this token; there is no way to reset a password
 * with just an email.
 */
@Composable
fun ForgotPasswordScreen(
    onDone: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    var email by remember { mutableStateOf("") }
    var resetCode by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var step by remember { mutableStateOf(1) }
    var resetComplete by remember { mutableStateOf(false) }

    // Accepts either a bare token or a full "…/reset-password?token=…&email=…" link.
    fun extractToken(input: String): String {
        val match = Regex("""[?&]token=([a-f0-9]+)""", RegexOption.IGNORE_CASE).find(input)
        return match?.groupValues?.get(1) ?: input.trim()
    }

    val uiState by authViewModel.uiState.collectAsState()

    LaunchedEffect(uiState.actionSucceeded) {
        if (uiState.actionSucceeded) {
            if (step == 1) step = 2 else resetComplete = true
            authViewModel.consumeActionSucceeded()
        }
    }

    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("Reset Password", style = MaterialTheme.typography.displayLarge)

            when {
                resetComplete -> {
                    Text(
                        "Your password has been reset successfully. You can now sign in.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Button(onClick = onDone, modifier = Modifier.fillMaxWidth()) {
                        Text("Back to Sign In")
                    }
                }

                step == 1 -> {
                    Text(
                        "Enter your account email to continue.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it; authViewModel.consumeError() },
                        label = { Text("Email") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )

                    uiState.errorMessage?.let {
                        Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }

                    Button(
                        onClick = { authViewModel.forgotPassword(email) },
                        enabled = !uiState.isLoading,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        if (uiState.isLoading) {
                            CircularProgressIndicator(modifier = Modifier.height(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                        } else {
                            Text("Continue")
                        }
                    }
                }

                else -> {
                    Text(
                        "Check your email for a reset link, then paste the link (or just the code from it) below along with your new password for $email.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    OutlinedTextField(
                        value = resetCode,
                        onValueChange = { resetCode = it; authViewModel.consumeError() },
                        label = { Text("Reset Code") },
                        supportingText = { Text("Paste the emailed link or just its code") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                    OutlinedTextField(
                        value = newPassword,
                        onValueChange = { newPassword = it; authViewModel.consumeError() },
                        label = { Text("New Password") },
                        supportingText = { Text("Min 8 characters, at least one letter and one number") },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )

                    uiState.errorMessage?.let {
                        Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }

                    Button(
                        onClick = { authViewModel.resetPassword(email, extractToken(resetCode), newPassword) },
                        enabled = !uiState.isLoading,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        if (uiState.isLoading) {
                            CircularProgressIndicator(modifier = Modifier.height(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                        } else {
                            Text("Reset Password")
                        }
                    }
                }
            }

            TextButton(onClick = onDone, modifier = Modifier.fillMaxWidth()) {
                Text("Cancel")
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 8.dp))
        }
    }
}
