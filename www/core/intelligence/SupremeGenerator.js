/**
 * SupremeGenerator
 * Final orchestrator combining all improvements:
 * - IdeaMixer for concept expansion
 * - DraftEngine for iterative drafts
 * - OriginalityEngine as core check (most important!)
 * - EditEngine for active rewriting
 * - ReflectionEngine for final validation
 */

import { TopicPackManager } from './TopicPacks.js';
import { InsightEngine } from './InsightEngine.js';
import { QuestionEngine } from './QuestionEngine.js';
import { AnalogyEngine } from './AnalogyEngine.js';
import { DebateEngine } from './DebateEngine.js';
import { EvidenceEngine } from './EvidenceEngine.js';
import { CuriosityEngine } from './CuriosityEngine.js';
import { CreatorStyleEngine } from './CreatorStyleEngine.js';
import { OriginalityEngine } from './OriginalityEngine.js';
import { DraftEngine } from './DraftEngine.js';
import { EditEngine } from './EditEngine.js';
import { IdeaMixer } from './IdeaMixer.js';
import { WriterEngine } from './WriterEngine.js';
import { ReflectionEngine } from './ReflectionEngine.js';

export class SupremeGenerator {
  constructor() {
    this.topicPacks = new TopicPackManager();
    this.insightEngine = new InsightEngine(this.topicPacks);
    this.questionEngine = new QuestionEngine(this.topicPacks);
    this.analogyEngine = new AnalogyEngine(this.topicPacks);
    this.debateEngine = new DebateEngine(this.topicPacks);
    this.evidenceEngine = new EvidenceEngine(this.topicPacks);
    this.curiosityEngine = new CuriosityEngine();
    this.styleEngine = new CreatorStyleEngine();
    this.originalityEngine = new OriginalityEngine();
    this.draftEngine = new DraftEngine();
    this.editEngine = new EditEngine();
    this.ideaMixer = new IdeaMixer();
    this.writerEngine = new WriterEngine();
    this.reflectionEngine = new ReflectionEngine();
  }

  /**
   * Generate using supreme pipeline
   */
  generate(options = {}) {
    const {
      topic,
      personality = 'default',
      goal = 'engage',
      audience = 'general'
    } = options;

    // Phase 1: Expand topic with IdeaMixer
    const ideaMix = this._expandTopic(topic);

    // Phase 2: Gather all intelligence
    const data = this._gatherIntelligence(ideaMix, topic, { goal, personality });

    // Phase 3: Generate multiple drafts
    const drafts = this._generateDrafts(ideaMix, data, { personality, goal });

    // Phase 4: Select best draft
    const { bestDraft, draftIndex } = this._selectBestDraft(drafts);

    // Phase 5: Check originality (THE MOST IMPORTANT STEP)
    let originality = this.originalityEngine.check(bestDraft.rawContent, {
      topic: ideaMix.primary,
      recentContent: []
    });

    // Phase 6: Active editing based on originality results
    let content = bestDraft.rawContent;
    let editedContent = this.editEngine.edit(content, originality, {
      topic: ideaMix.primary,
      insights: data.insights,
      evidence: data.evidence
    });

    // Phase 7: Re-check after editing
    let edited = editedContent.content;
    let recheck = this.originalityEngine.check(edited, {
      topic: ideaMix.primary,
      recentContent: []
    });

    // Phase 8: Iterate if still failing
    let iterations = 1;
    const maxIterations = 3;

    while (!recheck.passed && iterations < maxIterations) {
      edited = this.editEngine.fullEdit(edited, {
        topic: ideaMix.primary,
        insights: data.insights,
        evidence: data.evidence
      }).content;

      recheck = this.originalityEngine.check(edited, {
        topic: ideaMix.primary,
        recentContent: []
      });
      iterations++;
    }

    // Phase 9: Final reflection
    const reflection = this.reflectionEngine.reflect(edited, { topic: ideaMix.primary, goal });

    // Phase 10: Calculate final score
    const finalScore = this._calculateFinalScore(recheck, reflection);
    const grade = this._getGrade(finalScore);

    return {
      content: edited,
      topic: ideaMix.primary,
      ideaMix,

      // Generation data
      pipeline: {
        draftsGenerated: drafts.length,
        bestDraftIndex: draftIndex,
        originalityChecks: iterations,
        editsApplied: editedContent.edits?.length || 0
      },

      // Quality checks
      originality: recheck,
      reflection,
      scores: {
        originality: recheck.score,
        quality: reflection.scores,
        overall: finalScore
      },
      grade,

      // Success criteria
      checks: {
        hasInsight: recheck.hasOriginalInsight.passed,
        hasExample: recheck.hasConcreteExample.passed,
        hasTakeaway: recheck.hasActionableTakeaway.passed,
        hasEmotional: recheck.hasEmotionalEngagement.passed,
        isOriginal: !recheck.isTemplateGenerated.passed,
        wouldSave: recheck.wouldSave.passed,
        hasStopScroll: recheck.hasStopScrollSentence.found
      }
    };
  }

  /**
   * Expand topic using IdeaMixer
   */
  _expandTopic(topic) {
    const mix = this.ideaMixer.mix([topic], { count: 3 });
    return mix;
  }

  /**
   * Gather all intelligence data
   */
  _gatherIntelligence(ideaMix, topic, options) {
    const pack = this.topicPacks.getPack(topic) || {};

    // Generate insights
    const insights = this.insightEngine.generateInsights(topic, {
      facts: pack.facts || [],
      count: 8
    });

    // Generate questions
    const questions = this.questionEngine.generateQuestions(topic, {
      facts: pack.facts || [],
      count: 10
    });

    // Generate evidence
    const evidence = this.evidenceEngine.generateEvidence(insights, { topic, count: 5 });

    // Generate analogies
    const analogies = this.analogyEngine.generateAnalogies(topic, { count: 3 });

    // Generate debate
    const debate = this.debateEngine.generateDebate(topic, { stance: 'auto' });

    // Generate hooks
    const hooks = this.curiosityEngine.generateHooks(topic, {
      personality: options.personality,
      count: 10
    });

    return {
      insights,
      questions,
      evidence,
      analogies,
      debate,
      hooks,
      painPoints: pack.painPoints || [],
      misconceptions: pack.misconceptions || [],
      topic
    };
  }

  /**
   * Generate multiple drafts
   */
  _generateDrafts(ideaMix, data, options) {
    // Use different draft styles
    const draftStyles = ['insight_first', 'story_first', 'question_first', 'contrarian_first'];

    const drafts = draftStyles.slice(0, 3).map(style => {
      return this.draftEngine.generateDraft(ideaMix.primary, {
        style,
        data: {
          ...data,
          topic: ideaMix.primary
        },
        personality: options.personality
      });
    });

    return drafts;
  }

  /**
   * Select best draft using originality
   */
  _selectBestDraft(drafts) {
    let bestDraft = drafts[0];
    let bestScore = 0;
    let draftIndex = 0;

    drafts.forEach((draft, index) => {
      const originality = this.originalityEngine.check(draft.rawContent, {});
      if (originality.score > bestScore) {
        bestScore = originality.score;
        bestDraft = draft;
        draftIndex = index;
      }
    });

    return { bestDraft, draftIndex };
  }

  /**
   * Calculate final score
   */
  _calculateFinalScore(originality, reflection) {
    // Weight originality more heavily (THE MOST IMPORTANT METRIC)
    const weights = {
      originality: 0.4,
      insight: 0.15,
      example: 0.15,
      takeaway: 0.1,
      humanity: 0.1,
      emotional: 0.1
    };

    const score =
      weights.originality * (originality.score || 75) +
      weights.insight * (reflection.scores?.insight || 75) +
      weights.example * (reflection.scores?.example || 75) +
      weights.takeaway * (reflection.scores?.takeaway || 75) +
      weights.humanity * (reflection.scores?.humanity || 75) +
      weights.emotional * (reflection.scores?.emotionalImpact || 75);

    return Math.round(score);
  }

  /**
   * Get grade from score
   */
  _getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate multiple versions
   */
  generateMultiple(options = {}) {
    const { versions = 3, ...genOptions } = options;
    const results = [];

    for (let i = 0; i < versions; i++) {
      const result = this.generate(genOptions);
      results.push(result);
    }

    // Sort by score
    results.sort((a, b) => b.scores.overall - a.scores.overall);

    return results;
  }
}

export default SupremeGenerator;
