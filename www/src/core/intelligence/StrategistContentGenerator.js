/**
 * StrategistContentGenerator
 * Memory-aware content generation that learns from history, avoids repetition,
 * and adapts to user preferences
 */

import { SmartContentGenerator } from './SmartContentGenerator.js';
import { PersistentMemory } from './PersistentMemory.js';
import { SessionManager } from './SessionManager.js';
import { IdeaGraph } from './IdeaGraph.js';
import { SimilarityEngine } from './SimilarityEngine.js';
import { LearningEngine } from './LearningEngine.js';

/**
 * StrategistContentGenerator
 * Main orchestrator that combines all intelligence modules
 */
export class StrategistContentGenerator {
  constructor() {
    this.memory = new PersistentMemory();
    this.session = new SessionManager();
    this.ideaGraph = new IdeaGraph();
    this.similarity = new SimilarityEngine();
    this.generator = new SmartContentGenerator();
    this.learning = null; // Initialize after memory
    
    this.maxIterations = 3;
    this.similarityThreshold = 0.7;
  }

  async init() {
    await this.memory._ensureReady();
    this.learning = new LearningEngine(this.memory);
    
    // Load recent content into similarity engine
    const recent = await this.memory.getRecentGenerations(50);
    this.similarity.loadFromMemory(recent);
    
    return this;
  }

  /**
   * Generate content with full intelligence
   */
  async generate(options = {}) {
    const {
      topic,
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      strategy = 'auto',
      versions = 3
    } = options;

    // Ensure initialized
    if (!this.learning) {
      await this.init();
    }

    // Phase 1: Memory-Aware Preparation
    const context = await this._prepareGeneration({
      topic,
      personality,
      goal,
      audience
    });

    // Phase 2: Topic Expansion
    const expandedTopic = await this._expandTopic(topic, context);

    // Phase 3: Generate with awareness
    const results = [];
    for (let i = 0; i < versions; i++) {
      const result = await this._generateWithAwareness({
        topic: expandedTopic,
        personality: context.selectedPersonality,
        goal: context.selectedGoal,
        audience: context.selectedAudience,
        strategy,
        iteration: i,
        context
      });

      if (result) {
        results.push(result);
      }
    }

    // Phase 4: Rank and save
    results.sort((a, b) => b.finalScore - a.finalScore);
    results.forEach((r, i) => r.rank = i + 1);

    // Save to memory
    for (const result of results) {
      await this._saveGeneration(result, { topic, personality, goal, audience });
    }

    return {
      topic,
      originalTopic: topic,
      expandedTopic,
      context,
      results,
      recommendations: this.learning.getRecommendations(),
      sessionStats: this.session.getSessionStats()
    };
  }

  /**
   * Prepare generation context from memory
   */
  async _prepareGeneration({ topic, personality, goal, audience }) {
    // Get user preferences
    const prefs = await this.memory.getAllPreferences();
    
    // Check topic frequency in session
    const sessionTopicCount = this.session.getTopicCount(topic);
    const isExplored = this.session.isTopicExplored(topic, 2);
    
    // Get topic history
    const topicHistory = await this.memory.getGenerationsByTopic(topic, 10);
    
    // Get recent similar topics
    const relatedSuggestions = this.session.getTopicSuggestions(this.ideaGraph, 3);
    
    // Get recommendations from learning
    const recommendations = this.learning.getRecommendations();
    
    // Select best options based on learning
    const selectedPersonality = recommendations.personality?.personality || personality;
    const selectedGoal = recommendations.strategy?.strategy || goal;
    const selectedAudience = audience;

    return {
      topicHistory,
      isExplored,
      sessionTopicCount,
      relatedSuggestions,
      recommendations,
      selectedPersonality,
      selectedGoal,
      selectedAudience,
      avoidanceHints: this.session.getAvoidanceHints(),
      explorationStrategy: this.session.getExplorationStrategy(topic),
      frequentTopics: await this.memory.getFrequentTopics(5)
    };
  }

  /**
   * Expand topic using IdeaGraph
   */
  async _expandTopic(topic, context) {
    const expansion = this.ideaGraph.buildConceptExpansion(topic);
    
    // If topic is short or generic, expand it
    if (topic.length < 10 || context.isExplored) {
      // Use related concepts to enrich
      const relatedConcept = expansion.related[0];
      if (relatedConcept) {
        return `${topic} - specifically ${relatedConcept.topic}`;
      }
    }
    
    return topic;
  }

  /**
   * Generate single version with full awareness
   */
  async _generateWithAwareness(options) {
    const { topic, personality, goal, audience, strategy, iteration, context } = options;

    let attempt = 0;
    let content = null;
    let scores = null;

    while (attempt < this.maxIterations) {
      // Generate
      const result = this.generator.generate({
        topic,
        personality,
        goal,
        audience,
        strategy
      });

      content = result.content;
      scores = result.critique?.scores || { overall: 75 };

      // Check similarity against recent
      const similarityResult = this.similarity.checkAgainstRecent(content);

      // Check if passes quality checks
      const qualityPass = scores.overall >= 80;
      const similarityPass = !similarityResult.isDuplicate;

      if (qualityPass && similarityPass) {
        break;
      }

      // Log why we're regenerating
      if (!qualityPass) {
        console.log(`Iteration ${attempt + 1}: Quality below threshold (${scores.overall})`);
      }
      if (!similarityPass) {
        console.log(`Iteration ${attempt + 1}: Too similar (${similarityResult.maxSimilarity}) to recent`);
      }

      attempt++;
    }

    // Record in session
    this.session.recordGeneration({
      topic,
      personality,
      goal,
      audience,
      strategy,
      content
    });

    return {
      content,
      scores,
      iteration: attempt + 1,
      strategy: result.strategy,
      topicExpansion: context.explorationStrategy,
      passedQualityCheck: scores.overall >= 80,
      passedSimilarityCheck: !this.similarity.checkAgainstRecent(content).isDuplicate
    };
  }

  /**
   * Save generation to memory
   */
  async _saveGeneration(result, options) {
    // Save to generations
    await this.memory.addGeneration({
      topic: options.topic,
      content: result.content,
      personality: options.personality,
      goal: options.goal,
      audience: options.audience,
      strategy: result.strategy,
      score: result.scores?.overall || 75
    });

    // Save to session
    this.session.recordGeneration({
      topic: options.topic,
      personality: options.personality,
      goal: options.goal,
      audience: options.audience,
      strategy: result.strategy,
      content: result.content
    });

    // Add to similarity engine
    this.similarity.addToRecent(result.content, {
      topic: options.topic,
      personality: options.personality
    });

    // Track topic
    await this.memory.addTopic(options.topic);
  }

  /**
   * Record user signal (copy, save, favorite, etc.)
   */
  async recordSignal(type, contentId, metadata = {}) {
    await this.learning.recordSignal(type, contentId, metadata);
  }

  /**
   * Get learning report
   */
  async getLearningReport() {
    return this.learning.getLearningReport();
  }

  /**
   * Get session stats
   */
  getSessionStats() {
    return this.session.getSessionStats();
  }

  /**
   * Get memory stats
   */
  async getMemoryStats() {
    return this.memory.getStats();
  }

  /**
   * Clear session (new conversation)
   */
  newSession() {
    this.session.newSession();
  }

  /**
   * Clear all memory
   */
  async clearAllMemory() {
    await this.memory.clearAll();
    this.similarity.clear();
    this.session.clear();
  }

  /**
   * Set user preference
   */
  async setPreference(key, value) {
    await this.memory.setPreference(key, value);
  }

  /**
   * Get user preference
   */
  async getPreference(key, defaultValue) {
    return this.memory.getPreference(key, defaultValue);
  }

  /**
   * Add to favorites
   */
  async addFavorite(data) {
    return this.memory.addFavorite(data);
  }

  /**
   * Get favorites
   */
  async getFavorites() {
    return this.memory.getFavorites();
  }

  /**
   * Get recent generations
   */
  async getRecentGenerations(limit = 20) {
    return this.memory.getRecentGenerations(limit);
  }

  /**
   * Get topic expansion preview
   */
  previewTopicExpansion(topic) {
    return this.ideaGraph.buildConceptExpansion(topic);
  }

  /**
   * Explain generation decisions (debug mode)
   */
  async explainGeneration(result, context) {
    return {
      topic: result.topic,
      originalTopic: result.originalTopic,
      expansion: {
        used: result.originalTopic !== result.expandedTopic,
        expandedTo: result.expandedTopic
      },
      memory: {
        topicHistoryCount: context.topicHistory?.length || 0,
        isExplored: context.isExplored,
        explorationStrategy: context.explorationStrategy
      },
      recommendations: {
        personality: context.selectedPersonality,
        goal: context.selectedGoal,
        basedOnLearning: context.recommendations
      },
      quality: {
        overallScore: result.results?.[0]?.scores?.overall || 75,
        passedChecks: result.results?.[0]?.passedQualityCheck
      },
      similarity: {
        passedChecks: result.results?.[0]?.passedSimilarityCheck
      },
      session: {
        topicCount: context.sessionTopicCount,
        generationCount: context.sessionTopicCount
      }
    };
  }
}

export default StrategistContentGenerator;
