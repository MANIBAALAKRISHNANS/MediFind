package com.medifind.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medifind.app.R
import com.medifind.app.viewmodel.AuthViewModel

/**
 * Shown while AuthViewModel restores the session (see
 * AuthRepository.loadUser() / authStore.loadUser() on the web). NavGraph
 * observes `isBootstrapping` and `isLoggedIn` to route onward automatically.
 */
@Composable
fun SplashScreen(
    onReady: (isLoggedIn: Boolean) -> Unit,
    authViewModel: AuthViewModel = hiltViewModel(),
) {
    val isBootstrapping by authViewModel.isBootstrapping.collectAsState()
    val isLoggedIn by authViewModel.isLoggedIn.collectAsState()

    LaunchedEffect(isBootstrapping) {
        if (!isBootstrapping) {
            onReady(isLoggedIn)
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.primary,
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Icon(
                imageVector = Icons.Default.LocalHospital,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onPrimary,
                modifier = Modifier.padding(bottom = 16.dp),
            )
            Text(
                text = stringResource(R.string.home_title),
                style = MaterialTheme.typography.displayLarge,
                color = MaterialTheme.colorScheme.onPrimary,
            )
            Text(
                text = stringResource(R.string.home_subtitle),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onPrimary,
                modifier = Modifier.padding(top = 4.dp, bottom = 32.dp),
            )
            CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary)
        }
    }
}
