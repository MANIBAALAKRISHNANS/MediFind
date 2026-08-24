package com.medifind.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.util.isValidEmail
import com.medifind.app.ui.util.sendEmail
import com.medifind.app.viewmodel.AuthViewModel

/**
 * Matches frontend-web's ForgotPasswordPage.jsx exactly: a single email
 * field that always resolves to the same generic "if an account exists…"
 * confirmation (the backend never reveals whether the address is
 * registered) — this screen never sees a reset token itself. Continuing the
 * reset (the emailed link) is handled by ResetPasswordScreen, normally
 * reached via the App Link declared in AndroidManifest.xml; see that
 * screen's doc comment for the manual-entry fallback when the link can't be
 * intercepted by the app.
 */
@Composable
fun ForgotPasswordScreen(
    onDone: () -> Unit,
    onHaveAResetCode: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    var email by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf<String?>(null) }
    var sent by remember { mutableStateOf(false) }

    val uiState by authViewModel.uiState.collectAsState()

    LaunchedEffect(uiState.actionSucceeded) {
        if (uiState.actionSucceeded) {
            authViewModel.consumeActionSucceeded()
            sent = true
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
            Text("Reset your password", style = MaterialTheme.typography.displayLarge)

            if (sent) {
                // ── Confirmation state — mirrors ForgotPasswordPage.jsx's "sent" branch ──
                Column(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF16A34A),
                        modifier = Modifier.size(48.dp),
                    )
                    Text(
                        "If an account exists for",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                    Text(
                        email.trim(),
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                    )
                    Text(
                        "we've sent a password reset link to that inbox. Open it on this device to set a new password — the link expires in 1 hour.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 4.dp, bottom = 8.dp),
                    )
                }
            } else {
                // ── Form state — mirrors ForgotPasswordPage.jsx's default branch ──
                Text(
                    "Enter your email address and we'll send you a link to reset your password.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it; emailError = null; authViewModel.consumeError() },
                    label = { Text("Email Address") },
                    isError = emailError != null,
                    supportingText = emailError?.let { { Text(it) } },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )

                uiState.errorMessage?.let {
                    Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }

                Button(
                    onClick = {
                        if (!isValidEmail(email)) {
                            emailError = "Enter a valid email address."
                        } else {
                            emailError = null
                            authViewModel.forgotPassword(email.trim())
                        }
                    },
                    enabled = !uiState.isLoading,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (uiState.isLoading) {
                        CircularProgressIndicator(modifier = Modifier.height(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                    } else {
                        Text("Send Reset Link")
                    }
                }

                TextButton(onClick = onHaveAResetCode, modifier = Modifier.fillMaxWidth()) {
                    Text("Already have a reset link or code?")
                }

                TextButton(
                    onClick = { sendEmail(context, "medifindofficial@gmail.com") },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Need help? medifindofficial@gmail.com")
                }
            }

            TextButton(onClick = onDone, modifier = Modifier.fillMaxWidth()) {
                Text("← Back to Sign In")
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 8.dp))
        }
    }
}
