package com.medifind.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.util.isPasswordStrongEnough
import com.medifind.app.viewmodel.AuthViewModel

/** Accepts either a bare hex token or a full "…/reset-password?token=…&email=…" link/paste. */
private fun extractToken(input: String): String {
    val match = Regex("""[?&]token=([a-f0-9]+)""", RegexOption.IGNORE_CASE).find(input)
    return match?.groupValues?.get(1) ?: input.trim()
}

private fun extractEmail(input: String): String? {
    val match = Regex("""[?&]email=([^&\s]+)""", RegexOption.IGNORE_CASE).find(input)
    return match?.groupValues?.get(1)?.let { java.net.URLDecoder.decode(it, "UTF-8") }
}

/**
 * Matches frontend-web's ResetPasswordPage.jsx: reads `token` + `email` from
 * the entry point (there, a URL query string; here, either the App Link
 * declared in AndroidManifest.xml — see NavGraph.kt's `Routes.RESET_PASSWORD`
 * deep link — or the manual-paste fallback below), shows the same
 * "Resetting password for {email}" line, New Password + Confirm Password
 * fields with a live match indicator, and disables Reset until the password
 * meets the strength floor AND both fields match — identical to web.
 *
 * DECISION — manual-paste fallback instead of a bare "invalid link" dead end:
 * unlike the web app (any browser opening the emailed link always lands on
 * a working page), Android's App Link is only silently promoted to
 * "open directly in this app" once the backend publishes
 * /.well-known/assetlinks.json with this app's release signing certificate
 * fingerprint — a server-side change outside this module, tracked in
 * android-app/README.md. Until that's done (or on any device where the user
 * opens the email in a different browser/device than the one with the app),
 * the OS still offers "MediFind" as a chooser for the link, but a cold
 * install or a declined chooser means this screen can be reached without
 * `token`/`email` set. Rather than dead-ending exactly like a strict web
 * port would (the emailed link always works there because it's just a
 * webpage), we let the user paste the link/code by hand — the same
 * degraded-but-working path the previous single-screen ForgotPasswordScreen
 * already offered, just relocated here to match the web route split 1:1.
 */
@Composable
fun ResetPasswordScreen(
    token: String?,
    email: String?,
    onResetComplete: () -> Unit,
    onRequestNewLink: () -> Unit,
    onBackToSignIn: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    var resolvedToken by remember(token) { mutableStateOf(token?.takeIf { it.isNotBlank() }) }
    var resolvedEmail by remember(email) { mutableStateOf(email?.takeIf { it.isNotBlank() }) }
    var pasteInput by remember { mutableStateOf("") }

    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var confirmError by remember { mutableStateOf<String?>(null) }

    val uiState by authViewModel.uiState.collectAsState()

    LaunchedEffect(uiState.actionSucceeded) {
        if (uiState.actionSucceeded) {
            authViewModel.consumeActionSucceeded()
            onResetComplete()
        }
    }

    // Mirrors ResetPasswordPage.jsx's expired/invalid detection: redirect back
    // to "request a new link" instead of leaving a dead error banner up.
    LaunchedEffect(uiState.errorMessage) {
        val msg = uiState.errorMessage?.lowercase() ?: return@LaunchedEffect
        if (msg.contains("expired") || msg.contains("invalid")) {
            authViewModel.consumeError()
            onRequestNewLink()
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
            Text("Set new password", style = MaterialTheme.typography.displayLarge)

            if (resolvedToken == null || resolvedEmail == null) {
                // ── Guard state — mirrors the web page's "Invalid link" branch ──
                Column(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Icon(
                        Icons.Default.Error,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.error,
                        modifier = Modifier.size(48.dp),
                    )
                    Text(
                        "This reset link is invalid or missing required parameters. Please request a new one, or paste your reset link/code below.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                }

                OutlinedTextField(
                    value = pasteInput,
                    onValueChange = { pasteInput = it },
                    label = { Text("Reset link or code") },
                    supportingText = { Text("Paste the emailed link, or just its code") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )
                Button(
                    onClick = {
                        resolvedToken = extractToken(pasteInput).takeIf { it.isNotBlank() }
                        resolvedEmail = extractEmail(pasteInput) ?: resolvedEmail
                    },
                    enabled = pasteInput.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Continue") }

                Button(onClick = onRequestNewLink, modifier = Modifier.fillMaxWidth()) {
                    Text("Request New Link")
                }
                TextButton(onClick = onBackToSignIn, modifier = Modifier.fillMaxWidth()) {
                    Text("Back to Sign In")
                }
            } else {
                Text(
                    "Resetting password for ${resolvedEmail}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )

                OutlinedTextField(
                    value = newPassword,
                    onValueChange = { newPassword = it; passwordError = null; authViewModel.consumeError() },
                    label = { Text("New Password") },
                    isError = passwordError != null,
                    supportingText = passwordError?.let { { Text(it) } } ?: { Text("Min. 8 characters") },
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )

                Column {
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it; confirmError = null; authViewModel.consumeError() },
                        label = { Text("Confirm Password") },
                        isError = confirmError != null,
                        supportingText = confirmError?.let { { Text(it) } },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                    if (confirmPassword.isNotEmpty()) {
                        val match = newPassword == confirmPassword
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(top = 4.dp),
                        ) {
                            Icon(
                                if (match) Icons.Default.CheckCircle else Icons.Default.Error,
                                contentDescription = null,
                                tint = if (match) Color(0xFF16A34A) else MaterialTheme.colorScheme.error,
                                modifier = Modifier.size(14.dp),
                            )
                            Text(
                                if (match) "Passwords match" else "Passwords don't match",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (match) Color(0xFF16A34A) else MaterialTheme.colorScheme.error,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(start = 4.dp),
                            )
                        }
                    }
                }

                uiState.errorMessage?.let {
                    Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }

                val canSubmit = isPasswordStrongEnough(newPassword) &&
                    newPassword == confirmPassword &&
                    confirmPassword.isNotEmpty()

                Button(
                    onClick = {
                        passwordError = if (!isPasswordStrongEnough(newPassword)) {
                            "Password must be at least 8 chars with a letter and number."
                        } else {
                            null
                        }
                        confirmError = if (newPassword != confirmPassword) "Passwords do not match." else null
                        if (passwordError == null && confirmError == null) {
                            authViewModel.resetPassword(resolvedEmail!!, resolvedToken!!, newPassword)
                        }
                    },
                    enabled = !uiState.isLoading && canSubmit,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (uiState.isLoading) {
                        CircularProgressIndicator(modifier = Modifier.height(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                    } else {
                        Text("Reset Password")
                    }
                }

                TextButton(onClick = onBackToSignIn, modifier = Modifier.fillMaxWidth()) {
                    Text("← Back to Sign In")
                }
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 8.dp))
        }
    }
}
