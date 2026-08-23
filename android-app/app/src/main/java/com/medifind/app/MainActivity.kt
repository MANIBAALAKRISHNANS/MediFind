package com.medifind.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.medifind.app.ui.navigation.NavGraph
import com.medifind.app.ui.theme.MediFindTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Single-activity Compose host — see ui/navigation/NavGraph.kt for every
 * screen/route in the app.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MediFindRoot()
        }
    }
}

@Composable
private fun MediFindRoot() {
    MediFindTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            NavGraph()
        }
    }
}
