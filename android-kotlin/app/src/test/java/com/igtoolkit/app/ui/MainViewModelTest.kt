package com.igtoolkit.app.ui

import com.igtoolkit.app.data.local.DraftDao
import com.igtoolkit.app.domain.engine.CaptionGenerator
import com.igtoolkit.app.domain.engine.LlmCaptionClient
import com.igtoolkit.app.domain.engine.ResearchEngine
import com.igtoolkit.app.domain.model.GenerationResult
import com.igtoolkit.app.domain.model.ResearchMode
import com.igtoolkit.app.domain.model.ResearchResult
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class MainViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    private lateinit var researchEngine: ResearchEngine
    private lateinit var captionGenerator: CaptionGenerator
    private lateinit var llmCaptionClient: LlmCaptionClient
    private lateinit var draftDao: DraftDao
    private lateinit var viewModel: MainViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)

        researchEngine = mockk(relaxed = true)
        every { researchEngine.currentMode } returns MutableStateFlow(ResearchMode.OFFLINE)
        every { researchEngine.researchStatus } returns MutableStateFlow(ResearchEngine.ResearchStatus())
        every { researchEngine.providerHealth } returns MutableStateFlow(emptyMap())
        every { researchEngine.debugLog } returns MutableStateFlow(emptyList())

        captionGenerator = mockk(relaxed = true)

        llmCaptionClient = mockk(relaxed = true)
        every { llmCaptionClient.isConfigured } returns false

        draftDao = mockk(relaxed = true)
        every { draftDao.observeAll() } returns flowOf(emptyList())

        viewModel = MainViewModel(researchEngine, captionGenerator, llmCaptionClient, draftDao)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `generate with blank topic sets an error and never calls research`() = runTest {
        viewModel.generate()
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals("Please enter a topic", viewModel.uiState.value.error)
        coVerify(exactly = 0) { researchEngine.research(any()) }
    }

    @Test
    fun `generate happy path uses template generator when LLM backend is not configured`() = runTest {
        viewModel.updateTopic("coffee")

        val research = ResearchResult(topic = "coffee", source = "live_research", qualityScore = 80)
        coEvery { researchEngine.research("coffee") } returns research

        val expected = listOf(GenerationResult(caption = "Test caption", hashtags = listOf("#Coffee")))
        every { captionGenerator.generateMultiple(any(), research, any()) } returns expected

        viewModel.generate()
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(expected, viewModel.generatedCaptions.value)
        assertFalse(viewModel.uiState.value.isLoading)
        coVerify { draftDao.insert(any()) }
    }

    @Test
    fun `generate falls back to templates when the LLM path throws`() = runTest {
        viewModel.updateTopic("travel")

        val research = ResearchResult(topic = "travel", source = "live_research", qualityScore = 70)
        coEvery { researchEngine.research("travel") } returns research
        every { llmCaptionClient.isConfigured } returns true
        coEvery { llmCaptionClient.generate(any(), research) } throws IllegalStateException("backend unreachable")

        val fallback = listOf(GenerationResult(caption = "Fallback caption"))
        every { captionGenerator.generateMultiple(any(), research, any()) } returns fallback

        viewModel.generate()
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(fallback, viewModel.generatedCaptions.value)
        assertFalse(viewModel.uiState.value.isLoading)
    }
}
