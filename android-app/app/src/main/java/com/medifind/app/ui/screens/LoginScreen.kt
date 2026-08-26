package com.medifind.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.R
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.util.isValidEmail
import com.medifind.app.viewmodel.AuthViewModel

/**
 * Matches frontend-web's LoginPage.jsx: client-side validation runs on submit
 * only (not live per-keystroke) and blocks the API call entirely when it
 * fails — the same two rules web enforces ("Enter a valid email address." /
 * "Password is required."). Server-side errors (wrong credentials, network
 * failure, …) still surface via AuthViewModel.uiState.errorMessage exactly
 * as before.
 */
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    onNavigateToSignup: () -> Unit,
    onNavigateToForgotPassword: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    // Deliberately NOT rememberSaveable: a saved instance state is written to
    // disk, so persisting this would mean a password sitting in plain text in
    // the field after process death. It resets to hidden on recreation, which
    // is the safe default anyway.
    var passwordVisible by remember { mutableStateOf(false) }

    val uiState by authViewModel.uiState.collectAsState()
    val passwordFocus = remember { FocusRequester() }

    LaunchedEffect(uiState.actionSucceeded) {
        if (uiState.actionSucceeded) {
            authViewModel.consumeActionSucceeded()
            onLoginSuccess()
        }
    }

    fun validateAndSubmit() {
        val eError = if (!isValidEmail(email)) "Enter a valid email address." else null
        val pError = if (password.isEmpty()) "Password is required." else null
        emailError = eError
        passwordError = pError
        if (eError == null && pError == null) {
            authViewModel.login(email.trim(), password)
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
            Text(
                text = stringResource(R.string.login_title),
                style = MaterialTheme.typography.displayLarge,
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it; emailError = null; authViewModel.consumeError() },
                label = { Text(stringResource(R.string.email_label)) },
                isError = emailError != null,
                supportingText = emailError?.let { { Text(it) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
                keyboardActions = KeyboardActions(onNext = { passwordFocus.requestFocus() }),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
            )

            OutlinedTextField(
                value = password,
                onValueChange = { password = it; passwordError = null; authViewModel.consumeError() },
                label = { Text(stringResource(R.string.password_label)) },
                isError = passwordError != null,
                supportingText = passwordError?.let { { Text(it) } },
                visualTransformation = if (passwordVisible) {
                    VisualTransformation.None
                } else {
                    PasswordVisualTransformation()
                },
                trailingIcon = {
                    val description = stringResource(
                        if (passwordVisible) R.string.hide_password else R.string.show_password,
                    )
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) {
                                Icons.Filled.VisibilityOff
                            } else {
                                Icons.Filled.Visibility
                            },
                            // The label states what tapping will DO, so it has to
                            // flip with the state, not describe the icon drawn.
                            contentDescription = description,
                        )
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(onDone = { validateAndSubmit() }),
                modifier = Modifier.fillMaxWidth().focusRequester(passwordFocus),
                singleLine = true,
            )

            uiState.errorMessage?.let {
                Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }

            Button(
                onClick = { validateAndSubmit() },
                enabled = !uiState.isLoading,
                modifier = Modifier.fillMaxWidth(),
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.height(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                    )
                } else {
                    Text(stringResource(R.string.login_button))
                }
            }

            TextButton(
                onClick = onNavigateToForgotPassword,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Forgot password?")
            }

            TextButton(
                onClick = onNavigateToSignup,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(stringResource(R.string.no_account))
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 8.dp))
        }
    }
}
