package com.medifind.app.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.medifind.app.R

private val QUICK_SYMPTOMS = listOf(
    "Fever", "Headache", "Cough", "Fatigue", "Nausea",
    "Body ache", "Sore throat", "Dizziness", "Chest pain", "Rash",
)

/**
 * Multi-line symptom text field with tap-to-append quick-symptom chips —
 * matches frontend-web/src/components/SymptomInput.jsx.
 */
@Composable
fun SymptomInputField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    supportingText: String? = null,
) {
    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
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

        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
        ) {
            items(QUICK_SYMPTOMS) { symptom ->
                AssistChip(
                    onClick = {
                        val separator = if (value.isBlank() || value.trimEnd().endsWith(",")) "" else ", "
                        onValueChange("${value.trimEnd()}$separator$symptom")
                    },
                    label = { Text(symptom) },
                    modifier = Modifier.padding(end = 8.dp),
                )
            }
        }
    }
}
