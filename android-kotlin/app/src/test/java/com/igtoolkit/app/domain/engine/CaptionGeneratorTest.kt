package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.GenerationRequest
import com.igtoolkit.app.domain.model.Goal
import com.igtoolkit.app.domain.model.Personality
import com.igtoolkit.app.domain.model.ResearchResult
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class CaptionGeneratorTest {

    private lateinit var generator: CaptionGenerator

    @Before
    fun setUp() {
        generator = CaptionGenerator()
    }

    @Test
    fun `generate produces a non-empty caption and marks aiGenerated false`() {
        val request = GenerationRequest(topic = "coffee", personality = Personality.VIRAL_CREATOR, goal = Goal.ENGAGE)
        val result = generator.generate(request, research = null)

        assertTrue(result.caption.isNotBlank())
        assertFalse(result.aiGenerated)
    }

    @Test
    fun `generate falls back gracefully with no research`() {
        val request = GenerationRequest(topic = "productivity", personality = Personality.EDUCATIONAL, goal = Goal.EDUCATE)
        val result = generator.generate(request, research = null)

        assertFalse(result.researchUsed)
        assertTrue(result.hashtags.isNotEmpty())
    }

    @Test
    fun `poor quality research is not treated as usable`() {
        val request = GenerationRequest(topic = "fitness", personality = Personality.VIRAL_CREATOR, goal = Goal.ENGAGE)
        val lowQualityResearch = ResearchResult(topic = "fitness", source = "live_research", qualityScore = 10)

        val result = generator.generate(request, lowQualityResearch)

        assertFalse(result.researchUsed)
    }

    @Test
    fun `generateMultiple returns the requested number of versions with distinct version numbers`() {
        val request = GenerationRequest(topic = "travel", versions = 3)
        val results = generator.generateMultiple(request, research = null, count = 3)

        assertEquals(3, results.size)
        assertEquals(listOf(1, 2, 3), results.map { it.version })
    }

    @Test
    fun `hashtags never exceed 15 and are unique`() {
        val request = GenerationRequest(topic = "food and drink")
        val result = generator.generate(request, research = null)

        assertTrue(result.hashtags.size <= 15)
        assertEquals(result.hashtags.size, result.hashtags.distinct().size)
    }
}
