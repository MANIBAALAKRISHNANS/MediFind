package com.medifind.app.ui.navigation

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.navDeepLink
import com.medifind.app.BuildConfig
import com.medifind.app.ui.screens.AnalysisResultScreen
import com.medifind.app.ui.screens.DoctorResultScreen
import com.medifind.app.ui.screens.ForgotPasswordScreen
import com.medifind.app.ui.screens.HistoryDetailScreen
import com.medifind.app.ui.screens.HistoryScreen
import com.medifind.app.ui.screens.HomeScreen
import com.medifind.app.ui.screens.LoginScreen
import com.medifind.app.ui.screens.ProfileScreen
import com.medifind.app.ui.screens.ResetPasswordScreen
import com.medifind.app.ui.screens.SignupScreen
import com.medifind.app.ui.screens.SplashScreen
import com.medifind.app.viewmodel.AnalysisViewModel

/** Route constants — the single source of truth for every destination in the app. */
object Routes {
    const val SPLASH = "splash"
    const val LOGIN = "login"
    const val SIGNUP = "signup"
    const val FORGOT_PASSWORD = "forgot_password"
    const val RESET_PASSWORD = "reset_password?token={token}&email={email}"

    // Nested graph so Home ⟷ AnalysisResult share one AnalysisViewModel instance
    // (the diagnosis produced on Home must still be visible after navigating
    // forward to AnalysisResult).
    const val MAIN_FLOW = "main_flow"
    const val HOME = "home"
    const val ANALYSIS_RESULT = "analysis_result"
    const val DOCTOR_RESULT = "doctor_result/{specialty}?analysisId={analysisId}&severity={severity}"

    const val HISTORY = "history"
    const val HISTORY_DETAIL = "history_detail/{analysisId}"
    const val PROFILE = "profile"

    fun doctorResult(specialty: String, analysisId: String?, severity: String?): String {
        val base = "doctor_result/${Uri.encode(specialty)}"
        val params = buildList {
            analysisId?.let { add("analysisId=${Uri.encode(it)}") }
            severity?.let { add("severity=${Uri.encode(it)}") }
        }
        return if (params.isEmpty()) base else "$base?${params.joinToString("&")}"
    }

    fun historyDetail(analysisId: String): String = "history_detail/${Uri.encode(analysisId)}"

    fun resetPassword(token: String? = null, email: String? = null): String {
        val params = buildList {
            token?.let { add("token=${Uri.encode(it)}") }
            email?.let { add("email=${Uri.encode(it)}") }
        }
        return if (params.isEmpty()) "reset_password" else "reset_password?${params.joinToString("&")}"
    }

    /**
     * The App Link host — derived from the same BuildConfig.API_BASE_URL used
     * for every API call (see app/build.gradle.kts), so the deep link this app
     * matches always tracks whichever backend it's actually pointed at rather
     * than a second hardcoded value that could drift out of sync. The backend
     * serves GET /reset-password itself (see backend/app.js) — the emailed
     * link's host is that same backend host (FRONTEND_URL server-side env var).
     */
    val deepLinkHost: String = BuildConfig.API_BASE_URL
        .removePrefix("https://")
        .removePrefix("http://")
        .trimEnd('/')
}

@Composable
fun NavGraph(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = Routes.SPLASH) {

        composable(Routes.SPLASH) {
            SplashScreen(
                onReady = { isLoggedIn ->
                    val target = if (isLoggedIn) Routes.MAIN_FLOW else Routes.LOGIN
                    navController.navigate(target) {
                        popUpTo(Routes.SPLASH) { inclusive = true }
                    }
                },
            )
        }

        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.MAIN_FLOW) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
                onNavigateToSignup = { navController.navigate(Routes.SIGNUP) },
                onNavigateToForgotPassword = { navController.navigate(Routes.FORGOT_PASSWORD) },
            )
        }

        composable(Routes.SIGNUP) {
            SignupScreen(
                onSignupSuccess = {
                    navController.navigate(Routes.MAIN_FLOW) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
                onNavigateToLogin = { navController.popBackStack() },
            )
        }

        composable(Routes.FORGOT_PASSWORD) {
            ForgotPasswordScreen(
                onDone = { navController.popBackStack() },
                onHaveAResetCode = { navController.navigate(Routes.resetPassword()) },
            )
        }

        composable(
            route = Routes.RESET_PASSWORD,
            arguments = listOf(
                navArgument("token") { type = NavType.StringType; nullable = true; defaultValue = null },
                navArgument("email") { type = NavType.StringType; nullable = true; defaultValue = null },
            ),
            // Lets the OS hand this app the emailed reset link directly (see
            // AndroidManifest.xml's matching <intent-filter> on MainActivity,
            // and MainActivity.onNewIntent() for the "app already running"
            // case) instead of falling back to a browser — the App Link
            // equivalent of the web app's /reset-password?token=&email= route.
            deepLinks = listOf(
                navDeepLink {
                    uriPattern = "https://${Routes.deepLinkHost}/reset-password?token={token}&email={email}"
                },
            ),
        ) { backStackEntry ->
            val token = backStackEntry.arguments?.getString("token")
            val email = backStackEntry.arguments?.getString("email")
            ResetPasswordScreen(
                token = token,
                email = email,
                onResetComplete = {
                    navController.navigate(Routes.LOGIN) { popUpTo(0) { inclusive = true } }
                },
                onRequestNewLink = {
                    navController.navigate(Routes.FORGOT_PASSWORD) { popUpTo(Routes.RESET_PASSWORD) { inclusive = true } }
                },
                onBackToSignIn = {
                    navController.navigate(Routes.LOGIN) { popUpTo(0) { inclusive = true } }
                },
            )
        }

        // ── Main flow: Home ⟷ AnalysisResult ⟷ DoctorResult ──────────────────
        navigation(startDestination = Routes.HOME, route = Routes.MAIN_FLOW) {

            composable(Routes.HOME) { backStackEntry ->
                val parentEntry = remember(backStackEntry, navController) {
                    navController.getBackStackEntry(Routes.MAIN_FLOW)
                }
                val analysisViewModel: AnalysisViewModel = hiltViewModel(parentEntry)

                HomeScreen(
                    onAnalysisReady = { navController.navigate(Routes.ANALYSIS_RESULT) },
                    onNavigateToHistory = { navController.navigate(Routes.HISTORY) },
                    onNavigateToProfile = { navController.navigate(Routes.PROFILE) },
                    onOpenAnalysis = { id -> navController.navigate(Routes.historyDetail(id)) },
                    analysisViewModel = analysisViewModel,
                )
            }

            composable(Routes.ANALYSIS_RESULT) { backStackEntry ->
                val parentEntry = remember(backStackEntry, navController) {
                    navController.getBackStackEntry(Routes.MAIN_FLOW)
                }
                val analysisViewModel: AnalysisViewModel = hiltViewModel(parentEntry)

                AnalysisResultScreen(
                    onFindDoctor = { specialty, analysisId, severity ->
                        navController.navigate(Routes.doctorResult(specialty, analysisId, severity))
                    },
                    onBack = {
                        analysisViewModel.resetForNewAnalysis()
                        navController.popBackStack()
                    },
                    analysisViewModel = analysisViewModel,
                )
            }

            composable(
                route = Routes.DOCTOR_RESULT,
                arguments = listOf(
                    navArgument("specialty") { type = NavType.StringType },
                    navArgument("analysisId") { type = NavType.StringType; nullable = true; defaultValue = null },
                    navArgument("severity") { type = NavType.StringType; nullable = true; defaultValue = null },
                ),
            ) { backStackEntry ->
                val specialty = backStackEntry.arguments?.getString("specialty").orEmpty()
                val analysisId = backStackEntry.arguments?.getString("analysisId")
                val severity = backStackEntry.arguments?.getString("severity")
                val parentEntry = remember(backStackEntry, navController) {
                    navController.getBackStackEntry(Routes.MAIN_FLOW)
                }
                val analysisViewModel: AnalysisViewModel = hiltViewModel(parentEntry)

                DoctorResultScreen(
                    specialty = specialty,
                    analysisId = analysisId,
                    severity = severity,
                    onBack = { navController.popBackStack() },
                    onNewAnalysis = {
                        analysisViewModel.resetForNewAnalysis()
                        navController.navigate(Routes.HOME) {
                            popUpTo(Routes.HOME) { inclusive = true }
                        }
                    },
                )
            }
        }

        composable(Routes.HISTORY) {
            HistoryScreen(
                onOpenAnalysis = { id -> navController.navigate(Routes.historyDetail(id)) },
                onBack = { navController.popBackStack() },
            )
        }

        composable(
            route = Routes.HISTORY_DETAIL,
            arguments = listOf(navArgument("analysisId") { type = NavType.StringType }),
        ) { backStackEntry ->
            val analysisId = backStackEntry.arguments?.getString("analysisId").orEmpty()
            HistoryDetailScreen(
                analysisId = analysisId,
                onBack = { navController.popBackStack() },
                onDeleted = { navController.popBackStack() },
            )
        }

        composable(Routes.PROFILE) {
            ProfileScreen(
                onBack = { navController.popBackStack() },
                onLoggedOut = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                },
            )
        }
    }
}
