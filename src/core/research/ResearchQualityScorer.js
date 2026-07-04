/**
 * ResearchQualityScorer
 * Scores research quality based on extracted data
 */

export class ResearchQualityScorer {
  constructor() {
    this.minimumThreshold = 40;
    this.goodThreshold = 70;
    
    this.weights = {
      usefulResults: 20,
      entities: 15,
      questions: 10,
      trends: 15,
      insights: 15,
      freshness: 10,
      diversity: 15
    };
  }

  /**
   * Score research quality
   */
  score(research, options = {}) {
    const {
      minThreshold = this.minimumThreshold,
      provider = 'unknown'
    } = options;

    if (!research) {
      return this._createScore(0, 'empty', provider, 'No research data');
    }

    const scores = {};
    let totalScore = 0;

    // 1. Useful results (20%)
    scores.usefulResults = this._scoreResults(research.results);
    totalScore += scores.usefulResults * this.weights.usefulResults / 100;

    // 2. Entities (15%)
    scores.entities = this._scoreEntities(research.entities);
    totalScore += scores.entities * this.weights.entities / 100;

    // 3. Questions (10%)
    scores.questions = this._scoreQuestions(research.questions);
    totalScore += scores.questions * this.weights.questions / 100;

    // 4. Trends (15%)
    scores.trends = this._scoreTrends(research.trends);
    totalScore += scores.trends * this.weights.trends / 100;

    // 5. Insights (15%)
    scores.insights = this._scoreInsights(research.insights);
    totalScore += scores.insights * this.weights.insights / 100;

    // 6. Freshness (10%)
    scores.freshness = this._scoreFreshness(research.timestamp);
    totalScore += scores.freshness * this.weights.freshness / 100;

    // 7. Diversity (15%)
    scores.diversity = this._scoreDiversity(research);
    totalScore += scores.diversity * this.weights.diversity / 100;

    // Calculate final score
    const finalScore = Math.round(totalScore);

    // Determine quality level
    let quality = 'poor';
    let pass = false;
    let reason = '';

    if (finalScore >= this.goodThreshold) {
      quality = 'excellent';
      pass = true;
      reason = 'High quality research with diverse data';
    } else if (finalScore >= minThreshold) {
      quality = 'adequate';
      pass = true;
      reason = 'Research meets minimum quality threshold';
    } else {
      quality = 'poor';
      pass = false;
      reason = `Research score (${finalScore}) below threshold (${minThreshold})`;
    }

    return {
      score: finalScore,
      quality,
      pass,
      reason,
      scores,
      breakdown: {
        usefulResults: Math.round(scores.usefulResults),
        entities: Math.round(scores.entities),
        questions: Math.round(scores.questions),
        trends: Math.round(scores.trends),
        insights: Math.round(scores.insights),
        freshness: Math.round(scores.freshness),
        diversity: Math.round(scores.diversity)
      },
      threshold: minThreshold,
      provider,
      timestamp: Date.now()
    };
  }

  /**
   * Score results
   */
  _scoreResults(results) {
    if (!results || results.length === 0) return 0;
    
    // Score based on number of results with content
    const useful = results.filter(r => r.title && r.snippet && r.snippet.length > 50);
    
    if (useful.length >= 10) return 100;
    if (useful.length >= 7) return 80;
    if (useful.length >= 5) return 60;
    if (useful.length >= 3) return 40;
    if (useful.length >= 1) return 20;
    return 0;
  }

  /**
   * Score entities
   */
  _scoreEntities(entities) {
    if (!entities || entities.length === 0) return 0;
    
    if (entities.length >= 15) return 100;
    if (entities.length >= 10) return 80;
    if (entities.length >= 7) return 60;
    if (entities.length >= 5) return 40;
    if (entities.length >= 3) return 20;
    return 10;
  }

  /**
   * Score questions
   */
  _scoreQuestions(questions) {
    if (!questions || questions.length === 0) return 0;
    
    if (questions.length >= 10) return 100;
    if (questions.length >= 7) return 80;
    if (questions.length >= 5) return 60;
    if (questions.length >= 3) return 40;
    if (questions.length >= 1) return 20;
    return 0;
  }

  /**
   * Score trends
   */
  _scoreTrends(trends) {
    if (!trends || trends.length === 0) return 0;
    
    if (trends.length >= 8) return 100;
    if (trends.length >= 5) return 70;
    if (trends.length >= 3) return 50;
    if (trends.length >= 1) return 30;
    return 0;
  }

  /**
   * Score insights
   */
  _scoreInsights(insights) {
    if (!insights || insights.length === 0) return 0;
    
    if (insights.length >= 8) return 100;
    if (insights.length >= 5) return 70;
    if (insights.length >= 3) return 50;
    if (insights.length >= 1) return 30;
    return 0;
  }

  /**
   * Score freshness
   */
  _scoreFreshness(timestamp) {
    if (!timestamp) return 50; // Unknown age
    
    const age = Date.now() - timestamp;
    const hour = 3600000;
    const day = hour * 24;
    
    if (age < hour) return 100;
    if (age < day) return 80;
    if (age < day * 2) return 60;
    if (age < day * 7) return 40;
    if (age < day * 30) return 20;
    return 0;
  }

  /**
   * Score diversity
   */
  _scoreDiversity(research) {
    let typesFound = 0;
    const totalTypes = 8;

    if (research.entities?.length > 0) typesFound++;
    if (research.questions?.length > 0) typesFound++;
    if (research.trends?.length > 0) typesFound++;
    if (research.insights?.length > 0) typesFound++;
    if (research.keywords?.length > 0) typesFound++;
    if (research.opinions?.length > 0) typesFound++;
    if (research.comparisons?.length > 0) typesFound++;
    if (research.examples?.length > 0) typesFound++;

    return (typesFound / totalTypes) * 100;
  }

  /**
   * Create a score object
   */
  _createScore(score, quality, provider, reason) {
    return {
      score,
      quality,
      pass: score >= this.minimumThreshold,
      reason,
      scores: {
        usefulResults: 0,
        entities: 0,
        questions: 0,
        trends: 0,
        insights: 0,
        freshness: 0,
        diversity: 0
      },
      breakdown: {
        usefulResults: 0,
        entities: 0,
        questions: 0,
        trends: 0,
        insights: 0,
        freshness: 0,
        diversity: 0
      },
      threshold: this.minimumThreshold,
      provider,
      timestamp: Date.now()
    };
  }

  /**
   * Compare two research results
   */
  compare(researchA, researchB) {
    const scoreA = this.score(researchA);
    const scoreB = this.score(researchB);
    
    return {
      winner: scoreA.score >= scoreB.score ? 'A' : 'B',
      scoreA: scoreA.score,
      scoreB: scoreB.score,
      difference: Math.abs(scoreA.score - scoreB.score)
    };
  }

  /**
   * Set minimum threshold
   */
  setThreshold(threshold) {
    this.minimumThreshold = threshold;
  }

  /**
   * Get score description
   */
  getDescription(score) {
    if (score >= 90) return 'Excellent - Rich, diverse research data';
    if (score >= 70) return 'Good - Solid research with multiple data types';
    if (score >= 50) return 'Adequate - Basic research data';
    if (score >= 30) return 'Poor - Limited research data';
    return 'Insufficient - Research below quality threshold';
  }
}

export default ResearchQualityScorer;
