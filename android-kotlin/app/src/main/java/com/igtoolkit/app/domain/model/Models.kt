package com.igtoolkit.app.domain.model

/**
 * Research data extracted from search providers
 */
data class ResearchResult(
    val topic: String = "",
    val provider: String = "offline",
    val source: String = "local_knowledge",
    val qualityScore: Int = 0,
    val qualityLevel: QualityLevel = QualityLevel.POOR,
    val timestamp: Long = System.currentTimeMillis(),
    val results: List<SearchResult> = emptyList(),
    val entities: List<Entity> = emptyList(),
    val questions: List<Question> = emptyList(),
    val trends: List<Trend> = emptyList(),
    val insights: List<Insight> = emptyList(),
    val keywords: List<Keyword> = emptyList(),
    val painPoints: List<PainPoint> = emptyList(),
    val misconceptions: List<Misconception> = emptyList(),
    val examples: List<String> = emptyList(),
    val statistics: List<String> = emptyList()
)

data class SearchResult(
    val title: String,
    val url: String,
    val snippet: String,
    val source: String = "unknown"
)

data class Entity(
    val name: String,
    val type: String = "unknown",
    val count: Int = 1
)

data class Question(
    val text: String,
    val type: String = "other"
)

data class Trend(
    val text: String,
    val indicator: String = ""
)

data class Insight(
    val text: String,
    val insight: String = "",
    val type: String = "general"
)

data class Keyword(
    val word: String,
    val count: Int = 1
)

data class PainPoint(
    val text: String,
    val type: String = "pain_point"
)

data class Misconception(
    val text: String
)

enum class QualityLevel {
    EXCELLENT, GOOD, ADEQUATE, POOR, OFFLINE
}

/**
 * Provider health status
 */
data class ProviderHealth(
    val key: String,
    val name: String,
    val isHealthy: Boolean = false,
    val status: ProviderStatus = ProviderStatus.UNKNOWN,
    val apiKeyConfigured: Boolean = false,
    val authStatus: AuthStatus = AuthStatus.UNKNOWN,
    val successRate: Int = 0,
    val latencyMs: Int = 0,
    val lastError: String? = null,
    val consecutiveFailures: Int = 0
)

enum class ProviderStatus {
    HEALTHY, DEGRADED, FAILING, DISABLED, RATE_LIMITED, AUTH_ERROR, UNKNOWN
}

enum class AuthStatus {
    VALID, MISSING, INVALID, RATE_LIMITED, UNKNOWN
}

/**
 * Research mode
 */
enum class ResearchMode {
    ONLINE,      // Live research
    CACHE,      // Using cached research
    MEMORY,     // Using stored memory
    OFFLINE     // Using local knowledge only
}

/**
 * Content generation request
 */
data class GenerationRequest(
    val topic: String,
    val personality: Personality = Personality.VIRAL_CREATOR,
    val goal: Goal = Goal.ENGAGE,
    val audience: String = "",
    val versions: Int = 3
)

/**
 * Content generation result
 */
data class GenerationResult(
    val caption: String,
    val hashtags: List<String> = emptyList(),
    val version: Int = 1,
    val quality: Int = 0,
    val researchUsed: Boolean = false,
    val aiGenerated: Boolean = false
)

/**
 * Personality presets
 */
enum class Personality(val displayName: String, val description: String) {
    VIRAL_CREATOR("Viral Creator", "Playful, attention-grabbing content"),
    LUXURY_BRAND("Luxury Brand", "Premium, sophisticated tone"),
    STARTUP_FOUNDER("Startup Founder", "Bold, innovative voice"),
    GEN_Z("Gen Z", "Trendy, meme-savvy style"),
    MINIMALIST("Minimalist", "Clean, simple messaging"),
    FUNNY("Funny", "Humor-driven engagement"),
    STORYTELLER("Storyteller", "Narrative-driven content"),
    EDUCATIONAL("Educational", "Informative and helpful"),
    CORPORATE("Corporate", "Professional and polished"),
    INFLUENCER("Influencer", "Personal brand voice")
}

/**
 * Content goals
 */
enum class Goal(val displayName: String) {
    ENGAGE("Engage"),
    EDUCATE("Educate"),
    ENTERTAIN("Entertain"),
    INSPIRE("Inspire"),
    SELL("Sell"),
    BUILD_TRUST("Build Trust"),
    GENERATE_COMMENTS("Generate Comments"),
    GENERATE_SHARES("Generate Shares"),
    GENERATE_SAVES("Generate Saves")
}

/**
 * Knowledge Graph - Structured representation of research data
 */
data class KnowledgeGraph(
    val topic: String = "",
    val source: String = "unknown",
    val confidence: Int = 0,
    val nodes: List<KnowledgeNode> = emptyList(),
    val relationships: List<KnowledgeRelationship> = emptyList(),
    val facts: List<Fact> = emptyList(),
    val opinions: List<Opinion> = emptyList(),
    val tips: List<ActionableTip> = emptyList()
)

data class KnowledgeNode(
    val id: String,
    val type: NodeType,
    val label: String,
    val properties: Map<String, String> = emptyMap()
)

enum class NodeType {
    ENTITY, TOPIC, TREND, QUESTION, PAIN_POINT, PRODUCT, COMPANY, PERSON, KEYWORD
}

data class KnowledgeRelationship(
    val sourceId: String,
    val targetId: String,
    val type: String
)

data class Fact(
    val text: String,
    val source: String = "",
    val verified: Boolean = false
)

data class Opinion(
    val text: String,
    val sentiment: String = "neutral",
    val source: String = ""
)

data class ActionableTip(
    val text: String,
    val category: String = "general"
)

/**
 * Research Summary - Human-readable summary of research
 */
data class ResearchSummary(
    val topic: String,
    val source: String,
    val qualityScore: Int,
    val summary: String,
    val keyFindings: List<String>,
    val mainQuestion: String?,
    val trendingTopics: List<String>,
    val painPoints: List<String>
)
