package com.medifind.app.viewmodel

import com.google.common.truth.Truth.assertThat
import com.medifind.app.MainDispatcherRule
import com.medifind.app.data.api.ApiResult
import com.medifind.app.data.api.models.UserResponse
import com.medifind.app.data.repository.AuthRepository
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val authRepository: AuthRepository = mockk()
    private lateinit var viewModel: AuthViewModel

    private val fakeUser = UserResponse(id = "u1", name = "Asha Rao", email = "asha@example.com")

    @Before
    fun setup() {
        every { authRepository.isLoggedIn } returns MutableStateFlow(false)
        every { authRepository.currentUser } returns MutableStateFlow(null)
        coEvery { authRepository.loadUser() } returns null
        viewModel = AuthViewModel(authRepository)
    }

    @Test
    fun `bootstrap resolves isBootstrapping to false once loadUser completes`() = runTest {
        // With the UnconfinedTestDispatcher installed by MainDispatcherRule, the
        // init{} block's viewModelScope.launch (calling loadUser()) has already
        // run to completion by the time the ViewModel constructor returns in @Before.
        advanceUntilIdle()
        assertThat(viewModel.isBootstrapping.value).isFalse()
    }

    @Test
    fun `login with blank fields shows a validation error without calling the repository`() = runTest {
        viewModel.login("", "")
        advanceUntilIdle()

        assertThat(viewModel.uiState.value.errorMessage).isEqualTo("Please enter both email and password.")
    }

    @Test
    fun `login success marks actionSucceeded and clears loading`() = runTest {
        coEvery { authRepository.login("asha@example.com", "password1") } returns ApiResult.Success(fakeUser)

        viewModel.login("asha@example.com", "password1")
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.isLoading).isFalse()
        assertThat(state.actionSucceeded).isTrue()
        assertThat(state.errorMessage).isNull()
    }

    @Test
    fun `login failure surfaces the backend error message and does not set actionSucceeded`() = runTest {
        coEvery { authRepository.login(any(), any()) } returns
            ApiResult.Error("Invalid credentials.", code = "INVALID_CREDENTIALS")

        viewModel.login("asha@example.com", "wrong-password")
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertThat(state.errorMessage).isEqualTo("Invalid credentials.")
        assertThat(state.actionSucceeded).isFalse()
    }

    @Test
    fun `signup with blank fields shows a validation error`() = runTest {
        viewModel.signup("", "", "")
        advanceUntilIdle()

        assertThat(viewModel.uiState.value.errorMessage).isEqualTo("Please fill in every field.")
    }

    @Test
    fun `consumeError clears the error message`() = runTest {
        coEvery { authRepository.login(any(), any()) } returns ApiResult.Error("Invalid credentials.")
        viewModel.login("a@b.com", "wrong")
        advanceUntilIdle()
        assertThat(viewModel.uiState.value.errorMessage).isNotNull()

        viewModel.consumeError()

        assertThat(viewModel.uiState.value.errorMessage).isNull()
    }
}
