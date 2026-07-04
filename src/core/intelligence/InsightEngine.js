/**
 * InsightEngine
 * Transforms facts into original conclusions
 * Infers implications, trade-offs, unexpected observations, and practical lessons
 */

export class InsightEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate insights from facts and observations
   */
  generateInsights(topic, options = {}) {
    const {
      facts = [],
      observations = [],
      count = 8
    } = options;

    const insights = [];
    const pack = this.topicPacks?.getPack(topic);

    // Transform facts into insights
    facts.forEach(fact => {
      insights.push(...this._transformFact(fact, topic, pack));
    });

    // Transform observations into deeper insights
    observations.forEach(obs => {
      const insight = this._deriveInsight(obs, topic);
      if (insight) insights.push(insight);
    });

    // Generate additional insights from pack data
    if (pack) {
      insights.push(...this._generateFromPack(pack, topic));
    }

    // Rank and dedupe
    const ranked = this._rankInsights(insights);
    return ranked.slice(0, count);
  }

  /**
   * Transform a fact into multiple insights
   */
  _transformFact(fact, topic, pack) {
    const insights = [];

    // Implication insight
    const implication = this._inferImplication(fact, topic);
    if (implication) insights.push(implication);

    // Trade-off insight
    const tradeoff = this._identifyTradeoff(fact, topic);
    if (tradeoff) insights.push(tradeoff);

    // Unexpected observation
    const unexpected = this._findUnexpected(fact, topic, pack);
    if (unexpected) insights.push(unexpected);

    // Practical lesson
    const lesson = this._extractLesson(fact, topic);
    if (lesson) insights.push(lesson);

    return insights;
  }

  /**
   * Infer implication from fact
   */
  _inferImplication(fact, topic) {
    const implications = [
      `This means ${topic} is more about ${this._getProcessAspect(topic)} than most people think`,
      `The implication for ${topic} is significant: ${this._getImplication(topic)}`,
      `What this reveals about ${topic}:`,
      `The deeper meaning behind ${topic}:`,
      `This changes how we should think about ${topic}`
    ];

    const implication = implications[Math.floor(Math.random() * implications.length)];

    return {
      type: 'implication',
      text: `${implication}\n\n${fact}`,
      insight: implication,
      supportingFact: fact,
      confidence: 0.8,
      category: 'implication',
      original: true
    };
  }

  /**
   * Identify trade-off
   */
  _identifyTradeoff(fact, topic) {
    const tradeoffs = [
      {
        a: `More ${topic}`,
        b: `Better quality`,
        connector: 'but'
      },
      {
        a: `Speed in ${topic}`,
        b: `Depth of understanding`,
        connector: 'means sacrificing'
      },
      {
        a: `Simple ${topic}`,
        b: `Powerful results`,
        connector: 'can still deliver'
      }
    ];

    const tradeoff = tradeoffs[Math.floor(Math.random() * tradeoffs.length)];

    return {
      type: 'tradeoff',
      text: `The ${topic} tradeoff: ${tradeoff.a} ${tradeoff.connector} ${tradeoff.b}`,
      insight: `${tradeoff.a} ${tradeoff.connector} ${tradeoff.b}`,
      confidence: 0.75,
      category: 'tradeoff',
      original: true
    };
  }

  /**
   * Find unexpected angle
   */
  _findUnexpected(fact, topic, pack) {
    const unexpectedAngles = [
      `What nobody tells you about ${topic}:`,
      `The ${topic} insight that surprised me:`,
      `Here's what ${topic} experts won't admit:`,
      `The ${topic} truth nobody discusses:`
    ];

    const angle = unexpectedAngles[Math.floor(Math.random() * unexpectedAngles.length)];

    return {
      type: 'unexpected',
      text: `${angle}\n\n${fact}`,
      insight: angle,
      supportingFact: fact,
      confidence: 0.7,
      category: 'surprise',
      original: true
    };
  }

  /**
   * Extract practical lesson
   */
  _extractLesson(fact, topic) {
    const lessons = [
      `The lesson from ${topic}:`,
      `What this teaches us about ${topic}:`,
      `Practical takeaway from ${topic}:`,
      `How to apply this to ${topic}:`
    ];

    const lesson = lessons[Math.floor(Math.random() * lessons.length)];

    return {
      type: 'lesson',
      text: `${lesson}\n\n${fact}`,
      insight: lesson,
      supportingFact: fact,
      confidence: 0.8,
      category: 'lesson',
      original: true
    };
  }

  /**
   * Derive insight from observation
   */
  _deriveInsight(observation, topic) {
    const { type, text } = observation;

    // Only process certain types
    if (!['fact', 'statistic', 'example', 'trend'].includes(type)) {
      return null;
    }

    // Generate deeper insight
    const patterns = [
      () => `The real significance: ${text}`,
      () => `Why this matters for ${topic}:`,
      () => `The overlooked connection in ${topic}:`,
      () => `This reveals something important about ${topic}`
    ];

    const insight = patterns[Math.floor(Math.random() * patterns.length)]();

    return {
      type: 'derived',
      text: `${insight}\n\n${text}`,
      insight,
      supportingObservation: text,
      confidence: 0.7,
      category: 'insight',
      original: true
    };
  }

  /**
   * Generate insights from pack
   */
  _generateFromPack(pack, topic) {
    const insights = [];

    // From misconceptions
    if (pack.misconceptions) {
      pack.misconceptions.forEach(mis => {
        insights.push({
          type: 'myth_bust',
          text: `Myth: ${mis.myth}\n\nReality: ${mis.truth}`,
          insight: mis.truth,
          supportingMyth: mis.myth,
          confidence: 0.9,
          category: 'insight',
          original: true
        });
      });
    }

    // From expert tips
    if (pack.expertTips) {
      pack.expertTips.slice(0, 3).forEach(tip => {
        insights.push({
          type: 'expert',
          text: `Expert insight on ${topic}:\n\n${tip}`,
          insight: tip,
          confidence: 0.85,
          category: 'insight',
          original: false
        });
      });
    }

    return insights;
  }

  /**
   * Get process aspect for topic
   */
  _getProcessAspect(topic) {
    const aspects = {
      ai: 'understanding patterns',
      business: 'customer focus',
      fitness: 'consistency',
      marketing: 'authenticity',
      productivity: 'prioritization',
      default: 'fundamental approach'
    };

    return aspects[topic.toLowerCase()] || aspects.default;
  }

  /**
   * Get implication for topic
   */
  _getImplication(topic) {
    const implications = {
      ai: 'we need to focus on judgment, not just knowledge',
      business: 'execution matters more than ideas',
      fitness: 'sustainable habits beat intense bursts',
      marketing: 'genuine connection beats volume',
      productivity: 'doing less often produces more',
      default: 'we need to reconsider our approach'
    };

    return implications[topic.toLowerCase()] || implications.default;
  }

  /**
   * Rank insights by quality
   */
  _rankInsights(insights) {
    return insights
      .map(insight => ({
        ...insight,
        score: this._calculateInsightScore(insight)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate insight quality score
   */
  _calculateInsightScore(insight) {
    let score = 0;

    // Original insights score higher
    if (insight.original) score += 20;

    // Higher confidence = higher score
    score += (insight.confidence || 0.5) * 30;

    // Implications and tradeoffs are valuable
    if (['implication', 'tradeoff', 'unexpected'].includes(insight.type)) {
      score += 15;
    }

    // Must have actual insight text
    if (!insight.insight) score -= 30;

    // Longer insight text often means more substance
    if (insight.text && insight.text.length > 100) score += 10;

    return score;
  }

  /**
   * Get best insight for caption
   */
  getBestInsight(insights) {
    if (!insights || insights.length === 0) return null;
    return insights[0];
  }

  /**
   * Check if insights are original enough
   */
  hasOriginalInsight(insights) {
    return insights.some(i => i.original || i.type === 'implication' || i.type === 'tradeoff' || i.type === 'unexpected');
  }
}

export default InsightEngine;
