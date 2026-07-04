package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.SearchResult
import java.util.concurrent.ConcurrentHashMap

/**
 * Research Cache - Simple in-memory cache with TTL
 */
class ResearchCache {
    
    private val cache = ConcurrentHashMap<String, CacheEntry>()
    private val ttlMs: Long = 30 * 60 * 1000 // 30 minutes
    
    data class CacheEntry(
        val query: String,
        val results: List<SearchResult>,
        val timestamp: Long
    )
    
    fun set(query: String, results: List<SearchResult>) {
        cache[query.lowercase()] = CacheEntry(
            query = query,
            results = results,
            timestamp = System.currentTimeMillis()
        )
    }
    
    fun get(query: String): List<SearchResult>? {
        return cache[query.lowercase()]?.results
    }
    
    fun isExpired(query: String): Boolean {
        val entry = cache[query.lowercase()] ?: return true
        return System.currentTimeMillis() - entry.timestamp > ttlMs
    }
    
    fun getTimestamp(query: String): Long {
        return cache[query.lowercase()]?.timestamp ?: 0L
    }
    
    fun clear() {
        cache.clear()
    }
    
    fun getCacheInfo(): CacheInfo {
        return CacheInfo(
            entries = cache.size,
            oldestTimestamp = cache.values.minOfOrNull { it.timestamp },
            newestTimestamp = cache.values.maxOfOrNull { it.timestamp }
        )
    }
    
    data class CacheInfo(
        val entries: Int,
        val oldestTimestamp: Long?,
        val newestTimestamp: Long?
    )
}
