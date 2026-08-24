package com.medifind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.R
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.util.isPasswordStrongEnough
import com.medifind.app.ui.util.isValidEmail
import com.medifind.app.ui.util.passwordStrength
import com.medifind.app.ui.util.passwordStrengthLabel
import com.medifind.app.viewmodel.AuthViewModel

/** 3-segment strength meter + label — matches SignupPage.jsx's StrengthMeter. */
@Composable
private fun PasswordStrengthMeter(password: String) {
    if (password.isEmpty()) return
    val score = passwordStrength(password)
    val barColor = when (score) {
        1 -> MaterialTheme.colorScheme.error
        2 -> Color(0xFFEA580C) // matches ios-orange used on the web meter
        3, 4 -> Color(0xFF16A34A) // matches ios-green used on the web meter
        else -> MaterialTheme.colorScheme.outline
    }

    Column(modifier = Modifier.fillMaxWidth().padding(top = 6.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.fillMaxWidth()) {
            repeat(3) { index ->
                Spacer(
                    modifier = Modifier
                        .weight(1f)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(
                            if (score >= index + 1) barColor else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                        ),
                )
            }
        }
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                "At least 8 chars, 1 letter, 1 number",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (score > 0) {
                Text(
                    passwordStrengthLabel(score),
                    style = MaterialTheme.typography.labelSmall,
                    color = barColor,
                )
            }
        }
    }
}

/**
 * Matches frontend-web's SignupPage.jsx: name >= 2 chars, valid email,
 * password strength >= 2 (visualised with the same 3-bar meter), and the
 * medical-disclaimer/terms checkbox must be checked — Create Account is
 * disabled until all four hold, exactly like the web `canSubmit` formula.
 */
@Composable
fun SignupScreen(
    onSignupSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var agreed by remember { mutableStateOf(false) }

    var nameError by remember { mutableStateOf<String?>(null) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var agreedError by remember { mutableStateOf<String?>(null) }

    val uiState by authViewModel.uiState.collectAsState()
    val emailFocus = remember { FocusRequester() }
    val passwordFocus = remember { FocusRequester() }

    LaunchedEffect(uiState.actionSucceeded) {
        if (uiState.actionSucceeded) {
            authViewModel.consumeActionSucceeded()
            onSignupSuccess()
        }
    }

    val canSubmit = name.trim().length >= 2 && isValidEmail(email) && isPasswordStrongEnough(password) && agreed

    fun validateAndSubmit() {
        nameError = if (name.trim().length < 2) "Name must be at least 2 characters." else null
        emailError = if (!isValidEmail(email)) "Enter a valid email address." else null
        passwordError = if (!isPasswordStrongEnough(password)) {
            "Password must be at least 8 chars with a letter and number."
        } else {
            null
        }
        agreedError = if (!agreed) "You must agree to continue." else null

        if (nameError == null && emailError == null && passwordError == null && agreedError == null) {
            authViewModel.signup(name.trim(), email.trim(), password)
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
                text = stringResource(R.string.signup_title),
                style = MaterialTheme.typography.displayLarge,
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it; nameError = null; authViewModel.consumeError() },
                label = { Text(stringResource(R.string.name_label)) },
                isError = nameError != null,
                supportingText = nameError?.let { { Text(it) } },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                keyboardActions = KeyboardActions(onNext = { emailFocus.requestFocus() }),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it; emailError = null; authViewModel.consumeError() },
                label = { Text(stringResource(R.string.email_label)) },
                isError = emailError != null,
                supportingText = emailError?.let { { Text(it) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
                keyboardActions = KeyboardActions(onNext = { passwordFocus.requestFocus() }),
                modifier = Modifier.fillMaxWidth().focusRequester(emailFocus),
                singleLine = true,
            )

            Column {
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it; passwordError = null; authViewModel.consumeError() },
                    label = { Text(stringResource(R.string.password_label)) },
                    isError = passwordError != null,
                    supportingText = passwordError?.let { { Text(it) } },
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = { validateAndSubmit() }),
                    modifier = Modifier.fillMaxWidth().focusRequester(passwordFocus),
                    singleLine = true,
                )
                PasswordStrengthMeter(password)
            }

            Row(verticalAlignment = Alignment.Top, modifier = Modifier.fillMaxWidth()) {
                Checkbox(checked = agreed, onCheckedChange = { agreed = it; agreedError = null })
                Text(
                    "I agree to the Medical Disclaimer and Terms of Use",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 14.dp),
                )
            }
            agreedError?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }

            uiState.errorMessage?.let {
                Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }

            Button(
                onClick = { validateAndSubmit() },
                enabled = !uiState.isLoading && canSubmit,
                modifier = Modifier.fillMaxWidth(),
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.height(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                    )
                } else {
                    Text(stringResource(R.string.signup_button))
                }
            }

            TextButton(
                onClick = onNavigateToLogin,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(stringResource(R.string.have_account))
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 8.dp))
        }
    }
}
