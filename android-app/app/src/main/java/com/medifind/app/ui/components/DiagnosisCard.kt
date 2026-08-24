package com.medifind.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.medifind.app.data.api.models.AnalysisResponse
import com.medifind.app.ui.theme.SeverityMildBg
import com.medifind.app.ui.theme.SeverityMildBorder
import com.medifind.app.ui.theme.SeverityMildText
import com.medifind.app.ui.theme.SeverityModerateBg
import com.medifind.app.ui.theme.SeverityModerateBorder
import com.medifind.app.ui.theme.SeverityModerateText
import com.medifind.app.ui.theme.SeverityToBg
import com.medifind.app.ui.theme.SeverityToBorder
import com.medifind.app.ui.theme.SeverityToText

private data class SeverityPalette(val bg: Color, val border: Color, val text: Color)

private fun severityPalette(severity: String?): SeverityPalette = when (severity?.lowercase()) {
    "severe" -> SeverityPalette(SeverityToBg, SeverityToBorder, SeverityToText)
    "moderate" -> SeverityPalette(SeverityModerateBg, SeverityModerateBorder, SeverityModerateText)
    else -> SeverityPalette(SeverityMildBg, SeverityMildBorder, SeverityMildText)
}

// Matches frontend-web/src/components/DiagnosisCard.jsx's URGENCY_CONFIG exactly,
// including its fallback: an unrecognized value (or "see-doctor") reads as
// the same "schedule an appointment" copy, not a generic placeholder.
private fun urgencyLabel(urgency: String?): String = when (urgency) {
    "self-care" -> "Self-care — manageable at home"
    "see-doctor-soon" -> "See a Doctor — within the next few days"
    "see-doctor-today" -> "See a Doctor Today — do not delay"
    "emergency" -> "MEDICAL EMERGENCY"
    else -> "See a Doctor — schedule an appointment"
}

/**
 * Severity-color-coded diagnosis summary — matches
 * frontend-web/src/components/DiagnosisCard.jsx.
 */
@Composable
fun DiagnosisCard(diagnosis: AnalysisResponse, modifier: Modifier = Modifier) {
    val palette = severityPalette(diagnosis.severity)
    val confidence = diagnosis.confidence.coerceIn(0, 100)

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.5.dp, palette.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = palette.bg),
        shape = RoundedCornerShape(16.dp),
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top,
            ) {
                Text(
                    text = diagnosis.disease,
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.weight(1f),
                )
                Spacer(modifier = Modifier.width(8.dp))
                Row(
                    modifier = Modifier
                        .background(palette.text, RoundedCornerShape(20.dp))
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                ) {
                    Text(
                        text = diagnosis.severity.uppercase(),
                        color = Color.White,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Confidence bar
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "AI Confidence",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.width(96.dp),
                )
                LinearProgressIndicator(
                    progress = { confidence / 100f },
                    modifier = Modifier
                        .weight(1f)
                        .height(8.dp)
                        .padding(horizontal = 8.dp),
                    color = palette.text,
                    trackColor = palette.border.copy(alpha = 0.3f),
                )
                Text(
                    "$confidence%",
                    style = MaterialTheme.typography.labelLarge,
                    color = palette.text,
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = urgencyLabel(diagnosis.urgency),
                style = MaterialTheme.typography.labelLarge,
                color = palette.text,
            )
            Text(
                text = "Specialist: ${diagnosis.specialty.replaceFirstChar { it.uppercase() }}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp),
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = diagnosis.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
