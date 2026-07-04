package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Research Engine - Main orchestrator with quality-aware provider selection
 */
class ResearchEngine {
    
    private val providerManager = ProviderManager()
    private val researchCache = ResearchCache()
    private val qualityScorer = QualityScorer()
    private val extractor = ResearchExtractor()
    
    private val _currentMode = MutableStateFlow(ResearchMode.OFFLINE)
    val currentMode: StateFlow<ResearchMode> = _currentMode.asStateFlow()
    
    private val _providerHealth = MutableStateFlow<Map<String, ProviderHealth>>(emptyMap())
    val providerHealth: StateFlow<Map<String, ProviderHealth>> = _providerHealth.asStateFlow()
    
    private val _debugLog = MutableStateFlow<List<DebugLogEntry>>(emptyList())
    val debugLog: StateFlow<List<DebugLogEntry>> = _debugLog.asStateFlow()
    
    private var lastProvider: String? = null
    private val qualityThreshold = 40
    
    data class DebugLogEntry(
        val timestamp: Long = System.currentTimeMillis(),
        val message: String
    )
    
    /**
     * Execute research with priority chain: Live → Cache → Memory → Local
     */
    suspend fun research(query: String): ResearchResult {
        addLog("Starting research for: $query")
        _currentMode.value = ResearchMode.ONLINE
        
        // Update provider health
        updateProviderHealth()
        
        // Priority 1: Try live research
        if (isNetworkAvailable()) {
            val liveResult = tryLiveResearch(query)
            if (liveResult != null && liveResult.qualityScore >= qualityThreshold) {
                addLog("Live research successful, quality: ${liveResult.qualityScore}")
                return liveResult
            }
            addLog("Live research insufficient, trying cache")
        }
        
        // Priority 2: Try cache
        val cached = researchCache.get(query)
        if (cached != null && !researchCache.isExpired(query)) {
            val extracted = extractor.extract(cached)
            val quality = qualityScorer.score(extracted)
            
            if (quality >= qualityThreshold) {
                _currentMode.value = ResearchMode.CACHE
                addLog("Using cached research, quality: $quality")
                return extracted.copy(
                    provider = "cache",
                    source = "cached_research",
                    qualityScore = quality,
                    qualityLevel = getQualityLevel(quality)
                )
            }
        }
        
        // Priority 3: Memory (placeholder)
        addLog("No memory data, using local knowledge")
        
        // Priority 4: Local knowledge
        _currentMode.value = ResearchMode.OFFLINE
        addLog("Entering OFFLINE mode with local knowledge")
        
        return createOfflineResearch(query)
    }
    
    private suspend fun tryLiveResearch(query: String): ResearchResult? {
        val healthyProviders = providerManager.getHealthyProviders()
        
        for (providerKey in healthyProviders) {
            addLog("Trying provider: $providerKey")
            
            val startTime = System.currentTimeMillis()
            val response = providerManager.search(query, providerKey)
            val latency = (System.currentTimeMillis() - startTime).toInt()
            
            if (response.success && response.results.isNotEmpty()) {
                addLog("Provider $providerKey succeeded in ${latency}ms")
                
                // Extract and score
                val extracted = extractor.extract(response.results, query)
                val quality = qualityScorer.score(extracted)
                
                // Update health
                updateProviderHealth(providerKey, true, latency)
                
                // Cache successful research
                researchCache.set(query, response.results)
                
                lastProvider = providerKey
                
                return extracted.copy(
                    topic = query,
                    provider = providerKey,
                    source = "live_research",
                    qualityScore = quality,
                    qualityLevel = getQualityLevel(quality),
                    timestamp = System.currentTimeMillis()
                )
            } else {
                addLog("Provider $providerKey failed: ${response.error}")
                updateProviderHealth(providerKey, false, latency, response.error)
            }
        }
        
        return null
    }
    
    private fun updateProviderHealth(key: String? = null, success: Boolean = false, latency: Int = 0, error: String? = null) {
        val healthMap = mutableMapOf<String, ProviderHealth>()
        
        providerManager.getProviders().forEach { (providerKey, config) ->
            val isHealthy = providerManager.isProviderHealthy(providerKey)
            healthMap[providerKey] = ProviderHealth(
                key = providerKey,
                name = config.name,
                isHealthy = isHealthy,
                status = when {
                    !config.enabled -> ProviderStatus.DISABLED
                    config.requiresApiKey && config.apiKey.isNullOrEmpty() -> ProviderStatus.AUTH_ERROR
                    !isHealthy -> ProviderStatus.FAILING
                    else -> ProviderStatus.HEALTHY
                },
                apiKeyConfigured = !config.apiKey.isNullOrEmpty(),
                authStatus = when {
                    config.requiresApiKey && config.apiKey.isNullOrEmpty() -> AuthStatus.MISSING
                    config.apiKey != null -> AuthStatus.VALID
                    else -> AuthStatus.UNKNOWN
                },
                successRate = if (key == providerKey && success) 100 else 80,
                latencyMs = if (key == providerKey) latency else 0,
                lastError = if (key == providerKey) error else null,
                consecutiveFailures = if (key == providerKey && !success) 1 else 0
            )
        }
        
        _providerHealth.value = healthMap
    }
    
    private fun isNetworkAvailable(): Boolean {
        // Simple check - at least one provider should be healthy
        return providerManager.getHealthyProviders().isNotEmpty()
    }
    
    private fun createOfflineResearch(query: String): ResearchResult {
        return ResearchResult(
            topic = query,
            provider = "offline",
            source = "local_knowledge",
            qualityScore = 0,
            qualityLevel = QualityLevel.OFFLINE,
            timestamp = System.currentTimeMillis(),
            results = emptyList(),
            entities = extractLocalEntities(query),
            questions = extractLocalQuestions(query),
            trends = emptyList(),
            insights = emptyList(),
            keywords = query.split(" ").map { Keyword(it, 1) }
        )
    }
    
    private fun extractLocalEntities(query: String): List<Entity> {
        // Extract capitalized words as potential entities
        val pattern = Regex("\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)\\b")
        return pattern.findAll(query)
            .map { Entity(it.value, "potential", 1) }
            .distinctBy { it.name }
            .take(5)
            .toList()
    }
    
    private fun extractLocalQuestions(query: String): List<Question> {
        if (query.contains("?")) {
            return listOf(Question(query.trimEnd('?'), "topic"))
        }
        return emptyList()
    }
    
    private fun getQualityLevel(score: Int): QualityLevel {
        return when {
            score >= 70 -> QualityLevel.EXCELLENT
            score >= 50 -> QualityLevel.GOOD
            score >= 40 -> QualityLevel.ADEQUATE
            else -> QualityLevel.POOR
        }
    }
    
    private fun addLog(message: String) {
        val current = _debugLog.value.toMutableList()
        current.add(DebugLogEntry(message = message))
        if (current.size > 50) current.removeAt(0)
        _debugLog.value = current
    }
    
    fun getDebugInfo(): DebugInfo {
        return DebugInfo(
            mode = _currentMode.value,
            lastProvider = lastProvider,
            providerHealth = _providerHealth.value,
            debugLog = _debugLog.value,
            qualityThreshold = qualityThreshold
        )
    }
    
    data class DebugInfo(
        val mode: ResearchMode,
        val lastProvider: String?,
        val providerHealth: Map<String, ProviderHealth>,
        val debugLog: List<DebugLogEntry>,
        val qualityThreshold: Int
    )
}
