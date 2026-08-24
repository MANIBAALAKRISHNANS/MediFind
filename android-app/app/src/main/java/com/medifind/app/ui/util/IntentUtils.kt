package com.medifind.app.ui.util

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

/** Opens the device dialer pre-filled with `phone` — matches the web app's `tel:` link. */
fun dialPhone(context: Context, phone: String) {
    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
    context.startActivity(intent)
}

/** Opens a URL (OSM map / directions / facility website link) in the browser. */
fun openUrl(context: Context, url: String) {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
    context.startActivity(intent)
}

/**
 * Opens the device's email app pre-addressed to [to] (and pre-filled with
 * [subject] when given) — the native equivalent of the web app's `mailto:`
 * links (Contact Support / Report a Problem on Profile, the support footer
 * on Forgot Password). Uses ACTION_SENDTO (not ACTION_SEND) so only email
 * apps are offered, matching what a `mailto:` link does in a browser.
 */
fun sendEmail(context: Context, to: String, subject: String? = null) {
    val uri = buildString {
        append("mailto:")
        append(Uri.encode(to).replace("%40", "@"))
        if (subject != null) append("?subject=").append(Uri.encode(subject))
    }
    val intent = Intent(Intent.ACTION_SENDTO, Uri.parse(uri))
    context.startActivity(intent)
}

/**
 * Shares a downloaded PDF report via the system share sheet, using a
 * FileProvider content:// Uri (see AndroidManifest.xml + res/xml/file_paths.xml).
 * Covers the "share via intent" half of the PDF requirement — the receiving
 * app (e.g. Google Drive, WhatsApp, a PDF viewer) handles saving/printing.
 */
fun sharePdf(context: Context, file: File) {
    val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    val intent = Intent(Intent.ACTION_SEND).apply {
        type = "application/pdf"
        putExtra(Intent.EXTRA_STREAM, uri)
        putExtra(Intent.EXTRA_SUBJECT, "MediFind Medical Report")
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
    context.startActivity(Intent.createChooser(intent, "Open or share your PDF report"))
}

/**
 * Sends the PDF straight to Android's print framework via the system PDF
 * viewer/printer chooser — covers the "print framework" half of the PDF
 * requirement as an alternative to sharing.
 */
fun printPdf(context: Context, file: File) {
    val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    val intent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, "application/pdf")
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    context.startActivity(Intent.createChooser(intent, "Open PDF to print"))
}
