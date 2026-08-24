# MediFind — Android (native Kotlin)

Native Android client for MediFind, built with Kotlin + Jetpack Compose. It
talks to the same backend as the web app (`../backend`) — see
`app/src/main/java/com/medifind/app/data/api/MediFindApi.kt` for the full
endpoint list.

This app replaces the old Capacitor-wrapped WebView build. The web app now
lives at `../frontend-web` and is web-only.

## Stack

- Kotlin, 100% Jetpack Compose (Material3) — no XML layouts, no Java
- Navigation Compose for routing (`ui/navigation/NavGraph.kt`)
- Retrofit2 + OkHttp + Moshi for networking (`data/api/`)
- Room for an offline history cache (`data/local/`)
- Hilt for dependency injection
- MVVM: `viewmodel/` → `data/repository/` → `data/api/` + `data/local/`
- EncryptedSharedPreferences for the JWT (`data/api/TokenManager.kt`)
- Google Play Services FusedLocationProvider for doctor search

## Building

Requires a JDK 17+ and the Android SDK (`ANDROID_HOME` or a
`local.properties` with `sdk.dir=...`, not committed).

```bash
cd android-app
./gradlew assembleDebug
```

The debug build points at the Android emulator loopback
(`http://10.0.2.2:5000`) by default — start the backend locally
(`npm --prefix ../backend run dev`) before running the app in an emulator.
For a physical device on the same network, override at build time:

```bash
./gradlew assembleDebug -PAPI_BASE_URL=http://<your-lan-ip>:5000/
```

(or edit `API_BASE_URL` directly in `app/build.gradle.kts`'s `debug` build type).

The release build type points at the deployed Render backend URL — update
that value in `app/build.gradle.kts` before shipping a release build.

## Tests

```bash
./gradlew test          # unit tests (viewmodel/ + repository/)
```

## Follow-up: verified App Links for password reset

`ui/screens/ResetPasswordScreen.kt` is reached via an App Link
(`AndroidManifest.xml`'s `<intent-filter android:autoVerify="true">` on
`MainActivity`, matching `https://<backend host>/reset-password`, the same
URL the password-reset email already links to — see `backend/app.js`'s
`GET /reset-password` handler and `FRONTEND_URL` in `render.yaml`).

`autoVerify` alone isn't enough for Android to open the link directly in the
app instead of a browser — the backend host must also serve
`/.well-known/assetlinks.json` listing this app's **release** signing
certificate's SHA-256 fingerprint:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.medifind.app",
    "sha256_cert_fingerprints": ["<release keystore SHA-256, from `keytool -list -v -keystore <release.jks>`>"]
  }
}]
```

That file has to be hosted on the backend (outside this module) once a
release keystore exists, so it isn't included here. Until it's published,
the OS still offers "MediFind" in the share/open-with chooser for the link
(the intent-filter is valid and `BROWSABLE` either way) — and
`ResetPasswordScreen` has a manual paste-the-link/code fallback for whenever
the user ends up in a browser instead.
