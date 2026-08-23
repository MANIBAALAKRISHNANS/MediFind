package com.medifind.app.ui.screens

import android.Manifest
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.LocationOff
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.accompanist.permissions.shouldShowRationale
import com.medifind.app.R
import com.medifind.app.ui.components.BestMatchCard
import com.medifind.app.ui.components.LoadingIndicator
import com.medifind.app.ui.components.MedicalDisclaimer
import com.medifind.app.ui.theme.EmergencyRed
import com.medifind.app.ui.util.dialPhone
import com.medifind.app.ui.util.openUrl
import com.medifind.app.ui.util.sharePdf
import com.medifind.app.viewmodel.DoctorViewModel
import com.medifind.app.viewmodel.HistoryViewModel

@OptIn(ExperimentalMaterial3Api::class, ExperimentalPermissionsApi::class)
@Composable
fun DoctorResultScreen(
    specialty: String,
    analysisId: String?,
    severity: String?,
    onBack: () -> Unit,
    doctorViewModel: DoctorViewModel = hiltViewModel(),
    historyViewModel: HistoryViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val uiState by doctorViewModel.uiState.collectAsState()
    val historyDetailState by historyViewModel.detailUiState.collectAsState()

    val locationPermission = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)
    var cityInput by remember { mutableStateOf("") }

    // Dense metro searches can legitimately take 15-20s on the backend (see
    // routes/findDoctor.js's Overpass timeout/retry) — swap the loading copy
    // after 3s so a long wait reads as "still working", not "stuck".
    var searchTakingLong by remember { mutableStateOf(false) }
    LaunchedEffect(uiState.isLoading) {
        searchTakingLong = false
        if (uiState.isLoading) {
            kotlinx.coroutines.delay(3000)
            searchTakingLong = true
        }
    }

    LaunchedEffect(locationPermission.status) {
        if (locationPermission.status.isGranted && !uiState.hasSearched && !uiState.isLoading) {
            doctorViewModel.searchDoctor(specialty, analysisId)
        }
    }

    LaunchedEffect(historyDetailState.downloadedPdf) {
        historyDetailState.downloadedPdf?.let { file ->
            sharePdf(context, file)
            historyViewModel.consumePdfDownload()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Find a Doctor") },
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
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            // Emergency numbers — always prominent for severe/emergency results.
            if (severity == "severe" || severity == "emergency") {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(EmergencyRed, RoundedCornerShape(12.dp))
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column {
                        Text(
                            "Emergency? Call now:",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.bodyMedium,
                        )
                        Text(
                            "${stringResource(R.string.emergency_ambulance)} (Ambulance) · ${stringResource(R.string.emergency_all)} (All Emergencies)",
                            color = Color.White,
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                    Button(
                        onClick = { dialPhone(context, "112") },
                        colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = Color.White),
                    ) {
                        Text("Call 112", color = EmergencyRed, fontWeight = FontWeight.Bold)
                    }
                }
            }

            when {
                // Highest priority — once we have a result (however it was found:
                // GPS or the city fallback below), always show it.
                uiState.bestMatch != null -> {
                    if (uiState.note != null) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(12.dp))
                                .padding(14.dp),
                        ) {
                            Text(
                                "ℹ️ ${uiState.note}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                    BestMatchCard(
                        bestMatch = uiState.bestMatch!!,
                        onCall = { phone -> dialPhone(context, phone) },
                        onViewMap = { url -> openUrl(context, url) },
                        onDirections = { url -> openUrl(context, url) },
                    )

                    if (analysisId != null) {
                        OutlinedButton(
                            onClick = { historyViewModel.downloadPdf(analysisId) },
                            enabled = !historyDetailState.isDownloadingPdf,
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            if (historyDetailState.isDownloadingPdf) {
                                CircularProgressIndicator(modifier = Modifier.padding(end = 8.dp))
                            } else {
                                Icon(Icons.Default.Download, contentDescription = null)
                            }
                            Text(" Download PDF Report")
                        }
                    }
                }

                uiState.isLoading -> LoadingIndicator(
                    label = if (searchTakingLong) {
                        "Still searching — busy areas can take up to 20 seconds…"
                    } else {
                        "Searching nearby hospitals…"
                    },
                )

                // No result yet and permission is denied — offer the GPS prompt
                // again, or let the user fall back to typing their city. Stays
                // visible across repeated failed city lookups since bestMatch
                // is still null and isLoading is false after each attempt.
                !locationPermission.status.isGranted -> {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Icon(
                            Icons.Default.LocationOff,
                            contentDescription = null,
                            modifier = Modifier.padding(bottom = 4.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = if (locationPermission.status.shouldShowRationale) {
                                "MediFind needs your location to find nearby doctors and hospitals. Please grant location access."
                            } else {
                                "Location access is required to search for nearby doctors."
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Button(onClick = { locationPermission.launchPermissionRequest() }) {
                            Text("Grant Location Access")
                        }

                        Text(
                            "or",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )

                        OutlinedTextField(
                            value = cityInput,
                            onValueChange = { cityInput = it; doctorViewModel.consumeError() },
                            label = { Text("Enter your city") },
                            placeholder = { Text("e.g. Mumbai, Chennai, Bangalore…") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                        )
                        Button(
                            onClick = { doctorViewModel.searchDoctorInCity(cityInput, specialty, analysisId) },
                            enabled = cityInput.isNotBlank(),
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text("Find Doctors in This City")
                        }

                        uiState.errorMessage?.let {
                            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }

                uiState.errorMessage != null -> {
                    Text(
                        text = uiState.errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    Button(onClick = { doctorViewModel.searchDoctor(specialty, analysisId) }) {
                        Text(stringResource(R.string.retry_button))
                    }
                }
            }

            historyDetailState.errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }

            MedicalDisclaimer()
        }
    }
}
