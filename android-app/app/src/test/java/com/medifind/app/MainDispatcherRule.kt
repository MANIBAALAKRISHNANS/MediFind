package com.medifind.app

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.TestDispatcher
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.rules.TestWatcher
import org.junit.runner.Description
import kotlinx.coroutines.Dispatchers

/**
 * Swaps Dispatchers.Main for an UnconfinedTestDispatcher for the duration of
 * a test. Unconfined (rather than Standard) is used deliberately: it runs
 * viewModelScope.launch { ... } bodies eagerly up to their first real
 * suspension point, so assertions don't need to coordinate with runTest's
 * own TestCoroutineScheduler (which is a separate instance from this rule's).
 */
@OptIn(ExperimentalCoroutinesApi::class)
class MainDispatcherRule(
    private val testDispatcher: TestDispatcher = UnconfinedTestDispatcher(),
) : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(testDispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
