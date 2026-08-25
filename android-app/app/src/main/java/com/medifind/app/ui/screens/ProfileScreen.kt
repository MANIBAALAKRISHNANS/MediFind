package com.medifind.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.BuildConfig
import com.medifind.app.R
import com.medifind.app.ui.components.LegalDocumentDialog
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.components.PRIVACY_POLICY_SECTIONS
import com.medifind.app.ui.components.TERMS_OF_SERVICE_SECTIONS
import com.medifind.app.ui.util.sendEmail
import com.medifind.app.viewmodel.AuthViewModel
import kotlinx.coroutines.launch
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

private const val SUPPORT_EMAIL = "medifindofficial@gmail.com"

private const val FULL_DISCLAIMER_TEXT = "MediFind is an AI-assisted application designed for informational " +
    "purposes only. It does not provide medical diagnoses, treatment plans, or prescriptions. Results should " +
    "not replace consultation with a qualified healthcare professional. Always seek professional advice for " +
    "any medical concerns. In case of emergency, contact emergency services immediately (108 / 112 / 911). " +
    "MediFind accepts no liability for actions taken based on the information provided."

private fun memberSinceLabel(createdAt: String?): String? {
    if (createdAt.isNullOrBlank()) return null
    return try {
        OffsetDateTime.parse(createdAt).format(DateTimeFormatter.ofPattern("MMMM yyyy"))
    } catch (e: DateTimeParseException) {
        null
    }
}

private fun initialsOf(name: String?): String =
    (name ?: "?").trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
        .take(2).joinToString("") { it.take(1) }.uppercase()

@Composable
private fun ProfileAvatar(name: String?, modifier: Modifier = Modifier, size: androidx.compose.ui.unit.Dp = 72.dp) {
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.primary),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            initialsOf(name),
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onPrimary,
            fontWeight = FontWeight.Bold,
        )
    }
}

/** One tappable settings row — matches the ListRow pattern in ProfilePage.jsx (icon + label + value/chevron). */
@Composable
private fun ProfileRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String? = null,
    danger: Boolean = false,
    enabled: Boolean = true,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = enabled, onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = if (danger) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(20.dp),
        )
        Text(
            label,
            style = MaterialTheme.typography.bodyLarge,
            color = if (danger) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f).padding(start = 14.dp),
        )
        if (value != null) {
            Text(value, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        } else if (!danger) {
            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(18.dp),
            )
        }
    }
}

@Composable
private fun SectionHeader(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.labelMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(top = 8.dp, bottom = 4.dp, start = 4.dp),
    )
}

/**
 * Combined view + edit screen — see the task decision log: unlike the web
 * app (which splits ProfilePage / EditProfilePage into two routes), this one
 * screen keeps the existing inline Name/Email editing and adds every action
 * row from both web pages around it, since the data fields were already at
 * parity and only the action rows were missing.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBack: () -> Unit,
    onLoggedOut: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val currentUser by authViewModel.currentUser.collectAsState()
    val isLoggedIn by authViewModel.isLoggedIn.collectAsState()
    val uiState by authViewModel.uiState.collectAsState()

    var name by remember(currentUser) { mutableStateOf(currentUser?.name ?: "") }
    var email by remember(currentUser) { mutableStateOf(currentUser?.email ?: "") }
    var disclaimerOpen by remember { mutableStateOf(false) }
    var legalDocOpen by remember { mutableStateOf<String?>(null) } // "privacy" | "terms" | null

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(isLoggedIn) {
        if (!isLoggedIn) onLoggedOut()
    }

    // Change Password result — separate from the Save Changes error banner below (see AuthViewModel.AuthUiState doc).
    LaunchedEffect(uiState.passwordResetMessage) {
        uiState.passwordResetMessage?.let { message ->
            scope.launch { snackbarHostState.showSnackbar(message) }
            authViewModel.consumePasswordResetMessage()
        }
    }

    val nameChanged = name.trim() != (currentUser?.name ?: "")
    val emailChanged = email.trim() != (currentUser?.email ?: "")
    val canSave = (nameChanged || emailChanged) && name.trim().length >= 2 && email.trim().contains("@")

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) { Snackbar(it) } },
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.profile_title)) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
            )
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            // ── Avatar + identity — matches ProfilePage.jsx's header block ──
            Column(
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                ProfileAvatar(currentUser?.name)
                Text(
                    currentUser?.name.orEmpty(),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 10.dp),
                )
                Text(
                    currentUser?.email.orEmpty(),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                memberSinceLabel(currentUser?.createdAt)?.let {
                    Text(
                        "Member since $it",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp),
                    )
                }
            }

            // ── Edit fields — matches EditProfilePage.jsx's Name/Email form ──
            SectionHeader("Edit Profile")
            OutlinedTextField(
                value = name,
                onValueChange = { if (it.length <= 60) { name = it; authViewModel.consumeError() } },
                label = { Text(stringResource(R.string.name_label)) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
            )
            OutlinedTextField(
                value = email,
                onValueChange = { email = it; authViewModel.consumeError() },
                label = { Text(stringResource(R.string.email_label)) },
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                singleLine = true,
            )
            uiState.errorMessage?.let {
                Text(
                    it,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(top = 6.dp),
                )
            }
            Button(
                onClick = { authViewModel.updateProfile(name, email) },
                enabled = !uiState.isLoading && canSave,
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(modifier = Modifier.height(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Text("Save Changes")
                }
            }

            // ── Account section — matches ProfilePage.jsx's "Account" card ──
            SectionHeader("Account")
            ProfileRow(
                icon = Icons.Default.Shield,
                label = if (uiState.isSendingPasswordReset) "Sending reset link…" else "Change Password",
                enabled = !uiState.isSendingPasswordReset,
                onClick = { authViewModel.sendPasswordResetForCurrentUser() },
            )

            // ── About section — matches ProfilePage.jsx's "About" card ──
            SectionHeader("About")
            ProfileRow(icon = Icons.Default.Shield, label = "Privacy Policy", onClick = { legalDocOpen = "privacy" })
            ProfileRow(icon = Icons.Default.Description, label = "Terms of Service", onClick = { legalDocOpen = "terms" })
            ProfileRow(
                icon = Icons.Default.WarningAmber,
                label = "Medical Disclaimer",
                onClick = { disclaimerOpen = !disclaimerOpen },
            )
            AnimatedVisibility(visible = disclaimerOpen) {
                Text(
                    FULL_DISCLAIMER_TEXT,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 10.dp),
                )
            }
            ProfileRow(icon = Icons.Default.Info, label = "App Version", value = BuildConfig.VERSION_NAME, onClick = {})

            // ── Support section — matches ProfilePage.jsx's "Support" card ──
            SectionHeader("Support")
            ProfileRow(
                icon = Icons.Default.Mail,
                label = "Contact Support",
                onClick = { sendEmail(context, SUPPORT_EMAIL) },
            )
            ProfileRow(
                icon = Icons.Default.BugReport,
                label = "Report a Problem",
                onClick = { sendEmail(context, SUPPORT_EMAIL, subject = "Bug Report - MediFind App") },
            )

            OutlinedButton(
                onClick = { authViewModel.logout() },
                modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
                colors = androidx.compose.material3.ButtonDefaults.outlinedButtonColors(
                    contentColor = MaterialTheme.colorScheme.error,
                ),
            ) {
                Text(stringResource(R.string.logout_button))
            }

            MedicalDisclaimer(modifier = Modifier.padding(top = 16.dp, bottom = 8.dp))
        }
    }

    legalDocOpen?.let { doc ->
        LegalDocumentDialog(
            title = if (doc == "privacy") "Privacy Policy" else "Terms of Service",
            sections = if (doc == "privacy") PRIVACY_POLICY_SECTIONS else TERMS_OF_SERVICE_SECTIONS,
            onDismiss = { legalDocOpen = null },
        )
    }
}
