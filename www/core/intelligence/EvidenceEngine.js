/**
 * EvidenceEngine
 * Supports major insights with evidence types:
 * - Practical examples
 * - Hypothetical scenarios
 * - Comparisons
 * - Mini case studies
 * - Memorable observations
 */

export class EvidenceEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate evidence for insights
   */
  generateEvidence(insights, options = {}) {
    const {
      topic,
      count = 5,
      type = 'auto' // 'example', 'scenario', 'comparison', 'case', 'observation', 'auto'
    } = options;

    const evidence = [];
    const pack = this.topicPacks?.getPack(topic);

    // Generate based on type preference
    const types = type === 'auto' 
      ? ['example', 'scenario', 'comparison', 'case', 'observation']
      : [type];

    types.forEach(evidenceType => {
      const generated = this._generateByType(evidenceType, insights, pack, topic);
      evidence.push(...generated);
    });

    // Fill from pack examples
    if (pack?.practicalExamples) {
      pack.practicalExamples.forEach(ex => {
        evidence.push({
          type: 'example',
          scenario: ex.scenario,
          approach: ex.approach,
          outcome: ex.outcome,
          text: `${ex.scenario}: ${ex.approach}`,
          confidence: 0.9
        });
      });
    }

    // Rank and dedupe
    const ranked = this._rankEvidence(evidence);
    return ranked.slice(0, count);
  }

  /**
   * Generate evidence by type
   */
  _generateByType(type, insights, pack, topic) {
    switch (type) {
      case 'example':
        return this._generateExamples(insights, pack, topic);
      case 'scenario':
        return this._generateScenarios(insights, pack, topic);
      case 'comparison':
        return this._generateComparisons(insights, pack, topic);
      case 'case':
        return this._generateCaseStudies(insights, pack, topic);
      case 'observation':
        return this._generateObservations(insights, pack, topic);
      default:
        return [];
    }
  }

  /**
   * Generate practical examples
   */
  _generateExamples(insights, pack, topic) {
    const examples = [];

    // From pack
    if (pack?.practicalExamples) {
      pack.practicalExamples.forEach(ex => {
        examples.push({
          type: 'example',
          scenario: ex.scenario,
          approach: ex.approach,
          outcome: ex.outcome,
          text: `Example:\n\n${ex.scenario}\n\n${ex.approach}`,
          confidence: 0.9
        });
      });
    }

    // Generate hypothetical examples
    examples.push({
      type: 'example',
      scenario: `Someone struggling with ${topic} starts with a minimal approach`,
      approach: `They focus on the single most important change, ignoring everything else`,
      outcome: `Within weeks, they see measurable progress`,
      text: `Real example:\n\nSomeone struggling with ${topic} started with just one change.\n\nThey ignored the noise and focused on what actually mattered.\n\nThe result: meaningful progress in weeks, not months.`,
      confidence: 0.7
    });

    return examples;
  }

  /**
   * Generate hypothetical scenarios
   */
  _generateScenarios(insights, pack, topic) {
    const scenarios = [];

    // Common scenario formats
    scenarios.push({
      type: 'scenario',
      premise: `Imagine two people starting ${topic}`,
      scenarioA: `Person A tries to do everything at once`,
      scenarioB: `Person B focuses on one thing`,
      outcome: `Person B sees results faster because they avoided the common trap`,
      text: `Scenario:\n\nTwo people start learning about ${topic}.\n\nPerson A tries everything at once - overwhelmed, slow progress.\n\nPerson B picks one approach and goes deep.\n\nPerson B wins. The lesson: less but focused beats more but scattered.`,
      confidence: 0.75
    });

    scenarios.push({
      type: 'scenario',
      premise: `What if you had unlimited resources for ${topic}?`,
      scenarioA: `Would you actually use them all?`,
      insight: `Most people wouldn't. Constraints force focus.`,
      text: `Thought experiment:\n\nIf you had unlimited time, money, and tools for ${topic}, would you actually be better?\n\nProbably not. Constraints force focus. The limitation is often the advantage.`,
      confidence: 0.7
    });

    return scenarios;
  }

  /**
   * Generate comparisons
   */
  _generateComparisons(insights, pack, topic) {
    const comparisons = [];

    // From pack comparisons
    if (pack?.comparisons) {
      pack.comparisons.forEach(comp => {
        comparisons.push({
          type: 'comparison',
          subject: comp.subject,
          versus: comp.versus,
          betterFor: comp.betterFor,
          nuance: comp.nuance,
          text: `${comp.subject} vs ${comp.versus}:\n\n${comp.betterFor}`,
          confidence: 0.85
        });
      });
    }

    // Generic comparison
    comparisons.push({
      type: 'comparison',
      subject: `Doing ${topic} perfectly`,
      versus: `Doing ${topic} consistently`,
      betterFor: `Consistency wins. Perfect but sporadic beats perfect but rare.`,
      nuance: `The best approach is sustainable, not optimal.`,
      text: `Comparison:\n\nOption A: Perfect ${topic} done occasionally.\nOption B: Good enough ${topic} done consistently.\n\nConsistency wins. Always.`,
      confidence: 0.8
    });

    return comparisons;
  }

  /**
   * Generate mini case studies
   */
  _generateCaseStudies(insights, pack, topic) {
    const cases = [];

    cases.push({
      type: 'case_study',
      subject: `The ${topic} transformation`,
      before: `Struggling with basics, trying too much`,
      approach: `Stripped back to fundamentals, focused on one improvement`,
      after: `Significant progress in 30 days`,
      lesson: `Sometimes doing less is the breakthrough`,
      text: `Mini Case Study:\n\nBefore: Trying everything, overwhelmed, no progress.\n\nApproach: Cut the noise. Focus on one thing.\n\nAfter: First real progress in weeks.\n\nThe pattern: complexity is often the problem, simplicity is the solution.`,
      confidence: 0.8
    });

    return cases;
  }

  /**
   * Generate memorable observations
   */
  _generateObservations(insights, pack, topic) {
    const observations = [];

    // From pack facts
    if (pack?.facts) {
      pack.facts.slice(0, 3).forEach(fact => {
        observations.push({
          type: 'observation',
          text: fact,
          implication: this._implyFromFact(fact, topic),
          confidence: 0.75
        });
      });
    }

    // Generate observation
    observations.push({
      type: 'observation',
      text: `${topic} follows the 80/20 rule - 80% of results come from 20% of efforts`,
      implication: `Find that 20% and focus there. Ignore the rest.`,
      confidence: 0.7
    });

    return observations;
  }

  /**
   * Imply meaning from fact
   */
  _implyFromFact(fact, topic) {
    const implications = [
      `This reveals something fundamental about ${topic}`,
      `The hidden meaning behind this for ${topic}:`,
      `What this means for your approach to ${topic}:`,
      `The practical implication for ${topic}:`
    ];

    return implications[Math.floor(Math.random() * implications.length)];
  }

  /**
   * Rank evidence by quality
   */
  _rankEvidence(evidence) {
    return evidence
      .map(e => ({
        ...e,
        score: this._calculateEvidenceScore(e)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate evidence quality score
   */
  _calculateEvidenceScore(evidence) {
    let score = 50;

    // Higher confidence = higher score
    score += (evidence.confidence || 0.5) * 30;

    // Has multiple parts = better
    if (evidence.scenario && evidence.outcome) score += 15;
    if (evidence.before && evidence.after) score += 15;

    // Has lesson or implication = better
    if (evidence.lesson || evidence.implication || evidence.nuance) score += 10;

    // Longer text often means more substance
    if (evidence.text && evidence.text.length > 150) score += 10;

    return score;
  }

  /**
   * Get best evidence for insight
   */
  getBestEvidence(insights, topic) {
    const evidence = this.generateEvidence(insights, { topic, count: 1 });
    return evidence[0] || null;
  }

  /**
   * Ensure insight has evidence
   */
  ensureEvidence(insight, topic) {
    if (insight.evidence) return insight;

    const evidence = this.getBestEvidence([insight], topic);
    if (evidence) {
      return {
        ...insight,
        evidence,
        hasEvidence: true
      };
    }

    return insight;
  }
}

export default EvidenceEngine;
