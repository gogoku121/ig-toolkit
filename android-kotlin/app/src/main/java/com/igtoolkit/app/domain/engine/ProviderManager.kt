package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.net.URLEncoder
import java.util.concurrent.TimeUnit

/**
 * Provider Manager with explicit failure handling and auto-failover
 */
class ProviderManager {
    
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()
    
    private val providers = mutableMapOf<String, ProviderConfig>()
    
    init {
        // Register available providers
        registerProvider("duckduckgo", ProviderConfig(
            name = "DuckDuckGo",
            baseUrl = "https://api.duckduckgo.com/",
            requiresApiKey = false,
            enabled = true
        ))
        
        registerProvider("serpapi", ProviderConfig(
            name = "SerpAPI (Google)",
            baseUrl = "https://serpapi.com/search.json",
            requiresApiKey = true,
            enabled = true
        ))
    }
    
    data class ProviderConfig(
        val name: String,
        val baseUrl: String,
        val requiresApiKey: Boolean,
        var enabled: Boolean = true,
        var apiKey: String? = null
    )
    
    data class SearchResponse(
        val success: Boolean,
        val results: List<SearchResult> = emptyList(),
        val error: String? = null,
        val errorType: ErrorType = ErrorType.NONE
    )
    
    enum class ErrorType {
        NONE, MISSING_KEY, AUTH_FAILED, RATE_LIMIT, NETWORK_ERROR, EMPTY_RESPONSE, TIMEOUT
    }
    
    fun registerProvider(key: String, config: ProviderConfig) {
        providers[key] = config
    }
    
    fun setApiKey(providerKey: String, apiKey: String) {
        providers[providerKey]?.apiKey = apiKey
    }
    
    fun getProviders(): Map<String, ProviderConfig> = providers.toMap()
    
    fun getProviderName(key: String): String = providers[key]?.name ?: key
    
    fun isProviderHealthy(key: String): Boolean {
        val provider = providers[key] ?: return false
        if (!provider.enabled) return false
        if (provider.requiresApiKey && provider.apiKey.isNullOrEmpty()) return false
        return true
    }
    
    fun getHealthyProviders(): List<String> {
        return providers.filter { isProviderHealthy(it.key) }.keys.toList()
    }
    
    suspend fun search(query: String, providerKey: String = "duckduckgo"): SearchResponse {
        return withContext(Dispatchers.IO) {
            try {
                val provider = providers[providerKey]
                    ?: return@withContext SearchResponse(false, error = "Provider not found: $providerKey", errorType = ErrorType.AUTH_FAILED)
                
                if (!provider.enabled) {
                    return@withContext SearchResponse(false, error = "Provider disabled: $providerKey", errorType = ErrorType.AUTH_FAILED)
                }
                
                if (provider.requiresApiKey && provider.apiKey.isNullOrEmpty()) {
                    return@withContext SearchResponse(false, error = "API key not configured for $providerKey", errorType = ErrorType.MISSING_KEY)
                }
                
                when (providerKey) {
                    "duckduckgo" -> searchDuckDuckGo(query, provider)
                    "serpapi" -> searchSerpApi(query, provider)
                    else -> SearchResponse(false, error = "Unknown provider: $providerKey", errorType = ErrorType.AUTH_FAILED)
                }
            } catch (e: Exception) {
                SearchResponse(false, error = e.message ?: "Unknown error", errorType = ErrorType.NETWORK_ERROR)
            }
        }
    }
    
    private fun searchDuckDuckGo(query: String, provider: ProviderConfig): SearchResponse {
        val encodedQuery = URLEncoder.encode(query, "UTF-8")
        val url = "${provider.baseUrl}?q=$encodedQuery&format=json&pretty=1"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .build()
        
        return try {
            val response = httpClient.newCall(request).execute()
            
            if (!response.isSuccessful) {
                return SearchResponse(false, error = "HTTP ${response.code}", errorType = ErrorType.NETWORK_ERROR)
            }
            
            val body = response.body?.string() ?: ""
            
            if (body.isEmpty()) {
                return SearchResponse(false, error = "Empty response", errorType = ErrorType.EMPTY_RESPONSE)
            }
            
            val json = JSONObject(body)
            val results = mutableListOf<SearchResult>()
            
            // Extract RelatedTopics
            if (json.has("RelatedTopics")) {
                val relatedTopics = json.getJSONArray("RelatedTopics")
                for (i in 0 until minOf(relatedTopics.length(), 20)) {
                    val topic = relatedTopics.getJSONObject(i)
                    val text = topic.optString("Text", "")
                    val firstUrl = topic.optString("FirstURL", "")
                    val resultTitle = text.take(60)
                    
                    if (text.isNotEmpty()) {
                        results.add(SearchResult(
                            title = resultTitle,
                            url = firstUrl,
                            snippet = text,
                            source = "duckduckgo"
                        ))
                    }
                }
            }
            
            // Extract Definition
            if (json.has("Definition")) {
                val definition = json.getString("Definition")
                if (definition.isNotEmpty()) {
                    results.add(0, SearchResult(
                        title = "Definition",
                        url = json.optString("DefinitionURL", ""),
                        snippet = definition,
                        source = "duckduckgo"
                    ))
                }
            }
            
            // Extract Abstract
            if (json.has("AbstractText")) {
                val abstract = json.getString("AbstractText")
                if (abstract.isNotEmpty()) {
                    results.add(0, SearchResult(
                        title = json.optString("Heading", "Information"),
                        url = json.optString("AbstractURL", ""),
                        snippet = abstract,
                        source = "duckduckgo"
                    ))
                }
            }
            
            if (results.isEmpty()) {
                return SearchResponse(false, error = "No results found", errorType = ErrorType.EMPTY_RESPONSE)
            }
            
            SearchResponse(true, results = results)
            
        } catch (e: Exception) {
            SearchResponse(false, error = e.message ?: "Network error", errorType = ErrorType.NETWORK_ERROR)
        }
    }
    
    private fun searchSerpApi(query: String, provider: ProviderConfig): SearchResponse {
        val apiKey = provider.apiKey ?: return SearchResponse(false, error = "Missing API key", errorType = ErrorType.MISSING_KEY)
        val encodedQuery = URLEncoder.encode(query, "UTF-8")
        val url = "${provider.baseUrl}?q=$encodedQuery&api_key=$apiKey"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .build()
        
        return try {
            val response = httpClient.newCall(request).execute()
            
            if (!response.isSuccessful) {
                return when (response.code) {
                    401, 403 -> SearchResponse(false, error = "Invalid API key", errorType = ErrorType.AUTH_FAILED)
                    429 -> SearchResponse(false, error = "Rate limit exceeded", errorType = ErrorType.RATE_LIMIT)
                    else -> SearchResponse(false, error = "HTTP ${response.code}", errorType = ErrorType.NETWORK_ERROR)
                }
            }
            
            val body = response.body?.string() ?: ""
            
            if (body.isEmpty()) {
                return SearchResponse(false, error = "Empty response", errorType = ErrorType.EMPTY_RESPONSE)
            }
            
            val json = JSONObject(body)
            val results = mutableListOf<SearchResult>()
            
            // Extract organic results
            if (json.has("organic_results")) {
                val organicResults = json.getJSONArray("organic_results")
                for (i in 0 until minOf(organicResults.length(), 15)) {
                    val result = organicResults.getJSONObject(i)
                    results.add(SearchResult(
                        title = result.optString("title", ""),
                        url = result.optString("link", ""),
                        snippet = result.optString("snippet", ""),
                        source = "serpapi"
                    ))
                }
            }
            
            if (results.isEmpty()) {
                return SearchResponse(false, error = "No results found", errorType = ErrorType.EMPTY_RESPONSE)
            }
            
            SearchResponse(true, results = results)
            
        } catch (e: Exception) {
            SearchResponse(false, error = e.message ?: "Network error", errorType = ErrorType.NETWORK_ERROR)
        }
    }
}
