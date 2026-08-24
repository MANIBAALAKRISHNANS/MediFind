package com.medifind.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.medifind.app.ui.navigation.NavGraph
import com.medifind.app.ui.theme.MediFindTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Single-activity Compose host — see ui/navigation/NavGraph.kt for every
 * screen/route in the app.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    // Hoisted out of the Composable so onNewIntent() (a warm-start deep link —
    // e.g. tapping the reset-password email link while the app is already
    // running) can hand the new Intent to the same NavController Compose is
    // using. A cold-start deep link doesn't need this: NavHost picks up
    // this Activity's launch Intent automatically the first time it composes.
    private var navController: NavHostController? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MediFindTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val controller = rememberNavController()
                    navController = controller
                    NavGraph(navController = controller)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        navController?.handleDeepLink(intent)
    }
}
