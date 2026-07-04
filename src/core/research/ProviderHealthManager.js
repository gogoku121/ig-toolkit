/**
 * ProviderHealthManager
 * Tracks provider health metrics continuously
 */

export class ProviderHealthManager {
  constructor() {
    this.providers = {};
    this.defaultProviders = ['serpapi', 'duckduckgo'];
    this._init();
  }

  _init() {
    this.defaultProviders.forEach(key => {
      this.providers[key] = this._createProviderHealth(key);
    });
  }

  _createProviderHealth(key) {
    return {
      key,
      name: this._getProviderName(key),
      apiKeyConfigured: false,
      apiAvailable: true,
      authStatus: 'unknown',
      rateLimits: {
        used: 0,
        limit: 0,
        resetAt: null
      },
      latency: {
        avg: 0,
        min: Infinity,
        max: 0,
        samples: []
      },
      successRate: 100,
      lastSuccess: null,
      lastAttempt: null,
      lastError: null,
      consecutiveFailures: 0,
      totalRequests: 0,
      successfulRequests: 0
    };
  }

  _getProviderName(key) {
    const names = {
      serpapi: 'SerpAPI (Google)',
      duckduckgo: 'DuckDuckGo',
      brave: 'Brave Search',
      google: 'Google Custom Search'
    };
    return names[key] || key;
  }

  /**
   * Register a provider
   */
  register(key, config = {}) {
    if (!this.providers[key]) {
      this.providers[key] = this._createProviderHealth(key);
    }
    
    if (config.apiKey) {
      this.providers[key].apiKeyConfigured = true;
    }
    
    Object.assign(this.providers[key], {
      apiAvailable: config.enabled !== false,
      authStatus: config.apiKey ? 'valid' : 'missing',
      rateLimits: {
        used: 0,
        limit: config.rateLimit || 0,
        resetAt: null
      }
    });
  }

  /**
   * Record a request start
   */
  recordRequestStart(key) {
    const provider = this.providers[key];
    if (!provider) return;
    
    provider.lastAttempt = Date.now();
  }

  /**
   * Record a successful request
   */
  recordSuccess(key, latency, responseSize = 0) {
    const provider = this.providers[key];
    if (!provider) return;

    provider.successfulRequests++;
    provider.totalRequests++;
    provider.consecutiveFailures = 0;
    provider.lastSuccess = Date.now();
    provider.lastError = null;

    // Update latency stats
    provider.latency.samples.push(latency);
    if (provider.latency.samples.length > 10) {
      provider.latency.samples.shift();
    }
    provider.latency.avg = provider.latency.samples.reduce((a, b) => a + b, 0) / provider.latency.samples.length;
    provider.latency.min = Math.min(provider.latency.min, latency);
    provider.latency.max = Math.max(provider.latency.max, latency);

    // Update success rate
    provider.successRate = (provider.successfulRequests / provider.totalRequests) * 100;

    // Update rate limits
    if (provider.rateLimits.limit > 0) {
      provider.rateLimits.used++;
    }

    // Update auth status
    provider.authStatus = 'valid';
  }

  /**
   * Record a failed request
   */
  recordFailure(key, error, isAuthError = false) {
    const provider = this.providers[key];
    if (!provider) return;

    provider.totalRequests++;
    provider.consecutiveFailures++;
    provider.lastError = {
      message: error,
      isAuthError,
      timestamp: Date.now()
    };

    // Update success rate
    provider.successRate = (provider.successfulRequests / provider.totalRequests) * 100;

    // Handle auth errors
    if (isAuthError) {
      provider.authStatus = 'invalid';
      provider.apiKeyConfigured = false;
    }

    // Check if provider should be disabled
    if (provider.consecutiveFailures >= 5) {
      provider.apiAvailable = false;
    }
  }

  /**
   * Record rate limit hit
   */
  recordRateLimit(key, resetAt) {
    const provider = this.providers[key];
    if (!provider) return;

    provider.rateLimits.used = provider.rateLimits.limit;
    provider.rateLimits.resetAt = resetAt;
    provider.authStatus = 'rate_limited';
  }

  /**
   * Get health status for a provider
   */
  getHealth(key) {
    const provider = this.providers[key];
    if (!provider) return null;

    return {
      key: provider.key,
      name: provider.name,
      status: this._calculateStatus(provider),
      apiKeyConfigured: provider.apiKeyConfigured,
      authStatus: provider.authStatus,
      latency: {
        avg: Math.round(provider.latency.avg),
        min: provider.latency.min === Infinity ? 0 : Math.round(provider.latency.min),
        max: Math.round(provider.latency.max)
      },
      successRate: Math.round(provider.successRate),
      lastSuccess: provider.lastSuccess,
      lastError: provider.lastError?.message || null,
      rateLimitStatus: provider.rateLimits.limit > 0 
        ? `${provider.rateLimits.used}/${provider.rateLimits.limit}`
        : 'unlimited',
      consecutiveFailures: provider.consecutiveFailures,
      isHealthy: this._isHealthy(provider)
    };
  }

  /**
   * Calculate status string
   */
  _calculateStatus(provider) {
    if (!provider.apiAvailable) return 'disabled';
    if (provider.consecutiveFailures >= 5) return 'failing';
    if (provider.consecutiveFailures >= 2) return 'degraded';
    if (provider.authStatus === 'rate_limited') return 'rate_limited';
    if (provider.authStatus === 'invalid') return 'auth_error';
    if (!provider.apiKeyConfigured && provider.authStatus !== 'unknown') return 'needs_key';
    return 'healthy';
  }

  /**
   * Check if provider is healthy enough to use
   */
  _isHealthy(provider) {
    if (!provider.apiAvailable) return false;
    if (provider.consecutiveFailures >= 3) return false;
    if (provider.authStatus === 'rate_limited') return false;
    if (provider.authStatus === 'invalid') return false;
    if (provider.successRate < 50) return false;
    return true;
  }

  /**
   * Get all provider statuses
   */
  getAllHealth() {
    const health = {};
    for (const key of Object.keys(this.providers)) {
      health[key] = this.getHealth(key);
    }
    return health;
  }

  /**
   * Get best available provider
   */
  getBestProvider() {
    let best = null;
    let bestScore = -1;

    for (const [key, provider] of Object.entries(this.providers)) {
      if (!this._isHealthy(provider)) continue;

      // Score based on success rate and latency
      let score = provider.successRate;
      
      // Prefer faster providers
      if (provider.latency.avg > 0) {
        score -= (provider.latency.avg / 100); // Penalty for slower latency
      }

      if (score > bestScore) {
        bestScore = score;
        best = key;
      }
    }

    return best;
  }

  /**
   * Get providers sorted by health
   */
  getProvidersByHealth() {
    return Object.entries(this.providers)
      .map(([key, _]) => ({ key, health: this.getHealth(key) }))
      .filter(p => p.health)
      .sort((a, b) => {
        // Healthy first
        if (a.health.isHealthy !== b.health.isHealthy) {
          return b.health.isHealthy - a.health.isHealthy;
        }
        // Then by success rate
        return b.health.successRate - a.health.successRate;
      });
  }

  /**
   * Reset provider to try again
   */
  resetProvider(key) {
    if (this.providers[key]) {
      this.providers[key].consecutiveFailures = 0;
      this.providers[key].apiAvailable = true;
    }
  }

  /**
   * Reset all providers
   */
  resetAll() {
    for (const key of Object.keys(this.providers)) {
      this.resetProvider(key);
    }
  }

  /**
   * Enable a provider
   */
  enable(key) {
    if (this.providers[key]) {
      this.providers[key].apiAvailable = true;
    }
  }

  /**
   * Disable a provider
   */
  disable(key) {
    if (this.providers[key]) {
      this.providers[key].apiAvailable = false;
    }
  }

  /**
   * Get summary for debug panel
   */
  getSummary() {
    const providers = this.getProvidersByHealth();
    const healthy = providers.filter(p => p.health.isHealthy).length;
    const total = providers.length;

    return {
      providers,
      healthyCount: healthy,
      totalCount: total,
      bestProvider: this.getBestProvider(),
      summary: `${healthy}/${total} providers healthy`
    };
  }
}

export default ProviderHealthManager;
