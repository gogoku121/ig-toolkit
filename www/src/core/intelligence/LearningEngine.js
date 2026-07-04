/**
 * LearningEngine
 * Tracks user behavior and adapts generation strategies over time
 * Records signals: copy, save, favorite, export, dismiss
 */

export class LearningEngine {
  constructor(persistentMemory) {
    this.memory = persistentMemory;
    this.strategyWeights = this._initStrategyWeights();
    this.personalityWeights = this._initPersonalityWeights();
    this.audienceWeights = this._initAudienceWeights();
  }

  /**
   * Initialize strategy weights
   */
  _initStrategyWeights() {
    return {
      educational: { weight: 1.0, signals: 0 },
      storytelling: { weight: 1.0, signals: 0 },
      'problem-solution': { weight: 1.0, signals: 0 },
      'how-to': { weight: 1.0, signals: 0 },
      'myth-bust': { weight: 1.0, signals: 0 },
      comparison: { weight: 1.0, signals: 0 },
      'question-answer': { weight: 1.0, signals: 0 }
    };
  }

  /**
   * Initialize personality weights
   */
  _initPersonalityWeights() {
    return {
      'viral creator': { weight: 1.0, signals: 0 },
      'gen z': { weight: 1.0, signals: 0 },
      'storyteller': { weight: 1.0, signals: 0 },
      educational: { weight: 1.0, signals: 0 },
      funny: { weight: 1.0, signals: 0 },
      corporate: { weight: 1.0, signals: 0 },
      'startup founder': { weight: 1.0, signals: 0 },
      minimalist: { weight: 1.0, signals: 0 },
      influencer: { weight: 1.0, signals: 0 },
      luxury: { weight: 1.0, signals: 0 }
    };
  }

  /**
   * Initialize audience weights
   */
  _initAudienceWeights() {
    return {
      general: { weight: 1.0, signals: 0 },
      beginners: { weight: 1.0, signals: 0 },
      professionals: { weight: 1.0, signals: 0 },
      students: { weight: 1.0, signals: 0 },
      creators: { weight: 1.0, signals: 0 },
      entrepreneurs: { weight: 1.0, signals: 0 },
      parents: { weight: 1.0, signals: 0 },
      'fitness enthusiasts': { weight: 1.0, signals: 0 }
    };
  }

  /**
   * Record a user signal (copy, save, favorite, export, dismiss)
   */
  async recordSignal(type, contentId, metadata = {}) {
    // Record in memory
    await this.memory.addSignal(type, contentId, metadata);

    // Update weights based on signal
    if (metadata.strategy) {
      await this._updateStrategyWeight(metadata.strategy, type);
    }
    if (metadata.personality) {
      await this._updatePersonalityWeight(metadata.personality, type);
    }
    if (metadata.audience) {
      await this._updateAudienceWeight(metadata.audience, type);
    }
  }

  /**
   * Update strategy weight based on signal
   */
  async _updateStrategyWeight(strategy, signalType) {
    if (!this.strategyWeights[strategy]) {
      this.strategyWeights[strategy] = { weight: 1.0, signals: 0 };
    }

    const entry = this.strategyWeights[strategy];
    entry.signals++;

    // Positive signals increase weight, negative decrease
    const signalValue = this._getSignalValue(signalType);
    entry.weight = entry.weight * 0.9 + signalValue * 0.1; // EMA-style update

    // Clamp weight
    entry.weight = Math.max(0.1, Math.min(2.0, entry.weight));
  }

  /**
   * Update personality weight
   */
  async _updatePersonalityWeight(personality, signalType) {
    if (!this.personalityWeights[personality]) {
      this.personalityWeights[personality] = { weight: 1.0, signals: 0 };
    }

    const entry = this.personalityWeights[personality];
    entry.signals++;

    const signalValue = this._getSignalValue(signalType);
    entry.weight = entry.weight * 0.9 + signalValue * 0.1;
    entry.weight = Math.max(0.1, Math.min(2.0, entry.weight));
  }

  /**
   * Update audience weight
   */
  async _updateAudienceWeight(audience, signalType) {
    if (!this.audienceWeights[audience]) {
      this.audienceWeights[audience] = { weight: 1.0, signals: 0 };
    }

    const entry = this.audienceWeights[audience];
    entry.signals++;

    const signalValue = this._getSignalValue(signalType);
    entry.weight = entry.weight * 0.9 + signalValue * 0.1;
    entry.weight = Math.max(0.1, Math.min(2.0, entry.weight));
  }

  /**
   * Get numeric value for signal type
   */
  _getSignalValue(signalType) {
    const values = {
      copy: 1.2,      // High value - user actively using
      save: 1.3,      // Very high - saving for later
      favorite: 1.4,   // Highest - marked as favorite
      export: 1.1,     // High - wants to use externally
      dismiss: 0.5,    // Low - not interested
      view: 1.0,       // Neutral baseline
      regenerate: 0.8  // Slightly negative - wanted something else
    };
    return values[signalType] || 1.0;
  }

  /**
   * Get recommended strategy based on learned weights
   */
  getRecommendedStrategy() {
    const strategies = Object.entries(this.strategyWeights)
      .filter(([_, data]) => data.signals > 0)
      .sort((a, b) => b[1].weight - a[1].weight);

    if (strategies.length === 0) {
      return null; // No data yet, use default
    }

    // Return top weighted strategy
    return {
      strategy: strategies[0][0],
      weight: strategies[0][1].weight,
      signals: strategies[0][1].signals
    };
  }

  /**
   * Get recommended personality
   */
  getRecommendedPersonality() {
    const personalities = Object.entries(this.personalityWeights)
      .filter(([_, data]) => data.signals > 0)
      .sort((a, b) => b[1].weight - a[1].weight);

    if (personalities.length === 0) {
      return null;
    }

    return {
      personality: personalities[0][0],
      weight: personalities[0][1].weight,
      signals: personalities[0][1].signals
    };
  }

  /**
   * Get recommended audience
   */
  getRecommendedAudience() {
    const audiences = Object.entries(this.audienceWeights)
      .filter(([_, data]) => data.signals > 0)
      .sort((a, b) => b[1].weight - a[1].weight);

    if (audiences.length === 0) {
      return null;
    }

    return {
      audience: audiences[0][0],
      weight: audiences[0][1].weight,
      signals: audiences[0][1].signals
    };
  }

  /**
   * Get all recommendations
   */
  getRecommendations() {
    return {
      strategy: this.getRecommendedStrategy(),
      personality: this.getRecommendedPersonality(),
      audience: this.getRecommendedAudience()
    };
  }

  /**
   * Get weights for generation
   */
  getWeights() {
    return {
      strategy: { ...this.strategyWeights },
      personality: { ...this.personalityWeights },
      audience: { ...this.audienceWeights }
    };
  }

  /**
   * Select best options based on weights
   */
  selectBestOptions(options) {
    const recs = this.getRecommendations();

    // Score each option
    return options.map(option => {
      let score = 1.0;

      if (recs.strategy && option.strategy === recs.strategy.strategy) {
        score *= recs.strategy.weight;
      }
      if (recs.personality && option.personality === recs.personality.personality) {
        score *= recs.personality.weight;
      }
      if (recs.audience && option.audience === recs.audience.audience) {
        score *= recs.audience.weight;
      }

      return { ...option, learningScore: score };
    }).sort((a, b) => b.learningScore - a.learningScore);
  }

  /**
   * Get learning report
   */
  async getLearningReport() {
    const stats = await this.memory.getSignalStats();

    return {
      totalSignals: stats.total,
      signalBreakdown: {
        copies: stats.copy,
        saves: stats.save,
        favorites: stats.favorite,
        exports: stats.export,
        dismissals: stats.dismiss
      },
      weights: this.getWeights(),
      recommendations: this.getRecommendations()
    };
  }

  /**
   * Reset learning data
   */
  reset() {
    this.strategyWeights = this._initStrategyWeights();
    this.personalityWeights = this._initPersonalityWeights();
    this.audienceWeights = this._initAudienceWeights();
  }
}

export default LearningEngine;
