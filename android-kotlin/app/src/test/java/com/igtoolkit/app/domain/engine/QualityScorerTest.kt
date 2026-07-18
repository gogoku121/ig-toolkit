package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.Entity
import com.igtoolkit.app.domain.model.Insight
import com.igtoolkit.app.domain.model.Question
import com.igtoolkit.app.domain.model.ResearchResult
import com.igtoolkit.app.domain.model.SearchResult
import com.igtoolkit.app.domain.model.Trend
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class QualityScorerTest {

    private lateinit var scorer: QualityScorer

    @Before
    fun setUp() {
        scorer = QualityScorer()
    }

    @Test
    fun `empty and stale research scores zero`() {
        // timestamp=0L makes freshness score 0 too - a fresh-but-otherwise-empty
        // ResearchResult would actually score 10 (freshness alone is 10% weight).
        val research = ResearchResult(timestamp = 0L)
        assertEquals(0, scorer.score(research))
    }

    @Test
    fun `rich fresh research covering all 8 diversity types scores 100`() {
        val research = ResearchResult(
            timestamp = System.currentTimeMillis(),
            results = (1..10).map { SearchResult(title = "t$it", url = "u$it", snippet = "s".repeat(60)) },
            entities = (1..15).map { Entity(name = "entity$it") },
            questions = (1..10).map { Question(text = "q$it") },
            trends = (1..8).map { Trend(text = "trend$it") },
            insights = (1..8).map { Insight(text = "insight$it") },
            keywords = listOf(com.igtoolkit.app.domain.model.Keyword(word = "kw")),
            painPoints = listOf(com.igtoolkit.app.domain.model.PainPoint(text = "pain")),
            misconceptions = listOf(com.igtoolkit.app.domain.model.Misconception(text = "myth")),
            examples = listOf("example")
        )
        assertEquals(100, scorer.score(research))
    }

    @Test
    fun `score is always clamped between 0 and 100`() {
        val research = ResearchResult(timestamp = 0L) // maximally stale, everything empty
        val score = scorer.score(research)
        assertTrue(score in 0..100)
    }

    @Test
    fun `getDescription buckets match the score thresholds`() {
        assertEquals("Excellent - Rich, diverse research data", scorer.getDescription(95))
        assertEquals("Good - Solid research with multiple data types", scorer.getDescription(75))
        assertEquals("Adequate - Basic research data", scorer.getDescription(55))
        assertEquals("Poor - Limited research data", scorer.getDescription(35))
        assertEquals("Insufficient - Research below quality threshold", scorer.getDescription(10))
    }
}
