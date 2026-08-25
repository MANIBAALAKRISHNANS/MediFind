package com.medifind.app.data.api

import com.medifind.app.BuildConfig
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.TimeUnit
import javax.inject.Singleton
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

/**
 * Attaches `Authorization: Bearer <token>` to every request, mirroring the
 * web app's axios request interceptor (frontend-web/src/api/client.js).
 * On a 401 from any endpoint other than the auth routes, the stored token is
 * cleared — TokenManager.isLoggedInFlow then flips to false and the nav
 * graph (see ui/navigation/NavGraph.kt) reacts by routing back to Login,
 * the same "global 401 handling" the web client does via window.location.
 */
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = tokenManager.getToken()

        val request = if (!token.isNullOrBlank()) {
            original.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            original
        }

        val response = chain.proceed(request)

        if (response.code == 401 && !original.url.encodedPath.contains("/api/auth/")) {
            tokenManager.clearToken()
        }

        return response
    }
}

@Module
@InstallIn(SingletonComponent::class)
object ApiClient {

    private const val CONNECT_TIMEOUT_SECONDS = 30L
    // The backend's local rule-based diagnosis engine (see
    // backend/routes/analyze.js) plus DB/network overhead should complete
    // well within this — 35s keeps a comfortable margin without hanging forever.
    private const val READ_TIMEOUT_SECONDS = 35L
    private const val WRITE_TIMEOUT_SECONDS = 30L

    @Provides
    @Singleton
    fun provideMoshi(): Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    @Provides
    @Singleton
    fun provideAuthInterceptor(tokenManager: TokenManager): AuthInterceptor =
        AuthInterceptor(tokenManager)

    @Provides
    @Singleton
    fun provideLoggingInterceptor(): HttpLoggingInterceptor =
        HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        loggingInterceptor: HttpLoggingInterceptor,
    ): OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(CONNECT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .readTimeout(READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .writeTimeout(WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .build()

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, moshi: Moshi): Retrofit =
        Retrofit.Builder()
            // BuildConfig.API_BASE_URL is set per build type in app/build.gradle.kts:
            // 10.0.2.2 (emulator loopback) for debug, the deployed Render URL for release.
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()

    @Provides
    @Singleton
    fun provideMediFindApi(retrofit: Retrofit): MediFindApi =
        retrofit.create(MediFindApi::class.java)
}
