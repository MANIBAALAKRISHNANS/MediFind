package com.medifind.app.ui.screens

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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.R
import com.medifind.app.data.local.entities.AnalysisEntity
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.components.SymptomInputField
import com.medifind.app.viewmodel.AnalysisViewModel
import com.medifind.app.viewmodel.AuthViewModel
import com.medifind.app.viewmodel.HomeDashboardViewModel
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

private fun greeting(): String {
    val hour = java.time.LocalTime.now().hour
    return when {
        hour < 12 -> "Good morning"
        hour < 17 -> "Good afternoon"
        else -> "Good evening"
    }
}

private fun formatEntryDate(iso: String): String = try {
    OffsetDateTime.parse(iso).format(DateTimeFormatter.ofPattern("MMM d, yyyy · h:mm a"))
} catch (e: DateTimeParseException) {
    ""
}

/**
 * Dashboard tile shown before the symptom form — matches HomePage.jsx's
 * `dashboard` stage: greeting, stats row (Total Analyses / Last Check),
 * up to 3 Recent Analyses, and the first-time empty state.
 */
@Composable
private fun Dashboard(
    firstName: String,
    onAnalyze: () -> Unit,
    onSeeAll: () -> Unit,
    onOpenAnalysis: (String) -> Unit,
    dashboardViewModel: HomeDashboardViewModel = hiltViewModel(),
) {
    val state by dashboardViewModel.uiState.collectAsState()

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Column {
            Text("${greeting()} 👋", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(
                "Hi, $firstName",
                style = MaterialTheme.typography.displayLarge,
                modifier = Modifier.padding(top = 2.dp),
            )
            Text(
                "How are you feeling today?",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp),
            )
        }

        // ── Main CTA — matches the "Analyze Symptoms" gradient card ──
        Card(
            onClick = onAnalyze,
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "AI SYMPTOM CHECKER",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.7f),
                    )
                    Text(
                        "Analyze Symptoms",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                    Text(
                        "Powered by Gemini AI · Takes ~10 seconds",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.6f),
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.15f), RoundedCornerShape(28.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Default.MedicalServices, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary)
                }
            }
        }

        // ── Stats row ──
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Total Analyses", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        "${state.total}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                }
            }
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Last Check", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = state.recent.firstOrNull()?.let {
                            try {
                                OffsetDateTime.parse(it.createdAt).format(DateTimeFormatter.ofPattern("MMM d, yyyy"))
                            } catch (e: DateTimeParseException) {
                                "Never"
                            }
                        } ?: "Never",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                }
            }
        }

        // ── Recent Analyses ──
        if (state.recent.isNotEmpty()) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        "RECENT ANALYSES",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold,
                    )
                    TextButton(onClick = onSeeAll) { Text("See All") }
                }
                Card(shape = RoundedCornerShape(16.dp)) {
                    Column {
                        state.recent.forEach { entry -> RecentRow(entry, onClick = { onOpenAnalysis(entry.id) }) }
                    }
                }
            }
        } else {
            // ── First-time empty state ──
            Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Icon(
                        Icons.Default.MedicalServices,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(32.dp),
                    )
                    Text(
                        "No analyses yet",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 10.dp),
                    )
                    Text(
                        "Tap \"Analyze Symptoms\" above to check your symptoms with AI",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
            }
        }

        MedicalDisclaimer()
    }
}

@Composable
private fun RecentRow(entry: AnalysisEntity, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(entry.disease ?: "Unknown condition", style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
            Text(
                formatEntryDate(entry.createdAt),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

/**
 * Matches frontend-web's HomePage.jsx: the `dashboard` stage renders first
 * (see [Dashboard] above); tapping its CTA reveals the symptom form — the
 * same two-stage flow as the web reducer's 'dashboard' → 'input' transition.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onAnalysisReady: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onOpenAnalysis: (id: String) -> Unit,
    analysisViewModel: AnalysisViewModel = hiltViewModel(),
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    val uiState by analysisViewModel.uiState.collectAsState()
    val currentUser by authViewModel.currentUser.collectAsState()
    var showInputForm by remember { mutableStateOf(false) }

    LaunchedEffect(uiState.diagnosis) {
        if (uiState.diagnosis != null) {
            onAnalysisReady()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.home_title)) },
                actions = {
                    IconButton(onClick = onNavigateToHistory) {
                        Icon(Icons.Default.History, contentDescription = stringResource(R.string.history_title))
                    }
                    IconButton(onClick = onNavigateToProfile) {
                        Icon(Icons.Default.Person, contentDescription = stringResource(R.string.profile_title))
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
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            if (!showInputForm) {
                Dashboard(
                    firstName = currentUser?.name?.substringBefore(' ')?.ifBlank { "there" } ?: "there",
                    onAnalyze = { showInputForm = true },
                    onSeeAll = onNavigateToHistory,
                    onOpenAnalysis = onOpenAnalysis,
                )
            } else {
                Text(
                    text = stringResource(R.string.home_subtitle),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )

                SymptomInputField(
                    value = uiState.symptoms,
                    onValueChange = analysisViewModel::onSymptomsChanged,
                    isError = uiState.errorMessage != null,
                    supportingText = uiState.errorMessage,
                )

                Button(
                    onClick = { analysisViewModel.analyzeSymptoms() },
                    enabled = !uiState.isLoading,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (uiState.isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.height(20.dp),
                            color = MaterialTheme.colorScheme.onPrimary,
                        )
                    } else {
                        Text(stringResource(R.string.analyze_button))
                    }
                }

                TextButton(
                    onClick = { showInputForm = false; analysisViewModel.onSymptomsChanged("") },
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("← Back to Dashboard") }

                MedicalDisclaimer()
            }
        }
    }
}
