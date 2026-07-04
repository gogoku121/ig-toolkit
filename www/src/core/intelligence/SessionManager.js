/**
 * SessionManager
 * Maintains conversation history within a session
 * Tracks what has been generated to avoid repetition
 */

export class SessionManager {
  constructor() {
    this.sessionId = this._generateSessionId();
    this.history = [];
    this.topicCount = {};
    this.generationCount = 0;
    this.maxHistory = 50;
  }

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session ID
   */
  getSessionId() {
    return this.sessionId;
  }

  /**
   * Start new session
   */
  newSession() {
    this.sessionId = this._generateSessionId();
    this.history = [];
    this.topicCount = {};
    this.generationCount = 0;
  }

  /**
   * Record a generation
   */
  recordGeneration(data) {
    const entry = {
      id: `${this.sessionId}_${this.generationCount}`,
      topic: data.topic,
      personality: data.personality,
      goal: data.goal,
      audience: data.audience,
      strategy: data.strategy,
      content: data.content,
      timestamp: Date.now()
    };

    this.history.unshift(entry);
    this.generationCount++;

    // Track topic frequency
    const topicKey = this._normalizeTopic(data.topic);
    this.topicCount[topicKey] = (this.topicCount[topicKey] || 0) + 1;

    // Prune old entries
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    return entry;
  }

  /**
   * Get session stats
   */
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      generationCount: this.generationCount,
      topicCounts: this.topicCount,
      uniqueTopics: Object.keys(this.topicCount).length,
      historyLength: this.history.length
    };
  }

  /**
   * Get how many times a topic has been generated in this session
   */
  getTopicCount(topic) {
    const normalized = this._normalizeTopic(topic);
    return this.topicCount[normalized] || 0;
  }

  /**
   * Check if topic has been generated many times
   */
  isTopicExplored(topic, threshold = 3) {
    return this.getTopicCount(topic) >= threshold;
  }

  /**
   * Get generation strategy for explored topics
   */
  getExplorationStrategy(topic) {
    const count = this.getTopicCount(topic);
    
    if (count === 0) {
      return {
        approach: 'comprehensive',
        focus: 'cover fundamentals and key insights'
      };
    }
    
    if (count === 1) {
      return {
        approach: 'varied_angle',
        focus: 'different perspective or framework'
      };
    }
    
    if (count === 2) {
      return {
        approach: 'deep_dive',
        focus: 'specific subtopic or advanced angle'
      };
    }
    
    return {
      approach: 'niche_or_related',
      focus: 'very specific angle or neighboring concept'
    };
  }

  /**
   * Get recent topics
   */
  getRecentTopics(limit = 5) {
    const topics = [];
    const seen = new Set();

    for (const entry of this.history) {
      const normalized = this._normalizeTopic(entry.topic);
      if (!seen.has(normalized)) {
        topics.push({
          topic: entry.topic,
          normalized,
          timestamp: entry.timestamp
        });
        seen.add(normalized);
      }
      if (topics.length >= limit) break;
    }

    return topics;
  }

  /**
   * Get related topics already generated
   */
  getRelatedGeneratedConcepts(topic, conceptGraph) {
    const generated = [];
    const normalized = this._normalizeTopic(topic);

    for (const entry of this.history) {
      const entryNormalized = this._normalizeTopic(entry.topic);
      
      // Check if related in graph
      if (conceptGraph.areRelated(entryNormalized, normalized)) {
        generated.push({
          topic: entry.topic,
          relationship: 'related',
          content: entry.content
        });
      }
    }

    return generated;
  }

  /**
   * Get content to avoid based on session history
   */
  getAvoidanceHints() {
    const hints = {
      hooks: [],
      ctas: [],
      structures: [],
      topics: []
    };

    // Recent hooks (first lines)
    const recentHooks = new Set();
    for (const entry of this.history.slice(0, 10)) {
      const firstLine = entry.content.split('\n')[0] || '';
      if (firstLine.length < 100) {
        recentHooks.add(firstLine.toLowerCase().substring(0, 50));
      }
    }
    hints.hooks = Array.from(recentHooks);

    // Recent CTAs
    const recentCTAs = new Set();
    for (const entry of this.history.slice(0, 5)) {
      const lines = entry.content.split('\n');
      const lastLine = lines[lines.length - 1] || '';
      if (lastLine.length < 50) {
        recentCTAs.add(lastLine.toLowerCase());
      }
    }
    hints.ctas = Array.from(recentCTAs);

    // Recent topics
    hints.topics = this.getRecentTopics(5).map(t => t.normalized);

    return hints;
  }

  /**
   * Get topic suggestions based on session history
   */
  getTopicSuggestions(conceptGraph, limit = 3) {
    const suggestions = [];
    const recentTopics = this.getRecentTopics(3);

    for (const recent of recentTopics) {
      const related = conceptGraph.findRelated(recent.topic, 3);
      
      for (const rel of related) {
        if (!this.topicCount[rel.topic]) {
          suggestions.push({
            topic: rel.topic,
            reason: `related to "${recent.topic}"`,
            relationship: rel.relationship
          });
        }
      }
    }

    // Dedupe and limit
    const seen = new Set(this.topicCount);
    return suggestions
      .filter(s => !seen.has(s.topic))
      .slice(0, limit);
  }

  /**
   * Get all history for export
   */
  exportHistory() {
    return {
      sessionId: this.sessionId,
      topicCount: this.topicCount,
      generationCount: this.generationCount,
      history: this.history
    };
  }

  /**
   * Import history
   */
  importHistory(data) {
    if (data.sessionId) this.sessionId = data.sessionId;
    if (data.topicCount) this.topicCount = data.topicCount;
    if (data.generationCount) this.generationCount = data.generationCount;
    if (data.history) this.history = data.history.slice(0, this.maxHistory);
  }

  /**
   * Normalize topic for comparison
   */
  _normalizeTopic(topic) {
    return (topic || '').toLowerCase().trim();
  }

  /**
   * Get most generated topic
   */
  getMostGeneratedTopic() {
    let maxTopic = null;
    let maxCount = 0;

    for (const [topic, count] of Object.entries(this.topicCount)) {
      if (count > maxCount) {
        maxCount = count;
        maxTopic = topic;
      }
    }

    return { topic: maxTopic, count: maxCount };
  }

  /**
   * Clear session data
   */
  clear() {
    this.history = [];
    this.topicCount = {};
    this.generationCount = 0;
  }
}

export default SessionManager;
