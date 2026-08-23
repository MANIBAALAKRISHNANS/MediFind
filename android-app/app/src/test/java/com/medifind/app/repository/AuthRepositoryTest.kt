package com.medifind.app.repository

import com.google.common.truth.Truth.assertThat
import com.medifind.app.data.api.ApiCallExecutor
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.MediFindApi
import com.medifind.app.data.api.TokenManager
import com.medifind.app.data.api.models.TokenResponse
import com.medifind.app.data.api.models.UserResponse
import com.medifind.app.data.repository.AuthRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Test

class AuthRepositoryTest {

    private val api: MediFindApi = mockk()
    private val tokenManager: TokenManager = mockk(relaxUnitFun = true)
    private val executor: ApiCallExecutor = mockk()

    private lateinit var repository: AuthRepository

    private val fakeUser = UserResponse(id = "u1", name = "Asha Rao", email = "asha@example.com")

    @Before
    fun setup() {
        every { tokenManager.isLoggedInFlow } returns MutableStateFlow(false)
        repository = AuthRepository(api, tokenManager, executor)
    }

    @Test
    fun `login success saves token and exposes the user`() = runTest {
        val tokenResponse = TokenResponse(user = fakeUser, token = "jwt-123")
        coEvery { executor.execute<TokenResponse>(any()) } returns ApiResult.Success(tokenResponse)

        val result = repository.login("asha@example.com", "password1")

        assertThat(result).isInstanceOf(ApiResult.Success::class.java)
        assertThat((result as ApiResult.Success).data).isEqualTo(fakeUser)
        assertThat(repository.currentUser.value).isEqualTo(fakeUser)
        verify { tokenManager.saveToken("jwt-123") }
    }

    @Test
    fun `login failure surfaces the real backend error message`() = runTest {
        coEvery { executor.execute<TokenResponse>(any()) } returns
            ApiResult.Error("Invalid credentials.", code = "INVALID_CREDENTIALS", httpStatus = 401)

        val result = repository.login("asha@example.com", "wrong-password")

        assertThat(result).isInstanceOf(ApiResult.Error::class.java)
        assertThat((result as ApiResult.Error).message).isEqualTo("Invalid credentials.")
        verify(exactly = 0) { tokenManager.saveToken(any()) }
    }

    @Test
    fun `logout clears the token even when the API call fails`() = runTest {
        // ApiCallExecutor.execute() never throws by contract — a network failure
        // surfaces as ApiResult.Error, same as any other backend call.
        coEvery { executor.execute<com.medifind.app.data.api.models.MessageResponse>(any()) } returns
            ApiResult.Error("Unable to connect to the server. Please check your internet connection and try again.", code = "NETWORK_ERROR")

        repository.logout()

        verify { tokenManager.clearToken() }
        assertThat(repository.currentUser.value).isNull()
    }

    @Test
    fun `loadUser does nothing when no token is stored`() = runTest {
        every { tokenManager.isLoggedIn() } returns false

        val result = repository.loadUser()

        assertThat(result).isNull()
        coVerify(exactly = 0) { executor.execute<UserResponse>(any()) }
    }

    @Test
    fun `loadUser clears the token when the stored session is rejected`() = runTest {
        every { tokenManager.isLoggedIn() } returns true
        coEvery { executor.execute<UserResponse>(any()) } returns
            ApiResult.Error("Invalid or expired token.", code = "UNAUTHORIZED", httpStatus = 401)

        val result = repository.loadUser()

        assertThat(result).isInstanceOf(ApiResult.Error::class.java)
        verify { tokenManager.clearToken() }
        assertThat(repository.currentUser.value).isNull()
    }
}
