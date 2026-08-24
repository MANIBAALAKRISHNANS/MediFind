package com.medifind.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.medifind.app.R

private const val MAX_CHARS = 1000
private const val MIN_CHARS = 10
private const val NEAR_MAX_THRESHOLD = 850

// Matches frontend-web/src/components/SymptomInput.jsx's CHIPS_DEFAULT (always visible).
private val CHIPS_DEFAULT = listOf(
    "Fever", "Headache", "Cough", "Chest pain",
    "Fatigue", "Nausea", "Stomach pain", "Dizziness",
)

// Matches CHIPS_EXTRA — revealed by the "+N more symptoms" toggle.
private val CHIPS_EXTRA = listOf(
    "Vomiting",
    "Blurred vision", "Numbness",
    "Shortness of breath", "Wheezing",
    "Diarrhea", "Constipation", "Heartburn",
    "Joint pain", "Back pain", "Muscle pain", "Swelling",
    "Rash", "Itching", "Skin redness",
    "Burning urination", "Frequent urination",
    "Excessive thirst", "Weight loss", "Weight gain",
    "Anxiety", "Low mood", "Insomnia",
    "Sore throat", "Ear pain", "Runny nose",
    "Red eye", "Eye pain",
)

/**
 * Multi-line symptom text field with tap-to-append quick-symptom chips —
 * matches frontend-web/src/components/SymptomInput.jsx: 8 always-visible
 * chips plus a "+N more symptoms" toggle revealing the rest, a 1000-char
 * hard cap with a live counter (turning attention-color past 850), and a
 * "N more characters needed" hint below the 10-char minimum.
 */
@Composable
fun SymptomInputField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    supportingText: String? = null,
) {
    var showMore by remember { mutableStateOf(false) }

    fun appendChip(chip: String) {
        if (value.lowercase().contains(chip.lowercase())) return
        val trimmed = value.trimEnd()
        onValueChange(if (trimmed.isEmpty()) chip else "$trimmed $chip")
    }

    Column(modifier = modifier.fillMaxWidth()) {
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(CHIPS_DEFAULT) { chip ->
                AssistChip(onClick = { appendChip(chip) }, label = { Text(chip) })
            }
        }

        AnimatedVisibility(visible = showMore) {
            LazyRow(
                modifier = Modifier.padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(CHIPS_EXTRA) { chip ->
                    AssistChip(onClick = { appendChip(chip) }, label = { Text(chip) })
                }
            }
        }

        TextButton(onClick = { showMore = !showMore }, modifier = Modifier.padding(top = 4.dp)) {
            Text(if (showMore) "Show fewer symptoms" else "+${CHIPS_EXTRA.size} more symptoms")
        }

        OutlinedTextField(
            value = value,
            onValueChange = { onValueChange(it.take(MAX_CHARS)) },
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
            placeholder = { Text(stringResource(R.string.symptom_hint)) },
            minLines = 5,
            maxLines = 10,
            isError = isError,
            supportingText = supportingText?.let { text ->
                { Text(text, color = MaterialTheme.colorScheme.error, textAlign = TextAlign.Start) }
            },
            colors = TextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface,
            ),
        )

        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            val trimmedLen = value.trim().length
            if (trimmedLen in 1 until MIN_CHARS) {
                val remaining = MIN_CHARS - trimmedLen
                Text(
                    "$remaining more character${if (remaining != 1) "s" else ""} needed",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.tertiary,
                )
            } else {
                Text("")
            }
            Text(
                "${value.length} / $MAX_CHARS",
                style = MaterialTheme.typography.labelSmall,
                color = if (value.length > NEAR_MAX_THRESHOLD) {
                    MaterialTheme.colorScheme.tertiary
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                },
            )
        }
    }
}
