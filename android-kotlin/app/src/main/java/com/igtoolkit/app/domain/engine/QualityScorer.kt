package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*

/**
 * Research Quality Scorer
 * Scores research based on 7 criteria
 */
class QualityScorer {
    
    private val weights = mapOf(
        "results" to 20,
        "entities" to 15,
        "questions" to 10,
        "trends" to 15,
        "insights" to 15,
        "freshness" to 10,
        "diversity" to 15
    )
    
    /**
     * Score research quality, returns 0-100
     */
    fun score(research: ResearchResult): Int {
        var totalScore = 0.0
        
        // Results score (20%)
        val resultsScore = scoreResults(research.results)
        totalScore += resultsScore * (weights["results"] ?: 20) / 100.0
        
        // Entities score (15%)
        val entitiesScore = scoreEntities(research.entities)
        totalScore += entitiesScore * (weights["entities"] ?: 15) / 100.0
        
        // Questions score (10%)
        val questionsScore = scoreQuestions(research.questions)
        totalScore += questionsScore * (weights["questions"] ?: 10) / 100.0
        
        // Trends score (15%)
        val trendsScore = scoreTrends(research.trends)
        totalScore += trendsScore * (weights["trends"] ?: 15) / 100.0
        
        // Insights score (15%)
        val insightsScore = scoreInsights(research.insights)
        totalScore += insightsScore * (weights["insights"] ?: 15) / 100.0
        
        // Freshness score (10%)
        val freshnessScore = scoreFreshness(research.timestamp)
        totalScore += freshnessScore * (weights["freshness"] ?: 10) / 100.0
        
        // Diversity score (15%)
        val diversityScore = scoreDiversity(research)
        totalScore += diversityScore * (weights["diversity"] ?: 15) / 100.0
        
        return totalScore.toInt().coerceIn(0, 100)
    }
    
    private fun scoreResults(results: List<SearchResult>): Int {
        if (results.isEmpty()) return 0
        val useful = results.filter { it.snippet.length > 50 }
        return when {
            useful.size >= 10 -> 100
            useful.size >= 7 -> 80
            useful.size >= 5 -> 60
            useful.size >= 3 -> 40
            useful.size >= 1 -> 20
            else -> 0
        }
    }
    
    private fun scoreEntities(entities: List<Entity>): Int {
        if (entities.isEmpty()) return 0
        return when {
            entities.size >= 15 -> 100
            entities.size >= 10 -> 80
            entities.size >= 7 -> 60
            entities.size >= 5 -> 40
            entities.size >= 3 -> 20
            else -> 10
        }
    }
    
    private fun scoreQuestions(questions: List<Question>): Int {
        if (questions.isEmpty()) return 0
        return when {
            questions.size >= 10 -> 100
            questions.size >= 7 -> 80
            questions.size >= 5 -> 60
            questions.size >= 3 -> 40
            questions.size >= 1 -> 20
            else -> 0
        }
    }
    
    private fun scoreTrends(trends: List<Trend>): Int {
        if (trends.isEmpty()) return 0
        return when {
            trends.size >= 8 -> 100
            trends.size >= 5 -> 70
            trends.size >= 3 -> 50
            trends.size >= 1 -> 30
            else -> 0
        }
    }
    
    private fun scoreInsights(insights: List<Insight>): Int {
        if (insights.isEmpty()) return 0
        return when {
            insights.size >= 8 -> 100
            insights.size >= 5 -> 70
            insights.size >= 3 -> 50
            insights.size >= 1 -> 30
            else -> 0
        }
    }
    
    private fun scoreFreshness(timestamp: Long): Int {
        val age = System.currentTimeMillis() - timestamp
        val hour = 3600000L
        val day = hour * 24
        
        return when {
            age < hour -> 100
            age < day -> 80
            age < day * 2 -> 60
            age < day * 7 -> 40
            age < day * 30 -> 20
            else -> 0
        }
    }
    
    private fun scoreDiversity(research: ResearchResult): Int {
        var typesFound = 0
        val totalTypes = 8
        
        if (research.entities.isNotEmpty()) typesFound++
        if (research.questions.isNotEmpty()) typesFound++
        if (research.trends.isNotEmpty()) typesFound++
        if (research.insights.isNotEmpty()) typesFound++
        if (research.keywords.isNotEmpty()) typesFound++
        if (research.painPoints.isNotEmpty()) typesFound++
        if (research.misconceptions.isNotEmpty()) typesFound++
        if (research.examples.isNotEmpty()) typesFound++
        
        return (typesFound.toFloat() / totalTypes * 100).toInt()
    }
    
    /**
     * Get score description
     */
    fun getDescription(score: Int): String {
        return when {
            score >= 90 -> "Excellent - Rich, diverse research data"
            score >= 70 -> "Good - Solid research with multiple data types"
            score >= 50 -> "Adequate - Basic research data"
            score >= 30 -> "Poor - Limited research data"
            else -> "Insufficient - Research below quality threshold"
        }
    }
}
