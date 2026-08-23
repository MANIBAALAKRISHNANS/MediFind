package com.medifind.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColors = lightColorScheme(
    primary = Medical600,
    onPrimary = SurfaceLight,
    primaryContainer = Medical100,
    onPrimaryContainer = Medical800,
    secondary = Medical500,
    onSecondary = SurfaceLight,
    background = BackgroundLight,
    onBackground = OnSurfaceLight,
    surface = SurfaceLight,
    onSurface = OnSurfaceLight,
    surfaceVariant = Medical50,
    onSurfaceVariant = Medical700,
    outline = OutlineLight,
    error = EmergencyRed,
)

private val DarkColors = darkColorScheme(
    primary = Medical400,
    onPrimary = OnSurfaceDark,
    primaryContainer = Medical700,
    onPrimaryContainer = Medical100,
    secondary = Medical500,
    onSecondary = OnSurfaceDark,
    background = BackgroundDark,
    onBackground = OnSurfaceDark,
    surface = SurfaceDark,
    onSurface = OnSurfaceDark,
    surfaceVariant = SurfaceDark,
    onSurfaceVariant = Medical200,
    outline = OutlineDark,
    error = EmergencyRed,
)

/**
 * MediFind's Material3 theme — a fixed brand palette (teal, matching the web
 * app's `medical-600` — see frontend-web/tailwind.config.js) rather than
 * Android 12+ dynamic/wallpaper color, so the two clients look consistent.
 */
@Composable
fun MediFindTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColors else LightColors
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = MediFindTypography,
        content = content,
    )
}
