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
import androidx.compose.material.icons.automirrored.filled.Undo
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.R
import com.medifind.app.ui.components.DiagnosisCard
import com.medifind.app.ui.components.LoadingIndicator
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.theme.EmergencyRed
import com.medifind.app.ui.util.dialPhone
import com.medifind.app.viewmodel.AnalysisViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnalysisResultScreen(
    onFindDoctor: (specialty: String, analysisId: String?, severity: String?) -> Unit,
    onBack: () -> Unit,
    analysisViewModel: AnalysisViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val uiState by analysisViewModel.uiState.collectAsState()
    val diagnosis = uiState.diagnosis

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Analysis Result") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
            )
        },
    ) { padding ->
        if (diagnosis == null) {
            LoadingIndicator(modifier = Modifier.padding(padding))
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            if (diagnosis.urgency == "emergency") {
                // Matches frontend-web's EmergencyBanner.jsx: headline + explanatory
                // text + three tap-to-dial buttons (911 / 112 / 108).
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(EmergencyRed, RoundedCornerShape(12.dp))
                        .padding(14.dp),
                ) {
                    Row {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = Color.White)
                        Column(modifier = Modifier.padding(start = 10.dp)) {
                            Text(
                                text = "Seek Emergency Care Now",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium,
                            )
                            Text(
                                text = "Your symptoms may indicate a serious medical emergency. Do not wait — call emergency services immediately.",
                                color = Color.White,
                                style = MaterialTheme.typography.bodySmall,
                                modifier = Modifier.padding(top = 2.dp),
                            )
                        }
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        listOf("911" to "🇺🇸 911", "112" to "🌍 112", "108" to "🇮🇳 108").forEach { (number, label) ->
                            OutlinedButton(
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

            DiagnosisCard(diagnosis = diagnosis)

            if (diagnosis.differentialDiagnosis.isNotEmpty()) {
                SectionTitle(stringResource(R.string.differential_diagnosis))
                diagnosis.differentialDiagnosis.forEach { diff ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(diff.name, style = MaterialTheme.typography.bodyMedium)
                        Text(
                            "${diff.probability}%",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }
                }
            }

            if (diagnosis.recommendations.isNotEmpty()) {
                SectionTitle(stringResource(R.string.recommendations_title))
                diagnosis.recommendations.forEachIndexed { index, rec ->
                    BulletRow(number = index + 1, text = rec)
                }
            }

            if (diagnosis.redFlags.isNotEmpty()) {
                SectionTitle(stringResource(R.string.red_flags_title))
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.errorContainer, RoundedCornerShape(12.dp))
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    diagnosis.redFlags.forEach { flag ->
                        Text(
                            "• $flag",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onErrorContainer,
                        )
                    }
                }
            }

            if (diagnosis.homeCare.isNotEmpty()) {
                SectionTitle(stringResource(R.string.home_care_title))
                diagnosis.homeCare.forEach { care ->
                    Text("• $care", style = MaterialTheme.typography.bodySmall)
                }
            }

            Button(
                onClick = { onFindDoctor(diagnosis.specialty, diagnosis.analysisId, diagnosis.severity) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(stringResource(R.string.find_doctor_button))
            }

            // Matches the "Start New Analysis" ghost button on the web's
            // Diagnosis stage (DiagnosisCard.jsx) — clears the in-progress
            // analysis and returns to Home, same as the top bar's back arrow.
            OutlinedButton(
                onClick = onBack,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Icon(Icons.AutoMirrored.Filled.Undo, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                Text("Start New Analysis")
            }

            MedicalDisclaimer()
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleMedium,
        color = MaterialTheme.colorScheme.onBackground,
    )
}

@Composable
private fun BulletRow(number: Int, text: String) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Text(
            "$number.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.primary,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(end = 8.dp),
        )
        Text(text, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(bottom = 2.dp))
    }
}
