package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Research Engine - Main orchestrator with proper error handling and provider selection
 * 
 * Research Pipeline:
 * 1. Check network connectivity
 * 2. Try each provider in priority order
 * 3. Validate research quality
 * 4. Cache successful research
 * 5. Fall back to OFFLINE only when ALL providers fail
 */
class ResearchEngine(
    private val networkChecker: NetworkChecker = NetworkChecker()
) {
    
    private val providerManager = ProviderManager()
    private val researchCache = ResearchCache()
    private val qualityScorer = QualityScorer()
    private val extractor = ResearchExtractor()
    
    // Research state
    private val _currentMode = MutableStateFlow(ResearchMode.OFFLINE)
    val currentMode: StateFlow<ResearchMode> = _currentMode.asStateFlow()
    
    private val _researchStatus = MutableStateFlow(ResearchStatus())
    val researchStatus: StateFlow<ResearchStatus> = _researchStatus.asStateFlow()
    
    private val _providerHealth = MutableStateFlow<Map<String, ProviderHealth>>(emptyMap())
    val providerHealth: StateFlow<Map<String, ProviderHealth>> = _providerHealth.asStateFlow()
    
    private val _debugLog = MutableStateFlow<List<DebugLogEntry>>(emptyList())
    val debugLog: StateFlow<List<DebugLogEntry>> = _debugLog.asStateFlow()
    
    // Configuration
    private var lastProvider: String? = null
    private var lastProviderLatency: Int = 0
    private val qualityThreshold = 40
    private val minimumResultsForQuality = 3
    
    // Data class for research status
    data class ResearchStatus(
        val isOnline: Boolean = false,
        val isResearching: Boolean = false,
        val currentPhase: String = "idle",
        val providerInUse: String? = null,
        val resultsCount: Int = 0,
        val entitiesCount: Int = 0,
        val insightsCount: Int = 0,
        val qualityScore: Int = 0,
        val lastError: String? = null,
        val fallbackReason: String? = null
    )
    
    data class DebugLogEntry(
        val timestamp: Long = System.currentTimeMillis(),
        val message: String,
        val type: LogType = LogType.INFO
    )
    
    enum class LogType {
        INFO, WARN, ERROR, SUCCESS
    }
    
    init {
        // Initialize provider health on creation
        updateProviderHealthStatus()
        addLog("ResearchEngine initialized", LogType.INFO)
    }
    
    /**
     * Main research method - MUST be called before caption generation
     * Returns complete research or throws exception if all providers fail
     */
    suspend fun research(query: String): ResearchResult {
        addLog("=== Starting research for: '$query' ===", LogType.INFO)
        _researchStatus.value = ResearchStatus(isResearching = true, currentPhase = "initializing")
        
        // PHASE 1: Network Connectivity Check
        _researchStatus.value = _researchStatus.value.copy(currentPhase = "checking_network")
        val hasNetwork = checkNetworkConnectivity()
        
        if (!hasNetwork) {
            addLog("No network connectivity - entering OFFLINE mode", LogType.WARN)
            _currentMode.value = ResearchMode.OFFLINE
            return handleOfflineMode(query, "No internet connection")
        }
        
        // PHASE 2: Provider Health Check
        _researchStatus.value = _researchStatus.value.copy(currentPhase = "checking_providers")
        updateProviderHealthStatus()
        
        val healthyProviders = getHealthyProvidersInPriorityOrder()
        
        if (healthyProviders.isEmpty()) {
            addLog("No healthy providers available", LogType.WARN)
            _currentMode.value = ResearchMode.OFFLINE
            return handleOfflineMode(query, "All providers unhealthy or unconfigured")
        }
        
        // PHASE 3: Try Live Research with each provider
        _currentMode.value = ResearchMode.ONLINE
        
        for (providerKey in healthyProviders) {
            addLog("Attempting provider: $providerKey", LogType.INFO)
            _researchStatus.value = _researchStatus.value.copy(
                providerInUse = providerKey,
                currentPhase = "researching_with_$providerKey"
            )
            
            try {
                val result = tryProvider(query, providerKey)
                
                if (result != null) {
                    addLog("Provider $providerKey succeeded with quality ${result.qualityScore}", LogType.SUCCESS)
                    lastProvider = providerKey
                    _researchStatus.value = _researchStatus.value.copy(
                        isOnline = true,
                        isResearching = false,
                        currentPhase = "complete",
                        resultsCount = result.results.size,
                        entitiesCount = result.entities.size,
                        insightsCount = result.insights.size,
                        qualityScore = result.qualityScore,
                        fallbackReason = null
                    )
                    return result
                }
            } catch (e: Exception) {
                addLog("Provider $providerKey threw: ${e.message}", LogType.ERROR)
                updateProviderHealthStatus(providerKey, ProviderHealth(
                    key = providerKey,
                    name = providerManager.getProviderName(providerKey),
                    isHealthy = false,
                    status = ProviderStatus.FAILING,
                    lastError = e.message,
                    consecutiveFailures = 1
                ))
            }
        }
        
        // PHASE 4: Try Cache
        addLog("All live providers failed - trying cache", LogType.WARN)
        _researchStatus.value = _researchStatus.value.copy(currentPhase = "trying_cache")
        
        val cachedResult = tryCache(query)
        if (cachedResult != null) {
            _currentMode.value = ResearchMode.CACHE
            _researchStatus.value = _researchStatus.value.copy(
                isOnline = true,
                isResearching = false,
                currentPhase = "complete_from_cache",
                fallbackReason = "Live research failed, using cache"
            )
            return cachedResult
        }
        
        // PHASE 5: OFFLINE - All options exhausted
        addLog("All options exhausted - entering OFFLINE mode", LogType.ERROR)
        _currentMode.value = ResearchMode.OFFLINE
        return handleOfflineMode(query, "Every provider failed. Check API keys or internet connection.")
    }
    
    /**
     * Try a specific provider and validate quality
     */
    private suspend fun tryProvider(query: String, providerKey: String): ResearchResult? {
        addLog("Trying provider: $providerKey", LogType.INFO)
        
        val startTime = System.currentTimeMillis()
        val response = providerManager.search(query, providerKey)
        val latency = (System.currentTimeMillis() - startTime).toInt()
        
        lastProviderLatency = latency
        
        // Log response details
        addLog("Provider $providerKey response: success=${response.success}, results=${response.results.size}, error=${response.error}", 
            if (response.success) LogType.SUCCESS else LogType.ERROR)
        
        if (!response.success) {
            addLog("Provider $providerKey error: ${response.error}", LogType.ERROR)
            updateProviderHealthStatus(providerKey, ProviderHealth(
                key = providerKey,
                name = providerManager.getProviderName(providerKey),
                isHealthy = false,
                status = when (response.errorType) {
                    ProviderManager.ErrorType.MISSING_KEY -> ProviderStatus.AUTH_ERROR
                    ProviderManager.ErrorType.AUTH_FAILED -> ProviderStatus.AUTH_ERROR
                    ProviderManager.ErrorType.RATE_LIMIT -> ProviderStatus.RATE_LIMITED
                    else -> ProviderStatus.FAILING
                },
                latencyMs = latency,
                lastError = response.error,
                consecutiveFailures = 1
            ))
            return null
        }
        
        // PHASE: Extract and Score
        addLog("Extracting research from ${response.results.size} results...", LogType.INFO)
        val extracted = extractor.extract(response.results, query)
        val quality = qualityScorer.score(extracted)
        
        addLog("Quality score: $quality (threshold: $qualityThreshold)", 
            if (quality >= qualityThreshold) LogType.SUCCESS else LogType.WARN)
        
        // Validate minimum quality
        if (quality < qualityThreshold) {
            addLog("Research quality $quality below threshold $qualityThreshold", LogType.WARN)
            updateProviderHealthStatus(providerKey, ProviderHealth(
                key = providerKey,
                name = providerManager.getProviderName(providerKey),
                isHealthy = false,
                status = ProviderStatus.DEGRADED,
                latencyMs = latency,
                lastError = "Low quality research: $quality < $qualityThreshold",
                successRate = (quality * 100 / qualityThreshold).coerceIn(0, 99)
            ))
            return null
        }
        
        // Update provider health as successful
        updateProviderHealthStatus(providerKey, ProviderHealth(
            key = providerKey,
            name = providerManager.getProviderName(providerKey),
            isHealthy = true,
            status = ProviderStatus.HEALTHY,
            latencyMs = latency,
            successRate = 100,
            consecutiveFailures = 0
        ))
        
        // Cache successful research
        researchCache.set(query, response.results)
        
        val result = extracted.copy(
            topic = query,
            provider = providerKey,
            source = "live_research",
            qualityScore = quality,
            qualityLevel = getQualityLevel(quality),
            timestamp = System.currentTimeMillis()
        )
        
        // Log extraction stats
        addLog("Extracted: ${result.entities.size} entities, ${result.insights.size} insights, ${result.questions.size} questions, ${result.trends.size} trends", 
            LogType.SUCCESS)
        
        return result
    }
    
    /**
     * Try cache as fallback
     */
    private fun tryCache(query: String): ResearchResult? {
        addLog("Checking cache for: '$query'", LogType.INFO)
        
        val cached = researchCache.get(query)
        if (cached == null) {
            addLog("Cache miss", LogType.WARN)
            return null
        }
        
        if (researchCache.isExpired(query)) {
            addLog("Cache expired", LogType.WARN)
            return null
        }
        
        addLog("Cache hit with ${cached.size} results", LogType.SUCCESS)
        
        val extracted = extractor.extract(cached, query)
        val quality = qualityScorer.score(extracted)
        
        if (quality < qualityThreshold) {
            addLog("Cached research quality $quality below threshold", LogType.WARN)
            return null
        }
        
        return extracted.copy(
            topic = query,
            provider = "cache",
            source = "cached_research",
            qualityScore = quality,
            qualityLevel = getQualityLevel(quality),
            timestamp = researchCache.getTimestamp(query)
        )
    }
    
    /**
     * Handle OFFLINE mode - only when all else fails
     */
    private fun handleOfflineMode(query: String, reason: String): ResearchResult {
        addLog("OFFLINE MODE: $reason", LogType.ERROR)
        
        _researchStatus.value = _researchStatus.value.copy(
            isOnline = false,
            isResearching = false,
            currentPhase = "offline",
            fallbackReason = reason
        )
        
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
            keywords = extractLocalKeywords(query),
            painPoints = emptyList(),
            misconceptions = emptyList(),
            examples = emptyList(),
            statistics = emptyList()
        )
    }
    
    /**
     * Check network connectivity
     */
    private fun checkNetworkConnectivity(): Boolean {
        val isConnected = networkChecker.isNetworkAvailable()
        addLog("Network connectivity: $isConnected", if (isConnected) LogType.SUCCESS else LogType.WARN)
        _researchStatus.value = _researchStatus.value.copy(isOnline = isConnected)
        return isConnected
    }
    
    /**
     * Get providers in priority order (healthy first, then by priority)
     */
    private fun getHealthyProvidersInPriorityOrder(): List<String> {
        val providers = providerManager.getProviders()
        val healthMap = _providerHealth.value
        
        return providers
            .filter { (key, config) ->
                config.enabled && healthMap[key]?.isHealthy != false
            }
            .map { it.key }
            .also { list ->
                addLog("Healthy providers: ${list.joinToString()}")
            }
    }
    
    /**
     * Update provider health status for all providers
     */
    private fun updateProviderHealthStatus(triggerKey: String? = null, health: ProviderHealth? = null) {
        val healthMap = mutableMapOf<String, ProviderHealth>()
        val providers = providerManager.getProviders()
        
        providers.forEach { (providerKey, config) ->
            val isHealthy = when {
                !config.enabled -> false
                config.requiresApiKey && config.apiKey.isNullOrEmpty() -> false
                else -> true
            }
            
            val existingHealth = if (triggerKey == providerKey && health != null) {
                health
            } else {
                _providerHealth.value[providerKey]
            }
            
            healthMap[providerKey] = existingHealth ?: ProviderHealth(
                key = providerKey,
                name = config.name,
                isHealthy = isHealthy,
                status = when {
                    !config.enabled -> ProviderStatus.DISABLED
                    config.requiresApiKey && config.apiKey.isNullOrEmpty() -> ProviderStatus.AUTH_ERROR
                    isHealthy -> ProviderStatus.HEALTHY
                    else -> ProviderStatus.FAILING
                },
                apiKeyConfigured = !config.apiKey.isNullOrEmpty(),
                authStatus = when {
                    config.requiresApiKey && config.apiKey.isNullOrEmpty() -> AuthStatus.MISSING
                    config.requiresApiKey -> AuthStatus.VALID
                    else -> AuthStatus.UNKNOWN
                }
            )
        }
        
        _providerHealth.value = healthMap
    }
    
    /**
     * Local entity extraction for offline mode
     */
    private fun extractLocalEntities(query: String): List<Entity> {
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
        return listOf(Question("What is $query?", "exploration"))
    }
    
    private fun extractLocalKeywords(query: String): List<Keyword> {
        return query.split(Regex("\\W+"))
            .filter { it.length > 3 }
            .distinct()
            .take(10)
            .map { Keyword(it.lowercase(), 1) }
    }
    
    private fun getQualityLevel(score: Int): QualityLevel {
        return when {
            score >= 70 -> QualityLevel.EXCELLENT
            score >= 50 -> QualityLevel.GOOD
            score >= 40 -> QualityLevel.ADEQUATE
            else -> QualityLevel.POOR
        }
    }
    
    private fun addLog(message: String, type: LogType = LogType.INFO) {
        val entry = DebugLogEntry(
            timestamp = System.currentTimeMillis(),
            message = message,
            type = type
        )
        val current = _debugLog.value.toMutableList()
        current.add(entry)
        if (current.size > 100) current.removeAt(0)
        _debugLog.value = current
    }
    
    /**
     * Set API key for a provider
     */
    fun setApiKey(providerKey: String, apiKey: String) {
        providerManager.setApiKey(providerKey, apiKey)
        updateProviderHealthStatus()
        addLog("API key set for $providerKey", LogType.INFO)
    }
    
    /**
     * Get comprehensive debug info
     */
    fun getDebugInfo(): DebugInfo {
        return DebugInfo(
            mode = _currentMode.value,
            researchStatus = _researchStatus.value,
            lastProvider = lastProvider,
            lastProviderLatency = lastProviderLatency,
            providerHealth = _providerHealth.value,
            debugLog = _debugLog.value,
            qualityThreshold = qualityThreshold,
            cacheInfo = researchCache.getCacheInfo()
        )
    }
    
    data class DebugInfo(
        val mode: ResearchMode,
        val researchStatus: ResearchStatus,
        val lastProvider: String?,
        val lastProviderLatency: Int,
        val providerHealth: Map<String, ProviderHealth>,
        val debugLog: List<DebugLogEntry>,
        val qualityThreshold: Int,
        val cacheInfo: ResearchCache.CacheInfo
    )
}

/**
 * Network connectivity checker
 */
class NetworkChecker {
    private var lastCheckTime: Long = 0
    private var lastResult: Boolean = false
    private val checkIntervalMs: Long = 5000 // 5 seconds cache
    
    fun isNetworkAvailable(): Boolean {
        val now = System.currentTimeMillis()
        if (now - lastCheckTime < checkIntervalMs) {
            return lastResult
        }
        
        // Perform actual network check
        lastResult = performNetworkCheck()
        lastCheckTime = now
        return lastResult
    }
    
    private fun performNetworkCheck(): Boolean {
        return try {
            val runtime = Runtime.getRuntime()
            val process = runtime.exec("/system/bin/ping -c 1 -W 2 8.8.8.8")
            val exitValue = process.waitFor()
            exitValue == 0
        } catch (e: Exception) {
            // If ping fails, try socket connection
            try {
                val socket = java.net.InetSocketAddress("www.google.com", 80)
                val socketConnection = java.net.Socket()
                socketConnection.connect(socket, 3000)
                socketConnection.close()
                true
            } catch (e2: Exception) {
                false
            }
        }
    }
}

