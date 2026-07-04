package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*

/**
 * Research Extractor - Extracts structured data from search results
 */
class ResearchExtractor {
    
    /**
     * Extract all structured data from search results
     */
    fun extract(results: List<SearchResult>, topic: String = ""): ResearchResult {
        val allText = results.joinToString(" ") { "${it.title} ${it.snippet}" }
        
        return ResearchResult(
            topic = topic,
            provider = "extracted",
            source = "search_results",
            qualityScore = 0,
            qualityLevel = QualityLevel.POOR,
            timestamp = System.currentTimeMillis(),
            results = results,
            entities = extractEntities(allText),
            questions = extractQuestions(allText),
            trends = extractTrends(allText),
            insights = extractInsights(allText),
            keywords = extractKeywords(allText),
            painPoints = extractPainPoints(allText),
            misconceptions = extractMisconceptions(allText),
            examples = extractExamples(allText),
            statistics = extractStatistics(allText)
        )
    }
    
    private fun extractEntities(text: String): List<Entity> {
        val entities = mutableListOf<Entity>()
        
        // Extract capitalized phrases
        val pattern = Regex("\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)\\b")
        val matches = pattern.findAll(text).toList()
        
        // Count occurrences
        val counts = mutableMapOf<String, Int>()
        matches.forEach { 
            val name = it.value
            if (!isCommonWord(name)) {
                counts[name] = (counts[name] ?: 0) + 1
            }
        }
        
        // Entities mentioned multiple times
        counts.filter { it.value >= 2 }
            .forEach { (name, count) ->
                val type = when {
                    isCompany(name) -> "company"
                    isPerson(name) -> "person"
                    isProduct(name) -> "product"
                    else -> "unknown"
                }
                entities.add(Entity(name, type, count))
            }
        
        return entities.take(20)
    }
    
    private fun extractQuestions(text: String): List<Question> {
        val questions = mutableListOf<Question>()
        
        val patterns = listOf(
            Regex("\\bwhat\\s+(is|are|does|do)\\s+[^?]+\\?", RegexOption.IGNORE_CASE),
            Regex("\\bhow\\s+(to|do|does|can)\\s+[^?]+\\?", RegexOption.IGNORE_CASE),
            Regex("\\bwhy\\s+[^?]+\\?", RegexOption.IGNORE_CASE),
            Regex("\\bis\\s+[^?]+\\?", RegexOption.IGNORE_CASE),
            Regex("\\bcan\\s+[^?]+\\?", RegexOption.IGNORE_CASE),
            Regex("\\bshould\\s+[^?]+\\?", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val questionText = match.value.trim()
                if (questionText.length in 15..200) {
                    questions.add(Question(questionText, classifyQuestion(questionText)))
                }
            }
        }
        
        return questions.distinctBy { it.text.lowercase().take(30) }.take(15)
    }
    
    private fun extractTrends(text: String): List<Trend> {
        val trends = mutableListOf<Trend>()
        
        val patterns = listOf(
            Regex("\\b(trending|viral|popular|growing|emerging)\\s+([a-z\\s]+?)(?=,|\\.|\$)", RegexOption.IGNORE_CASE),
            Regex("\\b(202[0-9])\\s+([a-z\\s]+?)(?=,|\\.|\$)", RegexOption.IGNORE_CASE),
            Regex("\\b(upcoming|forecast|predicted)\\s+([a-z\\s]+?)(?=,|\\.|\$)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val trendText = (match.groupValues[2] ?: match.groupValues[1]).trim()
                if (trendText.length in 3..50) {
                    trends.add(Trend(trendText, match.groupValues[1]))
                }
            }
        }
        
        return trends.distinctBy { it.text.lowercase() }.take(10)
    }
    
    private fun extractInsights(text: String): List<Insight> {
        val insights = mutableListOf<Insight>()
        
        val patterns = listOf(
            Regex("the\\s+(truth|secret|key|main|real|important)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("what\\s+nobody\\s+(tells|talks|shares|mentions)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("here'?s?\\s+(what|the)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("most\\s+people\\s+(don't|never|ignore|overlook)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("the\\s+(problem|issue|reason|cause)\\s+([^.]+)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val insightText = match.value.trim()
                if (insightText.length in 10..200) {
                    insights.add(Insight(
                        text = insightText,
                        insight = match.groupValues.getOrNull(2) ?: "",
                        type = classifyInsight(match.value)
                    ))
                }
            }
        }
        
        return insights.distinctBy { it.text.lowercase().take(20) }.take(10)
    }
    
    private fun extractKeywords(text: String): List<Keyword> {
        val words = text.split(Regex("\\W+"))
            .filter { it.length >= 4 }
            .map { it.lowercase() }
        
        val counts = mutableMapOf<String, Int>()
        words.forEach { counts[it] = (counts[it] ?: 0) + 1 }
        
        val stopWords = setOf(
            "that", "this", "with", "from", "have", "been", "were", "they",
            "their", "what", "when", "where", "which", "about", "would",
            "could", "should", "there", "here", "these", "those", "being",
            "other", "some", "into", "only", "very", "just", "than", "also"
        )
        
        return counts
            .filter { !stopWords.contains(it.key) }
            .toList()
            .sortedByDescending { it.second }
            .take(30)
            .map { Keyword(it.first, it.second) }
    }
    
    private fun extractPainPoints(text: String): List<PainPoint> {
        val painPoints = mutableListOf<PainPoint>()
        
        val patterns = listOf(
            Regex("struggle[s]?\\s+(?:with|from)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("problem[s]?\\s+(?:with|in)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("challenge[s]?\\s+(?:with|in)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("frustrat[ing|ed]\\s+(?:with|by)\\s+([^.]+)", RegexOption.IGNORE_CASE),
            Regex("difficult[yies]?\\s+(?:with|in)\\s+([^.]+)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val painText = (match.groupValues[1]).trim()
                if (painText.length in 5..100) {
                    painPoints.add(PainPoint(painText, "pain_point"))
                }
            }
        }
        
        return painPoints.distinctBy { it.text.lowercase().take(30) }.take(10)
    }
    
    private fun extractMisconceptions(text: String): List<Misconception> {
        val misconceptions = mutableListOf<Misconception>()
        
        val patterns = listOf(
            Regex("myth\\s*[:\\-]?\\s*([^.]+)", RegexOption.IGNORE_CASE),
            Regex("wrong\\s+belief\\s*[:\\-]?\\s*([^.]+)", RegexOption.IGNORE_CASE),
            Regex("common\\s+misconception\\s*[:\\-]?\\s*([^.]+)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val text = match.value.trim()
                if (text.length in 10..200) {
                    misconceptions.add(Misconception(text))
                }
            }
        }
        
        return misconceptions.distinctBy { it.text.lowercase().take(30) }.take(5)
    }
    
    private fun extractExamples(text: String): List<String> {
        val examples = mutableListOf<String>()
        
        val patterns = listOf(
            Regex("for\\s+example\\s*[:\\-]?\\s*([^.]+)", RegexOption.IGNORE_CASE),
            Regex("for\\s+instance\\s*[:\\-]?\\s*([^.]+)", RegexOption.IGNORE_CASE),
            Regex("such\\s+as\\s+([^.]+)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val example = match.groupValues[1].trim()
                if (example.length in 10..300) {
                    examples.add(example)
                }
            }
        }
        
        return examples.distinct().take(5)
    }
    
    private fun extractStatistics(text: String): List<String> {
        val statistics = mutableListOf<String>()
        
        val patterns = listOf(
            Regex("\\d+%"),
            Regex("\\d+x"),
            Regex("\\d+\\s+(million|billion|thousand)", RegexOption.IGNORE_CASE),
            Regex("\\$\\d+"),
            Regex("\\d+\\s+(hours|days|weeks|months|years)\\s+(?:of|per|every)", RegexOption.IGNORE_CASE)
        )
        
        patterns.forEach { pattern ->
            pattern.findAll(text).forEach { match ->
                val stat = match.value.trim()
                if (stat.length in 1..30) {
                    statistics.add(stat)
                }
            }
        }
        
        return statistics.distinct().take(10)
    }
    
    private fun isCommonWord(word: String): Boolean {
        val common = setOf(
            "The", "This", "That", "These", "Those", "There", "Here", "What",
            "When", "Where", "Why", "How", "Which", "Who", "Just", "Only"
        )
        return common.contains(word)
    }
    
    private fun isCompany(name: String): Boolean {
        val suffixes = listOf("Inc", "Corp", "LLC", "Ltd", "Company", "Co", 
            "Technologies", "Solutions", "Systems", "Labs", "Ventures", 
            "Capital", "Partners", "Media", "Group", "Holdings")
        return suffixes.any { name.contains(it) }
    }
    
    private fun isPerson(name: String): Boolean {
        val titles = listOf("CEO", "CTO", "CFO", "Founder", "Director", "Expert", "Analyst")
        return titles.any { name.contains(it) }
    }
    
    private fun isProduct(name: String): Boolean {
        val types = listOf("App", "Tool", "Software", "Platform", "Service", "Plugin")
        return types.any { name.contains(it) }
    }
    
    private fun classifyQuestion(text: String): String {
        val lower = text.lowercase()
        return when {
            lower.startsWith("what") -> "what"
            lower.startsWith("how") -> "how"
            lower.startsWith("why") -> "why"
            lower.startsWith("when") -> "when"
            lower.startsWith("where") -> "where"
            lower.startsWith("is") || lower.startsWith("are") -> "yesno"
            lower.startsWith("can") -> "capability"
            lower.startsWith("should") -> "advice"
            else -> "other"
        }
    }
    
    private fun classifyInsight(text: String): String {
        val lower = text.lowercase()
        return when {
            lower.contains("secret") -> "secret"
            lower.contains("truth") || lower.contains("myth") -> "truth"
            lower.contains("nobody") -> "gap"
            lower.contains("most people") -> "behavior"
            lower.contains("problem") || lower.contains("issue") -> "problem"
            else -> "general"
        }
    }
}
