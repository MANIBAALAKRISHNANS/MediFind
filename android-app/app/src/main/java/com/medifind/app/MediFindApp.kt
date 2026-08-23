package com.medifind.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/** Hilt entry point — enables @AndroidEntryPoint / @HiltViewModel throughout the app. */
@HiltAndroidApp
class MediFindApp : Application()
