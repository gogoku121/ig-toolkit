/**
 * ReflectionEngine
 * Self-critique after generation
 * Asks internal questions to ensure quality
 */

export class ReflectionEngine {
  constructor() {
    this.minimums = {
      hasInsight: true,
      hasExample: true,
      hasOriginalIdea: true,
      hasTakeaway: true,
      soundsHuman: true,
      wouldStartDiscussion: false
    };
  }

  /**
   * Reflect on generated content
   */
  reflect(content, options = {}) {
    const { topic = '', goal = 'engage' } = options;

    const checks = {
      hasInsight: this._checkInsight(content),
      hasExample: this._checkExample(content),
      hasOriginalIdea: this._checkOriginality(content),
      hasTakeaway: this._checkTakeaway(content),
      soundsHuman: this._checkHumanity(content),
      wouldStartDiscussion: this._checkDiscussion(content, goal),
      uniqueObservation: this._checkUniqueObservation(content),
      hasConcreteDetail: this._checkConcreteDetail(content)
    };

    const passed = Object.entries(checks).every(([key, value]) => {
      if (this.minimums[key] === undefined) return true;
      return this.minimums[key] ? value : true;
    });

    const issues = Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([check]) => check);

    const scores = this._calculateScores(checks);

    return {
      passed,
      checks,
      issues,
      scores,
      suggestions: this._getSuggestions(checks, content),
      wouldPost: this._wouldPost(checks),
      wouldSave: this._wouldSave(checks),
      learnedSomething: this._learnedSomething(content)
    };
  }

  /**
   * Check if content has an insight
   */
  _checkInsight(content) {
    // Look for insight indicators
    const insightPatterns = [
      /the (real |actual |key |hidden )?(truth|insight|secret|lesson)/i,
      /what nobody (tells|shares|mentions|explains)/i,
      /the (pattern|principle|rule|law)/i,
      /the ( counterintuitive| surprising| unexpected)? (reason|truth|insight)/i,
      /most people (don't |never |fail to |ignore )/i,
      /here's (what|why)/i,
      /the (biggest|number one|#1|main)/i,
      /(actually|really|truly|honestly)/i
    ];

    const hasInsight = insightPatterns.some(pattern => pattern.test(content));
    
    // Also check for specific, actionable statements
    const hasSpecificClaim = /\d+%|research shows|studies show|data suggests/i.test(content);

    return hasInsight || hasSpecificClaim;
  }

  /**
   * Check if content has an example
   */
  _checkExample(content) {
    const examplePatterns = [
      /example:?/i,
      /for instance/i,
      /such as/i,
      /scenario:?/i,
      /case (of|study)/i,
      /when (I|we|you)/i,
      /story time/i,
      /real (talk|world|life)/i,
      /here's how (this|it)/i,
      /how (I|we|someone)/i,
      /the (story|tale|narrative)/i
    ];

    return examplePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check if content has original idea
   */
  _checkOriginality(content) {
    // Check against common template phrases
    const templatePhrases = [
      'at the end of the day',
      'needless to say',
      'it goes without saying',
      'think outside the box',
      'low hanging fruit',
      'move the needle',
      'circle back',
      'synergy',
      'leverage',
      'paradigm shift'
    ];

    const hasTemplate = templatePhrases.some(phrase => 
      content.toLowerCase().includes(phrase)
    );

    if (hasTemplate) return false;

    // Check for repeated words
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = {};
    words.forEach(w => {
      const cleaned = w.replace(/[^a-z]/g, '');
      if (cleaned.length > 3) {
        wordCounts[cleaned] = (wordCounts[cleaned] || 0) + 1;
      }
    });

    const maxRepetition = Math.max(...Object.values(wordCounts), 0);
    if (maxRepetition > 5) return false;

    // Should have some variety
    const uniqueWords = new Set(words.filter(w => w.length > 3)).size;
    const ratio = uniqueWords / words.length;
    if (ratio < 0.3) return false;

    return true;
  }

  /**
   * Check if content has takeaway
   */
  _checkTakeaway(content) {
    const takeawayPatterns = [
      /(key |main |most important |essential )?(lesson|takeaway|point|insight|principle)/i,
      /the (bottom line|summary|tl;dr|line version)/i,
      /what (you|we) should (do|take away|remember)/i,
      /action item/i,
      /here's (what to|how to)/i,
      /try this/i,
      /start here/i,
      /(lesson|lesson learned)/i
    ];

    return takeawayPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check if content sounds human
   */
  _checkHumanity(content) {
    // Check for robotic patterns
    const roboticPatterns = [
      /^in today's (fast-paced|ever-changing|digital)/i,
      /leveraging/i,
      /utilizing/i,
      /synergy/i,
      /at the end of the day/i,
      /it is important to note/i,
      /it should be noted/i,
      /in conclusion/i,
      /to summarize/i
    ];

    const hasRobotic = roboticPatterns.some(pattern => pattern.test(content));
    if (hasRobotic) return false;

    // Check sentence length variety
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 3) return true; // Too short to judge

    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
    
    // Some variety is good
    if (variance < 5 && avg > 15) return false; // All sentences same length = robotic

    // Check for contractions (humans use them)
    const hasContraction = /'[a-z]{2}/i.test(content);
    if (!hasContraction && content.length > 200) return false;

    return true;
  }

  /**
   * Check if content would start discussion
   */
  _checkDiscussion(content, goal) {
    if (goal === 'generate comments') {
      const questionPatterns = [/\?/g, /what (do you|would|think)/i, /how (do you|would|about)/i, /comment below/i];
      return questionPatterns.some(pattern => pattern.test(content));
    }

    // Generally engaging content
    const engagingPatterns = [
      /what (do you|would|think)/i,
      /how (would|about|do you)/i,
      /agree or disagree/i,
      /your (take|thoughts|experience)/i,
      /let me know/i,
      /comment below/i
    ];

    return engagingPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check for unique observation
   */
  _checkUniqueObservation(content) {
    // Look for specific, memorable statements
    const memorablePatterns = [
      /the (\w+ )?(secret|truth|insight|lesson|thing)/i,
      /what nobody (tells|shares|mentions)/i,
      /(actually|honestly|really|truly)/i,
      /here's (the |a )?(thing|secret|truth)/i,
      /most people (don't |never |fail to )/i,
      /(counterintuitive|surprising|unexpected)/i
    ];

    return memorablePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check for concrete detail
   */
  _checkConcreteDetail(content) {
    // Look for numbers, names, specific terms
    const concretePatterns = [
      /\d+%/,
      /\d+x/i,
      /\d+ (hours|days|weeks|months|years)/i,
      /[A-Z][a-z]+ (says|shows|proves|explains)/i, // Named experts
      /^(what|when|where|how|why)/i // Questions starting with what/when
    ];

    return concretePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Calculate scores for each criterion
   */
  _calculateScores(checks) {
    return {
      insight: checks.hasInsight ? 90 + Math.random() * 10 : 50 + Math.random() * 20,
      example: checks.hasExample ? 90 + Math.random() * 10 : 40 + Math.random() * 20,
      originality: checks.hasOriginalIdea ? 85 + Math.random() * 15 : 30 + Math.random() * 30,
      takeaway: checks.hasTakeaway ? 90 + Math.random() * 10 : 50 + Math.random() * 20,
      humanity: checks.soundsHuman ? 85 + Math.random() * 15 : 40 + Math.random() * 30,
      discussion: checks.wouldStartDiscussion ? 90 + Math.random() * 10 : 60 + Math.random() * 20,
      uniqueObservation: checks.uniqueObservation ? 85 + Math.random() * 15 : 40 + Math.random() * 30,
      concreteDetail: checks.hasConcreteDetail ? 80 + Math.random() * 20 : 30 + Math.random() * 30
    };
  }

  /**
   * Get suggestions for improvement
   */
  _getSuggestions(checks, content) {
    const suggestions = [];

    if (!checks.hasInsight) {
      suggestions.push({
        issue: 'No clear insight',
        suggestion: 'Add a surprising fact, counterintuitive truth, or key lesson'
      });
    }

    if (!checks.hasExample) {
      suggestions.push({
        issue: 'No example',
        suggestion: 'Include a real scenario, case study, or specific situation'
      });
    }

    if (!checks.hasOriginalIdea) {
      suggestions.push({
        issue: 'Sounds templated',
        suggestion: 'Replace generic phrases with specific observations'
      });
    }

    if (!checks.hasTakeaway) {
      suggestions.push({
        issue: 'No clear takeaway',
        suggestion: 'End with actionable advice or key lesson'
      });
    }

    if (!checks.soundsHuman) {
      suggestions.push({
        issue: 'Sounds robotic',
        suggestion: 'Use contractions, vary sentence length, remove formal phrases'
      });
    }

    if (!checks.wouldStartDiscussion && content.length > 500) {
      suggestions.push({
        issue: 'No discussion prompt',
        suggestion: 'Add a question or invitation to comment'
      });
    }

    if (!checks.uniqueObservation) {
      suggestions.push({
        issue: 'Missing unique angle',
        suggestion: 'Add a counterintuitive or surprising observation'
      });
    }

    if (!checks.hasConcreteDetail) {
      suggestions.push({
        issue: 'Too abstract',
        suggestion: 'Add specific numbers, examples, or named concepts'
      });
    }

    return suggestions;
  }

  /**
   * Would a real creator post this?
   */
  _wouldPost(checks) {
    // Must pass humanity, originality, and at least one of insight/example
    const critical = checks.soundsHuman && checks.hasOriginalIdea;
    const valuable = checks.hasInsight || checks.hasExample;

    return critical && valuable;
  }

  /**
   * Would someone save this?
   */
  _wouldSave(checks) {
    // Must have takeaway and be useful
    return checks.hasTakeaway && checks.hasConcreteDetail;
  }

  /**
   * Does this teach something?
   */
  _learnedSomething(content) {
    const teachPatterns = [
      /here's (what|why|how)/i,
      /the (key|main|important) (lesson|insight|principle)/i,
      /what (I|experts|research) (found|discovered|learned)/i,
      /the (truth|secret|reason)/i,
      /(lesson|learning):/i
    ];

    return teachPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Get overall quality score
   */
  getQualityScore(reflection) {
    const { scores } = reflection;
    
    const weights = {
      insight: 0.15,
      example: 0.15,
      originality: 0.15,
      takeaway: 0.15,
      humanity: 0.15,
      discussion: 0.05,
      uniqueObservation: 0.1,
      concreteDetail: 0.1
    };

    let total = 0;
    let weightSum = 0;

    Object.entries(weights).forEach(([criterion, weight]) => {
      if (scores[criterion] !== undefined) {
        total += scores[criterion] * weight;
        weightSum += weight;
      }
    });

    return Math.round(total / weightSum);
  }

  /**
   * Get grade from score
   */
  getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

export default ReflectionEngine;
