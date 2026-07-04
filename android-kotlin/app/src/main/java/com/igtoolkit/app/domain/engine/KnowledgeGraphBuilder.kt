package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*

/**
 * Builds a Knowledge Graph from Research Results
 * 
 * This converts raw research data into structured knowledge that can be
 * used for caption generation.
 */
class KnowledgeGraphBuilder {
    
    private var nodeIdCounter = 0
    
    /**
     * Build a Knowledge Graph from research results
     */
    fun build(research: ResearchResult): KnowledgeGraph {
        nodeIdCounter = 0
        
        val nodes = mutableListOf<KnowledgeNode>()
        val relationships = mutableListOf<KnowledgeRelationship>()
        
        // Add topic node
        val topicNodeId = "topic_${nodeIdCounter++}"
        nodes.add(KnowledgeNode(
            id = topicNodeId,
            type = NodeType.TOPIC,
            label = research.topic
        ))
        
        // Add entity nodes
        research.entities.forEach { entity ->
            val entityNodeId = "entity_${nodeIdCounter++}"
            nodes.add(KnowledgeNode(
                id = entityNodeId,
                type = NodeType.ENTITY,
                label = entity.name,
                properties = mapOf("entityType" to entity.type)
            ))
            relationships.add(KnowledgeRelationship(topicNodeId, entityNodeId, "mentions"))
        }
        
        // Add question nodes
        research.questions.forEach { question ->
            val questionNodeId = "question_${nodeIdCounter++}"
            nodes.add(KnowledgeNode(
                id = questionNodeId,
                type = NodeType.QUESTION,
                label = question.text
            ))
            relationships.add(KnowledgeRelationship(topicNodeId, questionNodeId, "raises"))
        }
        
        // Add trend nodes
        research.trends.forEach { trend ->
            val trendNodeId = "trend_${nodeIdCounter++}"
            nodes.add(KnowledgeNode(
                id = trendNodeId,
                type = NodeType.TREND,
                label = trend.text,
                properties = mapOf("indicator" to trend.indicator)
            ))
            relationships.add(KnowledgeRelationship(topicNodeId, trendNodeId, "trending"))
        }
        
        // Add pain point nodes
        research.painPoints.forEach { painPoint ->
            val painNodeId = "pain_${nodeIdCounter++}"
            nodes.add(KnowledgeNode(
                id = painNodeId,
                type = NodeType.PAIN_POINT,
                label = painPoint.text
            ))
            relationships.add(KnowledgeRelationship(topicNodeId, painNodeId, "addresses"))
        }
        
        // Add keyword nodes
        research.keywords.take(10).forEach { keyword ->
            val keywordNodeId = "keyword_${nodeIdCounter++}"
            nodes.add(KnowledgeNode(
                id = keywordNodeId,
                type = NodeType.KEYWORD,
                label = keyword.word,
                properties = mapOf("count" to keyword.count.toString())
            ))
            relationships.add(KnowledgeRelationship(topicNodeId, keywordNodeId, "related_to"))
        }
        
        // Extract facts from search results
        val facts = research.results
            .filter { it.snippet.length > 50 }
            .take(10)
            .map { result ->
                Fact(
                    text = result.snippet.take(200),
                    source = result.source,
                    verified = result.url.isNotEmpty()
                )
            }
        
        // Extract opinions from insights
        val opinions = research.insights.map { insight ->
            Opinion(
                text = insight.text.take(150),
                sentiment = insight.type,
                source = insight.insight
            )
        }
        
        // Generate actionable tips from research
        val tips = generateTips(research)
        
        // Calculate confidence based on data richness
        val confidence = calculateConfidence(research, nodes.size)
        
        return KnowledgeGraph(
            topic = research.topic,
            source = research.source,
            confidence = confidence,
            nodes = nodes,
            relationships = relationships,
            facts = facts,
            opinions = opinions,
            tips = tips
        )
    }
    
    /**
     * Generate actionable tips from research data
     */
    private fun generateTips(research: ResearchResult): List<ActionableTip> {
        val tips = mutableListOf<ActionableTip>()
        
        // From questions
        research.questions.take(3).forEach { question ->
            tips.add(ActionableTip(
                text = "Consider addressing: ${question.text}",
                category = "engagement"
            ))
        }
        
        // From insights
        research.insights.take(3).forEach { insight ->
            tips.add(ActionableTip(
                text = insight.text.take(100),
                category = "insight"
            ))
        }
        
        // From trends
        research.trends.take(2).forEach { trend ->
            tips.add(ActionableTip(
                text = "Trending: ${trend.text}",
                category = "trending"
            ))
        }
        
        return tips.distinctBy { it.text.take(50) }
    }
    
    /**
     * Calculate confidence score based on data richness
     */
    private fun calculateConfidence(research: ResearchResult, nodeCount: Int): Int {
        var score = 0
        
        // Results contribute to confidence
        score += minOf(research.results.size * 3, 30)
        
        // Entities contribute
        score += minOf(research.entities.size * 4, 20)
        
        // Insights contribute
        score += minOf(research.insights.size * 5, 20)
        
        // Questions contribute
        score += minOf(research.questions.size * 3, 15)
        
        // Trends contribute
        score += minOf(research.trends.size * 5, 15)
        
        return score.coerceIn(0, 100)
    }
    
    /**
     * Create a research summary from research data
     */
    fun createSummary(research: ResearchResult): ResearchSummary {
        val keyFindings = mutableListOf<String>()
        
        // Top entities as findings
        research.entities.take(3).forEach { entity ->
            keyFindings.add("${entity.name} (${entity.type})")
        }
        
        // Top insights as findings
        research.insights.take(3).forEach { insight ->
            keyFindings.add(insight.text.take(80))
        }
        
        // Statistics as findings
        research.statistics.take(2).forEach { stat ->
            keyFindings.add(stat)
        }
        
        return ResearchSummary(
            topic = research.topic,
            source = research.provider,
            qualityScore = research.qualityScore,
            summary = buildSummaryText(research),
            keyFindings = keyFindings,
            mainQuestion = research.questions.firstOrNull()?.text,
            trendingTopics = research.trends.map { it.text },
            painPoints = research.painPoints.map { it.text }
        )
    }
    
    private fun buildSummaryText(research: ResearchResult): String {
        return buildString {
            if (research.entities.isNotEmpty()) {
                append("Key entities include ${research.entities.take(3).joinToString(", ") { it.name }}. ")
            }
            if (research.insights.isNotEmpty()) {
                append("Key insight: ${research.insights.first().text.take(100)}. ")
            }
            if (research.questions.isNotEmpty()) {
                append("Common question: ${research.questions.first().text}")
            }
        }.take(300)
    }
}
