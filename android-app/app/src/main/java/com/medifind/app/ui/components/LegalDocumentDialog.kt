package com.medifind.app.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * One section of a placeholder legal document — a heading + a body paragraph.
 */
data class LegalSection(val heading: String, val body: String)

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder legal copy for the "About" section's Privacy Policy / Terms of
// Service rows — mirrors frontend-web/src/constants/legalContent.js.
//
// NOTE: This is synthetic filler text so testers see a real screen instead of
// a dead tap target — it is NOT reviewed legal copy and must be replaced with
// actual counsel-approved Privacy Policy / Terms of Service text before any
// public release.
// ─────────────────────────────────────────────────────────────────────────────
const val LEGAL_LAST_UPDATED = "August 25, 2026"

val PRIVACY_POLICY_SECTIONS = listOf(
    LegalSection(
        "Overview",
        "MediFind (\"we\", \"our\", \"the app\") provides AI-assisted symptom analysis and helps you find " +
            "nearby medical facilities. This policy explains what information we collect, how we use it, and " +
            "the choices you have.",
    ),
    LegalSection(
        "Information We Collect",
        "Account details you provide (name, email, password — stored as a salted hash, never in plain text); " +
            "the symptom descriptions you submit for analysis; your device location when you search for nearby " +
            "doctors or facilities; and basic usage data (e.g. analysis history) needed to run the app.",
    ),
    LegalSection(
        "How We Use Your Information",
        "To generate symptom analyses and specialist recommendations, match you with nearby facilities, " +
            "maintain your account and analysis history, and send you transactional emails such as password " +
            "resets. We do not sell your personal data.",
    ),
    LegalSection(
        "Location Data",
        "Location is used only to find nearby medical facilities via OpenStreetMap-based mapping services " +
            "(Nominatim/Overpass). It is sent for the duration of a search and is not stored long-term against " +
            "your account.",
    ),
    LegalSection(
        "Data Storage & Security",
        "Data is stored in our backend database and transmitted over encrypted connections. Passwords are " +
            "hashed before storage. Access to production data is restricted to maintaining and operating the " +
            "service.",
    ),
    LegalSection(
        "Your Rights & Choices",
        "You can review and edit your profile at any time from this app, and you can request deletion of " +
            "your account and associated data by contacting support below.",
    ),
    LegalSection(
        "Children's Privacy",
        "MediFind is not directed at children under 13, and we do not knowingly collect data from them.",
    ),
    LegalSection(
        "Changes to This Policy",
        "We may update this policy as the app evolves. Material changes will be reflected here with an " +
            "updated date.",
    ),
    LegalSection(
        "Contact Us",
        "Questions about this policy? Email medifindofficial@gmail.com.",
    ),
)

val TERMS_OF_SERVICE_SECTIONS = listOf(
    LegalSection(
        "Acceptance of Terms",
        "By creating an account and using MediFind, you agree to these Terms of Service. If you do not agree, " +
            "please do not use the app.",
    ),
    LegalSection(
        "Description of Service",
        "MediFind offers AI-assisted, informational symptom analysis and helps locate nearby medical " +
            "facilities. It is a triage aid, not a diagnostic or prescribing tool.",
    ),
    LegalSection(
        "Medical Disclaimer",
        "MediFind does not provide medical diagnoses, treatment plans, or prescriptions, and is not a " +
            "substitute for professional medical advice. Always consult a qualified healthcare professional " +
            "for medical concerns. In an emergency, contact emergency services immediately (108 / 112 / 911).",
    ),
    LegalSection(
        "Your Account",
        "You are responsible for keeping your login credentials secure and for all activity under your " +
            "account. Provide accurate information when registering.",
    ),
    LegalSection(
        "Acceptable Use",
        "Do not misuse the service — including attempting to disrupt it, submitting unlawful content, or " +
            "using it in place of urgent professional medical care.",
    ),
    LegalSection(
        "Limitation of Liability",
        "MediFind and its team accept no liability for decisions made or actions taken based on information " +
            "provided by the app, to the fullest extent permitted by law.",
    ),
    LegalSection(
        "Termination",
        "We may suspend or terminate access for violation of these terms. You may stop using the app and " +
            "request account deletion at any time.",
    ),
    LegalSection(
        "Changes to These Terms",
        "We may revise these terms as the app evolves. Continued use after changes take effect constitutes " +
            "acceptance of the revised terms.",
    ),
    LegalSection(
        "Contact Us",
        "Questions about these terms? Email medifindofficial@gmail.com.",
    ),
)

/**
 * Scrollable dialog for the placeholder Privacy Policy / Terms of Service
 * content — matches the AlertDialog pattern used elsewhere (e.g.
 * HistoryScreen.kt's delete confirmations), just with a scrollable body.
 */
@Composable
fun LegalDocumentDialog(title: String, sections: List<LegalSection>, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 420.dp)
                    .verticalScroll(rememberScrollState()),
            ) {
                Text(
                    "Placeholder content for testing — not reviewed legal copy. Last updated $LEGAL_LAST_UPDATED.",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(bottom = 12.dp),
                )
                sections.forEach { section ->
                    Text(
                        section.heading,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 8.dp, bottom = 2.dp),
                    )
                    Text(
                        section.body,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        },
    )
}
