package com.medifind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.ui.components.LoadingIndicator
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.theme.EmergencyRed
import com.medifind.app.ui.util.dialPhone
import com.medifind.app.ui.util.openUrl
import com.medifind.app.ui.util.sharePdf
import com.medifind.app.viewmodel.HistoryViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryDetailScreen(
    analysisId: String,
    onBack: () -> Unit,
    onDeleted: () -> Unit,
    historyViewModel: HistoryViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val uiState by historyViewModel.detailUiState.collectAsState()
    var showDeleteConfirm by remember { mutableStateOf(false) }

    LaunchedEffect(analysisId) {
        historyViewModel.loadAnalysis(analysisId)
    }

    LaunchedEffect(uiState.downloadedPdf) {
        uiState.downloadedPdf?.let { file ->
            sharePdf(context, file)
            historyViewModel.consumePdfDownload()
        }
    }

    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("Delete this analysis?") },
            text = { Text("This cannot be undone.") },
            confirmButton = {
                TextButton(onClick = {
                    showDeleteConfirm = false
                    historyViewModel.deleteAnalysis(analysisId, onDeleted)
                }) { Text("Delete", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) { Text("Cancel") }
            },
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Analysis Detail") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showDeleteConfirm = true }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete")
                    }
                },
            )
        },
    ) { padding ->
        val analysis = uiState.analysis

        when {
            uiState.isLoading && analysis == null -> LoadingIndicator(modifier = Modifier.padding(padding))
            analysis == null -> {
                Column(
                    modifier = Modifier.fillMaxSize().padding(padding).padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        uiState.errorMessage ?: "Analysis not found.",
                        color = MaterialTheme.colorScheme.error,
                    )
                }
            }
            else -> Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                if (analysis.urgency == "emergency") {
                    // Matches DiagnosisCard.jsx's EmergencyBanner, reused verbatim
                    // on frontend-web's AnalysisDetailPage.jsx.
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(EmergencyRed, RoundedCornerShape(12.dp))
                            .padding(14.dp),
                    ) {
                        Row {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color.White)
                            Text(
                                "Seek Emergency Care Now",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.padding(start = 10.dp),
                            )
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            listOf("911" to "🇺🇸 911", "112" to "🌍 112", "108" to "🇮🇳 108").forEach { (number, label) ->
                                androidx.compose.material3.OutlinedButton(
                                    onClick = { dialPhone(context, number) },
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                                ) {
                                    Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.padding(end = 4.dp))
                                    Text(label)
                                }
                            }
                        }
                    }
                }

                Text(text = analysis.disease ?: "Unspecified Condition", style = MaterialTheme.typography.headlineMedium)
                Text(text = "\"${analysis.symptoms}\"", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)

                DetailRow("Specialty", analysis.specialty ?: "—")
                DetailRow("Severity", analysis.severity ?: "—")
                DetailRow("Urgency", analysis.urgency ?: "—")
                analysis.description?.let { DetailRow("Description", it) }

                if (analysis.recommendations.isNotEmpty()) {
                    Text("Recommendations", style = MaterialTheme.typography.titleMedium)
                    analysis.recommendations.forEach { Text("• $it", style = MaterialTheme.typography.bodySmall) }
                }

                if (analysis.redFlags.isNotEmpty()) {
                    Text("Warning Signs", style = MaterialTheme.typography.titleMedium)
                    analysis.redFlags.forEach {
                        Text("• $it", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
                    }
                }

                if (analysis.matchName != null) {
                    Text("Matched Facility", style = MaterialTheme.typography.titleMedium)
                    DetailRow("Name", analysis.matchName)
                    analysis.matchAddress?.let { DetailRow("Address", it) }
                    analysis.matchDistanceKm?.let { DetailRow("Distance", "$it km") }

                    if (analysis.matchPhone != null) {
                        OutlinedButton(
                            onClick = { dialPhone(context, analysis.matchPhone) },
                            modifier = Modifier.fillMaxWidth(),
                        ) { Text("Call ${analysis.matchPhone}") }
                    }
                    if (analysis.matchOsmMapUrl != null) {
                        OutlinedButton(
                            onClick = { openUrl(context, analysis.matchOsmMapUrl) },
                            modifier = Modifier.fillMaxWidth(),
                        ) { Text("View on Map") }
                    }
                }

                Button(
                    onClick = { historyViewModel.downloadPdf(analysisId) },
                    enabled = !uiState.isDownloadingPdf,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    if (uiState.isDownloadingPdf) {
                        CircularProgressIndicator(modifier = Modifier.padding(end = 8.dp))
                    } else {
                        Icon(Icons.Default.Download, contentDescription = null)
                    }
                    Text(" Download PDF Report")
                }

                uiState.errorMessage?.let {
                    Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }

                MedicalDisclaimer()
            }
        }
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp)) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.bodyMedium)
    }
}
